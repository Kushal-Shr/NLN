"use client";

import { useEffect } from "react";
import { loginAnonymously } from "@/lib/db";
import { ThemeProvider } from "@/lib/ThemeContext";
import { seedDatabase } from "@/lib/seedDatabase";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    loginAnonymously().catch(console.error);
    seedDatabase().catch(console.error);
  }, []);

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
