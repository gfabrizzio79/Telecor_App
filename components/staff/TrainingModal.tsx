import React, { useState, useEffect, ChangeEvent } from 'react';
import { Training, NivelOption } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { UploadIcon, TrashIcon, XCircleIcon } from '../common/Icons';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (trainings: Training[]) => void;
  existingTrainings: Training[];
  staffName: string;
}

const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, onConfirm, existingTrainings, staffName }) => {
  const { t } = useLanguage();
  const [trainings, setTrainings] = useState<Training[]>([]);
  
  const nivelOptions: NivelOption[] = ['Bachillerato', 'Universitario', 'Postgrado', 'Diplomado', 'Capacitacion', 'Certificacion'];

  useEffect(() => {
    if (isOpen) {
      setTrainings([...existingTrainings]);
    }
  }, [isOpen, existingTrainings]);

  if (!isOpen) return null;

  const updateTraining = (id: string, field: keyof Training, value: any) => {
    setTrainings(prev => prev.map(tr => tr.id === id ? { ...tr, [field]: value } : tr));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTraining(id, 'archivo', reader.result as string);
        updateTraining(id, 'fileName', file.name);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addEmptyTraining = () => {
    const newTraining: Training = {
      id: `tr-${Date.now()}`,
      nombreCurso: '',
      nivel: '',
      archivo: null,
      fileName: null,
    };
    setTrainings(prev => [...prev, newTraining]);
  }

  const removeTraining = (id: string) => {
    setTrainings(prev => prev.filter(tr => tr.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('trainingsFor')} {staffName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XCircleIcon className="h-7 w-7" /></button>
        </div>

        <div className="p-4 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button onClick={addEmptyTraining} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                {t('addTraining')}
              </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('courseName')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('level')}</th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('addFile')}</th>
                            <th className="px-2 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {trainings.map((tr) => (
                        <tr key={tr.id}>
                            <td><input type="text" value={tr.nombreCurso} onChange={(e) => updateTraining(tr.id, 'nombreCurso', e.target.value)} className="w-full bg-transparent p-1 border-b-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500"/></td>
                            <td>
                                <select value={tr.nivel} onChange={(e) => updateTraining(tr.id, 'nivel', e.target.value)} className="w-full bg-transparent p-1 border-b-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:[color-scheme:dark]">
                                    <option value="">{t('selectLevel')}</option>
                                    {nivelOptions.map(opt => <option key={opt} value={opt}>{t(opt.toLowerCase() as any)}</option>)}
                                </select>
                            </td>
                            <td>
                                <input type="file" id={`file-${tr.id}`} onChange={(e) => handleFileChange(e, tr.id)} className="hidden"/>
                                <label htmlFor={`file-${tr.id}`} className="cursor-pointer text-blue-500 hover:underline text-sm">
                                    {tr.fileName || t('addFile')}
                                </label>
                            </td>
                            <td><button onClick={() => removeTraining(tr.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="h-5 w-5"/></button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition duration-300">{t('close')}</button>
          <button onClick={() => onConfirm(trainings)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">{t('save')}</button>
        </div>
      </div>
    </div>
  );
};

export default TrainingModal;
