"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  Users,
  MessageSquare,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/hub", label: "Wisdom Hub", icon: BookOpen },
  { href: "/journal", label: "Inner Ledger", icon: PenLine },
  { href: "/events", label: "Circles", icon: Users },
  { href: "/chat", label: "Mentors", icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 backdrop-blur-md">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-stealth-accent"
      >
        <span className="text-[13px] font-semibold uppercase tracking-[0.18em]">
          Sanctuary
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? "text-stealth-accent"
                    : "text-stealth-muted hover:text-stealth-text"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>

                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-10 rounded-lg bg-stealth-accent/10"
                    transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* User avatar placeholder */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-stealth-card">
        <User className="h-4 w-4 text-stealth-muted" />
      </div>
    </nav>
  );
}
