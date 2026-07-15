import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Zap, Box, ArrowRight } from 'lucide-react';

function Landing({ onStartBuilding, onNavigate }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col font-sans bg-app-bg text-app-text transition-colors">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-semibold px-3 py-1 rounded-full mb-8 animate-pulse">
          {t('landing.welcome')}
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-app-text mb-6 leading-tight">
          {t('landing.title_main')} <br />
          <span className="text-brand-blue bg-clip-text">{t('landing.title_highlight')}</span>
        </h1>
        
        <p className="text-lg text-app-text-muted mb-10 max-w-2xl leading-relaxed">
          {t('landing.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={onStartBuilding}
            className="bg-brand-blue hover:opacity-90 text-white dark:text-slate-950 text-base font-bold px-8 py-4 rounded transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-blue/10"
          >
            {t('landing.start_btn')}
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onNavigate('catalog')}
            className="bg-app-surface hover:bg-app-bg border border-app-border text-app-text text-base font-medium px-8 py-4 rounded transition-all cursor-pointer"
          >
            {t('landing.explore_btn')}
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-app-surface border border-app-border p-6 rounded-lg hover:border-brand-blue/50 transition-all shadow-sm">
            <div className="text-brand-blue text-2xl mb-3">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-app-text mb-2">{t('landing.features.compat_title')}</h3>
            <p className="text-sm text-app-text-muted">{t('landing.features.compat_desc')}</p>
          </div>
          <div className="bg-app-surface border border-app-border p-6 rounded-lg hover:border-brand-blue/50 transition-all shadow-sm">
            <div className="text-brand-blue text-2xl mb-3">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-app-text mb-2">{t('landing.features.tdp_title')}</h3>
            <p className="text-sm text-app-text-muted">{t('landing.features.tdp_desc')}</p>
          </div>
          <div className="bg-app-surface border border-app-border p-6 rounded-lg hover:border-brand-blue/50 transition-all shadow-sm">
            <div className="text-brand-blue text-2xl mb-3">
              <Box className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-app-text mb-2">{t('landing.features.uat_title')}</h3>
            <p className="text-sm text-app-text-muted">{t('landing.features.uat_desc')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
