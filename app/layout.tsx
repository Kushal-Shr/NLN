import type { Metadata } from "next";
import NavbarWrapper from "@/components/shared/NavbarWrapper";
import QuickExit from "@/components/shared/QuickExit";
import { ThemeProvider } from "@/lib/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanctuary",
  description: "Resilience through Cultural Wisdom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
