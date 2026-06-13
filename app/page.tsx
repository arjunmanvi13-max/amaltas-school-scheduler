"use client";

import { useMemo, useState } from "react";
import {
  schoolName,
  days,
  periods,
  standards,
  initialTeachers,
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

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedPeriod, setSelectedPeriod] = useState("3");
  const [selectedAbsentTeacherId, setSelectedAbsentTeacherId] = useState("1");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedTeacherProfileId, setSelectedTeacherProfileId] = useState(1);

  const [absences, setAbsences] = useState<Absence[]>([
    { id: 1, teacherId: 1, day: "Monday" },
  ]);

  const [coverAssignments, setCoverAssignments] = useState<CoverAssignment[]>([]);

  function getTeacherForSlot(day: string, period: string, standard: string) {
    const index =
      (days.indexOf(day) + Number(period) + standards.indexOf(standard)) %
      teachers.length;

    return teachers[index];
  }

  function getSubjectForSlot(day: string, period: string, standard: string) {
    return getTeacherForSlot(day, period, standard)?.subjects[0] || "Subject";
  }

  function getAffectedClassesForTeacher(teacherId: number, day: string) {
    const affected = [];

    for (const period of periods) {
      for (const standard of standards) {
        const teacher = getTeacherForSlot(day, period, standard);

        if (teacher?.id === teacherId) {
          affected.push({
            day,
            period,
            className: standard,
            subject: getSubjectForSlot(day, period, standard),
            teacher,
          });
        }
      }
    }

    return affected;
  }

  function getTeacherSchedule(teacherId: number) {
    const schedule = [];

    for (const day of days) {
      for (const period of periods) {
        for (const standard of standards) {
          const teacher = getTeacherForSlot(day, period, standard);

          if (teacher?.id === teacherId) {
            schedule.push({
              day,
              period,
              className: standard,
              subject: getSubjectForSlot(day, period, standard),
            });
          }
        }
      }
    }

    return schedule;
  }

  function findCoverTeachers(
    day: string,
    period: string,
    standard: string,
    absentTeacherId: number
  ) {
    const slot = `${day}-${period}`;

    return teachers
      .filter((teacher) => {
        const isAbsentTeacher = teacher.id === absentTeacherId;
        const isUnavailable = teacher.unavailable.includes(slot);

        const isAlreadyTeaching = standards.some((className) => {
          const assignedTeacher = getTeacherForSlot(day, period, className);
          return assignedTeacher?.id === teacher.id;
        });

        return !isAbsentTeacher && !isUnavailable && !isAlreadyTeaching;
      })
      .map((teacher) => {
        let score = 25;
        if (teacher.classes.includes(standard)) score += 25;

        return {
          ...teacher,
          score,
          match: score >= 50 ? "Good match" : "Available",
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  const selectedAbsentTeacher =
    teachers.find((teacher) => teacher.id === Number(selectedAbsentTeacherId)) ||
    teachers[0];

  const subjectForSlot = getSubjectForSlot(selectedDay, selectedPeriod, selectedClass);

  const coverTeachers = findCoverTeachers(
    selectedDay,
    selectedPeriod,
    selectedClass,
    selectedAbsentTeacher.id
  );

  const affectedClasses = getAffectedClassesForTeacher(
    selectedAbsentTeacher.id,
    selectedDay
  );

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
    );
  }, [teacherSearch, teachers]);

  const selectedTeacherProfile =
    teachers.find((teacher) => teacher.id === selectedTeacherProfileId) || teachers[0];

  const selectedTeacherSchedule = selectedTeacherProfile
    ? getTeacherSchedule(selectedTeacherProfile.id)
    : [];

  function markTeacherAbsent() {
    const alreadyMarked = absences.some(
      (absence) =>
        absence.teacherId === Number(selectedAbsentTeacherId) &&
        absence.day === selectedDay
    );

    if (alreadyMarked) return;

    setAbsences([
      ...absences,
      {
        id: Date.now(),
        teacherId: Number(selectedAbsentTeacherId),
        day: selectedDay,
      },
    ]);
  }

  function removeAbsence(id: number) {
    setAbsences(absences.filter((absence) => absence.id !== id));
  }

  function assignCover(coverTeacherId: number) {
    const alreadyAssigned = coverAssignments.some(
      (assignment) =>
        assignment.day === selectedDay &&
        assignment.period === selectedPeriod &&
        assignment.className === selectedClass
    );

    if (alreadyAssigned) return;

    setCoverAssignments([
      ...coverAssignments,
      {
        id: Date.now(),
        absentTeacherId: selectedAbsentTeacher.id,
        coverTeacherId,
        day: selectedDay,
        period: selectedPeriod,
        className: selectedClass,
        subject: subjectForSlot,
      },
    ]);
  }

  function removeCoverAssignment(id: number) {
    setCoverAssignments(
      coverAssignments.filter((assignment) => assignment.id !== id)
    );
  }

  function removeTeacher(teacherId: number) {
    const remainingTeachers = teachers.filter((teacher) => teacher.id !== teacherId);

    setTeachers(remainingTeachers);
    setAbsences(absences.filter((absence) => absence.teacherId !== teacherId));
    setCoverAssignments(
      coverAssignments.filter(
        (assignment) =>
          assignment.absentTeacherId !== teacherId &&
          assignment.coverTeacherId !== teacherId
      )
    );

    if (Number(selectedAbsentTeacherId) === teacherId && remainingTeachers.length > 0) {
      setSelectedAbsentTeacherId(remainingTeachers[0].id.toString());
    }

    if (selectedTeacherProfileId === teacherId && remainingTeachers.length > 0) {
      setSelectedTeacherProfileId(remainingTeachers[0].id);
    }
  }

  function useAffectedClass(period: string, className: string) {
    setSelectedPeriod(period);
    setSelectedClass(className);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-slate-900 p-6 text-white shadow">
          <p className="text-sm text-slate-300">Teacher Management Demo</p>
          <h1 className="text-4xl font-bold">{schoolName}</h1>
          <p className="mt-2 text-slate-300">
            Mark absences, view affected classes, assign covers, and review weekly schedules.
          </p>
          <p className="mt-3 rounded-lg bg-slate-800 p-3 text-sm text-slate-200">
            Demo uses placeholder teacher data. Real Excel data can be added later.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Card title="Teachers" value={teachers.length.toString()} />
          <Card title="Classes" value="Nursery–10" />
          <Card title="Teachers Absent" value={absences.length.toString()} />
          <Card title="Covers Assigned" value={coverAssignments.length.toString()} />
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">Today&apos;s Problems</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Problem label="Absent teachers" value={absences.length} />
            <Problem label="Affected periods" value={affectedClasses.length} />
            <Problem label="Covers assigned" value={coverAssignments.length} />
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">Expected Excel Format</h2>
          <p className="mb-4 text-sm text-slate-600">
            Real data can be converted into this simple 4-column format.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-slate-100 p-3 text-left">Name</th>
                  <th className="border bg-slate-100 p-3 text-left">Subjects</th>
                  <th className="border bg-slate-100 p-3 text-left">Classes</th>
                  <th className="border bg-slate-100 p-3 text-left">Unavailable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">Rakesh Kumar</td>
                  <td className="border p-3">Math, Science</td>
                  <td className="border p-3">6, 7, 8</td>
                  <td className="border p-3">Monday-3, Wednesday-5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="mt-4 rounded-lg border border-dashed border-slate-400 px-4 py-2 text-sm text-slate-500">
            Upload Excel Coming Soon
          </button>
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
              value={selectedDay}
              options={days.map((day) => ({ label: day, value: day }))}
              onChange={setSelectedDay}
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
            {absences.map((absence) => {
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
            })}
          </div>

          <h3 className="mt-5 font-semibold">
            Affected Classes for {selectedAbsentTeacher.name}
          </h3>

          <div className="mt-3 grid gap-3 md:grid-cols-4">
            {affectedClasses.length === 0 ? (
              <p className="text-sm text-slate-500">
                No classes found for this teacher on this day.
              </p>
            ) : (
              affectedClasses.map((item) => (
                <button
                  key={`${item.day}-${item.period}-${item.className}`}
                  onClick={() => useAffectedClass(item.period, item.className)}
                  className="rounded-lg border bg-amber-50 p-3 text-left hover:bg-amber-100"
                >
                  <p className="font-bold">Class {item.className}</p>
                  <p className="text-sm text-slate-600">
                    Period {item.period} — {item.subject}
                  </p>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">2. Find and Assign Cover</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Select
              label="Class"
              value={selectedClass}
              options={standards.map((standard) => ({
                label: standard,
                value: standard,
              }))}
              onChange={setSelectedClass}
            />

            <Select
              label="Day"
              value={selectedDay}
              options={days.map((day) => ({ label: day, value: day }))}
              onChange={setSelectedDay}
            />

            <Select
              label="Period"
              value={selectedPeriod}
              options={periods.map((period) => ({
                label: `Period ${period}`,
                value: period,
              }))}
              onChange={setSelectedPeriod}
            />
          </div>

          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <p>
              Need cover for <strong>Class {selectedClass}</strong>,{" "}
              <strong>{subjectForSlot}</strong>, Period{" "}
              <strong>{selectedPeriod}</strong> on <strong>{selectedDay}</strong>.
            </p>
            <p className="text-sm text-slate-600">
              Original teacher: <strong>{selectedAbsentTeacher.name}</strong>
            </p>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {coverTeachers.slice(0, 6).map((teacher) => (
              <div key={teacher.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">{teacher.name}</h4>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    {teacher.match}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Subjects: {teacher.subjects.join(", ")}
                </p>
                <p className="text-sm text-slate-600">
                  Classes: {teacher.classes.join(", ")}
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
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">Assigned Covers</h2>

          {coverAssignments.length === 0 ? (
            <p className="text-sm text-slate-500">No covers assigned yet.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {coverAssignments.map((assignment) => {
                const absentTeacher = teachers.find(
                  (t) => t.id === assignment.absentTeacherId
                );
                const coverTeacher = teachers.find(
                  (t) => t.id === assignment.coverTeacherId
                );

                return (
                  <div key={assignment.id} className="rounded-lg border p-4">
                    <h3 className="font-bold">
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
                      className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm"
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Weekly Timetable</h2>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border p-2"
            >
              {standards.map((standard) => (
                <option key={standard}>{standard}</option>
              ))}
            </select>
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
                      const teacher = getTeacherForSlot(day, period, selectedClass);
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
                          <div className="text-slate-600">{teacher?.name}</div>

                          {coverTeacher && (
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
                  Classes: {selectedTeacherProfile.classes.join(", ")}
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {selectedTeacherSchedule.slice(0, 12).map((item) => (
                  <div
                    key={`${item.day}-${item.period}-${item.className}`}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-semibold">{item.day}</p>
                    <p className="text-sm text-slate-600">
                      Period {item.period}: Class {item.className} — {item.subject}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">Teacher Database</h2>

          <input
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
            placeholder="Search teacher..."
            className="mb-4 w-full rounded-lg border p-3"
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-slate-100 p-3 text-left">Name</th>
                  <th className="border bg-slate-100 p-3 text-left">Subjects</th>
                  <th className="border bg-slate-100 p-3 text-left">Classes</th>
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
                    <td className="border p-3">{teacher.classes.join(", ")}</td>
                    <td className="border p-3">
                      {teacher.unavailable.length
                        ? teacher.unavailable.join(", ")
                        : "None"}
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

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
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