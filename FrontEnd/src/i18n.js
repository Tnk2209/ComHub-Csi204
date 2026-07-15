import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationTH from './locales/th/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  th: {
    translation: translationTH
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'th', // Default to Thai language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safe from xss
    }
  });

export default i18n;
