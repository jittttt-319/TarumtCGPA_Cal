import React from 'react';
import { CalculationResult } from '../types';

interface ResultDisplayProps {
  name: string;
  results: CalculationResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ name, results }) => {
  if (!results) return null;

  const getGradeColor = (gpa: number) => {
    if (gpa >= 3.75) return 'from-green-400 to-emerald-500';
    if (gpa >= 3.0) return 'from-blue-400 to-blue-500';
    if (gpa >= 2.5) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="glass p-8 rounded-2xl shadow-2xl mt-8 border-t-4 border-blue-500 result-card">
      <h3 className="section-header text-3xl font-extrabold mb-6">
        ✨ Your Results
      </h3>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <p className="text-gray-700 mb-2 text-lg">
          Hello, <span className="font-bold text-blue-600">{name || 'Student'}</span> 👋
        </p>
        <p className="text-gray-600 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Total Credit Hours: <span className="font-bold text-lg">{results.totalCreditHours.toFixed(1)}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`stat-card bg-gradient-to-br ${getGradeColor(results.gpa)} text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📈</span>
            <p className="text-sm font-semibold uppercase tracking-wider opacity-90">Semester GPA</p>
          </div>
          <p className="text-5xl font-extrabold mt-3">{results.gpa.toFixed(4)}</p>
          <div className="mt-3 pt-3 border-t border-white/30">
            <p className="text-sm opacity-90">Current Semester Performance</p>
          </div>
        </div>
        
        <div className={`stat-card bg-gradient-to-br ${getGradeColor(results.cgpa)} text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🎯</span>
            <p className="text-sm font-semibold uppercase tracking-wider opacity-90">Updated CGPA</p>
          </div>
          <p className="text-5xl font-extrabold mt-3">{results.cgpa.toFixed(4)}</p>
          <div className="mt-3 pt-3 border-t border-white/30">
            <p className="text-sm opacity-90">Cumulative Performance</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
        <p className="text-sm text-gray-700">
          <span className="font-bold">💡 Pro Tip:</span> Keep your CGPA above 3.0 to maintain good academic standing!
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;