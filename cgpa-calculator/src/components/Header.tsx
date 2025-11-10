import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header-gradient p-8 shadow-2xl">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          🎓 CGPA Calculator
        </h1>
        <p className="text-blue-100 mt-3 text-lg">
          Calculate your GPA and CGPA with adjustments for co-curricular activities and internships
        </p>
      </div>
    </header>
  );
};

export default Header;