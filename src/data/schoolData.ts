export const schoolName = "Amaltas School";

export type Teacher = {
  id: number;
  name: string;
  subjects: string[];
  classes: string[];
  unavailable: string[];
};

export type TimetableEntry = {
  className: string;
  teacherName: string;
  subject: string;
  period: number;
  day: string;
};

export type ClassTeacher = {
  className: string;
  teacherName: string;
};

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const periods = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const standards = ["NUR A", "LKG A", "LKG B", "UKG A", "UKG B", "I A", "I B", "II A", "II B", "III A", "III B", "IV A", "IV B", "V A", "V B", "VI A", "VI B", "VII A", "VII B", "VIII A", "VIII B", "IX A", "IX B", "X A", "X B"];

export const classOrder = standards.reduce<Record<string, number>>((acc, className, index) => {
  acc[className] = index;
  return acc;
}, {});

export function sortClasses(classNames: string[]) {
  return [...classNames].sort((a, b) => (classOrder[a] ?? 999) - (classOrder[b] ?? 999) || a.localeCompare(b));
}

export function sortBySchoolOrder<T extends { className?: string; classes?: string[]; day?: string; period?: string | number }>(items: T[]) {
  const dayOrder = days.reduce<Record<string, number>>((acc, day, index) => {
    acc[day] = index;
    return acc;
  }, {});

  return [...items].sort((a, b) => {
    const dayDiff = (dayOrder[a.day || ""] ?? 999) - (dayOrder[b.day || ""] ?? 999);
    if (dayDiff !== 0) return dayDiff;

    const periodDiff = Number(a.period || 0) - Number(b.period || 0);
    if (periodDiff !== 0) return periodDiff;

    const aClass = a.className || a.classes?.[0] || "";
    const bClass = b.className || b.classes?.[0] || "";
    return (classOrder[aClass] ?? 999) - (classOrder[bClass] ?? 999) || aClass.localeCompare(bClass);
  });
}

export function cleanTeacherName(name: string) {
  return name
    .replace("Suprabhat(3,Phy) + Ansari(3, Che) + Shukla(3, Bio)", "Suprabhat Kumar Ghosh")
    .replace("Sohrab(3,Phy) + Ansari(3, Che) + Shukla(3, Bio)", "Md. Sohrab Ansari")
    .trim();
}
export const subjects = ["Activity", "Computer Studies", "Craft", "Craft-Music", "Cursive Writing", "Drawing", "EVS", "English", "GK", "Games", "Hindi", "IT-Music", "Library", "Maths", "Music", "PT", "PT-Yoga", "SST", "Sanskrit", "Science", "Skill Development", "Social Development", "Sulekh", "Yoga"];

