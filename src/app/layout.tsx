import type { Metadata } from 'next';
import './globals.css';
import { SolarFlowProvider } from '@/context/SolarFlowContext';

export const metadata: Metadata = {
  title: 'SolarFlow - Solar EPC & Installation Business Management',
  description:
    'Turnkey Solar EPC & Installation Business Management System for commercial, industrial, and residential solar developers in India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 font-sans text-slate-900 min-h-screen antialiased">
        <SolarFlowProvider>{children}</SolarFlowProvider>
      </body>
    </html>
  );
}
