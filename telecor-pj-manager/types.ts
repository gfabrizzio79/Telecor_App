export interface Resource {
  id: string;
  staffId: string; // Link to the Staff member
  'Rol Staff': string;
  'Nombre Completo Staff': string;
  'Fecha Inicio': string;
  'Fecha Fin': string;
  'Dias Laborados': number;
  'Salario Mensual': number | null;
  'Monto a pagar por Dias': number;
}

export interface Project {
  'ID Proyecto': string;
  'ID Cliente': string;
  'Nombre del Proyecto': string;
  'Descripcion del Servicio': string;
  'Pais donde se ejecutara': string;
  'Monto del Proyecto': number | null;
  'Status del Proyecto': 'Planificado' | 'En Progreso' | 'Completado' | 'En Pausa';
  'Fecha Inicio': string;
  'Fecha Fin': string;
  'PMO del Cliente': string;
  resources: Resource[];
}

// Types for the new Staff Database App

export type AfpOption = "Confia" | "Crecer" | string;
export type NivelOption = 'Bachillerato' | 'Universitario' | 'Postgrado' | 'Diplomado' | 'Capacitacion' | 'Certificacion';
export type PuestoOption = 'Gerente' | 'Supervisor' | 'Team Leader' | 'Tecnico' | 'Motorista' | 'Analista de Ingenieria';
export type RolPjOption = 'Gerente' | 'Field Supervisor' | 'Administracion' | 'Técnico Rigger' | 'Analista de Ingenieria' | 'Team Leader' | 'Técnico Cableado Estructurado' | 'Motorista' | 'PMO';

export interface Training {
  id: string;
  nombreCurso: string;
  nivel: NivelOption | '';
  archivo: string | null; // base64 representation or a URL
  fileName: string | null;
}

export interface Staff {
  id: string;
  nacionalidad: string;
  dui: string;
  foto: string | null; // base64 representation of the image
  nombres: string;
  apellidos: string;
  rolDePj: RolPjOption | '';
  nombreCompleto: string; // Calculated field
  pais: string;
  departamento: string;
  distrito: string;
  municipio: string;
  direccionCompleta: string;
  fechaNacimiento: string;
  telefono: string;
  salarioMensual: number | null;
  afp: AfpOption | '';
  numeroAfp: string;
  numeroIsss: string;
  pasaporte: string;
  user: string;
  contrasena: string;
  email: string;
  especialidad: string[];
  puestoDeTrabajo: PuestoOption | '';
  anosExperiencia: number | null;
  personaContacto: string;
  telefonoContacto: string;
  esAlergico: 'si' | 'no' | '';
  detalleAlergias: string;
  vacunaFiebreAmarilla: 'si' | 'no' | '';
  tieneTrainings: 'si' | 'no' | '';
  trainings: Training[];
  autorizadoOperadoras: 'si' | 'no' | '';
  esConductor: 'si' | 'no' | '';
  licenciaConducir: string;
}
