import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switchLanguage = (lang: 'nl' | 'en') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => switchLanguage('nl')}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
          i18n.language === 'nl'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="Switch to Dutch"
      >
        NL
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
          i18n.language === 'en'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
