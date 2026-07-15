import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-app-border bg-app-surface/50 text-app-text-muted py-8 text-center text-xs mt-10 transition-colors">
      <p>{t('footer.text')}</p>
    </footer>
  );
}

export default Footer;
