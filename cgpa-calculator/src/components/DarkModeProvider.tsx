'use client';

import React, { useEffect } from 'react';

const DarkModeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Initialize dark mode from localStorage on client-side
  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return <>{children}</>;
};

export default DarkModeProvider;