const rawInitialTeachers: Teacher[] = [
  {
    "id": 1,
    "name": "Aarti Kumari",
    "subjects": [
      "English",
      "Games",
      "Hindi",
      "Library",
      "Maths",
      "PT"
    ],
    "classes": [
      "I A",
      "I B",
      "LKG A",
      "LKG B",
      "UKG A",
      "UKG B"
    ],
    "unavailable": []
  },
  {
    "id": 2,
    "name": "Ajij Fatma",
    "subjects": [
      "Craft-Music",
      "Drawing",
      "English",
      "Games",
      "Hindi",
      "Maths",
      "PT"
    ],
    "classes": [
      "II A",
      "II B",
      "LKG A",
      "LKG B",
      "NUR A",
      "UKG A",
      "V A",
      "V B"
    ],
    "unavailable": []
  },
  {
    "id": 3,
    "name": "Anajali Kumari",
    "subjects": [
      "English",
      "Sulekh (Hindi W)"
    ],
    "classes": [
      "III A",
      "VI A"
    ],
    "unavailable": []
  },
  {
    "id": 4,
    "name": "Anamika Mishra",
    "subjects": [
      "Class Teacher",
      "GK",
      "Hindi",
      "Sanskrit",
      "Social Development",
      "Sulekh"
    ],
    "classes": [
      "II A",
      "II B",
      "III A",
      "III B",
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VII A",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 5,
    "name": "Anand Kumar",
    "subjects": [
      "Game",
      "Games",
      "PT",
      "Skill Development"
    ],
    "classes": [
      "I A",
      "I B",
      "II A",
      "II B",
      "III A",
      "III B",
      "IV A",
      "IV B",
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VII A",
      "VII B",
      "VIII A",
      "VIII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 6,
    "name": "Anjali Kumari",
    "subjects": [
      "Class Teacher",
      "Cursive Writing",
      "English",
      "Science",
      "Skill"
    ],
    "classes": [
      "II A",
      "II B",
      "III A",
      "III B",
      "LKG A",
      "LKG B",
      "VI A",
      "VI B",
      "VIII B"
    ],
    "unavailable": []
  },
  {
    "id": 7,
    "name": "Anubhav Roushan Sinha",
    "subjects": [
      "Class Teacher",
      "Computer",
      "Computer Studies",
      "English",
      "Skill"
    ],
    "classes": [
      "I A",
      "I B",
      "IV A",
      "IV B",
      "IX B",
      "VI A",
      "VIII A",
      "VIII B"
    ],
    "unavailable": []
  },
  {
    "id": 8,
    "name": "Bade Sir",
    "subjects": [
      "English",
      "SST/EVS"
    ],
    "classes": [
      "IX A",
      "X A"
    ],
    "unavailable": []
  },
  {
    "id": 9,
    "name": "Bhupendra Kumar",
    "subjects": [
      "Class Teacher",
      "EVS",
      "Lib",
      "SST",
      "SST/EVS"
    ],
    "classes": [
      "IX B",
      "VI A",
      "VI B",
      "VIII A",
      "VIII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 10,
    "name": "Deepak Kumar Srivastaw",
    "subjects": [
      "Maths",
      "Sd / Gk"
    ],
    "classes": [
      "V A",
      "V B",
      "VII A",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 11,
    "name": "Devdatta Richhariya",
    "subjects": [
      "Class Teacher",
      "Maths"
    ],
    "classes": [
      "IX A",
      "IX B",
      "VI B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 12,
    "name": "Devendra Kumar Shukla",
    "subjects": [
      "Science"
    ],
    "classes": [
      "IX A",
      "IX B",
      "VIII A",
      "VIII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 13,
    "name": "Dharmendra Kumar",
    "subjects": [
      "Mus",
      "Music"
    ],
    "classes": [
      "I A",
      "I B",
      "II A",
      "II B",
      "III A",
      "III B",
      "IV A",
      "IV B",
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VII A",
      "VII B",
      "VIII A",
      "VIII B"
    ],
    "unavailable": []
  },
  {
    "id": 14,
    "name": "Hem Neeraj",
    "subjects": [
      "Class Teacher",
      "English",
      "Sd / Gk"
    ],
    "classes": [
      "IX A",
      "IX B",
      "VIII A",
      "VIII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 15,
    "name": "Irshad Khan",
    "subjects": [
      "Class Teacher",
      "Games",
      "SST",
      "SST/EVS",
      "Skill",
      "Skill Development"
    ],
    "classes": [
      "II A",
      "IX A",
      "IX B",
      "V A",
      "V B",
      "VII A",
      "VII B",
      "VIII A",
      "VIII B"
    ],
    "unavailable": []
  },
  {
    "id": 16,
    "name": "Kamal Kumar",
    "subjects": [
      "Class Teacher",
      "EVS",
      "Games",
      "Lib",
      "Maths",
      "Sd / Gk",
      "Skill",
      "Skill Development"
    ],
    "classes": [
      "III A",
      "III B",
      "IV A",
      "IV B",
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VII A",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 17,
    "name": "Manju Devi",
    "subjects": [
      "Activity",
      "Class Teacher",
      "English",
      "Hindi",
      "Maths",
      "PT",
      "Skill Development",
      "Yoga"
    ],
    "classes": [
      "I A",
      "I B",
      "IV B",
      "LKG A",
      "LKG B",
      "NUR A",
      "V B"
    ],
    "unavailable": []
  },
  {
    "id": 18,
    "name": "Mansi Kumari",
    "subjects": [
      "EVS",
      "English",
      "Hindi",
      "Maths"
    ],
    "classes": [
      "II A",
      "II B",
      "UKG A",
      "UKG B"
    ],
    "unavailable": []
  },
  {
    "id": 19,
    "name": "Md. Sohrab Ansari",
    "subjects": [
      "Class Teacher",
      "Maths",
      "Science",
      "Skill"
    ],
    "classes": [
      "IX B",
      "VI A",
      "VI B",
      "VII A",
      "VII B",
      "X A"
    ],
    "unavailable": []
  },
  {
    "id": 20,
    "name": "Moni Kumari",
    "subjects": [
      "Class Teacher",
      "Computer",
      "Cur (Eng W)",
      "EVS",
      "English",
      "Lib",
      "Library",
      "Sd / Gk",
      "Skill",
      "Sulekh (Hindi W)",
      "Yoga"
    ],
    "classes": [
      "I A",
      "I B",
      "II A",
      "II B",
      "III A",
      "III B",
      "IV A",
      "V A",
      "VI B"
    ],
    "unavailable": []
  },
  {
    "id": 21,
    "name": "Nand Kishor Chaurasiya",
    "subjects": [
      "Class Teacher",
      "English",
      "Maths",
      "SST/EVS",
      "Skill"
    ],
    "classes": [
      "III A",
      "III B",
      "IV A",
      "IV B",
      "V B",
      "VII A",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 22,
    "name": "Nandani Kumari",
    "subjects": [
      "Class Teacher",
      "Cur (Eng W)",
      "Hindi"
    ],
    "classes": [
      "I B",
      "IV A",
      "IV B",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 23,
    "name": "Neha Kumari",
    "subjects": [
      "Class Teacher",
      "Library",
      "Maths",
      "Sanskrit"
    ],
    "classes": [
      "I B",
      "IV A",
      "IV B",
      "V A",
      "V B"
    ],
    "unavailable": []
  },
  {
    "id": 24,
    "name": "Popayeshwar Kumar Priye",
    "subjects": [
      "Computer",
      "Computer Studies",
      "IT-Music",
      "Maths",
      "SST/EVS",
      "Skill"
    ],
    "classes": [
      "III A",
      "III B",
      "IV A",
      "IV B",
      "IX A",
      "IX B",
      "V A",
      "V B",
      "VI B",
      "VII A",
      "VII B",
      "VIII A"
    ],
    "unavailable": []
  },
  {
    "id": 25,
    "name": "Qutubuddin Ansari",
    "subjects": [
      "Class Teacher",
      "Maths",
      "Science",
      "Skill"
    ],
    "classes": [
      "IX A",
      "IX B",
      "VII A",
      "VII B",
      "VIII A",
      "VIII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 26,
    "name": "Raghvendra Kumar Singh",
    "subjects": [
      "Computer",
      "GK",
      "IT-Music",
      "Science",
      "Sd / Gk",
      "Social Development"
    ],
    "classes": [
      "IV A",
      "IV B",
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VII A",
      "VII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 27,
    "name": "Rajani Bala",
    "subjects": [
      "Activity",
      "Class Teacher",
      "Craft",
      "Craft-Music",
      "Drawing",
      "Hindi",
      "Lib",
      "Maths",
      "Sd / Gk",
      "Sulekh",
      "Sulekh (Hindi W)"
    ],
    "classes": [
      "I A",
      "I B",
      "II A",
      "II B",
      "III A",
      "III B",
      "IV A",
      "IV B",
      "LKG A",
      "LKG B",
      "UKG A",
      "UKG B"
    ],
    "unavailable": []
  },
  {
    "id": 28,
    "name": "Rani Parween",
    "subjects": [
      "Activity",
      "Class Teacher",
      "Cursive Writing",
      "English",
      "GK",
      "Maths",
      "SST/EVS",
      "Sd / Gk",
      "Social Development"
    ],
    "classes": [
      "I A",
      "I B",
      "II A",
      "II B",
      "LKG A",
      "LKG B"
    ],
    "unavailable": []
  },
  {
    "id": 29,
    "name": "Renu Kumari",
    "subjects": [
      "Class Teacher",
      "English",
      "Maths",
      "SST/EVS"
    ],
    "classes": [
      "I A",
      "I B",
      "II A",
      "II B",
      "UKG A",
      "UKG B"
    ],
    "unavailable": []
  },
  {
    "id": 30,
    "name": "Rina Kumari",
    "subjects": [
      "Class Teacher",
      "Hindi",
      "Sd / Gk",
      "Social Development"
    ],
    "classes": [
      "IX A",
      "IX B",
      "VI A",
      "VI B",
      "VIII A",
      "VIII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 31,
    "name": "Sangeea Sinha",
    "subjects": [
      "Hindi"
    ],
    "classes": [
      "VIII A"
    ],
    "unavailable": []
  },
  {
    "id": 32,
    "name": "Sangeeta Sinha",
    "subjects": [
      "Class Teacher",
      "GK",
      "Hindi",
      "Lib",
      "Sd / Gk",
      "Social Development"
    ],
    "classes": [
      "III A",
      "III B",
      "IV A",
      "VI A",
      "VI B",
      "VII A",
      "VII B",
      "VIII A",
      "VIII B"
    ],
    "unavailable": []
  },
  {
    "id": 33,
    "name": "Sangita",
    "subjects": [
      "Hindi",
      "Lib",
      "Library",
      "Sd / Gk"
    ],
    "classes": [
      "II B",
      "III A",
      "III B",
      "IV A",
      "LKG A",
      "NUR A",
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VII A",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 34,
    "name": "Shagufa Bint Ekram",
    "subjects": [
      "Class Teacher",
      "Cur (Eng W)",
      "Cursive Writing",
      "English",
      "Hindi",
      "Sd / Gk"
    ],
    "classes": [
      "IV A",
      "IV B",
      "UKG A",
      "UKG B",
      "V A",
      "V B"
    ],
    "unavailable": []
  },
  {
    "id": 35,
    "name": "Shailendra",
    "subjects": [
      "Maths"
    ],
    "classes": [
      "II A",
      "II B"
    ],
    "unavailable": []
  },
  {
    "id": 36,
    "name": "Shailendra Kumar",
    "subjects": [
      "Class Teacher",
      "Cur (Eng W)",
      "Hindi",
      "Sulekh",
      "Sulekh (Hindi W)"
    ],
    "classes": [
      "I A",
      "II A",
      "II B",
      "III A",
      "III B",
      "IV B",
      "V A",
      "V B"
    ],
    "unavailable": []
  },
  {
    "id": 37,
    "name": "Sidheshwar Ojha",
    "subjects": [
      "Class Teacher",
      "Lib",
      "Library",
      "Sanskrit"
    ],
    "classes": [
      "IV A",
      "IV B",
      "IX A",
      "IX B",
      "V A",
      "VIII A",
      "VIII B",
      "X A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 38,
    "name": "Snigdha Kumari",
    "subjects": [
      "Activity",
      "Craft-Music",
      "Drawing",
      "GK",
      "Skill Development",
      "Social Development"
    ],
    "classes": [
      "III A",
      "III B",
      "UKG A",
      "UKG B",
      "VI A",
      "VI B",
      "VII A",
      "VII B",
      "VIII A",
      "VIII B"
    ],
    "unavailable": []
  },
  {
    "id": 39,
    "name": "Sohrab(3,Phy) + Ansari(3, Che) + Shukla(3, Bio)",
    "subjects": [
      "Science"
    ],
    "classes": [
      "IX B",
      "X A"
    ],
    "unavailable": []
  },
  {
    "id": 40,
    "name": "Sumant Kumar Pandey",
    "subjects": [
      "Sanskrit"
    ],
    "classes": [
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VII A",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 41,
    "name": "Suprabhat Kumar Ghosh",
    "subjects": [
      "Class Teacher",
      "Cur (Eng W)",
      "English",
      "GK",
      "Maths",
      "Science",
      "Social Development"
    ],
    "classes": [
      "II B",
      "IX A",
      "V A",
      "V B",
      "VI A",
      "VI B",
      "VIII A",
      "VIII B",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 42,
    "name": "Suprabhat(3,Phy) + Ansari(3, Che) + Shukla(3, Bio)",
    "subjects": [
      "Science"
    ],
    "classes": [
      "IX A",
      "X B"
    ],
    "unavailable": []
  },
  {
    "id": 43,
    "name": "Trilok Prasad",
    "subjects": [
      "Computer",
      "Computer Studies",
      "PT",
      "PT-Yoga"
    ],
    "classes": [
      "I B",
      "II A",
      "II B",
      "III A",
      "III B",
      "IV A",
      "IV B",
      "VI A",
      "VI B",
      "VII A",
      "VII B"
    ],
    "unavailable": []
  },
  {
    "id": 44,
    "name": "Usha Kiran",
    "subjects": [
      "Craft",
      "Drawing",
      "English",
      "Games",
      "Hindi",
      "Maths",
      "PT"
    ],
    "classes": [
      "II A",
      "II B",
      "III A",
      "III B",
      "LKG B",
      "NUR A",
      "UKG A",
      "UKG B"
    ],
    "unavailable": []
  },
  {
    "id": 45,
    "name": "Vaishnavi Ojha",
    "subjects": [
      "Class Teacher",
      "Cur (Eng W)",
      "English",
      "Lib",
      "Library",
      "Maths"
    ],
    "classes": [
      "II A",
      "LKG A",
      "V A",
      "VI A",
      "VI B",
      "VII A",
      "VII B",
      "VIII A",
      "VIII B"
    ],
    "unavailable": []
  }
];


export const initialTeachers: Teacher[] = rawInitialTeachers
  .filter((teacher) => !teacher.name.includes("(") && !teacher.name.includes("+"))
  .map((teacher) => ({
    ...teacher,
    name: cleanTeacherName(teacher.name),
    subjects: [...new Set(teacher.subjects)].sort((a, b) => a.localeCompare(b)),
    classes: sortClasses([...new Set(teacher.classes)]),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const rawTimetableEntries: TimetableEntry[] = [
  {
    "className": "II A",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "II A",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "II B",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "III B",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "IV A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "IV B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "IV B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "IV B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "V A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "V B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "VI A",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Trilok Prasad",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "VII A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "VII A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Anubhav Roushan Sinha",
    "subject": "Computer Studies",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Anubhav Roushan Sinha",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Anubhav Roushan Sinha",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Anubhav Roushan Sinha",
    "subject": "Computer Studies",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Anubhav Roushan Sinha",
    "subject": "Computer Studies",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "VIII B",
    "teacherName": "Anubhav Roushan Sinha",
    "subject": "Computer Studies",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Rajani Bala",
    "subject": "Craft-Music",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Rajani Bala",
    "subject": "Craft-Music",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Ajij Fatma",
    "subject": "Craft-Music",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Ajij Fatma",
    "subject": "Craft-Music",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "VI A",
    "teacherName": "Snigdha Kumari",
    "subject": "Craft-Music",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Snigdha Kumari",
    "subject": "Craft-Music",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "VII A",
    "teacherName": "Snigdha Kumari",
    "subject": "Craft-Music",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Snigdha Kumari",
    "subject": "Craft-Music",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Snigdha Kumari",
    "subject": "Craft-Music",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Snigdha Kumari",
    "subject": "Craft-Music",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Craft",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Craft",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Usha Kiran",
    "subject": "Craft",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Usha Kiran",
    "subject": "Craft",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Rajani Bala",
    "subject": "Craft",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "III B",
    "teacherName": "Rajani Bala",
    "subject": "Craft",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "Cursive Writing",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "Cursive Writing",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "Cursive Writing",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "Cursive Writing",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "Cursive Writing",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "Cursive Writing",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "Cursive Writing",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "Cursive Writing",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "Cursive Writing",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "Cursive Writing",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "II A",
    "teacherName": "Usha Kiran",
    "subject": "Drawing",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Usha Kiran",
    "subject": "Drawing",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "IV A",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "IV B",
    "teacherName": "Rajani Bala",
    "subject": "Drawing",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "V A",
    "teacherName": "Ajij Fatma",
    "subject": "Drawing",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Ajij Fatma",
    "subject": "Drawing",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Snigdha Kumari",
    "subject": "Drawing",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "VI B",
    "teacherName": "Snigdha Kumari",
    "subject": "Drawing",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "VII A",
    "teacherName": "Snigdha Kumari",
    "subject": "Drawing",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Snigdha Kumari",
    "subject": "Drawing",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Snigdha Kumari",
    "subject": "Drawing",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Snigdha Kumari",
    "subject": "Drawing",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "LKG A",
    "teacherName": "Rani Parween",
    "subject": "Activity",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "LKG A",
    "teacherName": "Rani Parween",
    "subject": "Activity",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Rani Parween",
    "subject": "Activity",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "LKG A",
    "teacherName": "Rani Parween",
    "subject": "Activity",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Rani Parween",
    "subject": "Activity",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "LKG B",
    "teacherName": "Rajani Bala",
    "subject": "Activity",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Rajani Bala",
    "subject": "Activity",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "LKG B",
    "teacherName": "Rajani Bala",
    "subject": "Activity",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "LKG B",
    "teacherName": "Rajani Bala",
    "subject": "Activity",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "LKG B",
    "teacherName": "Rajani Bala",
    "subject": "Activity",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Activity",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Activity",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Activity",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Activity",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Activity",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "UKG A",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "UKG A",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "UKG A",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "UKG B",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "UKG B",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "UKG B",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "UKG B",
    "teacherName": "Snigdha Kumari",
    "subject": "Activity",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "English",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "II B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "III A",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Anjali Kumari",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "IX B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "IX B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "English",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "English",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "English",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Aarti Kumari",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "LKG B",
    "teacherName": "Aarti Kumari",
    "subject": "English",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "LKG B",
    "teacherName": "Aarti Kumari",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "LKG B",
    "teacherName": "Aarti Kumari",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "LKG B",
    "teacherName": "Aarti Kumari",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Aarti Kumari",
    "subject": "English",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "English",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "English",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Mansi Kumari",
    "subject": "English",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "UKG A",
    "teacherName": "Mansi Kumari",
    "subject": "English",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "UKG A",
    "teacherName": "Mansi Kumari",
    "subject": "English",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "UKG A",
    "teacherName": "Mansi Kumari",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "UKG A",
    "teacherName": "Mansi Kumari",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Mansi Kumari",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Usha Kiran",
    "subject": "English",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "UKG B",
    "teacherName": "Usha Kiran",
    "subject": "English",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "UKG B",
    "teacherName": "Usha Kiran",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "UKG B",
    "teacherName": "Usha Kiran",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "UKG B",
    "teacherName": "Usha Kiran",
    "subject": "English",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Usha Kiran",
    "subject": "English",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "V A",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Shagufa Bint Ekram",
    "subject": "English",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "VI A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "VI A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "VI A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "VII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "VII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "VII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "VII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "VII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "VII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "VII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "VIII B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "VIII B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "VIII B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "X A",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Bade Sir",
    "subject": "English",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "X B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Hem Neeraj",
    "subject": "English",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "I A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "I A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "I A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "I A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "I B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "I B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "II A",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "II A",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "II B",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "II B",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Mansi Kumari",
    "subject": "EVS",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "III A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "III A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "III A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "III A",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "III B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Moni Kumari",
    "subject": "EVS",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "IV A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "IV A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "IV B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "IV B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "IV B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "IV B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "IX B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "V A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "V A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "V A",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "V B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "V B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Kamal Kumar",
    "subject": "EVS",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Bhupendra Kumar",
    "subject": "EVS",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "VI A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "VI A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "VI A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "VI B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "VI B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "VI B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "VII A",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "VII A",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "VII A",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "VII B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "VII B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Irshad Khan",
    "subject": "SST",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "VIII A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "VIII A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "VIII B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "VIII B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "VIII B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "X B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Bhupendra Kumar",
    "subject": "SST",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Aarti Kumari",
    "subject": "Games",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "I A",
    "teacherName": "Aarti Kumari",
    "subject": "Games",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Aarti Kumari",
    "subject": "Games",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Aarti Kumari",
    "subject": "Games",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Ajij Fatma",
    "subject": "Games",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Ajij Fatma",
    "subject": "Games",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "II B",
    "teacherName": "Ajij Fatma",
    "subject": "Games",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Ajij Fatma",
    "subject": "Games",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "III A",
    "teacherName": "Usha Kiran",
    "subject": "Games",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Usha Kiran",
    "subject": "Games",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "III B",
    "teacherName": "Usha Kiran",
    "subject": "Games",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Usha Kiran",
    "subject": "Games",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Anand Kumar",
    "subject": "Games",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Anand Kumar",
    "subject": "Games",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "IV B",
    "teacherName": "Anand Kumar",
    "subject": "Games",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "IV B",
    "teacherName": "Anand Kumar",
    "subject": "Games",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Irshad Khan",
    "subject": "Games",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Irshad Khan",
    "subject": "Games",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "V B",
    "teacherName": "Irshad Khan",
    "subject": "Games",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Irshad Khan",
    "subject": "Games",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Kamal Kumar",
    "subject": "Games",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Kamal Kumar",
    "subject": "Games",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "VII A",
    "teacherName": "Kamal Kumar",
    "subject": "Games",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Kamal Kumar",
    "subject": "Games",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Irshad Khan",
    "subject": "Games",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Irshad Khan",
    "subject": "Games",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Anand Kumar",
    "subject": "Games",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Anand Kumar",
    "subject": "Games",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "GK",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "GK",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "GK",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "GK",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "GK",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "GK",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "GK",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "GK",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Snigdha Kumari",
    "subject": "GK",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "III A",
    "teacherName": "Snigdha Kumari",
    "subject": "GK",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Snigdha Kumari",
    "subject": "GK",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Snigdha Kumari",
    "subject": "GK",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "V A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "GK",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "GK",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "VII A",
    "teacherName": "Sangeeta Sinha",
    "subject": "GK",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Sangeeta Sinha",
    "subject": "GK",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Hindi",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "III A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "III A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "III A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "III B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "III B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "III B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "IV A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "IV A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "IV A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "IV B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "IV B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "IV B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "IV B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "IX A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "IX A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "IX B",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "IX B",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "LKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "LKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "LKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Hindi",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Ajij Fatma",
    "subject": "Hindi",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "LKG B",
    "teacherName": "Ajij Fatma",
    "subject": "Hindi",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "LKG B",
    "teacherName": "Ajij Fatma",
    "subject": "Hindi",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "LKG B",
    "teacherName": "Ajij Fatma",
    "subject": "Hindi",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Ajij Fatma",
    "subject": "Hindi",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Hindi",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Hindi",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Hindi",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Hindi",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Hindi",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Hindi",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Usha Kiran",
    "subject": "Hindi",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "UKG A",
    "teacherName": "Usha Kiran",
    "subject": "Hindi",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "UKG A",
    "teacherName": "Usha Kiran",
    "subject": "Hindi",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "UKG A",
    "teacherName": "Usha Kiran",
    "subject": "Hindi",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Usha Kiran",
    "subject": "Hindi",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Hindi",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Hindi",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Hindi",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Hindi",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "V A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "V A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "V A",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "V B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "V B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Shailendra Kumar",
    "subject": "Hindi",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "VI A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "VI A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "VI B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "VI B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "VII A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "VII A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "VII A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "VII B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Anamika Mishra",
    "subject": "Hindi",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Hindi",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "X A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "X A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "X A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Rina Kumari",
    "subject": "Hindi",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "IX A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "IX B",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "IT-Music",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "X A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "X A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "IT-Music",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "I A",
    "teacherName": "Aarti Kumari",
    "subject": "Library",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Aarti Kumari",
    "subject": "Library",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Neha Kumari",
    "subject": "Library",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Neha Kumari",
    "subject": "Library",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Moni Kumari",
    "subject": "Library",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "III B",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "IV A",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Library",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "VI A",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "VII A",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Sangita",
    "subject": "Library",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Vaishnavi Ojha",
    "subject": "Library",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Vaishnavi Ojha",
    "subject": "Library",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Library",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Library",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "I A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "I A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "I A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "I A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "I A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "II A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "II A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "II A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "II A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "II B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "II B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "II B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "II B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "II B",
    "teacherName": "Renu Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "III A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "III A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "III A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "III A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "III B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "III B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "III B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "III B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "IV A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "IV A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "IV A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "IX A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "IX A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "IX A",
    "teacherName": "Popayeshwar Kumar Priye",
    "subject": "Maths",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "IX A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "IX B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "IX B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "Maths",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "Maths",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "Maths",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "LKG A",
    "teacherName": "Ajij Fatma",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "Maths",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "Maths",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "Maths",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Maths",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Maths",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Maths",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "Maths",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Mansi Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "V A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "V A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "V A",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "V B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "V B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "V B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Neha Kumari",
    "subject": "Maths",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "VI B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "VI B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "VI B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "VII A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "VII A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "VII A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "VII A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 3,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "VII B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "VII B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Nand Kishor Chaurasiya",
    "subject": "Maths",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "VIII A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "VIII A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "VIII B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "VIII B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "VIII B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "X A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "X A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "X A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya",
    "subject": "Maths",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Dharmendra Kumar",
    "subject": "Music",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "I B",
    "teacherName": "Dharmendra Kumar",
    "subject": "Music",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "II A",
    "teacherName": "Dharmendra Kumar",
    "subject": "Music",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Dharmendra Kumar",
    "subject": "Music",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "III A",
    "teacherName": "Dharmendra Kumar",
    "subject": "Music",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "III B",
    "teacherName": "Dharmendra Kumar",
    "subject": "Music",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "I B",
    "teacherName": "Trilok Prasad",
    "subject": "PT",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "II B",
    "teacherName": "Anand Kumar",
    "subject": "PT",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Anand Kumar",
    "subject": "PT",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Anand Kumar",
    "subject": "PT",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "III B",
    "teacherName": "Anand Kumar",
    "subject": "PT",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "IV A",
    "teacherName": "Trilok Prasad",
    "subject": "PT",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "IV B",
    "teacherName": "Trilok Prasad",
    "subject": "PT",
    "period": 1,
    "day": "Saturday"
  },
  {
    "className": "LKG A",
    "teacherName": "Manju Devi",
    "subject": "PT",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "PT",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "LKG B",
    "teacherName": "Usha Kiran",
    "subject": "PT",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "LKG B",
    "teacherName": "Manju Devi",
    "subject": "PT",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "LKG B",
    "teacherName": "Ajij Fatma",
    "subject": "PT",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "PT",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "PT",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "NUR A",
    "teacherName": "Manju Devi",
    "subject": "PT",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "NUR A",
    "teacherName": "Usha Kiran",
    "subject": "PT",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "NUR A",
    "teacherName": "Ajij Fatma",
    "subject": "PT",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "NUR A",
    "teacherName": "Ajij Fatma",
    "subject": "PT",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "PT",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "UKG A",
    "teacherName": "Ajij Fatma",
    "subject": "PT",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "PT",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "UKG A",
    "teacherName": "Usha Kiran",
    "subject": "PT",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "UKG A",
    "teacherName": "Aarti Kumari",
    "subject": "PT",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "UKG B",
    "teacherName": "Aarti Kumari",
    "subject": "PT",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "UKG B",
    "teacherName": "Aarti Kumari",
    "subject": "PT",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "UKG B",
    "teacherName": "Usha Kiran",
    "subject": "PT",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "V A",
    "teacherName": "Anand Kumar",
    "subject": "PT",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Anand Kumar",
    "subject": "PT",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Trilok Prasad",
    "subject": "PT-Yoga",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Trilok Prasad",
    "subject": "PT-Yoga",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Trilok Prasad",
    "subject": "PT-Yoga",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "IV A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "IV A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "IX A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "IX B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "IX B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "V A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "V B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "VI B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "VI B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Sumant Kumar Pandey",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 3,
    "day": "Monday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "X B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "X B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Sidheshwar Ojha",
    "subject": "Sanskrit",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "IX A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "IX A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Science",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "IX A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Science",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "IX A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Science",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "IX A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 3,
    "day": "Saturday"
  },
  {
    "className": "IX B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 3,
    "day": "Friday"
  },
  {
    "className": "IX B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "IX B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "IX B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "IX B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "VI A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "VI A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "VI A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "VI A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "VI B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 1,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "VI B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "VI B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Wednesday"
  },
  {
    "className": "VI B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "VII A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Thursday"
  },
  {
    "className": "VII A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "VII A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "VII A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Tuesday"
  },
  {
    "className": "VII B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 3,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "VII B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "VII B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 1,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "VIII A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "VIII A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 2,
    "day": "Saturday"
  },
  {
    "className": "VIII B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 4,
    "day": "Wednesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "VIII B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "VIII B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 2,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "X A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Md. Sohrab Ansari",
    "subject": "Science",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "X A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "X A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "X A",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "X A",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 4,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 4,
    "day": "Tuesday"
  },
  {
    "className": "X B",
    "teacherName": "Devendra Kumar Shukla",
    "subject": "Science",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "X B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 2,
    "day": "Friday"
  },
  {
    "className": "X B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "X B",
    "teacherName": "Qutubuddin Ansari",
    "subject": "Science",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "X B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Science",
    "period": 1,
    "day": "Wednesday"
  },
  {
    "className": "X B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Science",
    "period": 4,
    "day": "Saturday"
  },
  {
    "className": "X B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Science",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "Social Development",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "I A",
    "teacherName": "Rani Parween",
    "subject": "Social Development",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "Social Development",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Rani Parween",
    "subject": "Social Development",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Social Development",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Social Development",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Social Development",
    "period": 4,
    "day": "Monday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Social Development",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Snigdha Kumari",
    "subject": "Social Development",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "III A",
    "teacherName": "Snigdha Kumari",
    "subject": "Social Development",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "III B",
    "teacherName": "Snigdha Kumari",
    "subject": "Social Development",
    "period": 5,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Snigdha Kumari",
    "subject": "Social Development",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "IV A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "IV A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "IV B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 7,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "V B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 3,
    "day": "Wednesday"
  },
  {
    "className": "V B",
    "teacherName": "Raghvendra Kumar Singh",
    "subject": "Social Development",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Social Development",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Social Development",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "VI B",
    "teacherName": "Suprabhat Kumar Ghosh",
    "subject": "Social Development",
    "period": 6,
    "day": "Friday"
  },
  {
    "className": "VII A",
    "teacherName": "Sangeeta Sinha",
    "subject": "Social Development",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "VII B",
    "teacherName": "Sangeeta Sinha",
    "subject": "Social Development",
    "period": 6,
    "day": "Tuesday"
  },
  {
    "className": "VIII A",
    "teacherName": "Rina Kumari",
    "subject": "Social Development",
    "period": 6,
    "day": "Monday"
  },
  {
    "className": "VIII A",
    "teacherName": "Rina Kumari",
    "subject": "Social Development",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "VIII B",
    "teacherName": "Rina Kumari",
    "subject": "Social Development",
    "period": 5,
    "day": "Monday"
  },
  {
    "className": "VIII B",
    "teacherName": "Rina Kumari",
    "subject": "Social Development",
    "period": 4,
    "day": "Friday"
  },
  {
    "className": "I A",
    "teacherName": "Manju Devi",
    "subject": "Skill Development",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "I B",
    "teacherName": "Anand Kumar",
    "subject": "Skill Development",
    "period": 8,
    "day": "Thursday"
  },
  {
    "className": "II A",
    "teacherName": "Anand Kumar",
    "subject": "Skill Development",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "II B",
    "teacherName": "Anand Kumar",
    "subject": "Skill Development",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "III A",
    "teacherName": "Snigdha Kumari",
    "subject": "Skill Development",
    "period": 6,
    "day": "Thursday"
  },
  {
    "className": "III B",
    "teacherName": "Snigdha Kumari",
    "subject": "Skill Development",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "IV A",
    "teacherName": "Anand Kumar",
    "subject": "Skill Development",
    "period": 7,
    "day": "Wednesday"
  },
  {
    "className": "IV B",
    "teacherName": "Anand Kumar",
    "subject": "Skill Development",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "V A",
    "teacherName": "Irshad Khan",
    "subject": "Skill Development",
    "period": 7,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Irshad Khan",
    "subject": "Skill Development",
    "period": 8,
    "day": "Wednesday"
  },
  {
    "className": "VI A",
    "teacherName": "Kamal Kumar",
    "subject": "Skill Development",
    "period": 8,
    "day": "Monday"
  },
  {
    "className": "VI B",
    "teacherName": "Kamal Kumar",
    "subject": "Skill Development",
    "period": 5,
    "day": "Tuesday"
  },
  {
    "className": "VII A",
    "teacherName": "Kamal Kumar",
    "subject": "Skill Development",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "VII B",
    "teacherName": "Kamal Kumar",
    "subject": "Skill Development",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "VIII A",
    "teacherName": "Irshad Khan",
    "subject": "Skill Development",
    "period": 7,
    "day": "Thursday"
  },
  {
    "className": "VIII B",
    "teacherName": "Irshad Khan",
    "subject": "Skill Development",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "I A",
    "teacherName": "Rajani Bala",
    "subject": "Sulekh",
    "period": 6,
    "day": "Wednesday"
  },
  {
    "className": "I B",
    "teacherName": "Rajani Bala",
    "subject": "Sulekh",
    "period": 5,
    "day": "Wednesday"
  },
  {
    "className": "II A",
    "teacherName": "Anamika Mishra",
    "subject": "Sulekh",
    "period": 5,
    "day": "Friday"
  },
  {
    "className": "II B",
    "teacherName": "Anamika Mishra",
    "subject": "Sulekh",
    "period": 8,
    "day": "Friday"
  },
  {
    "className": "III A",
    "teacherName": "Shailendra Kumar",
    "subject": "Sulekh",
    "period": 7,
    "day": "Monday"
  },
  {
    "className": "III B",
    "teacherName": "Shailendra Kumar",
    "subject": "Sulekh",
    "period": 8,
    "day": "Tuesday"
  },
  {
    "className": "IV B",
    "teacherName": "Manju Devi",
    "subject": "Yoga",
    "period": 1,
    "day": "Friday"
  },
  {
    "className": "V A",
    "teacherName": "Moni Kumari",
    "subject": "Yoga",
    "period": 1,
    "day": "Tuesday"
  },
  {
    "className": "V B",
    "teacherName": "Manju Devi",
    "subject": "Yoga",
    "period": 1,
    "day": "Monday"
  }
];

export const classTeachers: ClassTeacher[] = sortBySchoolOrder([
  {
    "className": "NUR A",
    "teacherName": "Manju Devi"
  },
  {
    "className": "LKG A",
    "teacherName": "Anjali Kumari"
  },
  {
    "className": "LKG B",
    "teacherName": "Rani Parween"
  },
  {
    "className": "UKG A",
    "teacherName": "Shagufa Bint Ekram"
  },
  {
    "className": "UKG B",
    "teacherName": "Rajani Bala"
  },
  {
    "className": "I A",
    "teacherName": "Anubhav Roushan Sinha"
  },
  {
    "className": "I B",
    "teacherName": "Renu Kumari"
  },
  {
    "className": "II A",
    "teacherName": "Moni Kumari"
  },
  {
    "className": "II B",
    "teacherName": "Shailendra Kumar"
  },
  {
    "className": "III A",
    "teacherName": "Anamika Mishra"
  },
  {
    "className": "III B",
    "teacherName": "Kamal Kumar"
  },
  {
    "className": "IV A",
    "teacherName": "Nand Kishor Chaurasiya"
  },
  {
    "className": "IV B",
    "teacherName": "Neha Kumari"
  },
  {
    "className": "V A",
    "teacherName": "Irshad Khan"
  },
  {
    "className": "V B",
    "teacherName": "Suprabhat Kumar Ghosh"
  },
  {
    "className": "VI A",
    "teacherName": "Sangeeta Sinha"
  },
  {
    "className": "VI B",
    "teacherName": "Vaishnavi Ojha"
  },
  {
    "className": "VII A",
    "teacherName": "Md. Sohrab Ansari"
  },
  {
    "className": "VII B",
    "teacherName": "Nandani Kumari"
  },
  {
    "className": "VIII A",
    "teacherName": "Hem Neeraj"
  },
  {
    "className": "VIII B",
    "teacherName": "Sidheshwar Ojha"
  },
  {
    "className": "IX A",
    "teacherName": "Rina Kumari"
  },
  {
    "className": "IX B",
    "teacherName": "Bhupendra Kumar"
  },
  {
    "className": "X A",
    "teacherName": "Qutubuddin Ansari"
  },
  {
    "className": "X B",
    "teacherName": "Devdatta Richhariya"
  }
]);

export const timetableEntries: TimetableEntry[] = sortBySchoolOrder(
  rawTimetableEntries.map((entry) => ({
    ...entry,
    teacherName: cleanTeacherName(entry.teacherName),
  }))
);
