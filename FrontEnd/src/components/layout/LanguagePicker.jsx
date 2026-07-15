import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguagePicker() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'th';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'th' ? 'en' : 'th';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center bg-app-surface border border-app-border rounded-full p-0.5 w-16 h-8 cursor-pointer transition-colors"
      title={currentLang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
      aria-label="Toggle Language"
    >
      {/* Sliding Indicator background */}
      <div 
        className={`absolute top-0.5 bottom-0.5 w-7 rounded-full bg-brand-blue/10 border border-brand-blue/30 transition-transform duration-300 ${
          currentLang === 'en' ? 'translate-x-[32px]' : 'translate-x-0'
        }`}
        style={{ left: '2px' }}
      />
      
      {/* Text Labels */}
      <div className="flex justify-between items-center w-full px-1">
        <span className={`w-7 text-[10px] font-extrabold z-10 text-center transition-colors duration-300 ${
          currentLang === 'th' ? 'text-brand-blue' : 'text-app-text-muted'
        }`}>
          TH
        </span>
        <span className={`w-7 text-[10px] font-extrabold z-10 text-center transition-colors duration-300 ${
          currentLang === 'en' ? 'text-brand-blue' : 'text-app-text-muted'
        }`}>
          EN
        </span>
      </div>
    </button>
  );
}

export default LanguagePicker;
