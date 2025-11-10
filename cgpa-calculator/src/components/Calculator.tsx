import React, { useState } from 'react';
import { Subject, CalculationResult } from '../types';
import { calculateGPA, calculateCGPA } from '../utils/calculation';
import CourseInput from './CourseInput';
import ResultDisplay from './ResultDisplay';

const Calculator: React.FC = () => {
  const [name, setName] = useState('');
  const [currentCreditHours, setCurrentCreditHours] = useState(0);
  const [currentCGPA, setCurrentCGPA] = useState(0);
  const [isOldStudent, setIsOldStudent] = useState(false);
  const [numSubjects, setNumSubjects] = useState<number | ''>(1); // Allow empty state
  const [subjects, setSubjects] = useState<Subject[]>([
    { grade: '', credit_hours: 1 },
  ]);
  const [cocuParticipation, setCocuParticipation] = useState(false);
  const [hasInternship, setHasInternship] = useState(false);
  const [internshipCreditHours, setInternshipCreditHours] = useState(0);
  const [results, setResults] = useState<CalculationResult | null>(null);

  const handleSubjectChange = (
    index: number,
    field: keyof Subject,
    value: string | number
  ) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const handleNumSubjectsChange = (value: number | '') => {
    setNumSubjects(value);

    if (value === '' || isNaN(Number(value))) {
      return; // Don't update subjects if value is empty
    }

    const num = Number(value);

    if (num > subjects.length) {
      // Add new subjects
      setSubjects([
        ...subjects,
        ...Array(num - subjects.length).fill({ grade: '', credit_hours: 1 }),
      ]);
    } else if (num > 0) { // Only update if number is greater than 0
      // Remove subjects
      setSubjects(subjects.slice(0, num));
    }
  };

  const handleCalculate = () => {
    if (numSubjects === '' || numSubjects === 0) {
      alert('Please enter the number of subjects');
      return;
    }

    const validSubjects = subjects.filter((s) => s.grade && s.credit_hours > 0);

    if (validSubjects.length === 0) {
      alert(
        'Please enter at least one valid subject with grade and credit hours'
      );
      return;
    }

    const [gpa, totalCreditHours] = calculateGPA(validSubjects, isOldStudent);

    // Modified to pass internship credit hours directly
    const cgpa = calculateCGPA(
      currentCreditHours,
      currentCGPA,
      totalCreditHours,
      gpa,
      cocuParticipation,
      hasInternship ? internshipCreditHours : 0
    );

    setResults({
      gpa,
      cgpa,
      totalCreditHours,
    });
  };

  const handleReset = () => {
    setName('');
    setCurrentCreditHours(0);
    setCurrentCGPA(0);
    setIsOldStudent(false);
    setNumSubjects(''); // Reset to empty string
    setSubjects([{ grade: '', credit_hours: 1 }]);
    setCocuParticipation(false);
    setHasInternship(false);
    setInternshipCreditHours(0);
    setResults(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="input-card mb-8">
        <h2 className="section-header">
          📝 Enter Your Information
        </h2>

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">👤</span>
                Your Name
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">🎓</span>
                Student Type
              </label>
              <div className="flex gap-4 mt-3">
                <label className="flex items-center px-4 py-2 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50" style={{ borderColor: !isOldStudent ? '#3b82f6' : '#d1d5db', backgroundColor: !isOldStudent ? '#eff6ff' : 'white' }}>
                  <input
                    type="radio"
                    checked={!isOldStudent}
                    onChange={() => setIsOldStudent(false)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-base font-medium">New Student</span>
                </label>
                <label className="flex items-center px-4 py-2 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50" style={{ borderColor: isOldStudent ? '#3b82f6' : '#d1d5db', backgroundColor: isOldStudent ? '#eff6ff' : 'white' }}>
                  <input
                    type="radio"
                    checked={isOldStudent}
                    onChange={() => setIsOldStudent(true)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-base font-medium">Returning Student</span>
                </label>
              </div>
              <div className="mt-3 text-xs bg-blue-50 border-l-4 border-blue-400 rounded p-3 text-blue-700">
                <p className="font-semibold mb-1">ℹ️ Note:</p>
                <p className="mb-1">• New students: Updated scale (A- = 3.67)</p>
                <p>• Returning students: Older scale (A- = 3.75)</p>
              </div>
            </div>
          </div>

          {/* Current CGPA info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">📚</span>
                Current Credit Hours
              </label>
              <input
                type="number"
                inputMode="decimal"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
                value={currentCreditHours || ''}
                onChange={(e) =>
                  setCurrentCreditHours(parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.5"
                placeholder="0 (for first-time students)"
              />
              <div className="mt-3 text-xs bg-amber-50 border-l-4 border-amber-400 rounded p-3 text-amber-800">
                <p className="font-semibold mb-1">⚠️ Important:</p>
                <p className="mb-1">• Continuing students: Enter total completed credit hours</p>
                <p className="mb-1">• Transfer students: Calculate transfer credits carefully</p>
                <p>• First-time students: Enter 0</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Current CGPA
              </label>
              <input
                type="number"
                inputMode="decimal"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
                value={currentCGPA || ''}
                onChange={(e) =>
                  setCurrentCGPA(parseFloat(e.target.value) || 0)
                }
                min="0"
                max="4.0"
                step="0.01"
                placeholder="0.00 (for new students)"
              />
            </div>
          </div>

          {/* Number of subjects */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">📊</span>
              Number of Subjects This Semester
            </label>
            <input
              type="number"
              inputMode="numeric"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
              value={numSubjects}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : parseInt(e.target.value);
                handleNumSubjectsChange(value);
              }}
              min="1"
              placeholder="Enter number of subjects"
            />
          </div>

          {/* Subject inputs */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span>
              Enter Subject Details
            </h3>
            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <CourseInput
                  key={index}
                  index={index}
                  subject={subject}
                  onChange={handleSubjectChange}
                />
              ))}
            </div>
          </div>

          {/* Extra adjustments */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Additional Adjustments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    checked={cocuParticipation}
                    onChange={(e) => setCocuParticipation(e.target.checked)}
                    className="mr-3 h-5 w-5"
                  />
                  <span className="text-base font-medium flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    Co-curricular Activities
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    checked={hasInternship}
                    onChange={(e) => setHasInternship(e.target.checked)}
                    className="mr-3 h-5 w-5"
                  />
                  <span className="text-base font-medium flex items-center gap-2">
                    <span className="text-xl">💼</span>
                    Completed Internship
                  </span>
                </label>

                {hasInternship && (
                  <div className="mt-4 ml-4 p-4 bg-white rounded-lg border-2 border-purple-300">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Internship Credit Hours
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg shadow-sm"
                      value={internshipCreditHours || ''}
                      onChange={(e) => setInternshipCreditHours(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="1"
                      placeholder="Enter credit hours"
                    />
                    <p className="text-xs text-gray-600 mt-2 italic">
                      💡 Enter credit hours according to your faculty guidelines
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t-2 border-gray-200">
            <button
              className="btn btn-primary px-8 py-4 text-lg font-bold flex items-center justify-center gap-2"
              onClick={handleCalculate}
            >
              <span className="text-xl">🧮</span>
              Calculate Results
            </button>
            <button
              className="btn btn-secondary px-8 py-4 text-lg font-bold flex items-center justify-center gap-2"
              onClick={handleReset}
            >
              <span className="text-xl">🔄</span>
              Reset Form
            </button>
          </div>
        </div>
      </div>

      {/* Results section */}
      <ResultDisplay name={name} results={results} />
    </div>
  );
};

export default Calculator;