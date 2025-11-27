import React, { useState, useEffect } from "react";
import { Github, Zap, Sun, Moon, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { PageRoute } from "../types";

interface NavbarProps {
  onHome: () => void;
  onNavigate?: (page: PageRoute) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onHome,
  onNavigate,
  theme,
  toggleTheme,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", value: "integrations" },
    { label: "Enterprise", value: "enterprise" },
    { label: "Changelog", value: "changelog" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#030303]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left: Logo & Status */}
          <div className="flex items-center gap-6">
            <div
              onClick={onHome}
              className="cursor-pointer hover:opacity-80 transition-opacity transform hover:scale-105 duration-200"
            >
              <Logo />
            </div>
          </div>

    

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:rotate-12"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all hover:scale-110"
            >
              <Github size={20} />
            </a>

            <div className="h-4 w-px bg-black/10 dark:bg-white/10"></div>

            <button className="text-xs font-medium text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
              Sign In
            </button>            
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-500 dark:text-neutral-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#030303] pt-24 px-6 md:hidden animate-fade-in-up">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => {
                  onNavigate?.(link.value as PageRoute);
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-gray-900 dark:text-white text-left border-b border-gray-100 dark:border-white/5 pb-4"
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-gray-500 dark:text-neutral-400">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-white/5"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <button className="w-full py-3 bg-[#00d907] text-black font-bold rounded mt-4">
              Start Free
            </button>
          </div>
        </div>
      )}
    </>
  );
};

