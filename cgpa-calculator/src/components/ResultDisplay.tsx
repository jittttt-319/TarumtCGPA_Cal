import React from 'react';
import { CalculationResult } from '../types';

interface ResultDisplayProps {
  name: string;
  results: CalculationResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ name, results }) => {
  if (!results) return null;

  return (
    <div className="glass p-6 rounded-lg shadow-lg mt-6 border-t-4 border-blue-500 result-card">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Results</h3>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-1">Hello, <span className="font-semibold">{name}</span></p>
        <p className="text-gray-600 mb-1">Total Credit Hours: <span className="font-semibold">{results.totalCreditHours.toFixed(1)}</span></p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg card">
          <p className="text-sm text-gray-500">Semester GPA</p>
          <p className="result-value">{results.gpa.toFixed(4)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg card">
          <p className="text-sm text-gray-500">Updated CGPA</p>
          <p className="result-value">{results.cgpa.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;