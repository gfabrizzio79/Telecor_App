
import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { XCircleIcon } from './Icons';

interface AddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (country: string) => void;
}

const AddCountryModal: React.FC<AddCountryModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useLanguage();
  const [countryName, setCountryName] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (countryName.trim()) {
      onSave(countryName.trim());
      setCountryName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('addCountryTitle')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>
        
        <form onSubmit={handleSave}>
          <div className="p-6">
            <label htmlFor="country-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('countryName')}
            </label>
            <input
              id="country-name"
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder={t('enterNewCountry')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition duration-300">
              {t('cancel')}
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCountryModal;
