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
  const [numSubjects, setNumSubjects] = useState(1);
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

  const handleNumSubjectsChange = (num: number) => {
    setNumSubjects(num);

    if (num > subjects.length) {
      // Add new subjects
      setSubjects([
        ...subjects,
        ...Array(num - subjects.length).fill({ grade: '', credit_hours: 1 }),
      ]);
    } else {
      // Remove subjects
      setSubjects(subjects.slice(0, num));
    }
  };

  const handleCalculate = () => {
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
    setNumSubjects(1);
    setSubjects([{ grade: '', credit_hours: 1 }]);
    setCocuParticipation(false);
    setHasInternship(false);
    setInternshipCreditHours(0);
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Enter Your Information
        </h2>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Type
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isOldStudent}
                    onChange={() => setIsOldStudent(false)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-lg">New Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isOldStudent}
                    onChange={() => setIsOldStudent(true)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-lg">Returning Student</span>
                </label>
              </div>
              <div className="mt-2 text-xs text-gray-500 italic">
                <p>Note: New students follow the updated grading scale (A- = 3.67, A = 4.0, etc.)</p>
                <p>Returning students use the older grading scale (A- = 3.75, A = 4.0, etc.)</p>
              </div>
            </div>
          </div>

          {/* Current CGPA info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Credit Hours (0 for new students)
              </label>
              <input
                type="number"
                inputMode="decimal"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={currentCreditHours || ''}
                onChange={(e) =>
                  setCurrentCreditHours(parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.5"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current CGPA (0 for new students)
              </label>
              <input
                type="number"
                inputMode="decimal"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={currentCGPA || ''}
                onChange={(e) =>
                  setCurrentCGPA(parseFloat(e.target.value) || 0)
                }
                min="0"
                max="4.0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Number of subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Subjects This Semester
            </label>
            <input
              type="number"
              inputMode="numeric"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              value={numSubjects}
              onChange={(e) =>
                handleNumSubjectsChange(parseInt(e.target.value) || 1)
              }
              min="1"
              placeholder="1"
            />
          </div>

          {/* Subject inputs */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
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
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Additional Adjustments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cocuParticipation}
                    onChange={(e) => setCocuParticipation(e.target.checked)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-lg">Participated in co-curricular activities</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasInternship}
                    onChange={(e) => setHasInternship(e.target.checked)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-lg">Completed an internship</span>
                </label>

                {hasInternship && (
                  <div className="mt-2 ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internship Credit Hours
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      value={internshipCreditHours || ''}
                      onChange={(e) => setInternshipCreditHours(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="1"
                      placeholder="Enter credit hours"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the number of credit hours for your internship according to your faculty guidelines.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              className="btn btn-primary p-4 text-lg"
              onClick={handleCalculate}
            >
              Calculate
            </button>
            <button
              className="btn btn-secondary p-4 text-lg"
              onClick={handleReset}
            >
              Reset
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