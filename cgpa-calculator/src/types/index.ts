export interface Subject {
  grade: string;
  credit_hours: number;
}

export interface CalculationResult {
  gpa: number;
  cgpa: number;
  totalCreditHours: number;
}
