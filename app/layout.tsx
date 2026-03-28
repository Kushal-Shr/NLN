import type { Metadata } from "next";
import NavbarWrapper from "@/components/shared/NavbarWrapper";
import QuickExit from "@/components/shared/QuickExit";
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
      <body className="text-stealth-text antialiased">
        <NavbarWrapper />
        <div id="app-content">{children}</div>
        <QuickExit />
      </body>
    </html>
  );
}
