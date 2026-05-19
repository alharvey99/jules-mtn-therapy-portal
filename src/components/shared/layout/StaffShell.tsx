"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StaffShellProps {
  children: ReactNode;
  role: "admin" | "therapist";
}

export function StaffShell({ children, role }: StaffShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const adminNav = [
    { name: "Dashboard", href: "/admin" },
    { name: "Clients", href: "/admin/clients" },
    { name: "Therapists", href: "/admin/therapists" },
    { name: "Schedule", href: "/admin/schedule" },
    { name: "Settings", href: "/admin/settings" },
  ];

  const therapistNav = [
    { name: "Dashboard", href: "/therapist" },
    { name: "My Clients", href: "/therapist/clients" },
    { name: "My Schedule", href: "/therapist/schedule" },
    { name: "My Profile", href: "/therapist/profile" },
    { name: "Leave", href: "/therapist/leave" },
  ];

  const navItems = role === "admin" ? adminNav : therapistNav;

  const renderNavLinks = () => {
    return navItems.map((item) => {
      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          key={item.name}
          href={item.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? "bg-action-primary/10 text-action-primary-text"
              : "text-panel-text hover:bg-contrast-bg"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.name}
        </Link>
      );
    });
  };

  return (
    <div className="min-h-screen bg-canvas-bg flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-panel-border bg-panel-bg shadow-sm">
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2 mr-2 text-panel-muted hover:text-panel-text focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo / Brand */}
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="h-8 w-8 rounded-md bg-action-primary flex items-center justify-center text-white">
              MTN
            </div>
            <span className="hidden sm:inline-block">Practice Portal</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex ml-8 gap-2 flex-1">
            {renderNavLinks()}
          </nav>

          {/* Right side utilities (Placeholders for F3 components) */}
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-panel-muted relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-state-danger-bg border-2 border-panel-bg"></span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-contrast-bg border border-panel-border flex items-center justify-center overflow-hidden cursor-pointer">
              <User className="h-5 w-5 text-panel-muted" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-panel-border bg-panel-bg px-4 py-4 space-y-2 flex flex-col shadow-md absolute w-full z-30">
          {renderNavLinks()}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
