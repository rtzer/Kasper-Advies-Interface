import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nl from './locales/nl.json';
import en from './locales/en.json';
import nlCommon from './locales/nl/common.json';
import nlNavigation from './locales/nl/navigation.json';
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'nl',
    supportedLngs: ['nl', 'en'],
    defaultNS: 'common',
    ns: ['common', 'navigation', 'translation'],
    resources: {
      nl: { 
        translation: nl,
        common: nlCommon,
        navigation: nlNavigation,
      },
      en: { 
        translation: en,
        common: enCommon,
        navigation: enNavigation,
      }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
