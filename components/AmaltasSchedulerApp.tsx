"use client";

import {
  getTeachers,
  saveTeacher,
  updateTeacher as updateTeacherInDb,
  deleteTeacher as deleteTeacherFromDb,
  getTimetableSlots,
  saveTimetableSlot,
  updateTimetableSlot,
  replaceTimetableSlots,
  replaceTeachers,
  getAbsences,
  saveAbsence,
  deleteAbsence as deleteAbsenceFromDb,
  getCoverAssignments,
  saveCoverAssignment,
  deleteCoverAssignment as deleteCoverAssignmentFromDb,
} from "@/src/lib/database";

import { seedSupabaseFromLocalData } from "@/src/lib/seedSupabase";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  schoolName,
  days,
  periods,
  standards,
  subjects,
  initialTeachers,
  timetableEntries,
  classTeachers,
  sortBySchoolOrder,
  sortClasses,
  inferTeacherGender,
  type Teacher,
} from "@/src/data/schoolData";

type Absence = {
  id: number;
  dbId?: string;
  teacherId: number;
  day: string;
  date?: string;
  startPeriod: string;
  endPeriod: string;
};

type CoverAssignment = {
  id: number;
  dbId?: string;
  absentTeacherId: number;
  coverTeacherId: number;
  day: string;
  date?: string;
  period: string;
  className: string;
  subject: string;
};

type CoverRequest = {
  absentTeacherId: number;
  day: string;
  date?: string;
  period: string;
  className: string;
  subject: string;
};

type AddTeacherForm = {
  name: string;
  gender: "Male" | "Female";
  subjects: string;
  classes: string;
  unavailable: string;
};

type EditableTimetableEntry = {
  dbId?: string;
  className: string;
  teacherName: string;
  auxiliaryTeacherName?: string;
  subject: string;
  period: number;
  day: string;
};

type EditSlotForm = {
  dbId?: string;
  className: string;
  day: string;
  period: string;
  subject: string;
  teacherName: string;
  auxiliaryTeacherName: string;
};

type ExcelImportPreview = {
  teachers: Teacher[];
  timetable: EditableTimetableEntry[];
  warnings: string[];
};

const STORAGE_KEY = "amaltas-school-scheduler-data-v2";
const ADMIN_PASSWORD = "amaltas123";

type ViewMode = "landing" | "admin" | "teacher";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getTodayDayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
}

function getDateForSchoolDay(day: string) {
  const date = new Date();
  const schoolDayToJsDay: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = schoolDayToJsDay[day] ?? date.getDay();
  const difference = targetDay - date.getDay();
  date.setDate(date.getDate() + difference);
  return date;
}

function formatSchoolDay(day: string) {
  return formatFullDate(getDateForSchoolDay(day));
}

function getSchoolDayFromDateKey(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(`${dateKey}T12:00:00`));
}

function formatDateKey(dateKey: string) {
  return formatFullDate(new Date(`${dateKey}T12:00:00`));
}

function getDateKeysInRange(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  const dates: string[] = [];

  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(cursor);
    if (days.includes(dayName)) {
      dates.push(cursor.toISOString().slice(0, 10));
    }
  }

  return dates;
}

function getComparableDateKey(dateKey?: string) {
  return dateKey || getTodayKey();
}

