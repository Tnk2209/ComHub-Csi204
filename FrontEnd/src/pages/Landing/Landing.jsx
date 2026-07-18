import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Zap, Box, ArrowRight } from 'lucide-react';

function Landing({ onStartBuilding, onNavigate }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col font-sans bg-app-bg text-app-text transition-colors">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue/10 text-blue text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          {t('landing.welcome')}
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-app-text mb-6 leading-tight">
          {t('landing.title_main')} <br />
          <span className="text-blue">{t('landing.title_highlight')}</span>
        </h1>

        <p className="text-lg text-app-text-muted mb-10 max-w-2xl leading-relaxed">
          {t('landing.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={onStartBuilding}
            className="bg-blue hover:opacity-90 text-white text-base font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {t('landing.start_btn')}
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-app-surface hover:bg-bg-secondary text-app-text text-base font-medium px-8 py-4 rounded-xl transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          >
            {t('landing.explore_btn')}
          </button>
        </div>

        {/* Feature Highlights - iOS Grouped Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-app-surface p-6 rounded-2xl hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="text-blue text-2xl mb-3">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-app-text mb-2">{t('landing.features.compat_title')}</h3>
            <p className="text-sm text-app-text-muted leading-relaxed">{t('landing.features.compat_desc')}</p>
          </div>
          <div className="bg-app-surface p-6 rounded-2xl hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="text-blue text-2xl mb-3">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-app-text mb-2">{t('landing.features.tdp_title')}</h3>
            <p className="text-sm text-app-text-muted leading-relaxed">{t('landing.features.tdp_desc')}</p>
          </div>
          <div className="bg-app-surface p-6 rounded-2xl hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="text-blue text-2xl mb-3">
              <Box className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-app-text mb-2">{t('landing.features.uat_title')}</h3>
            <p className="text-sm text-app-text-muted leading-relaxed">{t('landing.features.uat_desc')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
