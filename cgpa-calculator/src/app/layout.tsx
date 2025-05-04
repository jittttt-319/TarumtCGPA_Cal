import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react"

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
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}