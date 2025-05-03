'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CGPA Calculator',
  description: 'Calculate your GPA and CGPA with adjustments for co-curricular activities and internships',
};

export default function RootLayout({
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

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}