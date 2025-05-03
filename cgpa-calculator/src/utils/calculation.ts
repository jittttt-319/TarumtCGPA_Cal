import { Subject } from '../types/index';

export const calculateGPA = (
  subjects: Subject[],
  isOldStudent: boolean
): [number, number] => {
  // Define grading scales for new and old students
  const gradingScale = isOldStudent
    ? {
        A: 4.0,
        'A-': 3.75,
        'B+': 3.5,
        B: 3.0,
        'B-': 2.75,
        'C+': 2.5,
        C: 2.0,
        'C-': 0.0,
        F: 0.0,
      }
    : {
        'A+': 4.0,
        A: 4.0,
        'A-': 3.67,
        'B+': 3.33,
        B: 3.0,
        'B-': 2.67,
        'C+': 2.33,
        C: 2.0,
        'C-': 0.0,
        F: 0.0,
      };

  let totalCreditHours = 0;
  let totalGradePoints = 0;

  // Loop through each subject and calculate total grade points
  for (const subject of subjects) {
    const grade = subject.grade.toUpperCase();
    const creditHours = subject.credit_hours;
    const gradePoint = gradingScale[grade] || 0.0;

    totalCreditHours += creditHours;
    totalGradePoints += gradePoint * creditHours;
  }

  // Calculate GPA: total grade points divided by total credit hours
  const gpa = totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;
  return [gpa, totalCreditHours];
};

export const calculateCGPA = (
  currentCreditHours: number,
  currentCGPA: number,
  newCreditHours: number,
  newGPA: number,
  cocuParticipation: boolean = false,
  internshipType: 'short' | 'long' | null = null
): number => {
  let adjustedCreditHours = currentCreditHours;

  // Adjust current credit hours based on participation in cocurricular activities
  if (cocuParticipation) {
    adjustedCreditHours = Math.max(0, adjustedCreditHours - 2); // Reduce by 2
  }

  // Adjust for internship type
  if (internshipType === 'short') {
    adjustedCreditHours = Math.max(0, adjustedCreditHours - 5); // Reduce by 5 for short semester
  } else if (internshipType === 'long') {
    adjustedCreditHours = Math.max(0, adjustedCreditHours - 8); // Reduce by 8 for long semester
  }

  // Calculate cumulative CGPA based on weighted average
  const totalCredits = adjustedCreditHours + newCreditHours;
  const weightedOldCGPA = currentCGPA * adjustedCreditHours;
  const weightedNewGPA = newGPA * newCreditHours;

  return totalCredits > 0
    ? (weightedOldCGPA + weightedNewGPA) / totalCredits
    : 0;
};
