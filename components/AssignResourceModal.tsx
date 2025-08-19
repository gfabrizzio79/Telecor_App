import React, { useState, useEffect } from 'react';
import { Resource, Staff } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { TrashIcon, XCircleIcon } from './common/Icons';
import { formatCurrency } from '../utils/formatting';
import { getStaff } from '../services/staffService';


interface AssignResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resources: Resource[]) => void;
  existingResources: Resource[];
}

const calculateWorkingDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) return 0;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

const calculateAmountToPay = (workingDays: number, monthlySalary: number | null): number => {
  if (!monthlySalary || monthlySalary <= 0 || workingDays <= 0) return 0;
  return (workingDays * monthlySalary) / 30;
};

const AssignResourceModal: React.FC<AssignResourceModalProps> = ({ isOpen, onClose, onConfirm, existingResources }) => {
  const { t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setResources([...existingResources]);
      getStaff().then(setAllStaff).catch(err => console.error(err));
    }
  }, [isOpen, existingResources]);

  if (!isOpen) return null;

  const handleDateChange = (id: string, field: 'Fecha Inicio' | 'Fecha Fin', value: string) => {
    setResources(prev =>
      prev.map(res => {
        if (res.id === id) {
          const updatedRes = { ...res, [field]: value };
          updatedRes['Dias Laborados'] = calculateWorkingDays(updatedRes['Fecha Inicio'], updatedRes['Fecha Fin']);
          updatedRes['Monto a pagar por Dias'] = calculateAmountToPay(updatedRes['Dias Laborados'], updatedRes['Salario Mensual']);
          return updatedRes;
        }
        return res;
      })
    );
  };
  
  const addResource = () => {
    if (!selectedStaffId) return;
    const staffMember = allStaff.find(s => s.id === selectedStaffId);
    if (!staffMember) return;

    // Prevent adding the same staff member twice
    if (resources.some(res => res.staffId === staffMember.id)) {
        alert("This staff member is already assigned to the project.");
        return;
    }

    const newResource: Resource = {
      id: `res-${Date.now()}`,
      staffId: staffMember.id,
      'Rol Staff': staffMember.rolDePj,
      'Nombre Completo Staff': staffMember.nombreCompleto,
      'Salario Mensual': staffMember.salarioMensual,
      'Fecha Inicio': '',
      'Fecha Fin': '',
      'Dias Laborados': 0,
      'Monto a pagar por Dias': 0,
    };
    setResources(prev => [...prev, newResource]);
    setSelectedStaffId('');
  }

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(res => res.id !== id));
  };

  const availableStaff = allStaff.filter(staff => !resources.some(res => res.staffId === staff.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('assignResourcesToProject')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XCircleIcon className="h-7 w-7" /></button>
        </div>

        <div className="p-4 overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
               <select 
                 value={selectedStaffId} 
                 onChange={e => setSelectedStaffId(e.target.value)}
                 className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               >
                    <option value="">{t('selectAStaff')}</option>
                    {availableStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.nombreCompleto}</option>
                    ))}
               </select>
              <button onClick={addResource} disabled={!selectedStaffId} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {t('assignResource')}
              </button>
            </div>
            {allStaff.length === 0 && <p className="text-yellow-500 text-sm mb-4">{t('noStaffAvailable')}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('staffFullName')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('staffRole')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('monthlySalary')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('startDate')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('endDate')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('workingDays')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('amountToPay')}</th>
                            <th className="px-2 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {resources.map((res) => (
                        <tr key={res.id}>
                            <td className="px-2 py-2 text-sm">{res['Nombre Completo Staff']}</td>
                            <td className="px-2 py-2 text-sm">{res['Rol Staff']}</td>
                            <td className="px-2 py-2 text-sm">{formatCurrency(res['Salario Mensual'])}</td>
                            <td><input type="date" value={res['Fecha Inicio']} onChange={(e) => handleDateChange(res.id, 'Fecha Inicio', e.target.value)} className="w-36 bg-transparent p-1 border-b-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500"/></td>
                            <td><input type="date" value={res['Fecha Fin']} onChange={(e) => handleDateChange(res.id, 'Fecha Fin', e.target.value)} className="w-36 bg-transparent p-1 border-b-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500"/></td>
                            <td className="px-2 py-2 text-center text-sm">{res['Dias Laborados']}</td>
                            <td className="px-2 py-2 text-center text-sm">{formatCurrency(res['Monto a pagar por Dias'])}</td>
                            <td><button onClick={() => removeResource(res.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="h-5 w-5"/></button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition duration-300">{t('close')}</button>
          <button onClick={() => onConfirm(resources)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">{t('addResources')}</button>
        </div>
      </div>
    </div>
  );
};

export default AssignResourceModal;
