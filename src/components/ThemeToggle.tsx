'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
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
    <button
      onClick={toggleDarkMode}
      className={`group relative inline-flex h-6 sm:h-8 w-10 sm:w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${darkMode ? 'bg-indigo-600' : 'bg-blue-100'} theme-toggle-container print:hidden`}
      aria-label="Toggle dark mode"
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`pointer-events-none relative inline-block h-5 sm:h-7 w-5 sm:w-7 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${darkMode ? 'translate-x-4 sm:translate-x-6' : 'translate-x-0'}`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${darkMode ? 'opacity-0' : 'opacity-100'}`}
        >
          <SunIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${darkMode ? 'opacity-100' : 'opacity-0'}`}
        >
          <MoonIcon className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-200" />
        </span>
      </span>
    </button>
  );
}
