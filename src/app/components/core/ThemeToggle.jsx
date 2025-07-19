'use client';

import { useTheme } from "next-themes";


export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700">
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
