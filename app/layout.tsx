// app/layout.tsx
"use client";  

import { useEffect } from "react";
import { loginAnonymously } from "@/lib/db";  // import form lib db
import NavbarWrapper from "@/components/shared/NavbarWrapper";
import QuickExit from "@/components/shared/QuickExit";
import { seedDatabase } from "../lib/seedDatabase";
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
      <body className="text-stealth-text antialiased">
        <NavbarWrapper />
        <div id="app-content">{children}</div>
        <QuickExit />
      </body>
    </html>
  );
}