import { supabase } from "@/src/lib/supabase";

export type DbTeacher = {
  id?: string;
  name: string;
  gender: "Male" | "Female";
  subjects: string[];
  classes: string[];
  unavailable: string[];
  class_teacher_for: string[];
};

export type DbTimetableSlot = {
  id?: string;
  day: string;
  period: string;
  class_name: string;
  subject: string;
  teacher_name: string;
};

export type DbAbsence = {
  id?: string;
  teacher_name: string;
  start_date: string;
  end_date: string;
  start_period: string;
  end_period: string;
  reason?: string;
};

export type DbCoverAssignment = {
  id?: string;
  absent_teacher_name: string;
  cover_teacher_name: string;
  day: string;
  date: string;
  period: string;
  class_name: string;
  subject: string;
};

export async function getTeachers() {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as DbTeacher[];
}

export async function saveTeacher(teacher: DbTeacher) {
  const { data, error } = await supabase
    .from("teachers")
    .insert(teacher)
    .select()
    .single();

  if (error) throw error;
  return data as DbTeacher;
}

export async function updateTeacher(id: string, teacher: Partial<DbTeacher>) {
  const { data, error } = await supabase
    .from("teachers")
    .update(teacher)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DbTeacher;
}

export async function deleteTeacher(id: string) {
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw error;
}

export async function getTimetableSlots() {
  const { data, error } = await supabase
    .from("timetable_slots")
    .select("*");

  if (error) throw error;
  return data as DbTimetableSlot[];
}

export async function saveTimetableSlot(slot: DbTimetableSlot) {
  const { data, error } = await supabase
    .from("timetable_slots")
    .insert(slot)
    .select()
    .single();

  if (error) throw error;
  return data as DbTimetableSlot;
}

export async function updateTimetableSlot(id: string, slot: Partial<DbTimetableSlot>) {
  const { data, error } = await supabase
    .from("timetable_slots")
    .update(slot)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DbTimetableSlot;
}

export async function getAbsences() {
  const { data, error } = await supabase
    .from("absences")
    .select("*")
    .order("start_date");

  if (error) throw error;
  return data as DbAbsence[];
}

export async function saveAbsence(absence: DbAbsence) {
  const { data, error } = await supabase
    .from("absences")
    .insert(absence)
    .select()
    .single();

  if (error) throw error;
  return data as DbAbsence;
}

export async function deleteAbsence(id: string) {
  const { error } = await supabase.from("absences").delete().eq("id", id);
  if (error) throw error;
}

export async function getCoverAssignments() {
  const { data, error } = await supabase
    .from("cover_assignments")
    .select("*")
    .order("date")
    .order("period");

  if (error) throw error;
  return data as DbCoverAssignment[];
}

export async function saveCoverAssignment(assignment: DbCoverAssignment) {
  const { data, error } = await supabase
    .from("cover_assignments")
    .insert(assignment)
    .select()
    .single();

  if (error) throw error;
  return data as DbCoverAssignment;
}

export async function deleteCoverAssignment(id: string) {
  const { error } = await supabase
    .from("cover_assignments")
    .delete()
    .eq("id", id);

  if (error) throw error;
}