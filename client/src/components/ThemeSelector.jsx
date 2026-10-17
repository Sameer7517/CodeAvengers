import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { themeMode, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  const currentIcon = () => {
    if (themeMode === 'system') {
      return <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    if (themeMode === 'dark') {
      return <Moon className="w-4 h-4 text-emerald-400" />;
    }
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-forest-50/60 dark:hover:bg-forest-900/60 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
        aria-label={`Theme selector: currently ${themeMode} (${resolvedTheme})`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {currentIcon()}
        <span className="hidden xl:inline text-xs font-semibold capitalize">
          {themeMode}
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-36 rounded-2xl glass-dropdown p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="listbox"
          aria-label="Theme options"
        >
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = themeMode === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setTheme(option.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{option.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
