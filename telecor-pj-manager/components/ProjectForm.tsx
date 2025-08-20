// Arriba de todo en ProjectForm.tsx
import { db } from '../services/firebase'; // O la ruta correcta a tu archivo de config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { Project, Resource } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import AssignResourceModal from './AssignResourceModal';
import { UserGroupIcon, TrashIcon, MagicIcon } from './common/Icons';
import { getCountries, addCountry } from '../utils/countries';
import AddCountryModal from './common/AddCountryModal';
import { generateDescription } from '../../services/geminiService';

const generateClientId = (): string => {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${month}${year}-${randomPart}`;
};

interface ProjectFormProps {
  projectToEdit: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const initialProjectState: Omit<Project, 'ID Proyecto'> = {
  'ID Cliente': '',
  'Nombre del Proyecto': '',
  'Descripcion del Servicio': '',
  'Pais donde se ejecutara': '',
  'Monto del Proyecto': null,
  'Status del Proyecto': 'Planificado',
  'Fecha Inicio': '',
  'Fecha Fin': '',
  'PMO del Cliente': '',
  resources: [],
};

const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [project, setProject] = useState<Project | Omit<Project, 'ID Proyecto'>>(initialProjectState);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isAddCountryModalOpen, setIsAddCountryModalOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setCountries(getCountries());
    if (projectToEdit) {
      setProject(projectToEdit);
    } else {
      setProject({
          ...initialProjectState, 
          'ID Cliente': generateClientId(),
          'Pais donde se ejecutara': getCountries()[0] || ''
      });
    }
  }, [projectToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'Monto del Proyecto') {
        setProject(prev => ({ ...prev, [name]: value === '' ? null : parseFloat(value) }));
    } else {
        setProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === 'Other') {
      setIsAddCountryModalOpen(true);
    } else {
      setProject(prev => ({ ...prev, 'Pais donde se ejecutara': value }));
    }
  };

  const handleAddNewCountry = (newCountry: string) => {
    const updatedCountries = addCountry(newCountry);
    setCountries(updatedCountries);
    setProject(prev => ({...prev, 'Pais donde se ejecutara': newCountry}));
    setIsAddCountryModalOpen(false);
  }

  c// REEMPLAZA TU FUNCIÓN handleSave CON ESTA:
const handleSave = async (e: React.FormEvent) => { // 1. La convertimos en async
  e.preventDefault();

  try {
    // 2. Añadimos la lógica para guardar en Firestore
    // Usamos la variable "project" que ya tienes en tu componente
    await addDoc(collection(db, "proyectos"), {
      ...project, // Esto copia todos los datos del proyecto actual
      fechaCreacion: serverTimestamp() // Le añade la fecha de creación del servidor
    });

    alert("¡Proyecto guardado en la base de datos!");

    // 3. Mantenemos esta línea para que la interfaz se actualice como antes
    onSave(project as Project);

  } catch (err) {
    console.error("Error al guardar en Firestore: ", err);
    alert("Hubo un error al guardar el proyecto.");
  }
};
  
  const handleResourceConfirm = (newResources: Resource[]) => {
    setProject(prev => ({ ...prev, resources: newResources }));
    setIsResourceModalOpen(false);
  };

  const removeResource = (resourceId: string) => {
    setProject(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== resourceId) }));
  }
  
  const handleGenerateDescription = async () => {
    if (!project['Nombre del Proyecto'].trim()) {
        alert(t('projectNameRequiredForAI'));
        return;
    }
    setIsGenerating(true);
    try {
        const description = await generateDescription(project['Nombre del Proyecto']);
        setProject(prev => ({ ...prev, 'Descripcion del Servicio': description }));
    } catch (error) {
        console.error(error);
        alert(t('generateDescriptionError'));
    } finally {
        setIsGenerating(false);
    }
  };

  const statusOptions: Project['Status del Proyecto'][] = ['Planificado', 'En Progreso', 'Completado', 'En Pausa'];

  return (
    <>
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {projectToEdit ? t('editProject') : t('newProject')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <InputField label={t('idClient')} name="ID Cliente" value={project['ID Cliente']} onChange={handleChange} required readonly />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('idClientHelpText')}</p>
            </div>
            <InputField label={t('projectName')} name="Nombre del Proyecto" value={project['Nombre del Proyecto']} onChange={handleChange} required />
            <div className="md:col-span-2">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('serviceDescription')}</label>
                     <button 
                        type="button" 
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-wait"
                    >
                        <MagicIcon className="h-4 w-4" />
                        {isGenerating ? t('generatingDescription') : t('generateWithAI')}
                    </button>
                </div>
                <textarea name="Descripcion del Servicio" value={project['Descripcion del Servicio']} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('countryOfExecution')}</label>
              <select name="Pais donde se ejecutara" value={project['Pais donde se ejecutara']} onChange={handleCountryChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                {countries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                <option value="Other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('projectAmount')}</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input name="Monto del Proyecto" type="number" value={project['Monto del Proyecto'] ?? ''} onChange={handleChange} required className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-7" step="any" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('projectStatus')}</label>
              <select name="Status del Proyecto" value={project['Status del Proyecto']} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                {statusOptions.map(opt => <option key={opt} value={opt}>{t(`status${opt.replace(' ', '')}`)}</option>)}
              </select>
            </div>
            <InputField label={t('clientPMO')} name="PMO del Cliente" value={project['PMO del Cliente']} onChange={handleChange} required />
            <InputField label={t('startDate')} name="Fecha Inicio" type="date" value={project['Fecha Inicio']} onChange={handleChange} required />
            <InputField label={t('endDate')} name="Fecha Fin" type="date" value={project['Fecha Fin']} onChange={handleChange} />
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('assignedResources')}</h3>
                <button type="button" onClick={() => setIsResourceModalOpen(true)} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    <UserGroupIcon className="h-5 w-5" />
                    {t('assignResource')}
                </button>
            </div>
            <div className="mt-4 space-y-2">
                {project.resources.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {project.resources.map(res => (
                        <li key={res.id} className="py-2 flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">{res['Nombre Completo Staff']} ({res['Rol Staff']})</span>
                        <button type="button" onClick={() => removeResource(res.id)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="h-5 w-5"/>
                        </button>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('noProjects')}</p> /* This is misusing noProjects, but it's what was there */
                )}
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition duration-300">
            {t('cancel')}
          </button>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            {t('save')}
          </button>
        </div>
      </form>

      <AssignResourceModal 
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onConfirm={handleResourceConfirm}
        existingResources={project.resources}
      />

      <AddCountryModal
        isOpen={isAddCountryModalOpen}
        onClose={() => setIsAddCountryModalOpen(false)}
        onSave={handleAddNewCountry}
      />
    </>
  );
};

interface InputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    readonly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', required = false, readonly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} readOnly={readonly} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm read-only:bg-gray-100 read-only:cursor-not-allowed dark:read-only:bg-gray-600" />
    </div>
);


export default ProjectForm;
