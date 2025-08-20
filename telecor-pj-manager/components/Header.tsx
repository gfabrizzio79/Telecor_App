import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
    currentApp: 'projects' | 'staff';
    setCurrentApp: (app: 'projects' | 'staff') => void;
}

const Header: React.FC<HeaderProps> = ({ currentApp, setCurrentApp }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'es' | 'en');
  };

  const getButtonClass = (app: 'projects' | 'staff') => {
    const baseClass = "py-2 px-4 text-sm font-medium text-center rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600";
    if (app === currentApp) {
        return `${baseClass} text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700`;
    }
    return `${baseClass} text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{t('appTitle')}</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="inline-flex rounded-md shadow-sm" role="group">
                <button type="button" onClick={() => setCurrentApp('projects')} className={`${getButtonClass('projects')} rounded-l-lg`}>
                    {t('projectManager')}
                </button>
                <button type="button" onClick={() => setCurrentApp('staff')} className={`${getButtonClass('staff')} rounded-r-lg`}>
                    {t('staffDatabase')}
                </button>
             </div>

            <div className="flex items-center">
              <label htmlFor="language-select" className="sr-only">{t('language')}</label>
              <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="es">{t('spanish')}</option>
                <option value="en">{t('english')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
