"use client";

import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { NavigationMenuDemo } from "@/components/ui/navigetion";
import Link from "next/link";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(
    null
  );

  const handleDropdownEnter = (itemName: string) => {
    setOpenDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdown = (itemName: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === itemName ? null : itemName);
  };

  return (
    <header className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-md">
            <svg
              className="h-6 w-6 text-white "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Endura
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              BaaS Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavigationMenuDemo />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {status === "loading" ? null : session ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">
                  {session.user?.name ?? session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-primary hover:text-primary/80 font-medium px-6 py-2.5 rounded-md transition-all duration-200 border border-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-md transition-all duration-200 border"
                >
                  Sign In
                </Link>
                <Link
                  href="/app"
                  className="text-primary hover:text-primary/80 font-medium px-6 py-2.5 rounded-md transition-all duration-200 border border-primary"
                >
                  Get the App
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary"
            onClick={toggleMobileMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden border-t border-gray-200 dark:border-gray-800 transition-all duration-500 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div
          className={`px-4 py-4 space-y-4 bg-white dark:bg-gray-900 transform transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          {/* Features Dropdown */}
          <div>
            <button
              className="flex items-center justify-between w-full text-left text-gray-900 dark:text-white font-medium py-2"
              onClick={() => toggleMobileDropdown("features")}
            >
              Features
              <svg
                className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                  mobileDropdownOpen === "features" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-400 ease-in-out transform ${
                mobileDropdownOpen === "features"
                  ? "max-h-48 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <div
                className={`pl-4 pt-2 space-y-3 transform transition-all duration-300 ease-out ${
                  mobileDropdownOpen === "features"
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
              >
                <Link
                  href="#"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary py-1 transform transition-all duration-200 hover:translate-x-1 hover:scale-105"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="4" />
                  </svg>
                  Backlog
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary py-1 transform transition-all duration-200 hover:translate-x-1 hover:scale-105"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  To Do
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary py-1 transform transition-all duration-200 hover:translate-x-1 hover:scale-105"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Done
                </Link>
              </div>
            </div>
          </div>

          {/* Regular Menu Items */}
          <Link
            href="/docs"
            className="block text-gray-900 dark:text-white font-medium py-2 hover:text-primary transition-all duration-200 transform hover:translate-x-1"
          >
            Document
          </Link>
          <Link
            href="/docs"
            className="block text-gray-900 dark:text-white font-medium py-2 hover:text-primary transition-all duration-200 transform hover:translate-x-1"
          >
            Contact
          </Link>
          <Link
            href="/docs"
            className="block text-gray-900 dark:text-white font-medium py-2 hover:text-primary transition-all duration-200 transform hover:translate-x-1"
          >
            About Us
          </Link>
        </div>
      </div>
    </header>
  );
}
