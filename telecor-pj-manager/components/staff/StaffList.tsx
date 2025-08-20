import React, { useState } from 'react';
import { Staff } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { PlusIcon, PencilIcon, TrashIcon, DocumentReportIcon } from '../common/Icons';

interface StaffListProps {
  staffList: Staff[];
  onAddNew: () => void;
  onEdit: (staff: Staff) => void;
  onDelete: (staffId: string) => void;
  onGenerateReport: () => void;
}

const StaffList: React.FC<StaffListProps> = ({ staffList, onAddNew, onEdit, onDelete, onGenerateReport }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staffList.filter(s =>
    s.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rolDePj.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.dui.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('staff')}</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={onGenerateReport}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            <DocumentReportIcon className="h-5 w-5" />
            {t('generateReport')}
          </button>
          <button
            onClick={onAddNew}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            {t('addNewStaff')}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('searchStaff')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('photo')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('fullName')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('pjRole')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('phone')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('email')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStaff.length > 0 ? (
              filteredStaff.map(staff => (
                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <img src={staff.foto || 'https://via.placeholder.com/40'} alt={staff.nombreCompleto} className="h-10 w-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{staff.nombreCompleto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.rolDePj}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                        <button onClick={() => onEdit(staff)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"><PencilIcon className="h-5 w-5" /></button>
                        <button onClick={() => onDelete(staff.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('noStaff')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
