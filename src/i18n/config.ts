import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import nl from './locales/nl.json';
import en from './locales/en.json';
import nlCommon from './locales/nl/common.json';
import nlNavigation from './locales/nl/navigation.json';
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';

const LANGUAGE_STORAGE_KEY = 'language';

function normalizeLanguage(lang: string | null | undefined): 'nl' | 'en' | undefined {
  if (!lang) return undefined;
  const normalized = lang.toLowerCase();
  if (normalized.startsWith('nl')) return 'nl';
  if (normalized.startsWith('en')) return 'en';
  return undefined;
}

i18n
  .use(
    new LanguageDetector(null, {
      // Prefer persisted user choice; else use browser language; else fallbackLng will apply.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => normalizeLanguage(lng) ?? 'nl',
    })
  )
  .use(initReactI18next)
  .init({
    fallbackLng: 'nl',
    supportedLngs: ['nl', 'en'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    cleanCode: true,
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

// Keep HTML lang + localStorage in sync with i18n (works for any callsite changing language)
i18n.on('languageChanged', (lng) => {
  const normalized = normalizeLanguage(lng) ?? 'nl';
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  } catch {
    // ignore
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalized;
  }
});

// Set initial <html lang="..."> as early as possible
if (typeof document !== 'undefined') {
  document.documentElement.lang = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? 'nl';
}

export default i18n;
