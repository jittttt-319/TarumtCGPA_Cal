import React from 'react';
import { Subject } from '../types/index';

interface CourseInputProps {
  index: number;
  subject: Subject;
  onChange: (
    index: number,
    field: keyof Subject,
    value: string | number
  ) => void;
}

const CourseInput: React.FC<CourseInputProps> = ({
  index,
  subject,
  onChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4 p-6 border-2 border-gray-200 rounded-xl card bg-gradient-to-br from-white to-gray-50 hover:border-blue-300">
      <div className="flex-1 form-group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📚 Course {index + 1} Grade
        </label>
        <select
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
          value={subject.grade}
          onChange={(e) => onChange(index, 'grade', e.target.value)}
        >
          <option value="">Select Grade</option>
          <option value="A+">A+ (4.00)</option>
          <option value="A">A (4.00)</option>
          <option value="A-">A- (3.67)</option>
          <option value="B+">B+ (3.33)</option>
          <option value="B">B (3.00)</option>
          <option value="B-">B- (2.67)</option>
          <option value="C+">C+ (2.33)</option>
          <option value="C">C (2.00)</option>
          <option value="C-">C- (1.67)</option>
          <option value="F">F (0.00)</option>
        </select>
      </div>
      <div className="flex-1 form-group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ Credit Hours
        </label>
        <select
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
          value={subject.credit_hours || ''}
          onChange={(e) => onChange(index, 'credit_hours', parseFloat(e.target.value) || 0)}
        >
          <option value="">Select Credit Hours</option>
          <option value="1">1 Credit Hour</option>
          <option value="2">2 Credit Hours</option>
          <option value="3">3 Credit Hours</option>
          <option value="4">4 Credit Hours</option>
          <option value="5">5 Credit Hours</option>
        </select>
      </div>
    </div>
  );
};

export default CourseInput;