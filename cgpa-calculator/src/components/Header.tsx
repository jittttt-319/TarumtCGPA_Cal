'use client';

import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
      <div className="container-custom flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">CGPA Calculator</h1>
          <p className="text-blue-100 dark:text-gray-300 mt-2">
            Calculate your GPA and CGPA with adjustments for co-curricular activities and internships
          </p>
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;