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
    <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 border rounded card">
      <div className="flex-1 form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course {index + 1} Grade
        </label>
        <select
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          value={subject.grade}
          onChange={(e) => onChange(index, 'grade', e.target.value)}
        >
          <option value="">Select Grade</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="B-">B-</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="C-">C-</option>
          <option value="F">F</option>
        </select>
      </div>
      <div className="flex-1 form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Credit Hours
        </label>
        <select
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          value={subject.credit_hours || ''}
          onChange={(e) => onChange(index, 'credit_hours', parseFloat(e.target.value) || 0)}
        >
          <option value="">Select Credit Hours</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </div>
  );
};

export default CourseInput;