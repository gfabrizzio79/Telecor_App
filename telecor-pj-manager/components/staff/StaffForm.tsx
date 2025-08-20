// al principio del archivo
import { db } from '../../services/firebase'; // <-- Verifica esta ruta
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Staff, Training, AfpOption, PuestoOption, RolPjOption } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getAfpOptions, addAfpOption } from '../../services/staffService';
import TrainingModal from './TrainingModal';
import AddAfpModal from './AddAfpModal';
import { UserGroupIcon, TrashIcon, PlusIcon } from '../common/Icons';


const generateStaffId = (): string => `staff-${Date.now()}`;

interface StaffFormProps {
  staffToEdit: Staff | null;
  onSave: (staff: Staff) => void;
  onCancel: () => void;
}

const initialStaffState: Staff = {
  id: '',
  nacionalidad: '',
  dui: '',
  foto: null,
  nombres: '',
  apellidos: '',
  rolDePj: '',
  nombreCompleto: '',
  pais: '',
  departamento: '',
  distrito: '',
  municipio: '',
  direccionCompleta: '',
  fechaNacimiento: '',
  telefono: '',
  salarioMensual: null,
  afp: '',
  numeroAfp: '',
  numeroIsss: '',
  pasaporte: '',
  user: '',
  contrasena: '',
  email: '',
  especialidad: [],
  puestoDeTrabajo: '',
  anosExperiencia: null,
  personaContacto: '',
  telefonoContacto: '',
  esAlergico: '',
  detalleAlergias: '',
  vacunaFiebreAmarilla: '',
  tieneTrainings: '',
  trainings: [],
  autorizadoOperadoras: '',
  esConductor: '',
  licenciaConducir: '',
};


const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);

