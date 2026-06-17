"use client";

import { useEffect, useMemo, useState } from "react";
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
  type Teacher,
} from "@/src/data/schoolData";

type Absence = {
  id: number;
  teacherId: number;
  day: string;
};

type CoverAssignment = {
  id: number;
  absentTeacherId: number;
  coverTeacherId: number;
  day: string;
  period: string;
  className: string;
  subject: string;
};

type CoverRequest = {
  absentTeacherId: number;
  day: string;
  period: string;
  className: string;
  subject: string;
};

type AddTeacherForm = {
  name: string;
  subjects: string;
  classes: string;
  unavailable: string;
};

const STORAGE_KEY = "amaltas-school-scheduler-data-v1";

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [selectedClass, setSelectedClass] = useState(standards[0] || "NUR A");
  const [selectedDailyViewDay, setSelectedDailyViewDay] = useState("Monday");
  const [selectedAbsenceDay, setSelectedAbsenceDay] = useState("Monday");
  const [selectedAbsentTeacherId, setSelectedAbsentTeacherId] = useState(
    initialTeachers[0]?.id.toString() || "1"
  );
  const [coverRequest, setCoverRequest] = useState<CoverRequest | null>(null);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState("All");
  const [teacherClassFilter, setTeacherClassFilter] = useState("All");
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
    subjects: "",
    classes: "",
    unavailable: "",
  });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed.teachers) && parsed.teachers.length > 0) {
          setTeachers(parsed.teachers);
        }
        if (Array.isArray(parsed.absences)) {
          setAbsences(parsed.absences);
        }
        if (Array.isArray(parsed.coverAssignments)) {
          setCoverAssignments(parsed.coverAssignments);
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
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        teachers,
        absences,
        coverAssignments,
        selectedClass,
      })
    );
  }, [teachers, absences, coverAssignments, selectedClass, storageReady]);

  function normalizeName(name: string) {
    return name.trim().toLowerCase();
  }

  function splitList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
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
    return timetableEntries.find(
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

  function getSubjectForSlot(day: string, period: string, className: string) {
    const entry = getEntryForSlot(day, period, className);
    return entry?.subject || "Free";
  }

  function getAffectedClassesForTeacher(teacherId: number, day: string) {
    const teacher = teachers.find((item) => item.id === teacherId);
    if (!teacher) return [];

    return sortBySchoolOrder(
      timetableEntries
        .filter(
          (entry) =>
            entry.day === day && normalizeName(entry.teacherName) === normalizeName(teacher.name)
        )
        .map((entry) => ({
          day: entry.day,
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
      timetableEntries
        .filter((entry) => normalizeName(entry.teacherName) === normalizeName(teacher.name))
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

    return timetableEntries.filter(
      (entry) => normalizeName(entry.teacherName) === normalizeName(teacher.name)
    ).length;
  }

  function getClassTeacherName(className: string) {
    return classTeachers.find((item) => item.className === className)?.teacherName || "Not listed";
  }

  function isTeacherAlreadyTeaching(teacher: Teacher, day: string, period: string) {
    return timetableEntries.some(
      (entry) =>
        entry.day === day &&
        entry.period.toString() === period &&
        normalizeName(entry.teacherName) === normalizeName(teacher.name)
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
          (absence) => absence.teacherId === teacher.id && absence.day === day
        );

        return !isAbsentTeacher && !isUnavailable && !alreadyTeaching && !absentToday;
      })
      .map((teacher) => {
        let score = 25;
        if (teacher.classes.includes(className)) score += 25;
        if (teacher.subjects.some((subject) => normalizeName(subject) === normalizeName(subjectForSlot))) {
          score += 40;
        }

        return {
          ...teacher,
          score,
          match: score >= 80 ? "Best match" : score >= 50 ? "Good match" : "Available",
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

  const affectedClassesForSelectedAbsence =
    selectedAbsentTeacher && selectedTeacherIsAbsent
      ? getAffectedClassesForTeacher(selectedAbsentTeacher.id, selectedAbsenceDay)
      : [];

  const allAffectedPeriods = absences.flatMap((absence) =>
    getAffectedClassesForTeacher(absence.teacherId, absence.day)
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
        coverTeacherName: coverTeacher?.name || "",
      };
    }),
  }));

  const subjectOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(teachers.flatMap((teacher) => teacher.subjects))).sort()];
  }, [teachers]);

  const classOptions = useMemo(() => {
    return ["All", ...sortClasses(Array.from(new Set(teachers.flatMap((teacher) => teacher.classes))))];
  }, [teachers]);

  function markTeacherAbsent() {
    const teacherId = Number(selectedAbsentTeacherId);
    const alreadyMarked = absences.some(
      (absence) => absence.teacherId === teacherId && absence.day === selectedAbsenceDay
    );

    if (alreadyMarked) return;

    setAbsences([
      ...absences,
      {
        id: Date.now(),
        teacherId,
        day: selectedAbsenceDay,
      },
    ]);
  }

  function removeAbsence(id: number) {
    const removed = absences.find((absence) => absence.id === id);
    setAbsences(absences.filter((absence) => absence.id !== id));

    if (removed) {
      setCoverAssignments(
        coverAssignments.filter(
          (assignment) =>
            !(assignment.absentTeacherId === removed.teacherId && assignment.day === removed.day)
        )
      );
    }

    if (
      removed &&
      coverRequest?.absentTeacherId === removed.teacherId &&
      coverRequest.day === removed.day
    ) {
      setCoverRequest(null);
    }
  }

  function chooseAffectedClass(request: CoverRequest) {
    setCoverRequest(request);
    setSelectedClass(request.className);
  }

  function assignCover(coverTeacherId: number) {
    if (!coverRequest) return;

    const alreadyAssigned = coverAssignments.some(
      (assignment) =>
        assignment.day === coverRequest.day &&
        assignment.period === coverRequest.period &&
        assignment.className === coverRequest.className
    );

    if (alreadyAssigned) return;

    setCoverAssignments([
      ...coverAssignments,
      {
        id: Date.now(),
        absentTeacherId: coverRequest.absentTeacherId,
        coverTeacherId,
        day: coverRequest.day,
        period: coverRequest.period,
        className: coverRequest.className,
        subject: coverRequest.subject,
      },
    ]);
  }

  function removeCoverAssignment(id: number) {
    setCoverAssignments(coverAssignments.filter((assignment) => assignment.id !== id));
  }

  function removeTeacher(teacherId: number) {
    const remainingTeachers = teachers.filter((teacher) => teacher.id !== teacherId);

    setTeachers(remainingTeachers);
    setAbsences(absences.filter((absence) => absence.teacherId !== teacherId));
    setCoverAssignments(
      coverAssignments.filter(
        (assignment) =>
          assignment.absentTeacherId !== teacherId && assignment.coverTeacherId !== teacherId
      )
    );

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

  function addTeacher() {
    const name = addTeacherForm.name.trim();
    if (!name) return;

    const duplicate = teachers.some((teacher) => normalizeName(teacher.name) === normalizeName(name));
    if (duplicate) return;

    const newTeacher: Teacher = {
      id: Date.now(),
      name,
      subjects: splitList(addTeacherForm.subjects),
      classes: sortClasses(splitList(addTeacherForm.classes)),
      unavailable: splitList(addTeacherForm.unavailable),
    };

    setTeachers([...teachers, newTeacher].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedTeacherProfileId(newTeacher.id);
    setSelectedAbsentTeacherId(newTeacher.id.toString());
    setAddTeacherForm({ name: "", subjects: "", classes: "", unavailable: "" });
  }

  function resetSavedData() {
    const confirmed = window.confirm(
      "Reset saved data back to the imported spreadsheet version? This will remove manual teacher changes, absences, and cover assignments."
    );
    if (!confirmed) return;

    window.localStorage.removeItem(STORAGE_KEY);
    setTeachers(initialTeachers);
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
                <div class="teacher">${escapeHtml(teacherName)}</div>
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
              ${days.map((day) => `<th>${escapeHtml(day)}</th>`).join("")}
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
                <div class="teacher">${escapeHtml(item.teacherName)}</div>
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
          <p class="subtitle">All Classes Timetable - ${escapeHtml(selectedDailyViewDay)}</p>
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

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex justify-center py-4">
          <img
            src="/amaltas-logo.png"
            alt="Amaltas School logo"
            className="max-h-32 w-auto object-contain"
          />
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Card title="Teachers" value={teachers.length.toString()} className="md:col-span-2" />
          <Card title="Available Standards" value={`${standards[0]}–${standards[standards.length - 1]}`} className="md:col-span-2" />
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Today&apos;s Problems</h2>
              <p className="text-sm text-slate-600">Counts update from marked absences and assigned covers.</p>
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

          <div className="grid gap-4 md:grid-cols-3">
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
              options={days.map((day) => ({ label: day, value: day }))}
              onChange={setSelectedAbsenceDay}
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
                    <p className="text-sm text-slate-600">Absent on {absence.day}</p>
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
                    <h4 className="mb-2 font-bold text-slate-700">{day}</h4>
                    <div className="grid gap-3 md:grid-cols-4">
                      {dayItems.map((item) => (
                        <button
                          key={`${item.day}-${item.period}-${item.className}`}
                          onClick={() =>
                            chooseAffectedClass({
                              absentTeacherId: item.teacher.id,
                              day: item.day,
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
                <ReadOnlyField label="Day" value={coverRequest.day} />
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
                  on <strong>{coverRequest.day}</strong>.
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
              {sortBySchoolOrder(coverAssignments).map((assignment) => {
                const absentTeacher = teachers.find((t) => t.id === assignment.absentTeacherId);
                const coverTeacher = teachers.find((t) => t.id === assignment.coverTeacherId);

                return (
                  <div key={assignment.id} className="rounded-lg border p-3 text-sm">
                    <h3 className="font-semibold">
                      Class {assignment.className} — Period {assignment.period}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {assignment.day}, {assignment.subject}
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
                        <div className="text-slate-600">{item.teacherName}</div>
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
                onClick={printAllTimetables}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white"
              >
                Print All Timetables
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
                      {day}
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
                          <div className="text-slate-600">{teacherName}</div>

                          {showWeeklyCovers && coverTeacher && (
                            <div className="mt-2 rounded bg-green-100 p-2 text-xs text-green-800">
                              Cover: {coverTeacher.name}
                            </div>
                          )}
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
                      <h4 className="mb-2 font-bold text-slate-700">{day}</h4>
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
            <button
              onClick={printFilteredTeachers}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Print Filtered Teachers
            </button>
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
            <div className="grid gap-3 md:grid-cols-4">
              <input
                value={addTeacherForm.name}
                onChange={(e) => setAddTeacherForm({ ...addTeacherForm, name: e.target.value })}
                placeholder="Teacher name"
                className="rounded-lg border p-3"
              />
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

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-slate-100 p-3 text-left">Name</th>
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
                    <td className="border p-3">{teacher.subjects.join(", ")}</td>
                    <td className="border p-3">{sortClasses(teacher.classes).join(", ")}</td>
                    <td className="border p-3 font-semibold">{getWeeklyClassCount(teacher.id)}</td>
                    <td className="border p-3">
                      {teacher.unavailable.length ? teacher.unavailable.join(", ") : "None"}
                    </td>
                    <td className="border p-3">
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
