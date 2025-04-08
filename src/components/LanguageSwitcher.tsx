'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IconLanguage } from '@tabler/icons-react';
import { Transition } from '@headlessui/react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const switchLocale = (newLocale: string) => {
    // Create a new path with the locale prefix
    const newPath = `/${newLocale}${pathname.startsWith(`/${locale}`) ? pathname.substring(locale.length + 1) : pathname}`;
    router.replace(newPath);
    setIsOpen(false);
  };

  const languages = {
    en: { label: 'English' },
    zh: { label: '中文' },
  };

  return (
    <div className="relative print:hidden language-switcher-container">
      <button
        onClick={e => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 bg-gray-900 dark:bg-black hover:bg-gray-800 dark:hover:bg-gray-600 text-gray-300 dark:text-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors cursor-pointer"
      >
        <IconLanguage size={16} className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
      </button>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute right-0 p-1 mt-2 w-28 origin-top-right rounded-md bg-gray-900 shadow-lg focus:outline-none z-[2000]">
          <div className="py-1">
            {Object.entries(languages).map(([code, lang], index) => (
              <a
                key={code}
                className={`
                  ${locale === code ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'}
                  block px-3 py-2 text-sm rounded-md mx-0.5 transition-colors cursor-pointer text-center
                  ${index === Object.keys(languages).length - 1 ? '' : 'mb-1'}
                `}
                onClick={e => {
                  e.stopPropagation();
                  switchLocale(code);
                }}
              >
                {lang.label}
              </a>
            ))}
          </div>
        </div>
      </Transition>
    </div>
  );
}