const FormField: React.FC<{ label: string; name: string; value: string | number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; readonly?: boolean; colSpan?: string; helpText?: string; children?: React.ReactNode }> =
({ label, name, value, onChange, type = 'text', required = false, readonly = false, colSpan = 'md:col-span-1', helpText, children }) => (
    <div className={colSpan}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {children || <input id={name} name={name} type={type} value={value ?? ''} onChange={onChange} required={required} readOnly={readonly} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm read-only:bg-gray-100 read-only:cursor-not-allowed dark:read-only:bg-gray-600" />}
        {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
);

const SelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: {value: string, label: string}[]; required?: boolean; colSpan?: string; helpText?: string;}> =
({label, name, value, onChange, options, required, colSpan = 'md:col-span-1', helpText}) => (
    <div className={colSpan}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
)


const StaffForm: React.FC<StaffFormProps> = ({ staffToEdit, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [staff, setStaff] = useState<Staff>(initialStaffState);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isAddAfpModalOpen, setIsAddAfpModalOpen] = useState(false);
  const [afpOptions, setAfpOptions] = useState<AfpOption[]>([]);
  
  const rolPjOptions: RolPjOption[] = ['Gerente', 'Field Supervisor', 'Administracion', 'Técnico Rigger', 'Analista de Ingenieria', 'Team Leader', 'Técnico Cableado Estructurado', 'Motorista', 'PMO'];
  const puestoOptions: PuestoOption[] = ['Gerente', 'Supervisor', 'Team Leader', 'Tecnico', 'Motorista', 'Analista de Ingenieria'];
  const especialidadOptions = ['Fibra Optica' , 'Cableado y Estructurado' , 'FW/SW/AP/Configuration' , 'Technical Support', 'MW - Team Leader' , 'MW - Rigger' , 'MW - Commissioning' , 'MW - Testing' , 'RBS - Rigger' , 'RBS - Commissioning' , 'RBS - Testing' , 'RBS - Team Leader', 'Drive Testing' , 'DC Power',  'Diseño e Ingeniería de Proyectos', 'Management', 'Driver'];


  useEffect(() => {
    const fetchAfpOptions = async () => {
        setAfpOptions(await getAfpOptions());
    };
    fetchAfpOptions();

    if (staffToEdit) {
      setStaff(staffToEdit);
    } else {
      setStaff({
          ...initialStaffState, 
          id: generateStaffId()
      });
    }
  }, [staffToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
         setStaff(prev => ({ ...prev, [name]: value === '' ? null : parseFloat(value) }));
    } else {
        setStaff(prev => ({...prev, [name]: value}));
    }
  };

  const handleMultiSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            value.push(options[i].value);
        }
    }
    setStaff(prev => ({...prev, [name]: value}));
  };

  const handleAfpChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'Other') {
        setIsAddAfpModalOpen(true);
    } else {
        setStaff(prev => ({...prev, afp: e.target.value}));
    }
  };

  const handleAddNewAfp = async (newAfp: string) => {
    try {
        const updatedAfps = await addAfpOption(newAfp);
        setAfpOptions(updatedAfps);
        setStaff(prev => ({...prev, afp: newAfp}));
        setIsAddAfpModalOpen(false);
    } catch (error) {
        console.error("Failed to add new AFP option:", error);
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setStaff(prev => ({ ...prev, foto: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => { // La convertimos en async
  e.preventDefault();

  // Mantenemos tu lógica para crear el nombre completo
  const finalStaff = {
      ...staff,
      nombreCompleto: `${staff.nombres} ${staff.apellidos}`.trim()
  };

  try {
    // Añadimos la lógica para guardar en Firestore
    await addDoc(collection(db, "staff"), { // Usaremos la colección "staff"
      ...finalStaff,
      fechaCreacion: serverTimestamp() // Añadimos una fecha de creación
    });

    alert("¡Miembro del staff guardado en la base de datos!");

    // Mantenemos la llamada a onSave para que la interfaz se actualice
    onSave(finalStaff);

  } catch (err) {
    console.error("Error al guardar en Firestore: ", err);
    alert("Hubo un error al guardar el registro.");
  }
};
  
  const handleTrainingConfirm = (newTrainings: Training[]) => {
    setStaff(prev => ({ ...prev, trainings: newTrainings }));
    setIsTrainingModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {staffToEdit ? t('editStaff') : t('newStaff')}
        </h2>
        
        {/* --- PERSONAL INFORMATION --- */}
        <Section title={t('personalInformation')}>
            <FormField label={t('id')} name="id" value={staff.id} onChange={handleChange} readonly helpText={t('idHelpText')} />
            <FormField label={t('firstName')} name="nombres" value={staff.nombres} onChange={handleChange} required />
            <FormField label={t('lastName')} name="apellidos" value={staff.apellidos} onChange={handleChange} required />
            <FormField label={t('fullName')} name="nombreCompleto" value={`${staff.nombres} ${staff.apellidos}`.trim()} onChange={() => {}} readonly helpText={t('fullNameHelpText')} />
            <FormField label={t('nationality')} name="nacionalidad" value={staff.nacionalidad} onChange={handleChange} />
            <FormField label={t('employeeDUI')} name="dui" value={staff.dui} onChange={handleChange} />
             <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('photo')}</label>
                <div className="mt-1 flex items-center gap-4">
                    {staff.foto && <img src={staff.foto} alt="Staff" className="h-16 w-16 rounded-full object-cover"/>}
                    <input type="file" id="photo-upload" name="foto" onChange={handleFileChange} accept="image/*" className="hidden" />
                    <label htmlFor="photo-upload" className="cursor-pointer bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-200">{t('uploadPhoto')}</label>
                    {staff.foto && <button type="button" onClick={() => setStaff(p => ({...p, foto: null}))} className="text-red-500 text-sm">{t('removePhoto')}</button>}
                </div>
            </div>
        </Section>
        
        {/* --- LOCATION --- */}
        <Section title={t('locationInformation')}>
            <FormField label={t('country')} name="pais" value={staff.pais} onChange={handleChange} />
            <FormField label={t('department')} name="departamento" value={staff.departamento} onChange={handleChange} />
            <FormField label={t('district')} name="distrito" value={staff.distrito} onChange={handleChange} />
            <FormField label={t('municipality')} name="municipio" value={staff.municipio} onChange={handleChange} />
            <FormField label={t('fullAddress')} name="direccionCompleta" value={staff.direccionCompleta} onChange={handleChange} colSpan="md:col-span-2 lg:col-span-3"/>
        </Section>
        
        {/* --- CONTACT --- */}
        <Section title={t('contactInformation')}>
            <FormField label={t('birthDate')} name="fechaNacimiento" value={staff.fechaNacimiento} onChange={handleChange} type="date" />
            <FormField label={t('phone')} name="telefono" value={staff.telefono} onChange={handleChange} type="tel" />
            <FormField label={t('email')} name="email" value={staff.email} onChange={handleChange} type="email" />
            <FormField label={t('contactPerson')} name="personaContacto" value={staff.personaContacto} onChange={handleChange} />
            <FormField label={t('contactPhone')} name="telefonoContacto" value={staff.telefonoContacto} onChange={handleChange} type="tel" />
        </Section>

        {/* --- PROFESSIONAL --- */}
        <Section title={t('professionalInformation')}>
            <SelectField label={t('pjRole')} name="rolDePj" value={staff.rolDePj} onChange={handleChange} options={[{value:'', label:t('selectRole')}, ...rolPjOptions.map(o => ({value:o, label:o}))]} />
            <SelectField label={t('jobPosition')} name="puestoDeTrabajo" value={staff.puestoDeTrabajo} onChange={handleChange} options={[{value:'', label:t('selectRole')}, ...puestoOptions.map(o => ({value:o, label:o}))]} />
            <FormField label={t('yearsOfExperience')} name="anosExperiencia" value={staff.anosExperiencia ?? ''} onChange={handleChange} type="number" />
            <FormField label={t('monthlySalaryLabel')} name="salarioMensual" value={staff.salarioMensual ?? ''} onChange={handleChange} type="number" />
            <FormField label={t('afp')} name="afp" value={staff.afp} onChange={() => {}} colSpan="md:col-span-1">
                <select id="afp" name="afp" value={staff.afp} onChange={handleAfpChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="">--</option>
                    {afpOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    <option value="Other">{t('other')}</option>
                </select>
            </FormField>
            <FormField label={t('afpNumber')} name="numeroAfp" value={staff.numeroAfp} onChange={handleChange} />
            <FormField label={t('isssNumber')} name="numeroIsss" value={staff.numeroIsss} onChange={handleChange} />
            <FormField label={t('passport')} name="pasaporte" value={staff.pasaporte} onChange={handleChange} />
            <FormField label={t('user')} name="user" value={staff.user} onChange={handleChange} />
            <FormField label={t('password')} name="contrasena" value={staff.contrasena} onChange={handleChange} type="password" />
            <div className="md:col-span-2 lg:col-span-3">
                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('specialty')}</label>
                 <select id="especialidad" name="especialidad" multiple value={staff.especialidad} onChange={handleMultiSelectChange} className="mt-1 block w-full h-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    {especialidadOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('specialtiesHelp')}</p>
            </div>
        </Section>
        
        {/* --- HEALTH & QUALIFICATIONS --- */}
        <Section title={t('healthAndSafety')}>
            <SelectField label={t('isAllergic')} name="esAlergico" value={staff.esAlergico} onChange={handleChange} options={[{value:'',label:'--'},{value:'si',label:t('yes')},{value:'no',label:t('no')}]} />
            {staff.esAlergico === 'si' && <FormField label={t('allergyDetails')} name="detalleAlergias" value={staff.detalleAlergias} onChange={handleChange} colSpan="md:col-span-2"/>}
            <SelectField label={t('yellowFeverVaccine')} name="vacunaFiebreAmarilla" value={staff.vacunaFiebreAmarilla} onChange={handleChange} options={[{value:'',label:'--'},{value:'si',label:t('yes')},{value:'no',label:t('no')}]} />
             <SelectField label={t('isDriver')} name="esConductor" value={staff.esConductor} onChange={handleChange} options={[{value:'',label:'--'},{value:'si',label:t('yes')},{value:'no',label:t('no')}]} />
            {staff.esConductor === 'si' && <FormField label={t('driverLicense')} name="licenciaConducir" value={staff.licenciaConducir} onChange={handleChange} />}
            <SelectField label={t('operatorAuthorized')} name="autorizadoOperadoras" value={staff.autorizadoOperadoras} onChange={handleChange} options={[{value:'',label:'--'},{value:'si',label:t('yes')},{value:'no',label:t('no')}]} />
            <div className="md:col-span-3 border-t dark:border-gray-700 pt-4 mt-4">
                 <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('hasTrainings')}</h4>
                    <button type="button" onClick={() => setIsTrainingModalOpen(true)} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        <PlusIcon className="h-5 w-5" />
                        {t('manageTrainings')}
                    </button>
                </div>
                 <ul className="mt-2 space-y-1">
                    {staff.trainings.map(t => <li key={t.id} className="text-sm dark:text-gray-300">{t.nombreCurso} ({t.nivel})</li>)}
                 </ul>
            </div>
        </Section>

        {/* --- ACTIONS --- */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition duration-300">
            {t('cancel')}
          </button>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            {t('save')}
          </button>
        </div>
      </form>

      <TrainingModal 
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        onConfirm={handleTrainingConfirm}
        existingTrainings={staff.trainings}
        staffName={staff.nombreCompleto}
      />
      
      <AddAfpModal 
        isOpen={isAddAfpModalOpen}
        onClose={() => setIsAddAfpModalOpen(false)}
        onSave={handleAddNewAfp}
      />
    </>
  );
};

export default StaffForm;