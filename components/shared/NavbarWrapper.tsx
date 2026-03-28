"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDDEN_ROUTES = ["/onboarding"];

export default function NavbarWrapper() {
  const pathname = usePathname();

  const shouldHide = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (shouldHide) return null;

  return <Navbar />;
}
