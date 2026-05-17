import './globals.css';
import { Inter } from 'next/font/google';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'MTN Therapy Practice Portal',
  description: 'Therapy Practice Portal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={clsx(inter.variable, 'light')}>
      <body className="min-h-screen bg-canvas-bg font-sans text-canvas-text antialiased">
        {children}
      </body>
    </html>
  );
}