export default function AmaltasSchedulerApp() {
  const todayKey = getTodayKey();
  const todayDayName = days.includes(getTodayDayName()) ? getTodayDayName() : days[0];
  const todayDisplay = formatFullDate(new Date());

  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [selectedTeacherViewId, setSelectedTeacherViewId] = useState(initialTeachers[0]?.id || 1);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [timetableData, setTimetableData] = useState<EditableTimetableEntry[]>(timetableEntries);
  const [selectedClass, setSelectedClass] = useState(standards[0] || "NUR A");
  const [selectedDailyViewDay, setSelectedDailyViewDay] = useState(todayDayName);
  const [selectedAbsenceDay, setSelectedAbsenceDay] = useState(todayDayName);
  const [selectedAbsenceStartDate, setSelectedAbsenceStartDate] = useState(todayKey);
  const [selectedAbsenceEndDate, setSelectedAbsenceEndDate] = useState(todayKey);
  const [selectedAbsenceStartPeriod, setSelectedAbsenceStartPeriod] = useState(periods[0] || "1");
  const [selectedAbsenceEndPeriod, setSelectedAbsenceEndPeriod] = useState(periods[periods.length - 1] || "8");
  const [selectedAbsentTeacherId, setSelectedAbsentTeacherId] = useState(
    initialTeachers[0]?.id.toString() || "1"
  );
  const [coverRequest, setCoverRequest] = useState<CoverRequest | null>(null);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState("All");
  const [teacherClassFilter, setTeacherClassFilter] = useState("All");
  const [selectedSubjectTeacherList, setSelectedSubjectTeacherList] = useState(subjects[0] || "All");
  const [selectedTeacherProfileId, setSelectedTeacherProfileId] = useState(
    initialTeachers[0]?.id || 1
  );
  const [storageReady, setStorageReady] = useState(false);
  const [showWeeklyCovers, setShowWeeklyCovers] = useState(true);
  const [showDailyCovers, setShowDailyCovers] = useState(true);

  const [absences, setAbsences] = useState<Absence[]>([]);
  const [coverAssignments, setCoverAssignments] = useState<CoverAssignment[]>([]);
  const [addTeacherForm, setAddTeacherForm] = useState<AddTeacherForm>({
    name: "",
    gender: "Female",
    subjects: "",
    classes: "",
    unavailable: "",
  });
  const [editingTeacherId, setEditingTeacherId] = useState<number | null>(null);
  const [editTeacherForm, setEditTeacherForm] = useState<AddTeacherForm>({
    name: "",
    gender: "Female",
    subjects: "",
    classes: "",
    unavailable: "",
  });
  const [editSlotForm, setEditSlotForm] = useState<EditSlotForm | null>(null);
  const [excelImportPreview, setExcelImportPreview] = useState<ExcelImportPreview | null>(null);
  const [excelImportStatus, setExcelImportStatus] = useState("");

  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed.teachers) && parsed.teachers.length > 0) {
          setTeachers(
            parsed.teachers.map((teacher: Teacher) => ({
              ...teacher,
              gender: teacher.gender || inferTeacherGender(teacher.name),
            }))
          );
        }
        if (parsed.savedDate === todayKey) {
          if (Array.isArray(parsed.absences)) {
            setAbsences(
              parsed.absences.map((absence: Partial<Absence>) => ({
                id: Number(absence.id) || Date.now(),
                teacherId: Number(absence.teacherId),
                day: absence.day || todayDayName,
                startPeriod: absence.startPeriod || periods[0] || "1",
                endPeriod: absence.endPeriod || periods[periods.length - 1] || "8",
              }))
            );
          }
          if (Array.isArray(parsed.coverAssignments)) {
            setCoverAssignments(parsed.coverAssignments);
          }
        } else {
          setAbsences([]);
          setCoverAssignments([]);
        }

        if (Array.isArray(parsed.timetableData) && parsed.timetableData.length > 0) {
          setTimetableData(parsed.timetableData);
        }
        if (typeof parsed.selectedClass === "string") {
          setSelectedClass(parsed.selectedClass);
        }
      }
    } catch (error) {
      console.error("Could not load saved Amaltas data", error);
    } finally {
      setStorageReady(true);
    }
  }, [todayKey, todayDayName]);

  useEffect(() => {
    if (!storageReady) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        savedDate: todayKey,
        teachers,
        absences,
        coverAssignments,
        selectedClass,
        timetableData,
      })
    );
  }, [teachers, timetableData, absences, coverAssignments, selectedClass, storageReady, todayKey]);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;

      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed.teachers) && parsed.teachers.length > 0) {
          setTeachers(parsed.teachers);
        }
        if (Array.isArray(parsed.timetableData) && parsed.timetableData.length > 0) {
          setTimetableData(parsed.timetableData);
        }
        if (parsed.savedDate === todayKey) {
          setAbsences(Array.isArray(parsed.absences) ? parsed.absences : []);
          setCoverAssignments(Array.isArray(parsed.coverAssignments) ? parsed.coverAssignments : []);
        } else {
          setAbsences([]);
          setCoverAssignments([]);
        }
      } catch (error) {
        console.error("Could not sync Amaltas data", error);
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [todayKey]);

  useEffect(() => {
  async function loadFromSupabase() {
    try {
      setDbError("");

      await seedSupabaseFromLocalData();

      const [dbTeachers, dbSlots, dbAbsences, dbCovers] = await Promise.all([
        getTeachers(),
        getTimetableSlots(),
        getAbsences(),
        getCoverAssignments(),
      ]);

      let convertedTeachers = teachers;

      if (dbTeachers.length > 0) {
        convertedTeachers = dbTeachers.map((teacher, index) => ({
          id: index + 1,
          dbId: teacher.id,
          name: teacher.name,
          gender: teacher.gender || inferTeacherGender(teacher.name),
          subjects: teacher.subjects || [],
          classes: teacher.classes || [],
          unavailable: teacher.unavailable || [],
          class_teacher_for: teacher.class_teacher_for || [],
        }));

        setTeachers(convertedTeachers);

        if (convertedTeachers[0]) {
          setSelectedTeacherViewId(convertedTeachers[0].id);
          setSelectedAbsentTeacherId(convertedTeachers[0].id.toString());
          setSelectedTeacherProfileId(convertedTeachers[0].id);
        }
      }

      if (dbSlots.length > 0) {
        setTimetableData(
          sortBySchoolOrder(
            dbSlots.map((slot) => ({
              dbId: slot.id,
              day: slot.day,
              period: Number(slot.period),
              className: slot.class_name,
              subject: slot.subject,
              teacherName: slot.teacher_name,
              auxiliaryTeacherName: slot.auxiliary_teacher_name || "",
            }))
          ) as EditableTimetableEntry[]
        );
      }

      const activeAbsenceRows = dbAbsences.filter((absence) => todayKey <= absence.end_date);

      setAbsences(
        activeAbsenceRows.flatMap((absence, index) => {
          const matchingTeacher = convertedTeachers.find(
            (teacher) => normalizeName(teacher.name) === normalizeName(absence.teacher_name)
          );
          if (!matchingTeacher) return [];

          return getDateKeysInRange(absence.start_date, absence.end_date).map((dateKey, dayIndex) => ({
            id: index * 1000 + dayIndex + 1,
            dbId: absence.id,
            teacherId: matchingTeacher.id,
            day: getSchoolDayFromDateKey(dateKey),
            date: dateKey,
            startPeriod: absence.start_period,
            endPeriod: absence.end_period,
          }));
        })
      );

      const activeCovers = dbCovers.filter((cover) => cover.date >= todayKey);

      setCoverAssignments(
        activeCovers.flatMap((cover, index) => {
          const absentTeacher = convertedTeachers.find(
            (teacher) => normalizeName(teacher.name) === normalizeName(cover.absent_teacher_name)
          );
          const coverTeacher = convertedTeachers.find(
            (teacher) => normalizeName(teacher.name) === normalizeName(cover.cover_teacher_name)
          );
          if (!absentTeacher || !coverTeacher) return [];

          return [{
            id: index + 1,
            dbId: cover.id,
            absentTeacherId: absentTeacher.id,
            coverTeacherId: coverTeacher.id,
            day: cover.day,
            date: cover.date,
            period: cover.period,
            className: cover.class_name,
            subject: cover.subject,
          }];
        })
      );

      setDbReady(true);
    } catch (error: any) {
  console.warn("Could not load Supabase data", error);

  setDbError(
    `Supabase Error: ${error?.message || JSON.stringify(error)}`
  );

  setDbReady(false);
}
  }

  loadFromSupabase();
}, [todayKey]);

  function normalizeName(name: string) {
    return name.trim().toLowerCase();
  }

  function splitList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function teacherMatchesSlot(teacher: Teacher, entry: EditableTimetableEntry) {
    const teacherName = normalizeName(teacher.name);
    return (
      normalizeName(entry.teacherName) === teacherName ||
      normalizeName(entry.auxiliaryTeacherName || "") === teacherName
    );
  }

  function deriveTeacherMetadataFromTimetable(sourceTeachers: Teacher[], sourceTimetable: EditableTimetableEntry[]) {
    return sourceTeachers.map((teacher) => {
      const teacherEntries = sourceTimetable.filter((entry) => teacherMatchesSlot(teacher, entry));
      return {
        ...teacher,
        subjects: Array.from(new Set(teacherEntries.map((entry) => entry.subject).filter((subject) => subject && subject !== "Free"))).sort((a, b) => a.localeCompare(b)),
        classes: sortClasses(Array.from(new Set(teacherEntries.map((entry) => entry.className).filter(Boolean)))),
      };
    });
  }

  function isPeriodInRange(period: string | number, startPeriod: string, endPeriod: string) {
    const periodNumber = Number(period);
    return periodNumber >= Number(startPeriod) && periodNumber <= Number(endPeriod);
  }

  function isPrimaryClass(className: string) {
    return ["NUR", "LKG", "UKG", "I", "II"].some((prefix) => className.startsWith(prefix));
  }

  function isFemalePrioritySubject(subject: string) {
    const normalized = subject.toLowerCase();
    return ["drawing", "art", "arts", "skill", "skill development", "activity", "craft"].some((keyword) =>
      normalized.includes(keyword)
    );
  }

  function escapeCsv(value: string | number | undefined | null) {
    const text = String(value ?? "");
    if (/[",\n]/.test(text)) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  }

  function downloadCsv(filename: string, rows: (string | number)[][]) {
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function escapeHtml(value: string | number | undefined | null) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getEntryForSlot(day: string, period: string, className: string) {
    return timetableData.find(
      (entry) =>
        entry.day === day &&
        entry.period.toString() === period &&
        entry.className === className
    );
  }

  function getTeacherNameForSlot(day: string, period: string, className: string) {
    const entry = getEntryForSlot(day, period, className);
    return entry?.teacherName || "Free";
  }

  function getAuxiliaryTeacherNameForSlot(day: string, period: string, className: string) {
    const entry = getEntryForSlot(day, period, className);
    return entry?.auxiliaryTeacherName || "";
  }

  function getSubjectForSlot(day: string, period: string, className: string) {
    const entry = getEntryForSlot(day, period, className);
    return entry?.subject || "Free";
  }

  function getAffectedClassesForTeacher(teacherId: number, day: string, startPeriod = periods[0] || "1", endPeriod = periods[periods.length - 1] || "8", date?: string) {
    const teacher = teachers.find((item) => item.id === teacherId);
    if (!teacher) return [];

    return sortBySchoolOrder(
      timetableData
        .filter(
          (entry) =>
            entry.day === day &&
            isPeriodInRange(entry.period, startPeriod, endPeriod) &&
            teacherMatchesSlot(teacher, entry)
        )
        .map((entry) => ({
          day: entry.day,
          date,
          period: entry.period.toString(),
          className: entry.className,
          subject: entry.subject,
          teacher,
        }))
    );
  }

  function getTeacherSchedule(teacherId: number) {
    const teacher = teachers.find((item) => item.id === teacherId);
    if (!teacher) return [];

    return sortBySchoolOrder(
      timetableData
        .filter((entry) => teacherMatchesSlot(teacher, entry))
        .map((entry) => ({
          day: entry.day,
          period: entry.period.toString(),
          className: entry.className,
          subject: entry.subject,
        }))
    );
  }

  function getWeeklyClassCount(teacherId: number) {
    const teacher = teachers.find((item) => item.id === teacherId);
    if (!teacher) return 0;

    return timetableData.filter(
      (entry) => teacherMatchesSlot(teacher, entry)
    ).length;
  }

  function getClassTeacherName(className: string) {
    return classTeachers.find((item) => item.className === className)?.teacherName || "Not listed";
  }

  function isTeacherAlreadyTeaching(teacher: Teacher, day: string, period: string) {
    return timetableData.some(
      (entry) =>
        entry.day === day &&
        entry.period.toString() === period &&
        teacherMatchesSlot(teacher, entry)
    );
  }

  function findCoverTeachers(
    day: string,
    period: string,
    className: string,
    absentTeacherId: number
  ) {
    const slot = `${day}-${period}`;
    const subjectForSlot = getSubjectForSlot(day, period, className);

    return teachers
      .filter((teacher) => {
        const isAbsentTeacher = teacher.id === absentTeacherId;
        const isUnavailable = teacher.unavailable.includes(slot);
        const alreadyTeaching = isTeacherAlreadyTeaching(teacher, day, period);
        const absentToday = absences.some(
          (absence) =>
            absence.teacherId === teacher.id &&
            absence.day === day &&
            isPeriodInRange(period, absence.startPeriod, absence.endPeriod)
        );

        return !isAbsentTeacher && !isUnavailable && !alreadyTeaching && !absentToday;
      })
      .map((teacher) => {
        let score = 25;
        if (teacher.classes.includes(className)) score += 25;
        if (teacher.subjects.some((subject) => normalizeName(subject) === normalizeName(subjectForSlot))) {
          score += 40;
        }
        if (teacher.gender === "Female" && isPrimaryClass(className)) score += 100;
        if (teacher.gender === "Female" && isFemalePrioritySubject(subjectForSlot)) score += 100;

        return {
          ...teacher,
          score,
          match: score >= 125 ? "Best match" : score >= 65 ? "Good match" : "Available",
        };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }

  const selectedAbsentTeacher =
    teachers.find((teacher) => teacher.id === Number(selectedAbsentTeacherId)) || teachers[0];

  const selectedTeacherIsAbsent = selectedAbsentTeacher
    ? absences.some(
        (absence) =>
          absence.teacherId === selectedAbsentTeacher.id && absence.day === selectedAbsenceDay
      )
    : false;

  const selectedAbsenceRecord = selectedAbsentTeacher
    ? absences.find(
        (absence) =>
          absence.teacherId === selectedAbsentTeacher.id && absence.day === selectedAbsenceDay
      )
    : null;

  const selectedAbsenceRecords =
    selectedAbsentTeacher && selectedAbsenceRecord
      ? absences.filter(
          (absence) =>
            absence.teacherId === selectedAbsentTeacher.id &&
            (selectedAbsenceRecord.dbId
              ? absence.dbId === selectedAbsenceRecord.dbId
              : absence.day === selectedAbsenceDay)
        )
      : [];

  const affectedClassesForSelectedAbsence = selectedAbsenceRecords.flatMap((absence) =>
    getAffectedClassesForTeacher(
      absence.teacherId,
      absence.day,
      absence.startPeriod,
      absence.endPeriod,
      absence.date
    )
  );

  const allAffectedPeriods = absences.flatMap((absence) =>
    getAffectedClassesForTeacher(
      absence.teacherId,
      absence.day,
      absence.startPeriod,
      absence.endPeriod,
      absence.date
    )
  );

  const coverTeachers = coverRequest
    ? findCoverTeachers(
        coverRequest.day,
        coverRequest.period,
        coverRequest.className,
        coverRequest.absentTeacherId
      )
    : [];

  const filteredTeachers = useMemo(() => {
    return [...teachers]
      .filter((teacher) =>
        teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
      )
      .filter((teacher) =>
        teacherSubjectFilter === "All" ? true : teacher.subjects.includes(teacherSubjectFilter)
      )
      .filter((teacher) =>
        teacherClassFilter === "All" ? true : teacher.classes.includes(teacherClassFilter)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [teacherSearch, teacherSubjectFilter, teacherClassFilter, teachers]);

  const selectedTeacherProfile =
    teachers.find((teacher) => teacher.id === selectedTeacherProfileId) || teachers[0];

  const selectedTeacherSchedule = selectedTeacherProfile
    ? getTeacherSchedule(selectedTeacherProfile.id)
    : [];

  const selectedTeacherScheduleByDay = days.map((day) => ({
    day,
    items: selectedTeacherSchedule.filter((item) => item.day === day),
  }));

  const selectedTeacherWeeklyCount = selectedTeacherProfile
    ? getWeeklyClassCount(selectedTeacherProfile.id)
    : 0;

  const dailyAllClassRows = standards.map((className) => ({
    className,
    classTeacherName: getClassTeacherName(className),
    periods: periods.map((period) => {
      const coverAssignment = coverAssignments.find(
        (assignment) =>
          assignment.day === selectedDailyViewDay &&
          assignment.period === period &&
          assignment.className === className
      );
      const coverTeacher = coverAssignment
        ? teachers.find((teacher) => teacher.id === coverAssignment.coverTeacherId)
        : null;

      return {
        period,
        subject: getSubjectForSlot(selectedDailyViewDay, period, className),
        teacherName: getTeacherNameForSlot(selectedDailyViewDay, period, className),
        auxiliaryTeacherName: getAuxiliaryTeacherNameForSlot(selectedDailyViewDay, period, className),
        coverTeacherName: coverTeacher?.name || "",
      };
    }),
  }));

  const absenceReportRows = sortBySchoolOrder(
    absences.flatMap((absence) => {
      const absentTeacher = teachers.find((teacher) => teacher.id === absence.teacherId);
      if (!absentTeacher) return [];

      return getAffectedClassesForTeacher(
        absence.teacherId,
        absence.day,
        absence.startPeriod,
        absence.endPeriod,
        absence.date
      ).map((item) => {
        const coverAssignment = coverAssignments.find(
          (assignment) =>
            assignment.day === item.day &&
            (assignment.date || "") === (absence.date || "") &&
            assignment.period === item.period &&
            assignment.className === item.className &&
            assignment.absentTeacherId === absence.teacherId
        );
        const substituteTeacher = coverAssignment
          ? teachers.find((teacher) => teacher.id === coverAssignment.coverTeacherId)
          : null;

        return {
          day: item.day,
          date: item.date,
          period: item.period,
          className: item.className,
          subject: item.subject,
          originalTeacherName: absentTeacher.name,
          substituteTeacherName: substituteTeacher?.name || "Not assigned",
        };
      });
    })
  ) as {
    day: string;
    date?: string;
    period: string;
    className: string;
    subject: string;
    originalTeacherName: string;
    substituteTeacherName: string;
  }[];

  const subjectOptions = useMemo(() => {
    return ["All", ...Array.from(new Set([
      ...teachers.flatMap((teacher) => teacher.subjects),
      ...timetableData.map((entry) => entry.subject),
    ].filter((subject) => subject && subject !== "Free"))).sort()];
  }, [teachers, timetableData]);

  const teachersForSelectedSubject = useMemo(() => {
    if (selectedSubjectTeacherList === "All") return [];
    return teachers
      .map((teacher) => {
        const matchingEntries = timetableData.filter(
          (entry) => entry.subject === selectedSubjectTeacherList && teacherMatchesSlot(teacher, entry)
        );

        return {
          teacher,
          classes: sortClasses(Array.from(new Set(matchingEntries.map((entry) => entry.className)))),
          weeklyPeriods: matchingEntries.length,
        };
      })
      .filter((item) => item.weeklyPeriods > 0)
      .sort((a, b) => a.teacher.name.localeCompare(b.teacher.name));
  }, [selectedSubjectTeacherList, teachers, timetableData]);

  const classOptions = useMemo(() => {
    return ["All", ...sortClasses(Array.from(new Set(teachers.flatMap((teacher) => teacher.classes))))];
  }, [teachers]);

  const selectedTeacherView =
    teachers.find((teacher) => teacher.id === selectedTeacherViewId) || teachers[0];

  const selectedTeacherViewSchedule = selectedTeacherView
    ? getTeacherSchedule(selectedTeacherView.id)
    : [];

  const selectedTeacherTodaySchedule = selectedTeacherViewSchedule.filter(
    (item) => item.day === todayDayName
  );

  const selectedTeacherViewScheduleByDay = days.map((day) => {
  const regularItems = selectedTeacherViewSchedule
    .filter((item) => item.day === day)
    .map((item) => ({ ...item, isCoverDuty: false, absentTeacherName: "" }));

  const coverItems = selectedTeacherView
    ? coverAssignments
        .filter((assignment) => assignment.coverTeacherId === selectedTeacherView.id && assignment.day === day)
        .map((assignment) => {
          const absentTeacher = teachers.find((teacher) => teacher.id === assignment.absentTeacherId);
          return {
            day: assignment.day,
            period: assignment.period,
            className: assignment.className,
            subject: assignment.subject,
            isCoverDuty: true,
            absentTeacherName: absentTeacher?.name || "Original teacher",
          };
        })
    : [];

  return {
    day,
    items: sortBySchoolOrder([...regularItems, ...coverItems]),
  };
});

  const selectedTeacherCoverDuties = selectedTeacherView
    ? (sortBySchoolOrder(
        coverAssignments.filter((assignment) => assignment.coverTeacherId === selectedTeacherView.id)
      ) as CoverAssignment[])
    : [];

  function handleAdminLogin() {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminLoginError("");
      setViewMode("admin");
      return;
    }

    setAdminLoginError("Incorrect password. Try amaltas123 for now.");
  }

  async function markTeacherAbsent() {
    const teacherId = Number(selectedAbsentTeacherId);
    const teacher = teachers.find((item) => item.id === teacherId);
    if (!teacher) return;

    const startPeriod = Math.min(Number(selectedAbsenceStartPeriod), Number(selectedAbsenceEndPeriod)).toString();
    const endPeriod = Math.max(Number(selectedAbsenceStartPeriod), Number(selectedAbsenceEndPeriod)).toString();
    const startDate = selectedAbsenceStartDate <= selectedAbsenceEndDate ? selectedAbsenceStartDate : selectedAbsenceEndDate;
    const endDate = selectedAbsenceStartDate <= selectedAbsenceEndDate ? selectedAbsenceEndDate : selectedAbsenceStartDate;

    try {
      const saved = await saveAbsence({
        teacher_name: teacher.name,
        start_date: startDate,
        end_date: endDate,
        start_period: startPeriod,
        end_period: endPeriod,
        reason: "",
      });

      const newAbsences = getDateKeysInRange(startDate, endDate).map((dateKey, index) => ({
        id: Date.now() + index,
        dbId: saved.id,
        teacherId,
        day: getSchoolDayFromDateKey(dateKey),
        date: dateKey,
        startPeriod,
        endPeriod,
      }));

      setAbsences((current) => {
        const filtered = current.filter(
          (absence) =>
            !(absence.teacherId === teacherId && absence.date && absence.date >= startDate && absence.date <= endDate)
        );
        return sortBySchoolOrder([...filtered, ...newAbsences]) as Absence[];
      });
      setSelectedAbsenceDay(getSchoolDayFromDateKey(startDate));
    } catch (error) {
      console.warn("Could not save absence to Supabase", error);
      setDbError("Could not save absence to Supabase. Check connection and policies.");
    }
  }

  async function removeAbsence(id: number) {
    const removed = absences.find((absence) => absence.id === id);
    if (!removed) return;

    const sameDbAbsences = removed.dbId
      ? absences.filter((absence) => absence.dbId === removed.dbId)
      : [removed];

    const removedDates = sameDbAbsences.map((absence) => absence.date || todayKey);

    setAbsences(absences.filter((absence) => (removed.dbId ? absence.dbId !== removed.dbId : absence.id !== id)));

    const coversToRemove = coverAssignments.filter(
      (assignment) =>
        assignment.absentTeacherId === removed.teacherId &&
        removedDates.includes(assignment.date || todayKey) &&
        isPeriodInRange(assignment.period, removed.startPeriod, removed.endPeriod)
    );

    setCoverAssignments(
      coverAssignments.filter((assignment) => !coversToRemove.some((cover) => cover.id === assignment.id))
    );

    try {
      if (removed.dbId) await deleteAbsenceFromDb(removed.dbId);
      await Promise.all(coversToRemove.filter((cover) => cover.dbId).map((cover) => deleteCoverAssignmentFromDb(cover.dbId!)));
    } catch (error) {
      console.warn("Could not remove absence from Supabase", error);
      setDbError("Could not remove absence from Supabase.");
    }

    if (removed && coverRequest?.absentTeacherId === removed.teacherId) {
      setCoverRequest(null);
    }
  }

  function chooseAffectedClass(request: CoverRequest) {
    setCoverRequest(request);
    setSelectedClass(request.className);
  }

  async function assignCover(coverTeacherId: number) {
    if (!coverRequest) return;

    const absentTeacher = teachers.find((teacher) => teacher.id === coverRequest.absentTeacherId);
    const coverTeacher = teachers.find((teacher) => teacher.id === coverTeacherId);
    if (!absentTeacher || !coverTeacher) return;

    const alreadyAssigned = coverAssignments.some(
      (assignment) =>
        assignment.day === coverRequest.day &&
        (assignment.date || "") === (coverRequest.date || "") &&
        assignment.period === coverRequest.period &&
        assignment.className === coverRequest.className
    );

    if (alreadyAssigned) return;

    try {
      const saved = await saveCoverAssignment({
        absent_teacher_name: absentTeacher.name,
        cover_teacher_name: coverTeacher.name,
        day: coverRequest.day,
        date: coverRequest.date || todayKey,
        period: coverRequest.period,
        class_name: coverRequest.className,
        subject: coverRequest.subject,
      });

      setCoverAssignments([
        ...coverAssignments,
        {
          id: Date.now(),
          dbId: saved.id,
          absentTeacherId: coverRequest.absentTeacherId,
          coverTeacherId,
          day: coverRequest.day,
          date: coverRequest.date || todayKey,
          period: coverRequest.period,
          className: coverRequest.className,
          subject: coverRequest.subject,
        },
      ]);
    } catch (error) {
      console.warn("Could not save cover assignment", error);
      setDbError("Could not save cover assignment to Supabase.");
    }
  }

  async function removeCoverAssignment(id: number) {
    const removed = coverAssignments.find((assignment) => assignment.id === id);
    setCoverAssignments(coverAssignments.filter((assignment) => assignment.id !== id));

    try {
      if (removed?.dbId) await deleteCoverAssignmentFromDb(removed.dbId);
    } catch (error) {
      console.warn("Could not remove cover assignment", error);
      setDbError("Could not remove cover assignment from Supabase.");
    }
  }

  async function removeTeacher(teacherId: number) {
    const removedTeacher = teachers.find((teacher) => teacher.id === teacherId);
    const remainingTeachers = teachers.filter((teacher) => teacher.id !== teacherId);

    setTeachers(remainingTeachers);
    setAbsences(absences.filter((absence) => absence.teacherId !== teacherId));
    setCoverAssignments(
      coverAssignments.filter(
        (assignment) =>
          assignment.absentTeacherId !== teacherId && assignment.coverTeacherId !== teacherId
      )
    );

    try {
      if (removedTeacher?.dbId) await deleteTeacherFromDb(removedTeacher.dbId);
    } catch (error) {
      console.warn("Could not remove teacher from Supabase", error);
      setDbError("Could not remove teacher from Supabase.");
    }

    if (coverRequest?.absentTeacherId === teacherId) {
      setCoverRequest(null);
    }

    if (Number(selectedAbsentTeacherId) === teacherId && remainingTeachers.length > 0) {
      setSelectedAbsentTeacherId(remainingTeachers[0].id.toString());
    }

    if (selectedTeacherProfileId === teacherId && remainingTeachers.length > 0) {
      setSelectedTeacherProfileId(remainingTeachers[0].id);
    }
  }

  async function addTeacher() {
    const name = addTeacherForm.name.trim();
    if (!name) return;

    const duplicate = teachers.some((teacher) => normalizeName(teacher.name) === normalizeName(name));
    if (duplicate) return;

    const baseTeacher = {
      name,
      gender: addTeacherForm.gender || inferTeacherGender(name),
      subjects: splitList(addTeacherForm.subjects),
      classes: sortClasses(splitList(addTeacherForm.classes)),
      unavailable: splitList(addTeacherForm.unavailable),
      class_teacher_for: [],
    };

    try {
      const saved = await saveTeacher(baseTeacher);
      const newTeacher: Teacher = {
        id: Date.now(),
        dbId: saved.id,
        name: saved.name,
        gender: saved.gender || inferTeacherGender(saved.name),
        subjects: saved.subjects || [],
        classes: sortClasses(saved.classes || []),
        unavailable: saved.unavailable || [],
      };

      setTeachers([...teachers, newTeacher].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedTeacherProfileId(newTeacher.id);
      setSelectedAbsentTeacherId(newTeacher.id.toString());
      setAddTeacherForm({ name: "", gender: "Female", subjects: "", classes: "", unavailable: "" });
    } catch (error) {
      console.warn("Could not add teacher", error);
      setDbError("Could not add teacher to Supabase.");
    }
  }

  function startEditTeacher(teacher: Teacher) {
    setEditingTeacherId(teacher.id);
    setEditTeacherForm({
      name: teacher.name,
      gender: teacher.gender || inferTeacherGender(teacher.name),
      subjects: teacher.subjects.join(", "),
      classes: teacher.classes.join(", "),
      unavailable: teacher.unavailable.join(", "),
    });
  }

  async function saveEditedTeacher() {
    if (!editingTeacherId) return;
    const teacher = teachers.find((item) => item.id === editingTeacherId);
    if (!teacher) return;

    const updatedTeacher: Teacher = {
      ...teacher,
      name: editTeacherForm.name.trim(),
      gender: editTeacherForm.gender,
      subjects: splitList(editTeacherForm.subjects),
      classes: sortClasses(splitList(editTeacherForm.classes)),
      unavailable: splitList(editTeacherForm.unavailable),
    };

    try {
      if (teacher.dbId) {
        const saved = await updateTeacherInDb(teacher.dbId, {
          name: updatedTeacher.name,
          gender: updatedTeacher.gender,
          subjects: updatedTeacher.subjects,
          classes: updatedTeacher.classes,
          unavailable: updatedTeacher.unavailable,
        });
        updatedTeacher.dbId = saved.id;
      }

      setTeachers(teachers.map((item) => (item.id === editingTeacherId ? updatedTeacher : item)).sort((a, b) => a.name.localeCompare(b.name)));
      setEditingTeacherId(null);
    } catch (error) {
      console.warn("Could not update teacher", error);
      setDbError("Could not update teacher in Supabase.");
    }
  }

  function startEditSlot(day: string, period: string, className: string) {
    const entry = getEntryForSlot(day, period, className);
    setEditSlotForm({
      dbId: entry?.dbId,
      day,
      period,
      className,
      subject: entry?.subject || "Free",
      teacherName: entry?.teacherName || "Free",
      auxiliaryTeacherName: entry?.auxiliaryTeacherName || "",
    });
  }

  async function saveEditedSlot() {
    if (!editSlotForm) return;

    let updatedSlot: EditableTimetableEntry = {
      dbId: editSlotForm.dbId,
      day: editSlotForm.day,
      period: Number(editSlotForm.period),
      className: editSlotForm.className,
      subject: editSlotForm.subject.trim() || "Free",
      teacherName: editSlotForm.teacherName.trim() || "Free",
      auxiliaryTeacherName: editSlotForm.auxiliaryTeacherName.trim(),
    };

    try {
      if (updatedSlot.dbId) {
        await updateTimetableSlot(updatedSlot.dbId, {
          day: updatedSlot.day,
          period: String(updatedSlot.period),
          class_name: updatedSlot.className,
          subject: updatedSlot.subject,
          teacher_name: updatedSlot.teacherName,
          auxiliary_teacher_name: updatedSlot.auxiliaryTeacherName || "",
        });
      } else {
        const saved = await saveTimetableSlot({
          day: updatedSlot.day,
          period: String(updatedSlot.period),
          class_name: updatedSlot.className,
          subject: updatedSlot.subject,
          teacher_name: updatedSlot.teacherName,
          auxiliary_teacher_name: updatedSlot.auxiliaryTeacherName || "",
        });
        updatedSlot = { ...updatedSlot, dbId: saved.id };
      }

      setTimetableData((current) => {
        const exists = current.some(
          (entry) => entry.day === updatedSlot.day && entry.period.toString() === String(updatedSlot.period) && entry.className === updatedSlot.className
        );
        const next = exists
          ? current.map((entry) =>
              entry.day === updatedSlot.day && entry.period.toString() === String(updatedSlot.period) && entry.className === updatedSlot.className
                ? updatedSlot
                : entry
            )
          : [...current, updatedSlot];
        return sortBySchoolOrder(next) as EditableTimetableEntry[];
      });
      setEditSlotForm(null);
      setDbError("");
    } catch (error) {
      console.warn("Could not update timetable slot", error);
      setDbError("Could not update timetable slot in Supabase.");
    }
  }

  function normalizeExcelHeader(value: unknown) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  }

  function readCell(row: Record<string, unknown>, possibleHeaders: string[]) {
    const normalizedHeaders = Object.keys(row).reduce<Record<string, string>>((acc, key) => {
      acc[normalizeExcelHeader(key)] = key;
      return acc;
    }, {});

    for (const header of possibleHeaders) {
      const actualKey = normalizedHeaders[normalizeExcelHeader(header)];
      if (actualKey && row[actualKey] !== undefined && row[actualKey] !== null) {
        return String(row[actualKey]).trim();
      }
    }

    return "";
  }

  function parseExcelList(value: string) {
    return value
      .split(/[,;|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function findSheetName(workbook: XLSX.WorkBook, candidates: string[]) {
    const normalizedCandidates = candidates.map(normalizeExcelHeader);
    return workbook.SheetNames.find((sheetName) =>
      normalizedCandidates.some((candidate) => normalizeExcelHeader(sheetName).includes(candidate))
    );
  }

  function downloadCurrentDatabase() {
    const classTeacherMap = classTeachers.reduce<Record<string, string[]>>((acc, item) => {
      if (!acc[item.teacherName]) acc[item.teacherName] = [];
      acc[item.teacherName].push(item.className);
      return acc;
    }, {});

    const teacherRows = teachers.map((teacher) => ({
      Teacher: teacher.name,
      Gender: teacher.gender,
      ClassTeacherFor: (teacher.class_teacher_for?.length
        ? teacher.class_teacher_for
        : classTeacherMap[teacher.name] || []
      ).join(", "),
    }));

    const timetableRows = sortBySchoolOrder(timetableData).map((slot) => ({
      Day: slot.day,
      Period: String(slot.period),
      Class: slot.className,
      Subject: slot.subject,
      MainTeacher: slot.teacherName,
      AuxiliaryTeacher: slot.auxiliaryTeacherName || "",
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(teacherRows), "Teachers");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(timetableRows), "Timetable");
    XLSX.writeFile(workbook, "amaltas-current-database.xlsx");
  }

  async function handleExcelUpload(file: File | null) {
    if (!file) return;

    try {
      setExcelImportStatus("Reading Excel file...");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const warnings: string[] = [];

      const teacherSheetName = findSheetName(workbook, ["Teachers", "Teacher Database", "Database"]);
      const timetableSheetName = findSheetName(workbook, ["Timetable", "Schedule", "Routine"]);

      if (!teacherSheetName) warnings.push("No Teachers sheet found. Teacher database will not be replaced.");
      if (!timetableSheetName) warnings.push("No Timetable sheet found. Timetable will not be replaced.");

      const teacherRows = teacherSheetName
        ? (XLSX.utils.sheet_to_json(workbook.Sheets[teacherSheetName]) as Record<string, unknown>[])
        : [];
      const timetableRows = timetableSheetName
        ? (XLSX.utils.sheet_to_json(workbook.Sheets[timetableSheetName]) as Record<string, unknown>[])
        : [];

      const parsedTeachers = teacherRows
        .map((row, index) => {
          const name = readCell(row, ["Name", "Teacher", "Teacher Name"]);
          if (!name) return null;
          const genderValue = readCell(row, ["Gender"]);
          const gender: "Male" | "Female" = genderValue.toLowerCase().startsWith("m") ? "Male" : "Female";

          return {
            id: Date.now() + index,
            name,
            gender,
            subjects: [],
            classes: [],
            unavailable: [],
            class_teacher_for: parseExcelList(readCell(row, ["ClassTeacherFor", "Class Teacher For", "Class Teacher Of", "Class Teacher"])),
          } as Teacher;
        })
        .filter(Boolean) as Teacher[];

      const parsedTimetable = timetableRows
        .map((row, index) => {
          const day = readCell(row, ["Day"]);
          const period = readCell(row, ["Period"]);
          const className = readCell(row, ["Class", "Class Name", "Standard"]);
          const subject = readCell(row, ["Subject"]);
          const teacherName = readCell(row, ["MainTeacher", "Teacher", "Teacher", "Teacher Name"]);
          const auxiliaryTeacherName = readCell(row, ["AuxiliaryTeacher", "Auxiliary Teacher", "Aux Teacher", "Assistant Teacher"]);

          if (!day || !period || !className) return null;

          return {
            day,
            period: Number(String(period).replace(/[^0-9]/g, "")) || 1,
            className,
            subject: subject || "Free",
            teacherName: teacherName || "Free",
            auxiliaryTeacherName,
          } as EditableTimetableEntry;
        })
        .filter(Boolean) as EditableTimetableEntry[];

      const parsedTeachersWithMetadata = deriveTeacherMetadataFromTimetable(parsedTeachers, parsedTimetable);

      setExcelImportPreview({
        teachers: parsedTeachersWithMetadata,
        timetable: sortBySchoolOrder(parsedTimetable) as EditableTimetableEntry[],
        warnings,
      });
      setExcelImportStatus("Preview ready. Review counts, then confirm import.");
    } catch (error) {
      console.warn("Could not parse Excel file", error);
      setExcelImportStatus("Could not read this Excel file. Use the template format and try again.");
    }
  }

  async function confirmExcelImport() {
    if (!excelImportPreview) return;

    const confirmed = window.confirm(
      "Replace the current teacher database and timetable with this Excel import? This affects all devices."
    );
    if (!confirmed) return;

    try {
      setExcelImportStatus("Saving import to Supabase...");

      if (excelImportPreview.teachers.length > 0) {
        const savedTeachers = await replaceTeachers(
          excelImportPreview.teachers.map((teacher) => ({
            name: teacher.name,
            gender: teacher.gender || inferTeacherGender(teacher.name),
            subjects: teacher.subjects || [],
            classes: teacher.classes || [],
            unavailable: teacher.unavailable || [],
            class_teacher_for: teacher.class_teacher_for || [],
          }))
        );

        setTeachers(
          savedTeachers.map((teacher, index) => ({
            id: index + 1,
            dbId: teacher.id,
            name: teacher.name,
            gender: teacher.gender || inferTeacherGender(teacher.name),
            subjects: teacher.subjects || [],
            classes: teacher.classes || [],
            unavailable: teacher.unavailable || [],
            class_teacher_for: teacher.class_teacher_for || [],
          }))
        );
      }

      if (excelImportPreview.timetable.length > 0) {
        const savedSlots = await replaceTimetableSlots(
          excelImportPreview.timetable.map((slot) => ({
            day: slot.day,
            period: String(slot.period),
            class_name: slot.className,
            subject: slot.subject,
            teacher_name: slot.teacherName,
            auxiliary_teacher_name: slot.auxiliaryTeacherName || "",
          }))
        );

        setTimetableData(
          sortBySchoolOrder(
            savedSlots.map((slot) => ({
              dbId: slot.id,
              day: slot.day,
              period: Number(slot.period),
              className: slot.class_name,
              subject: slot.subject,
              teacherName: slot.teacher_name,
              auxiliaryTeacherName: slot.auxiliary_teacher_name || "",
            }))
          ) as EditableTimetableEntry[]
        );
      }

      setAbsences([]);
      setCoverAssignments([]);
      setCoverRequest(null);
      setExcelImportPreview(null);
      setExcelImportStatus("Import complete. Supabase data updated across devices.");
    } catch (error) {
      console.warn("Could not save Excel import", error);
      setExcelImportStatus("Import failed while saving to Supabase.");
    }
  }

  function resetSavedData() {
    const confirmed = window.confirm(
      "Reset saved data back to the imported spreadsheet version? This will remove manual teacher changes, absences, and cover assignments."
    );
    if (!confirmed) return;

    window.localStorage.removeItem(STORAGE_KEY);
    setTeachers(initialTeachers);
    setTimetableData(timetableEntries);
    setAbsences([]);
    setCoverAssignments([]);
    setCoverRequest(null);
    setSelectedClass(standards[0] || "NUR A");
    setSelectedAbsentTeacherId(initialTeachers[0]?.id.toString() || "1");
    setSelectedTeacherProfileId(initialTeachers[0]?.id || 1);
  }

  function printHtml(title: string, body: string) {
    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeHtml(title)}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 28px; }
            .header { border-bottom: 3px solid #111827; padding-bottom: 12px; margin-bottom: 18px; }
            .school { font-size: 28px; font-weight: 800; margin: 0; }
            .subtitle { font-size: 16px; color: #475569; margin: 4px 0 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #e2e8f0; text-align: left; }
            th, td { border: 1px solid #1f2937; padding: 8px; vertical-align: top; }
            .period { font-weight: 700; width: 72px; }
            .subject { font-weight: 700; margin-bottom: 4px; }
            .teacher { color: #475569; }
            .cover { margin-top: 6px; padding: 4px; background: #dcfce7; color: #166534; border-radius: 4px; font-size: 11px; }
            .meta { margin: 10px 0 18px; color: #475569; font-size: 13px; }
            .page-break { page-break-after: always; break-after: page; }
            .page-break:last-child { page-break-after: auto; break-after: auto; }
            @media print { button { display: none; } body { margin: 16px; } }
          </style>
        </head>
        <body>
          ${body}
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  function renderTimetableHtml(className: string, includePageBreak = false, includeCovers = true) {
    const rows = periods
      .map((period) => {
        const cells = days
          .map((day) => {
            const teacherName = getTeacherNameForSlot(day, period, className);
            const auxiliaryTeacherName = getAuxiliaryTeacherNameForSlot(day, period, className);
            const subject = getSubjectForSlot(day, period, className);
            const coverAssignment = coverAssignments.find(
              (assignment) =>
                assignment.day === day &&
                assignment.period === period &&
                assignment.className === className
            );
            const coverTeacher = coverAssignment
              ? teachers.find((teacher) => teacher.id === coverAssignment.coverTeacherId)
              : null;

            return `
              <td>
                <div class="subject">${escapeHtml(subject)}</div>
                <div class="teacher">Teacher: ${escapeHtml(teacherName)}</div>
                ${auxiliaryTeacherName ? `<div class="teacher">Auxiliary: ${escapeHtml(auxiliaryTeacherName)}</div>` : ""}
                ${includeCovers && coverTeacher ? `<div class="cover">Cover: ${escapeHtml(coverTeacher.name)}</div>` : ""}
              </td>
            `;
          })
          .join("");

        return `<tr><td class="period">Period ${escapeHtml(period)}</td>${cells}</tr>`;
      })
      .join("");

    return `
      <section class="${includePageBreak ? "page-break" : ""}">
        <div class="header">
          <p class="school">${escapeHtml(schoolName)}</p>
          <p class="subtitle">Weekly Timetable - Class ${escapeHtml(className)}</p>
        </div>
        <p class="meta">Class Teacher: ${escapeHtml(getClassTeacherName(className))}</p>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              ${days.map((day) => `<th>${escapeHtml(formatSchoolDay(day))}</th>`).join("")}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    `;
  }

  function printSelectedTimetable() {
    printHtml(
      `${schoolName} ${selectedClass} Timetable`,
      renderTimetableHtml(selectedClass, false, showWeeklyCovers)
    );
  }

  function printAllTimetables() {
    printHtml(
      `${schoolName} All Class Timetables`,
      standards.map((className) => renderTimetableHtml(className, true, showWeeklyCovers)).join("")
    );
  }

  function printDailyAllClasses() {
    const rows = dailyAllClassRows
      .map((row) => {
        const cells = row.periods
          .map(
            (item) => `
              <td>
                <div class="subject">${escapeHtml(item.subject)}</div>
                <div class="teacher">Teacher: ${escapeHtml(item.teacherName)}</div>
                ${item.auxiliaryTeacherName ? `<div class="teacher">Auxiliary: ${escapeHtml(item.auxiliaryTeacherName)}</div>` : ""}
                ${showDailyCovers && item.coverTeacherName ? `<div class="cover">Cover: ${escapeHtml(item.coverTeacherName)}</div>` : ""}
              </td>
            `
          )
          .join("");

        return `
          <tr>
            <td class="period">${escapeHtml(row.className)}</td>
            <td>${escapeHtml(row.classTeacherName)}</td>
            ${cells}
          </tr>
        `;
      })
      .join("");

    printHtml(
      `${schoolName} ${selectedDailyViewDay} All Classes`,
      `
        <div class="header">
          <p class="school">${escapeHtml(schoolName)}</p>
          <p class="subtitle">All Classes Timetable - ${escapeHtml(formatSchoolDay(selectedDailyViewDay))}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Class Teacher</th>
              ${periods.map((period) => `<th>Period ${escapeHtml(period)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `
    );
  }

  function printFilteredTeachers() {
    const rows = filteredTeachers
      .map(
        (teacher) => `
          <tr>
            <td>${escapeHtml(teacher.name)}</td>
            <td>${escapeHtml(teacher.gender)}</td>
            <td>${escapeHtml(teacher.subjects.join(", "))}</td>
            <td>${escapeHtml(sortClasses(teacher.classes).join(", "))}</td>
            <td>${escapeHtml(getWeeklyClassCount(teacher.id))}</td>
            <td>${escapeHtml(teacher.unavailable.length ? teacher.unavailable.join(", ") : "None")}</td>
          </tr>
        `
      )
      .join("");

    printHtml(
      `${schoolName} Teacher Database`,
      `
        <div class="header">
          <p class="school">${escapeHtml(schoolName)}</p>
          <p class="subtitle">Teacher Database</p>
        </div>
        <p class="meta">
          Current filters: Search = ${escapeHtml(teacherSearch || "All")}, Subject = ${escapeHtml(teacherSubjectFilter)}, Class = ${escapeHtml(teacherClassFilter)}.<br />
          Total teachers shown: ${filteredTeachers.length}
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Subjects</th>
              <th>Classes</th>
              <th>Weekly Periods</th>
              <th>Unavailable</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `
    );
  }


  function printAbsenceReport() {
    const rows = absenceReportRows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml((row.date ? formatDateKey(row.date) : formatSchoolDay(row.day)))}</td>
            <td>Period ${escapeHtml(row.period)}</td>
            <td>${escapeHtml(row.className)}</td>
            <td>${escapeHtml(row.subject)}</td>
            <td>${escapeHtml(row.originalTeacherName)}</td>
            <td>${escapeHtml(row.substituteTeacherName)}</td>
          </tr>
        `
      )
      .join("");

    printHtml(
      `${schoolName} Absent Teacher Report`,
      `
        <div class="header">
          <p class="school">${escapeHtml(schoolName)}</p>
          <p class="subtitle">Absent Teacher Cover Report</p>
        </div>
        <p class="meta">Sorted by day and period. Total affected periods: ${absenceReportRows.length}</p>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Period</th>
              <th>Standard</th>
              <th>Subject</th>
              <th>Original Teacher</th>
              <th>Substitute</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `
    );
  }

  function downloadSelectedTimetable() {
    downloadCsv(`${selectedClass}-weekly-timetable.csv`, [
      ["Class", "Day", "Period", "Subject", "Teacher", "Auxiliary Teacher", "Cover"],
      ...days.flatMap((day) =>
        periods.map((period) => {
          const coverAssignment = coverAssignments.find(
            (assignment) =>
              assignment.day === day &&
              assignment.period === period &&
              assignment.className === selectedClass
          );
          const coverTeacher = coverAssignment
            ? teachers.find((teacher) => teacher.id === coverAssignment.coverTeacherId)
            : null;

          return [
            selectedClass,
            formatSchoolDay(day),
            `Period ${period}`,
            getSubjectForSlot(day, period, selectedClass),
            getTeacherNameForSlot(day, period, selectedClass),
            getAuxiliaryTeacherNameForSlot(day, period, selectedClass),
            showWeeklyCovers ? coverTeacher?.name || "" : "",
          ];
        })
      ),
    ]);
  }

  function downloadAllTimetables() {
    downloadCsv(`all-class-weekly-timetables.csv`, [
      ["Class", "Day", "Period", "Subject", "Teacher", "Auxiliary Teacher", "Cover"],
      ...standards.flatMap((className) =>
        days.flatMap((day) =>
          periods.map((period) => {
            const coverAssignment = coverAssignments.find(
              (assignment) =>
                assignment.day === day &&
                assignment.period === period &&
                assignment.className === className
            );
            const coverTeacher = coverAssignment
              ? teachers.find((teacher) => teacher.id === coverAssignment.coverTeacherId)
              : null;

            return [
              className,
              formatSchoolDay(day),
              `Period ${period}`,
              getSubjectForSlot(day, period, className),
              getTeacherNameForSlot(day, period, className),
              getAuxiliaryTeacherNameForSlot(day, period, className),
              showWeeklyCovers ? coverTeacher?.name || "" : "",
            ];
          })
        )
      ),
    ]);
  }

  function downloadDailyAllClasses() {
    downloadCsv(`${selectedDailyViewDay}-all-classes-timetable.csv`, [
      ["Day", "Class", "Class Teacher", "Period", "Subject", "Teacher", "Auxiliary Teacher", "Cover"],
      ...dailyAllClassRows.flatMap((row) =>
        row.periods.map((item) => [
          formatSchoolDay(selectedDailyViewDay),
          row.className,
          row.classTeacherName,
          `Period ${item.period}`,
          item.subject,
          item.teacherName,
          item.auxiliaryTeacherName,
          showDailyCovers ? item.coverTeacherName : "",
        ])
      ),
    ]);
  }

  function downloadFilteredTeachers() {
    downloadCsv(`teacher-database-filtered.csv`, [
      ["Name", "Gender", "Subjects", "Classes", "Weekly Periods", "Unavailable"],
      ...filteredTeachers.map((teacher) => [
        teacher.name,
        teacher.gender,
        teacher.subjects.join(", "),
        sortClasses(teacher.classes).join(", "),
        getWeeklyClassCount(teacher.id),
        teacher.unavailable.length ? teacher.unavailable.join(", ") : "None",
      ]),
    ]);
  }

  function downloadAbsenceReport() {
    downloadCsv(`absent-teacher-cover-report.csv`, [
      ["Day", "Period", "Standard", "Subject", "Original Teacher", "Substitute"],
      ...absenceReportRows.map((row) => [
        (row.date ? formatDateKey(row.date) : formatSchoolDay(row.day)),
        `Period ${row.period}`,
        row.className,
        row.subject,
        row.originalTeacherName,
        row.substituteTeacherName,
      ]),
    ]);
  }

  if (viewMode === "landing") {
    return (
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto flex min-h-[90vh] max-w-3xl flex-col items-center justify-center gap-6">
          <div className="w-full rounded-2xl bg-white p-8 text-center shadow">
            <div className="mb-6 flex justify-center">
              <img
                src="/amaltas-logo.png"
                alt="Amaltas School logo"
                className="max-h-32 w-auto object-contain"
              />
            </div>
            <div className="rounded-xl bg-white p-3 text-sm shadow">
  {dbError ? (
    <span className="text-red-700">{dbError}</span>
  ) : dbReady ? (
    <span className="text-green-700">Supabase sync active across devices.</span>
  ) : (
    <span className="text-slate-600">Connecting to Supabase...</span>
  )}
</div>

          
            <p className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-700">
              Today: {todayDisplay}
            </p>
            <h1 className="mt-5 text-3xl font-bold">Amaltas School Scheduler</h1>
            <p className="mt-2 text-slate-600">Choose how you want to enter the system.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border p-5 text-left">
                <h2 className="text-xl font-bold">Admin Login</h2>
                <p className="mt-1 text-sm text-slate-600">Edit teachers, mark absences, assign covers, print reports, and manage schedules.</p>
                <input
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleAdminLogin();
                  }}
                  type="password"
                  placeholder="Enter admin password"
                  className="mt-4 w-full rounded-lg border p-3"
                />
                {adminLoginError && <p className="mt-2 text-sm text-red-600">{adminLoginError}</p>}
                <button
                  onClick={handleAdminLogin}
                  className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 text-white"
                >
                  Enter Admin View
                </button>
              </div>

              <div className="rounded-xl border p-5 text-left">
                <h2 className="text-xl font-bold">Teacher View</h2>
                <p className="mt-1 text-sm text-slate-600">View your weekly schedule, today&apos;s classes, and assigned cover duties only.</p>
                <button
                  onClick={() => setViewMode("teacher")}
                  className="mt-4 w-full rounded-lg bg-green-700 px-4 py-3 text-white"
                >
                  Enter Teacher View
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (viewMode === "teacher") {
    return (
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="rounded-2xl bg-white p-5 shadow">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img src="/amaltas-logo.png" alt="Amaltas School logo" className="h-20 w-auto object-contain" />
                <div>
                  <p className="text-sm font-semibold text-slate-500">Teacher View</p>
                  <h1 className="text-2xl font-bold">Amaltas School Scheduler</h1>
                  <p className="text-sm text-slate-600">Today: {todayDisplay}</p>
                </div>
              </div>
              <button
                onClick={() => setViewMode("landing")}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
              >
                Back to Start
              </button>
            </div>
          </header>

          <section className="rounded-xl bg-white p-5 shadow">
            <Select
              label="Select your name"
              value={selectedTeacherView?.id.toString() || ""}
              options={teachers.map((teacher) => ({ label: teacher.name, value: teacher.id.toString() }))}
              onChange={(value) => setSelectedTeacherViewId(Number(value))}
            />
          </section>

          {selectedTeacherView && (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                <Card title="Teacher" value={selectedTeacherView.name} />
                <Card title="Today" value={todayDisplay} />
                <Card title="Cover Duties" value={selectedTeacherCoverDuties.length.toString()} />
              </section>

              <section className="rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-xl font-bold">Today&apos;s Schedule - {todayDisplay}</h2>
                {selectedTeacherTodaySchedule.length === 0 ? (
                  <p className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">No scheduled classes today.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-3">
                    {selectedTeacherTodaySchedule.map((item) => (
                      <div key={`${item.day}-${item.period}-${item.className}-${item.subject}`} className="rounded-lg border p-4">
                        <p className="font-bold">Period {item.period}</p>
                        <p className="text-sm text-slate-600">Class {item.className} - {item.subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-xl font-bold">Your Cover Duties</h2>
                {selectedTeacherCoverDuties.length === 0 ? (
                  <p className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">No cover duties assigned.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedTeacherCoverDuties.map((assignment) => {
                      const absentTeacher = teachers.find((teacher) => teacher.id === assignment.absentTeacherId);
                      return (
                        <div key={assignment.id} className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <p className="font-bold">{formatSchoolDay(assignment.day)} - Period {assignment.period}</p>
                          <p className="text-sm text-slate-700">Class {assignment.className} - {assignment.subject}</p>
                          <p className="mt-2 text-sm text-slate-600">Covering for {absentTeacher?.name || "Original teacher"}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-xl font-bold">Weekly Schedule</h2>
                <div className="space-y-5">
                  {selectedTeacherViewScheduleByDay.map(({ day, items }) => (
                    <div key={day}>
                      <h3 className="mb-2 font-bold text-slate-700">{formatSchoolDay(day)}</h3>
                      {items.length === 0 ? (
                        <p className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-500">No scheduled classes.</p>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-3">
                          {items.map((item) => (
                            <div
  key={`${item.day}-${item.period}-${item.className}-${item.subject}-${item.isCoverDuty ? "cover" : "regular"}`}
  className={`rounded-lg border p-3 ${item.isCoverDuty ? "border-green-200 bg-green-50" : ""}`}
>
  <p className="font-semibold">
    Period {item.period}
    {item.isCoverDuty ? " - Cover Duty" : ""}
  </p>
  <p className="text-sm text-slate-600">Class {item.className} - {item.subject}</p>
  {item.isCoverDuty && (
    <p className="mt-2 text-xs text-green-800">
      Covering for {item.absentTeacherName}
    </p>
  )}
</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-white p-5 shadow">
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src="/amaltas-logo.png"
              alt="Amaltas School logo"
              className="max-h-32 w-auto object-contain"
            />
            <p className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Admin View - Today: {todayDisplay}
            </p>
            <button
              onClick={() => setViewMode("landing")}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Back to Start
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Card title="Teachers" value={teachers.length.toString()} className="md:col-span-2" />
          <Card title="Available Standards" value={`${standards[0]}–${standards[standards.length - 1]}`} className="md:col-span-2" />
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold">School Data Upload</h2>
              <p className="mt-1 text-sm text-slate-600">Upload a locked-format Excel workbook to replace the teacher database and timetable across devices.</p>
              <p className="mt-2 text-xs text-slate-500">Expected sheets: <strong>Teachers</strong> and <strong>Timetable</strong>. Download the current database, edit it, then upload it back.</p>
            </div>
            <div className="flex flex-col gap-2 md:min-w-72">
              <button onClick={downloadCurrentDatabase} className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white">Download Current Database</button>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(event) => handleExcelUpload(event.target.files?.[0] || null)}
                className="rounded-lg border p-2 text-sm"
              />
            </div>
          </div>
          {excelImportStatus && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{excelImportStatus}</p>}
          {excelImportPreview && (
            <div className="mt-4 rounded-lg border p-4">
              <h3 className="font-bold">Import Preview</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Card title="Teachers Found" value={excelImportPreview.teachers.length.toString()} />
                <Card title="Timetable Slots Found" value={excelImportPreview.timetable.length.toString()} />
                <Card title="Warnings" value={excelImportPreview.warnings.length.toString()} />
              </div>
              {excelImportPreview.warnings.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-700">
                  {excelImportPreview.warnings.map((warning) => <li key={warning}>{warning}</li>)}
                </ul>
              )}
              <div className="mt-4 flex gap-2">
                <button onClick={confirmExcelImport} className="rounded-lg bg-red-700 px-4 py-2 text-sm text-white">Confirm Replace Current Data</button>
                <button onClick={() => setExcelImportPreview(null)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm">Cancel Import</button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Today&apos;s Problems</h2>
              <p className="text-sm text-slate-600">Counts update from marked absences and assigned covers for {todayDisplay}.</p>
            </div>
            <button
              onClick={resetSavedData}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Reset Saved Data
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Problem label="Absent teachers" value={absences.length} />
            <Problem label="Affected periods" value={allAffectedPeriods.length} />
            <Problem label="Covers assigned" value={coverAssignments.length} />
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">1. Mark Teacher Absent</h2>

          <div className="grid gap-4 md:grid-cols-7">
            <Select
              label="Teacher"
              value={selectedAbsentTeacherId}
              options={teachers.map((teacher) => ({
                label: teacher.name,
                value: teacher.id.toString(),
              }))}
              onChange={setSelectedAbsentTeacherId}
            />

            <Select
              label="Day"
              value={selectedAbsenceDay}
              options={days.map((day) => ({ label: formatSchoolDay(day), value: day }))}
              onChange={setSelectedAbsenceDay}
            />

            <label className="space-y-1">
              <span className="text-sm font-medium">Start Date</span>
              <input
                type="date"
                value={selectedAbsenceStartDate}
                onChange={(e) => {
                  setSelectedAbsenceStartDate(e.target.value);
                  setSelectedAbsenceDay(getSchoolDayFromDateKey(e.target.value));
                }}
                className="w-full rounded-lg border p-2"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">End Date</span>
              <input
                type="date"
                value={selectedAbsenceEndDate}
                onChange={(e) => setSelectedAbsenceEndDate(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </label>

            <Select
              label="From Period"
              value={selectedAbsenceStartPeriod}
              options={periods.map((period) => ({ label: `Period ${period}`, value: period }))}
              onChange={setSelectedAbsenceStartPeriod}
            />

            <Select
              label="To Period"
              value={selectedAbsenceEndPeriod}
              options={periods.map((period) => ({ label: `Period ${period}`, value: period }))}
              onChange={setSelectedAbsenceEndPeriod}
            />

            <div className="flex items-end">
              <button
                onClick={markTeacherAbsent}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white"
              >
                Mark Absent
              </button>
            </div>
          </div>

          <h3 className="mt-5 font-semibold">Current Absences</h3>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {absences.length === 0 ? (
              <p className="text-sm text-slate-500">No teachers marked absent yet.</p>
            ) : (
              absences.map((absence) => {
                const teacher = teachers.find((t) => t.id === absence.teacherId);
                if (!teacher) return null;

                return (
                  <div key={absence.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 className="font-bold">{teacher.name}</h4>
                    <p className="text-sm text-slate-600">
                      Absent on {absence.date ? formatDateKey(absence.date) : formatSchoolDay(absence.day)}, Period {absence.startPeriod}–{absence.endPeriod}
                    </p>
                    <button
                      onClick={() => removeAbsence(absence.id)}
                      className="mt-3 rounded-lg bg-white px-3 py-2 text-sm"
                    >
                      Remove Absence
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <h3 className="mt-5 font-semibold">
            Affected Classes for {selectedAbsentTeacher?.name || "selected teacher"}
          </h3>

          {!selectedTeacherIsAbsent ? (
            <p className="mt-3 rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
              Mark this teacher absent first. Then their affected classes will appear here.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {days.map((day) => {
                const dayItems = affectedClassesForSelectedAbsence.filter((item) => item.day === day);
                if (dayItems.length === 0) return null;

                return (
                  <div key={day}>
                    <h4 className="mb-2 font-bold text-slate-700">{dayItems[0]?.date ? formatDateKey(dayItems[0].date) : formatSchoolDay(day)}</h4>
                    <div className="grid gap-3 md:grid-cols-4">
                      {dayItems.map((item) => (
                        <button
                          key={`${item.day}-${item.period}-${item.className}`}
                          onClick={() =>
                            chooseAffectedClass({
                              absentTeacherId: item.teacher.id,
                              day: item.day,
                              date: item.date,
                              period: item.period,
                              className: item.className,
                              subject: item.subject,
                            })
                          }
                          className="rounded-lg border bg-amber-50 p-3 text-left hover:bg-amber-100"
                        >
                          <p className="font-bold">Class {item.className}</p>
                          <p className="text-sm text-slate-600">
                            Period {item.period} — {item.subject}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">2. Find and Assign Cover</h2>

          {!coverRequest ? (
            <p className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
              Click an affected class above. The class, day, period, subject, and absent teacher will fill in automatically.
            </p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-5">
                <ReadOnlyField label="Class" value={coverRequest.className} />
                <ReadOnlyField label="Day" value={formatSchoolDay(coverRequest.day)} />
                <ReadOnlyField label="Period" value={`Period ${coverRequest.period}`} />
                <ReadOnlyField label="Subject" value={coverRequest.subject} />
                <ReadOnlyField
                  label="Absent Teacher"
                  value={teachers.find((teacher) => teacher.id === coverRequest.absentTeacherId)?.name || "Unknown"}
                />
              </div>

              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                <p>
                  Need cover for <strong>Class {coverRequest.className}</strong>,{" "}
                  <strong>{coverRequest.subject}</strong>, Period <strong>{coverRequest.period}</strong>{" "}
                  on <strong>{formatSchoolDay(coverRequest.day)}</strong>.
                </p>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {coverTeachers.slice(0, 6).map((teacher) => (
                  <div key={teacher.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-bold">{teacher.name}</h4>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        {teacher.match}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Subjects: {teacher.subjects.join(", ")}
                    </p>
                    <p className="text-sm text-slate-600">
                      Classes: {sortClasses(teacher.classes).join(", ")}
                    </p>
                    <button
                      onClick={() => assignCover(teacher.id)}
                      className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                      Assign Cover
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">Assigned Covers</h2>

          {coverAssignments.length === 0 ? (
            <p className="text-sm text-slate-500">No covers assigned yet.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
              {(sortBySchoolOrder(coverAssignments) as CoverAssignment[]).map((assignment) => {
                const absentTeacher = teachers.find((t) => t.id === assignment.absentTeacherId);
                const coverTeacher = teachers.find((t) => t.id === assignment.coverTeacherId);

                return (
                  <div key={assignment.id} className="rounded-lg border p-3 text-sm">
                    <h3 className="font-semibold">
                      Class {assignment.className} — Period {assignment.period}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {formatSchoolDay(assignment.day)}, {assignment.subject}
                    </p>
                    <p className="mt-2 text-sm">
                      <strong>{coverTeacher?.name}</strong> covering for{" "}
                      <strong>{absentTeacher?.name}</strong>
                    </p>
                    <button
                      onClick={() => removeCoverAssignment(assignment.id)}
                      className="mt-2 rounded-lg bg-slate-100 px-2 py-1 text-xs"
                    >
                      Remove Assignment
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Absent Teacher Cover Report</h2>
              <p className="text-sm text-slate-600">Printable and downloadable report sorted by day, period, and class.</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <button
                onClick={printAbsenceReport}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Print Absence Report
              </button>
              <button
                onClick={downloadAbsenceReport}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Download CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-slate-100 p-3 text-left">Day</th>
                  <th className="border bg-slate-100 p-3 text-left">Period</th>
                  <th className="border bg-slate-100 p-3 text-left">Standard</th>
                  <th className="border bg-slate-100 p-3 text-left">Subject</th>
                  <th className="border bg-slate-100 p-3 text-left">Original Teacher</th>
                  <th className="border bg-slate-100 p-3 text-left">Substitute</th>
                </tr>
              </thead>
              <tbody>
                {absenceReportRows.length === 0 ? (
                  <tr>
                    <td className="border p-3 text-slate-500" colSpan={6}>
                      No absent teachers or affected periods yet.
                    </td>
                  </tr>
                ) : (
                  absenceReportRows.map((row) => (
                    <tr key={`${row.day}-${row.period}-${row.className}-${row.originalTeacherName}`}>
                      <td className="border p-3">{(row.date ? formatDateKey(row.date) : formatSchoolDay(row.day))}</td>
                      <td className="border p-3 font-semibold">Period {row.period}</td>
                      <td className="border p-3">{row.className}</td>
                      <td className="border p-3">{row.subject}</td>
                      <td className="border p-3">{row.originalTeacherName}</td>
                      <td className="border p-3">{row.substituteTeacherName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Daily All-Class Timetable</h2>
              <p className="text-sm text-slate-600">Select a day to see every class on one page.</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <select
                value={selectedDailyViewDay}
                onChange={(e) => setSelectedDailyViewDay(e.target.value)}
                className="rounded-lg border p-2"
              >
                {days.map((day) => (
                  <option key={day}>{day}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={showDailyCovers}
                  onChange={(e) => setShowDailyCovers(e.target.checked)}
                />
                Show covers
              </label>
              <button
                onClick={printDailyAllClasses}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Print Day View
              </button>
              <button
                onClick={downloadDailyAllClasses}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Download CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border bg-slate-100 p-3 text-left">Class</th>
                  <th className="border bg-slate-100 p-3 text-left">Class Teacher</th>
                  {periods.map((period) => (
                    <th key={period} className="border bg-slate-100 p-3 text-left">
                      Period {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dailyAllClassRows.map((row) => (
                  <tr key={row.className}>
                    <td className="border p-3 font-bold">{row.className}</td>
                    <td className="border p-3 text-slate-700">{row.classTeacherName}</td>
                    {row.periods.map((item) => (
                      <td key={`${row.className}-${item.period}`} className="border p-3">
                        <div className="font-semibold">{item.subject}</div>
                        <div className="text-slate-600">Teacher: {item.teacherName}</div>
                        {item.auxiliaryTeacherName && (
                          <div className="text-slate-600">Auxiliary: {item.auxiliaryTeacherName}</div>
                        )}
                        {showDailyCovers && item.coverTeacherName && (
                          <div className="mt-2 rounded bg-green-100 p-2 text-xs text-green-800">
                            Cover: {item.coverTeacherName}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Weekly Timetable</h2>
              <p className="text-sm text-slate-600">Select a class and print an attractive weekly schedule.</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-lg border p-2"
              >
                {standards.map((standard) => (
                  <option key={standard}>{standard}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={showWeeklyCovers}
                  onChange={(e) => setShowWeeklyCovers(e.target.checked)}
                />
                Show covers
              </label>
              <button
                onClick={printSelectedTimetable}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Print Schedule
              </button>
              <button
                onClick={downloadSelectedTimetable}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Download Schedule
              </button>
              <button
                onClick={printAllTimetables}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Print All Timetables
              </button>
              <button
                onClick={downloadAllTimetables}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Download All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-slate-100 p-3 text-left">Period</th>
                  {days.map((day) => (
                    <th key={day} className="border bg-slate-100 p-3 text-left">
                      {formatSchoolDay(day)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period}>
                    <td className="border p-3 font-bold">Period {period}</td>
                    {days.map((day) => {
                      const teacherName = getTeacherNameForSlot(day, period, selectedClass);
                      const auxiliaryTeacherName = getAuxiliaryTeacherNameForSlot(day, period, selectedClass);
                      const subject = getSubjectForSlot(day, period, selectedClass);

                      const coverAssignment = coverAssignments.find(
                        (assignment) =>
                          assignment.day === day &&
                          assignment.period === period &&
                          assignment.className === selectedClass
                      );

                      const coverTeacher = coverAssignment
                        ? teachers.find((t) => t.id === coverAssignment.coverTeacherId)
                        : null;

                      return (
                        <td key={day} className="border p-3">
                          <div className="font-semibold">{subject}</div>
                          <div className="text-slate-600">Teacher: {teacherName}</div>
                          {auxiliaryTeacherName && (
                            <div className="text-slate-600">Auxiliary: {auxiliaryTeacherName}</div>
                          )}

                          {showWeeklyCovers && coverTeacher && (
                            <div className="mt-2 rounded bg-green-100 p-2 text-xs text-green-800">
                              Cover: {coverTeacher.name}
                            </div>
                          )}
                          <button
                            onClick={() => startEditSlot(day, period, selectedClass)}
                            className="mt-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
                          >
                            Edit Slot
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">Class Teachers</h2>
          <div className="grid gap-3 md:grid-cols-5">
            {classTeachers.map((item) => (
              <div key={item.className} className="rounded-lg border p-4">
                <p className="text-sm text-slate-500">Class {item.className}</p>
                <h3 className="font-bold">{item.teacherName}</h3>
              </div>
            ))}
          </div>
        </section>



        {editSlotForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <section className="w-full max-w-4xl rounded-xl bg-white p-5 shadow-2xl">
              <h2 className="mb-2 text-xl font-bold">Edit Timetable Slot</h2>
              <p className="mb-4 text-sm text-slate-600">Change the subject or teacher for this exact class period. Saving updates Supabase and all devices.</p>
              <div className="grid gap-3 md:grid-cols-3">
                <ReadOnlyField label="Class" value={editSlotForm.className} />
                <ReadOnlyField label="Day" value={formatSchoolDay(editSlotForm.day)} />
                <ReadOnlyField label="Period" value={`Period ${editSlotForm.period}`} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label className="space-y-1">
                  <span className="text-sm font-medium">Subject</span>
                  <input
                    value={editSlotForm.subject}
                    onChange={(e) => setEditSlotForm({ ...editSlotForm, subject: e.target.value })}
                    placeholder="Subject"
                    className="w-full rounded-lg border p-3"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium">Teacher</span>
                  <select
                    value={editSlotForm.teacherName}
                    onChange={(e) => setEditSlotForm({ ...editSlotForm, teacherName: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="Free">Free</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.name}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium">Auxiliary Teacher</span>
                  <select
                    value={editSlotForm.auxiliaryTeacherName}
                    onChange={(e) => setEditSlotForm({ ...editSlotForm, auxiliaryTeacherName: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">None</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.name}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={saveEditedSlot} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Save Slot</button>
                <button onClick={() => setEditSlotForm(null)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm">Cancel</button>
              </div>
            </section>
          </div>
        )}
        <section className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Teachers by Subject</h2>
              <p className="text-sm text-slate-600">Select a subject to see every teacher assigned to it from the timetable.</p>
            </div>
            <div className="w-full md:w-72">
              <Select
                label="Subject"
                value={selectedSubjectTeacherList}
                options={subjectOptions.map((subject) => ({ label: subject, value: subject }))}
                onChange={setSelectedSubjectTeacherList}
              />
            </div>
          </div>

          {selectedSubjectTeacherList === "All" ? (
            <div className="rounded-lg border p-4 text-sm text-slate-600">Choose a subject to view assigned teachers.</div>
          ) : teachersForSelectedSubject.length === 0 ? (
            <div className="rounded-lg border p-4 text-sm text-slate-600">No teachers found for this subject.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border bg-slate-100 p-3 text-left">Teacher</th>
                    <th className="border bg-slate-100 p-3 text-left">Classes</th>
                    <th className="border bg-slate-100 p-3 text-left">Weekly Periods</th>
                  </tr>
                </thead>
                <tbody>
                  {teachersForSelectedSubject.map((item) => (
                    <tr key={item.teacher.id}>
                      <td className="border p-3 font-semibold">{item.teacher.name}</td>
                      <td className="border p-3">{item.classes.join(", ") || "Not listed"}</td>
                      <td className="border p-3 font-semibold">{item.weeklyPeriods}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">Teacher Schedule View</h2>

          <Select
            label="Select Teacher"
            value={selectedTeacherProfile?.id.toString() || ""}
            options={teachers.map((teacher) => ({
              label: teacher.name,
              value: teacher.id.toString(),
            }))}
            onChange={(value) => setSelectedTeacherProfileId(Number(value))}
          />

          {selectedTeacherProfile && (
            <>
              <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-bold">{selectedTeacherProfile.name}</h3>
                <p className="text-sm text-slate-600">
                  Subjects: {selectedTeacherProfile.subjects.join(", ")}
                </p>
                <p className="text-sm text-slate-600">
                  Classes: {sortClasses(selectedTeacherProfile.classes).join(", ")}
                </p>
                <p className="mt-2 rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-800">
                  Weekly periods/classes: {selectedTeacherWeeklyCount}
                </p>
              </div>

              <div className="mt-4 space-y-5">
                {selectedTeacherScheduleByDay.map(({ day, items }) => {
                  if (items.length === 0) return null;

                  return (
                    <div key={day}>
                      <h4 className="mb-2 font-bold text-slate-700">{formatSchoolDay(day)}</h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        {items.map((item) => (
                          <div
                            key={`${item.day}-${item.period}-${item.className}-${item.subject}`}
                            className="rounded-lg border p-3"
                          >
                            <p className="font-semibold">Period {item.period}</p>
                            <p className="text-sm text-slate-600">
                              Class {item.className} — {item.subject}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Teacher Database</h2>
              <p className="text-sm text-slate-600">
                Filter by search, subject, or class. Print only the currently filtered teachers.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <button
                onClick={printFilteredTeachers}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Print Filtered Teachers
              </button>
              <button
                onClick={downloadFilteredTeachers}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Download CSV
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-1">
              <span className="text-sm font-medium">Search teacher</span>
              <input
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Search teacher..."
                className="w-full rounded-lg border p-3"
              />
            </label>

            <Select
              label="Filter by Subject"
              value={teacherSubjectFilter}
              options={subjectOptions.map((subject) => ({ label: subject, value: subject }))}
              onChange={setTeacherSubjectFilter}
            />

            <Select
              label="Filter by Class"
              value={teacherClassFilter}
              options={classOptions.map((className) => ({ label: className, value: className }))}
              onChange={setTeacherClassFilter}
            />
          </div>

          <div className="mt-5 rounded-lg border bg-slate-50 p-4">
            <h3 className="mb-3 font-bold">Manually Add Teacher</h3>
            <div className="grid gap-3 md:grid-cols-5">
              <input
                value={addTeacherForm.name}
                onChange={(e) => setAddTeacherForm({ ...addTeacherForm, name: e.target.value })}
                placeholder="Teacher name"
                className="rounded-lg border p-3"
              />
              <select
                value={addTeacherForm.gender}
                onChange={(e) =>
                  setAddTeacherForm({
                    ...addTeacherForm,
                    gender: e.target.value as "Male" | "Female",
                  })
                }
                className="rounded-lg border p-3"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
              <input
                value={addTeacherForm.subjects}
                onChange={(e) => setAddTeacherForm({ ...addTeacherForm, subjects: e.target.value })}
                placeholder="Subjects, comma separated"
                className="rounded-lg border p-3"
              />
              <input
                value={addTeacherForm.classes}
                onChange={(e) => setAddTeacherForm({ ...addTeacherForm, classes: e.target.value })}
                placeholder="Classes, e.g. VI A, VII B"
                className="rounded-lg border p-3"
              />
              <input
                value={addTeacherForm.unavailable}
                onChange={(e) => setAddTeacherForm({ ...addTeacherForm, unavailable: e.target.value })}
                placeholder="Unavailable, e.g. Monday-3"
                className="rounded-lg border p-3"
              />
            </div>
            <button
              onClick={addTeacher}
              className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Add Teacher
            </button>
          </div>

          {editingTeacherId && (
            <div className="mt-5 rounded-lg border bg-blue-50 p-4">
              <h3 className="mb-3 font-bold">Edit Teacher</h3>
              <div className="grid gap-3 md:grid-cols-5">
                <input
                  value={editTeacherForm.name}
                  onChange={(e) => setEditTeacherForm({ ...editTeacherForm, name: e.target.value })}
                  placeholder="Teacher name"
                  className="rounded-lg border p-3"
                />
                <select
                  value={editTeacherForm.gender}
                  onChange={(e) => setEditTeacherForm({ ...editTeacherForm, gender: e.target.value as "Male" | "Female" })}
                  className="rounded-lg border p-3"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                <input
                  value={editTeacherForm.subjects}
                  onChange={(e) => setEditTeacherForm({ ...editTeacherForm, subjects: e.target.value })}
                  placeholder="Subjects"
                  className="rounded-lg border p-3"
                />
                <input
                  value={editTeacherForm.classes}
                  onChange={(e) => setEditTeacherForm({ ...editTeacherForm, classes: e.target.value })}
                  placeholder="Classes"
                  className="rounded-lg border p-3"
                />
                <input
                  value={editTeacherForm.unavailable}
                  onChange={(e) => setEditTeacherForm({ ...editTeacherForm, unavailable: e.target.value })}
                  placeholder="Unavailable"
                  className="rounded-lg border p-3"
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={saveEditedTeacher} className="rounded-lg bg-blue-700 px-4 py-2 text-sm text-white">Save Changes</button>
                <button onClick={() => setEditingTeacherId(null)} className="rounded-lg bg-white px-4 py-2 text-sm">Cancel</button>
              </div>
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-slate-100 p-3 text-left">Name</th>
                  <th className="border bg-slate-100 p-3 text-left">Gender</th>
                  <th className="border bg-slate-100 p-3 text-left">Subjects</th>
                  <th className="border bg-slate-100 p-3 text-left">Classes</th>
                  <th className="border bg-slate-100 p-3 text-left">Weekly Periods</th>
                  <th className="border bg-slate-100 p-3 text-left">Unavailable</th>
                  <th className="border bg-slate-100 p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50">
                    <td
                      onClick={() => setSelectedTeacherProfileId(teacher.id)}
                      className="cursor-pointer border p-3 font-semibold"
                    >
                      {teacher.name}
                    </td>
                    <td className="border p-3">{teacher.gender}</td>
                    <td className="border p-3">{teacher.subjects.join(", ")}</td>
                    <td className="border p-3">{sortClasses(teacher.classes).join(", ")}</td>
                    <td className="border p-3 font-semibold">{getWeeklyClassCount(teacher.id)}</td>
                    <td className="border p-3">
                      {teacher.unavailable.length ? teacher.unavailable.join(", ") : "None"}
                    </td>
                    <td className="border p-3">
                      <button
                        onClick={() => startEditTeacher(teacher)}
                        className="mr-2 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeTeacher(teacher.id)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                      >
                        Remove Teacher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value, className = "" }: { title: string; value: string; className?: string }) {
  return (
    <div className={`rounded-xl bg-white p-5 shadow ${className}`}>
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function Problem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-amber-50 p-4">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <div className="rounded-lg border bg-slate-50 p-2 text-slate-900">{value}</div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border p-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
