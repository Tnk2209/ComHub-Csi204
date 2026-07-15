import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className="p-2 rounded-lg bg-app-surface border border-app-border text-app-text hover:text-[#0284c7] dark:hover:text-[#00c2ff] transition-colors cursor-pointer flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
}

export default ThemeToggle;
