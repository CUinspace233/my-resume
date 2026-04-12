'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored !== null ? stored === 'dark' : prefersDark;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="theme-toggle-container print:hidden flex shrink-0 items-center">
      <button
        type="button"
        id="theme-toggle-button"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/90 text-[#171717] transition-colors cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/10 dark:bg-[#171717] dark:text-[#ededed]"
      >
        <SunIcon
          className="absolute h-4 w-4 transition-opacity duration-150"
          style={{ opacity: darkMode ? 0 : 1 }}
          aria-hidden="true"
        />
        <MoonIcon
          className="absolute h-4 w-4 transition-opacity duration-150"
          style={{ opacity: darkMode ? 1 : 0 }}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
