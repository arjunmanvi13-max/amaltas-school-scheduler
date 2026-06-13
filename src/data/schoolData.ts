export const schoolName = "Amaltas School";

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const periods = ["1", "2", "3", "4", "5", "6", "7"];

export const standards = [
  "Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
];

export const subjects = [
  "Math", "English", "Hindi", "Science", "Social Studies", "Computer", "Sanskrit", "Art", "Games",
];

const teacherNames = [
  "Rakesh Kumar", "Poonam Kumari", "Anil Singh", "Sunita Devi", "Manoj Kumar",
  "Priyanka Sharma", "Amit Kumar", "Neha Kumari", "Sanjay Singh", "Ritu Verma",
  "Vikash Kumar", "Anita Devi", "Rahul Raj", "Kiran Kumari", "Deepak Singh",
  "Meena Devi", "Arvind Kumar", "Sweta Singh", "Niraj Kumar", "Kavita Kumari",
  "Mukesh Yadav", "Archana Kumari", "Rajesh Prasad", "Jyoti Kumari", "Santosh Kumar",
  "Nisha Kumari", "Pramod Singh", "Rekha Devi", "Dinesh Kumar", "Suman Kumari",
  "Ashok Kumar", "Madhuri Kumari", "Ravi Shankar", "Priti Kumari", "Mahesh Kumar",
  "Seema Devi", "Ajit Kumar", "Manju Kumari", "Rohit Singh", "Babita Kumari",
  "Suresh Kumar", "Lalita Devi", "Gopal Kumar", "Mamta Kumari", "Vijay Singh",
  "Kalpana Kumari", "Naveen Kumar", "Usha Devi", "Harish Kumar", "Geeta Kumari",
];

export const initialTeachers = teacherNames.map((name, i) => ({
  id: i + 1,
  name,
  subjects: [subjects[i % subjects.length], subjects[(i + 2) % subjects.length]],
  classes: [standards[i % standards.length], standards[(i + 3) % standards.length]],
  unavailable: i % 6 === 0 ? ["Monday-3", "Wednesday-5"] : i % 5 === 0 ? ["Tuesday-2"] : [],
}));

export type Teacher = (typeof initialTeachers)[number];