import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MFGFlow | Manufacturing Production Management System",
  description: "Enterprise manufacturing production visibility, machine monitoring, downtime analysis, quality tracking and inventory management.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50 text-slate-900">
      <body className="h-full bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}