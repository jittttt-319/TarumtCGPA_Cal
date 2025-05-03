import React, { useState, useEffect } from 'react';
import { Subject, CalculationResult } from '../types';
import { calculateGPA, calculateCGPA } from '../utils/calculation';
import CourseInput from './CourseInput';
import ResultDisplay from './ResultDisplay';

const Calculator: React.FC = () => {
  // Main state
  const [name, setName] = useState('');
  const [currentCreditHours, setCurrentCreditHours] = useState(0);
  const [currentCGPA, setCurrentCGPA] = useState(0);
  const [isOldStudent, setIsOldStudent] = useState(false);
  const [numSubjects, setNumSubjects] = useState<number | ''>(''); // Empty state by default
  const [subjects, setSubjects] = useState<Subject[]>([
    { grade: '', credit_hours: 1 },
  ]);
  const [cocuParticipation, setCocuParticipation] = useState(false);
  const [hasInternship, setHasInternship] = useState(false);
  const [internshipCreditHours, setInternshipCreditHours] = useState(0);
  const [results, setResults] = useState<CalculationResult | null>(null);
  
  // UI enhancement state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [savedResults, setSavedResults] = useState<Array<{
    name: string;
    date: string;
    result: CalculationResult;
  }>>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved results on component mount
  useEffect(() => {
    const saved = localStorage.getItem('cgpaCalculations');
    if (saved) {
      try {
        setSavedResults(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved calculations');
      }
    }
    
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);
  
  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (numSubjects === '' || numSubjects === 0) {
      newErrors.numSubjects = 'Please enter the number of subjects';
    }
    
    const validSubjects = subjects.filter((s) => s.grade && s.credit_hours > 0);
    if (validSubjects.length === 0) {
      newErrors.subjects = 'Please enter at least one valid subject with grade and credit hours';
    }

    if (currentCGPA < 0 || currentCGPA > 4.0) {
      newErrors.cgpa = 'CGPA must be between 0 and 4.0';
    }

    if (hasInternship && internshipCreditHours <= 0) {
      newErrors.internship = 'Please enter valid internship credit hours';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubjectChange = (
    index: number,
    field: keyof Subject,
    value: string | number
  ) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
    
    // Clear subject errors when user makes changes
    if (errors.subjects) {
      setErrors(prev => ({ ...prev, subjects: undefined }));
    }
  };

  const handleNumSubjectsChange = (value: number | '') => {
    setNumSubjects(value);
    
    // Clear errors when user fixes input
    if (errors.numSubjects) {
      setErrors(prev => ({ ...prev, numSubjects: undefined }));
    }
    
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  const handleCalculate = () => {
    if (!validateForm()) {
      // Show the first error as an alert
      const firstError = Object.values(errors)[0];
      if (firstError) {
        alert(firstError);
      }
      return;
    }
    
    setIsCalculating(true);
    
    const validSubjects = subjects.filter((s) => s.grade && s.credit_hours > 0);
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

    // Add a small delay to show the calculating state (better UX)
    setTimeout(() => {
      setResults({
        gpa,
        cgpa,
        totalCreditHours,
      });
      setIsCalculating(false);
      
      // Scroll to results
      const resultElement = document.getElementById('results-section');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
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
    setErrors({});
  };
  
  const handleSaveResult = () => {
    if (!results) return;
    
    const newSavedResults = [
      {
        name: name || 'Unnamed Calculation',
        date: new Date().toLocaleDateString(),
        result: results
      },
      ...savedResults
    ];
    
    setSavedResults(newSavedResults);
    localStorage.setItem('cgpaCalculations', JSON.stringify(newSavedResults));
    alert('Calculation saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Dark mode toggle */}
      <div className="absolute right-4 top-4 flex items-center">
        <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Dark Mode</span>
        <label className="relative inline-block w-12 h-6">
          <input 
            type="checkbox" 
            className="opacity-0 w-0 h-0" 
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <span className="slider absolute cursor-pointer inset-0 bg-gray-300 dark:bg-gray-700 rounded-full before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition-all before:duration-300 before:transform toggle-checkbox"></span>
        </label>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Enter Your Information
        </h2>
        
        {/* Help section */}
        <div className="mb-6">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="text-blue-600 dark:text-blue-400 flex items-center text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {showHelp ? 'Hide Help' : 'Need Help?'}
          </button>
          
          {showHelp && (
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm">
              <h3 className="font-semibold mb-2 dark:text-white">How to Use This Calculator</h3>
              <ul className="list-disc pl-5 space-y-1 dark:text-gray-200">
                <li>Enter your name and select your student type</li>
                <li>If you're a diploma student entering a degree program, enter your previous credit hours and CGPA</li>
                <li>Enter the number of subjects for this semester</li>
                <li>For each subject, select the grade and credit hours</li>
                <li>Check any applicable additional adjustments</li>
                <li>Click Calculate to see your results</li>
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  <span className="text-lg dark:text-white">New Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isOldStudent}
                    onChange={() => setIsOldStudent(true)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-lg dark:text-white">Returning Student</span>
                </label>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                <p>Note: New students follow the updated grading scale (A- = 3.67, A = 4.0, etc.)</p>
                <p>Returning students use the older grading scale (A- = 3.75, A = 4.0, etc.)</p>
              </div>
            </div>
          </div>

          {/* Current CGPA info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Credit Hours (0 for new students)
              </label>
              <input
                type="number"
                inputMode="decimal"
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.cgpa ? 'border-red-500' : ''
                }`}
                value={currentCreditHours || ''}
                onChange={(e) => {
                  setCurrentCreditHours(parseFloat(e.target.value) || 0);
                  if (errors.cgpa) setErrors(prev => ({ ...prev, cgpa: undefined }));
                }}
                min="0"
                step="0.5"
                placeholder="0"
                onKeyDown={handleKeyDown}
              />
              <div className="mt-2 text-xs bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded p-2 text-yellow-700 dark:text-yellow-300">
                <p className="font-semibold">Important Notice:</p>
                <p>Only diploma students entering degree programs should enter their previous credit hours. Regular students should use the standard calculation.</p>
                <p>Using this field incorrectly will affect your CGPA calculation.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current CGPA (0 for new students)
              </label>
              <input
                type="number"
                inputMode="decimal"
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.cgpa ? 'border-red-500' : ''
                }`}
                value={currentCGPA || ''}
                onChange={(e) => {
                  setCurrentCGPA(parseFloat(e.target.value) || 0);
                  if (errors.cgpa) setErrors(prev => ({ ...prev, cgpa: undefined }));
                }}
                min="0"
                max="4.0"
                step="0.01"
                placeholder="0.00"
                onKeyDown={handleKeyDown}
              />
              {errors.cgpa && (
                <p className="mt-1 text-sm text-red-500">{errors.cgpa}</p>
              )}
            </div>
          </div>

          {/* Number of subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Subjects This Semester
            </label>
            <input
              type="number"
              inputMode="numeric"
              className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.numSubjects ? 'border-red-500' : ''
              }`}
              value={numSubjects}
              onChange={(e) => {
                const value = e.target.value === '' ? '' : parseInt(e.target.value);
                handleNumSubjectsChange(value);
              }}
              min="1"
              placeholder="Enter number of subjects"
              onKeyDown={handleKeyDown}
            />
            {errors.numSubjects && (
              <p className="mt-1 text-sm text-red-500">{errors.numSubjects}</p>
            )}
          </div>

          {/* Subject inputs */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
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
            {errors.subjects && (
              <p className="mt-2 text-sm text-red-500">{errors.subjects}</p>
            )}
          </div>

          {/* Extra adjustments */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
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
                  <span className="text-lg dark:text-white">Participated in co-curricular activities</span>
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
                  <span className="text-lg dark:text-white">Completed an internship</span>
                </label>

                {hasInternship && (
                  <div className="mt-2 ml-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Internship Credit Hours
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                        errors.internship ? 'border-red-500' : ''
                      }`}
                      value={internshipCreditHours || ''}
                      onChange={(e) => {
                        setInternshipCreditHours(parseFloat(e.target.value) || 0);
                        if (errors.internship) setErrors(prev => ({ ...prev, internship: undefined }));
                      }}
                      min="0"
                      step="1"
                      placeholder="Enter credit hours"
                      onKeyDown={handleKeyDown}
                    />
                    {errors.internship && (
                      <p className="mt-1 text-sm text-red-500">{errors.internship}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
              className={`btn btn-primary p-4 text-lg w-full sm:w-auto ${isCalculating ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <span className="loading-spinner mr-2"></span> Calculating...
                </>
              ) : (
                'Calculate'
              )}
            </button>
            <button
              className="btn btn-secondary p-4 text-lg w-full sm:w-auto"
              onClick={handleReset}
              disabled={isCalculating}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results section */}
      <div id="results-section">
        <ResultDisplay name={name} results={results} />
        
        {results && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSaveResult}
              className="btn bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 p-3"
            >
              Save This Calculation
            </button>
          </div>
        )}
      </div>
      
      {/* Saved calculations */}
      {savedResults.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center text-blue-600 dark:text-blue-400 font-medium mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            {showSaved ? 'Hide Saved Calculations' : 'View Saved Calculations'}
          </button>
          
          {showSaved && (
            <div className="space-y-3 mt-3">
              {savedResults.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                  </div>
                  <p className="dark:text-gray-300">GPA: <span className="font-semibold">{item.result.gpa.toFixed(2)}</span> | CGPA: <span className="font-semibold">{item.result.cgpa.toFixed(2)}</span></p>
                  <button 
                    onClick={() => {
                      const newSaved = savedResults.filter((_, i) => i !== index);
                      setSavedResults(newSaved);
                      localStorage.setItem('cgpaCalculations', JSON.stringify(newSaved));
                    }}
                    className="text-xs text-red-500 dark:text-red-400 mt-1"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scroll to top button - shows only when needed */}
      {(numSubjects && Number(numSubjects) > 3) && (
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-10"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Calculator;