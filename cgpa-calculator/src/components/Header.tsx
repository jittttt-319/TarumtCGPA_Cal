import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header-gradient p-6">
      <div className="container-custom">
        <h1 className="text-2xl md:text-3xl font-bold text-white">CGPA Calculator</h1>
        <p className="text-blue-100 mt-2">
          Calculate your GPA and CGPA with adjustments for co-curricular activities and internships
        </p>
      </div>
    </header>
  );
};

export default Header;