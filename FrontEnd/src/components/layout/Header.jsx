import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguagePicker from './LanguagePicker';

function Header({ currentPage, onNavigate }) {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b border-app-border bg-app-surface/90 backdrop-blur-md sticky top-0 z-50 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center flex-shrink-0">
          <span 
            onClick={() => onNavigate('landing')} 
            className="text-xl font-bold tracking-wider text-brand-blue cursor-pointer hover:opacity-85 transition-opacity"
          >
            ComHub
          </span>
        </div>

        {/* Center: Navigation Menu */}
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium h-full flex-grow">
          <button 
            onClick={() => onNavigate('landing')}
            className={`h-full flex items-center transition-colors cursor-pointer border-b-2 px-1 ${
              currentPage === 'landing' 
                ? 'text-app-text border-brand-blue font-semibold' 
                : 'text-app-text-muted border-transparent hover:text-app-text'
            }`}
          >
            {t('nav.home')}
          </button>
          <button 
            onClick={() => onNavigate('builder')}
            className={`h-full flex items-center transition-colors cursor-pointer border-b-2 px-1 ${
              currentPage === 'builder' 
                ? 'text-app-text border-brand-blue font-semibold' 
                : 'text-app-text-muted border-transparent hover:text-app-text'
            }`}
          >
            {t('nav.builder')}
          </button>
          <a 
            href="#support" 
            className="h-full flex items-center text-app-text-muted hover:text-app-text transition-colors border-b-2 border-transparent px-1"
          >
            {t('nav.support')}
          </a>
          <a 
            href="#community" 
            className="h-full flex items-center text-app-text-muted hover:text-app-text transition-colors border-b-2 border-transparent px-1"
          >
            {t('nav.community')}
          </a>
        </nav>

        {/* Right Side: Settings & Auth Buttons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          
          {/* Consolidated Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-lg bg-app-surface border border-app-border text-app-text hover:text-brand-blue transition-all cursor-pointer flex items-center justify-center hover:bg-app-bg ${
                isSettingsOpen ? 'border-brand-blue text-brand-blue bg-app-bg' : ''
              }`}
              title="System Preferences"
              aria-expanded={isSettingsOpen}
              aria-haspopup="true"
            >
              <Settings className={`w-5 h-5 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90' : 'hover:rotate-45'}`} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-app-surface border border-app-border rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[10px] font-semibold text-app-text-muted uppercase tracking-wider border-b border-app-border pb-2">
                  System Preferences / ตั้งค่าระบบ
                </div>
                
                {/* Language Setting Row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-app-text">Language / ภาษา</span>
                  <LanguagePicker />
                </div>
                
                {/* Theme Setting Row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-app-text">Theme / ธีม</span>
                  <ThemeToggle />
                </div>
              </div>
            )}
          </div>
          
          {/* Subtle Vertical Separator */}
          <div className="h-6 w-px bg-app-border" />
          
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-app-text hover:text-brand-blue transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-app-bg">
              {t('nav.signin')}
            </button>
            <button className="bg-brand-blue hover:opacity-95 text-white dark:text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md">
              {t('nav.signup')}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
