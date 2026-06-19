import { supabase } from "@/src/lib/supabase";
import * as rawSchoolData from "@/src/data/schoolData";

const schoolData = rawSchoolData as any;

type AnyTeacher = {
  name: string;
  gender?: "Male" | "Female" | string;
  subjects?: string[];
  classes?: string[];
  unavailable?: string[];
  classTeacherFor?: string[];
  class_teacher_for?: string[];
};

type AnySlot = {
  day: string;
  period: string;
  className?: string;
  class_name?: string;
  subject: string;
  teacherName?: string;
  teacher_name?: string;
};

export async function seedSupabaseFromLocalData() {
  const localTeachers = (
    schoolData.initialTeachers ||
    schoolData.teachers ||
    []
  ) as AnyTeacher[];

  const localSlots = (
    schoolData.timetableSlots ||
    schoolData.initialTimetableSlots ||
    []
  ) as AnySlot[];

  const { data: existingTeachers } = await supabase
    .from("teachers")
    .select("id")
    .limit(1);

  const { data: existingSlots } = await supabase
    .from("timetable_slots")
    .select("id")
    .limit(1);

  if (!existingTeachers?.length && localTeachers.length > 0) {
    await supabase.from("teachers").insert(
      localTeachers.map((teacher) => ({
        name: teacher.name,
        gender: teacher.gender || "Female",
        subjects: teacher.subjects || [],
        classes: teacher.classes || [],
        unavailable: teacher.unavailable || [],
        class_teacher_for:
          teacher.classTeacherFor || teacher.class_teacher_for || [],
      }))
    );
  }

  if (!existingSlots?.length && localSlots.length > 0) {
    await supabase.from("timetable_slots").insert(
      localSlots.map((slot) => ({
        day: slot.day,
        period: slot.period,
        class_name: slot.className || slot.class_name || "",
        subject: slot.subject,
        teacher_name: slot.teacherName || slot.teacher_name || "",
      }))
    );
  }
}