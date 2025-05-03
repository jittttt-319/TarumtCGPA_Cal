'use client';

import { useEffect } from 'react';

export default function DarkModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize dark mode from localStorage on client-side
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}