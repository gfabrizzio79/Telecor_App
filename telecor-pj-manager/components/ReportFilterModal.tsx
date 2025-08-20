import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { XCircleIcon } from './common/Icons';
import { ReportFilters } from '../services/pdfGenerator';

interface ReportFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (filters: ReportFilters) => void;
  filterOptions: {
    clients: string[];
    projectNames: string[];
    statuses: string[];
    staffNames: string[];
  };
}

const ReportFilterModal: React.FC<ReportFilterModalProps> = ({ isOpen, onClose, onGenerate, filterOptions }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<ReportFilters>({
    clients: [],
    projectNames: [],
    statuses: [],
    staffNames: [],
  });

  useEffect(() => {
    if(isOpen) {
        setFilters({ clients: [], projectNames: [], statuses: [], staffNames: [] });
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const handleCheckboxChange = (category: keyof ReportFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[category];
      if (currentValues.includes(value)) {
        return { ...prev, [category]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentValues, value] };
      }
    });
  };

  const handleSelectAll = (category: keyof ReportFilters) => {
    setFilters(prev => ({...prev, [category]: filterOptions[category] }));
  };
  
  const handleDeselectAll = (category: keyof ReportFilters) => {
    setFilters(prev => ({...prev, [category]: [] }));
  };

  const renderFilterSection = (title: string, category: keyof ReportFilters, options: string[]) => (
    <div className="mb-4">
      <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h4>
       <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => handleSelectAll(category)} className="text-xs text-blue-500 hover:underline">{t('selectAll')}</button>
            <button type="button" onClick={() => handleDeselectAll(category)} className="text-xs text-blue-500 hover:underline">{t('deselectAll')}</button>
       </div>
      <div className="max-h-32 overflow-y-auto border dark:border-gray-600 rounded-md p-2 space-y-1">
        {options.sort().map(option => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters[category].includes(option)}
              onChange={() => handleCheckboxChange(category, option)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('generateReportFilters')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XCircleIcon className="h-7 w-7" /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFilterSection(t('filterByClient'), 'clients', filterOptions.clients)}
            {renderFilterSection(t('filterByProjectName'), 'projectNames', filterOptions.projectNames)}
            {renderFilterSection(t('filterByStatus'), 'statuses', filterOptions.statuses.map(s => t(`status${s.replace(' ', '')}`)).map((s, i) => filterOptions.statuses[i]))}
            {renderFilterSection(t('filterByStaff'), 'staffNames', filterOptions.staffNames)}
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition duration-300">{t('cancel')}</button>
          <button onClick={() => onGenerate(filters)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">{t('applyFilters')}</button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilterModal;
