import type { Metadata } from "next";
import QuickExit from "@/components/shared/QuickExit";
import "./globals.css";

export const metadata: Metadata = {
  title: "NLN Stealth",
  description: "Stealth-themed support workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-stealth-text antialiased">
        {children}
        <QuickExit />
      </body>
    </html>
  );
}
