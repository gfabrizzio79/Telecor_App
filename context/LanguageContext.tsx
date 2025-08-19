import React, { createContext, useState, useEffect, ReactNode } from 'react';

// A generic type for a translation file
type TranslationMap = { [key: string]: string };

// A type for the structure holding all language translations
type AllTranslations = {
  es: TranslationMap;
  en: TranslationMap;
};

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // The key is now a string, as we can't statically know the keys anymore.
  t: (key: string, ...args: any[]) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');
  const [translations, setTranslations] = useState<AllTranslations | null>(null);

  useEffect(() => {
    // Set language from browser preference
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en' || browserLang === 'es') {
      setLanguage(browserLang as Language);
    }

    // Asynchronously fetch translation files
    const fetchTranslations = async () => {
      try {
        const [esResponse, enResponse] = await Promise.all([
          fetch('/i18n/es.json'),
          fetch('/i18n/en.json'),
        ]);

        if (!esResponse.ok || !enResponse.ok) {
            throw new Error('Failed to fetch translation files');
        }

        const esData = await esResponse.json();
        const enData = await enResponse.json();
        setTranslations({ es: esData, en: enData });
      } catch (error) {
        console.error("Could not load translation files:", error);
        // Fallback to empty objects to prevent app crash
        setTranslations({ es: {}, en: {} });
      }
    };

    fetchTranslations();
  }, []); // Runs only once on component mount

  const t = (key: string): string => {
    // Return the key itself if translations are not loaded yet
    if (!translations) {
      return key;
    }
    // Return the translated string or the key as a fallback
    return translations[language][key] || key;
  };

  // Display a loading indicator while translations are being fetched.
  // This prevents the app from rendering with untranslated keys.
  if (!translations) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
