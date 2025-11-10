'use client';

import React from 'react';
import Header from '../components/Header';
import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-custom py-12">
        <Calculator />
      </main>
      <footer className="app-footer">
        <div className="container-custom text-center">
          <p className="text-base font-medium">
            &copy; {new Date().getFullYear()} CGPA Calculator. All rights reserved.
          </p>
          <p className="text-sm mt-2 opacity-80">
            Made with ❤️ for Students
          </p>
        </div>
      </footer>
    </div>
  );
}