// app/layout.tsx
"use client";  

import { useEffect } from "react";
import { loginAnonymously } from "@/lib/db";  // import form lib db
import NavbarWrapper from "@/components/shared/NavbarWrapper";
import QuickExit from "@/components/shared/QuickExit";
<<<<<<< HEAD
import { ThemeProvider } from "@/lib/ThemeContext";
=======
import { seedDatabase } from "../lib/seedDatabase";
>>>>>>> 5bf50812b1051dde5402252538a6244374fd8f14
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => { //run once 
    loginAnonymously().catch(console.error); //get login anonymously form the db file
    seedDatabase().catch(console.error);//
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