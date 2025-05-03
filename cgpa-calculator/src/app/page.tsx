'use client';

import React from 'react';
import Header from '../components/Header';
import Calculator from '../components/Calculator';
import DarkModeProvider from '../components/DarkModeProvider';

export default function Home() {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-pattern">
        <Header />
        <main className="container-custom py-8">
          <Calculator />
        </main>
        <footer className="app-footer">
          <div className="container-custom text-center text-sm">
            &copy; {new Date().getFullYear()} CGPA Calculator. All rights reserved.
          </div>
        </footer>
      </div>
    </DarkModeProvider>
  );
}