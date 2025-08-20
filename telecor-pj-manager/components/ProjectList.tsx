import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { PlusIcon, PencilIcon, TrashIcon, DocumentReportIcon } from './common/Icons';
import ReportFilterModal from './ReportFilterModal';
import { ReportFilters } from '../services/pdfGenerator';

interface ProjectListProps {
  projects: Project[];
  onAddNew: () => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onGenerateReport: (filters: ReportFilters) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onAddNew, onEdit, onDelete, onGenerateReport }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const filteredProjects = projects.filter(p =>
    p['Nombre del Proyecto'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    p['ID Cliente'].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateFilteredReport = (filters: ReportFilters) => {
    onGenerateReport(filters);
    setIsReportModalOpen(false);
  }

  const reportFilterOptions = useMemo(() => {
    const clients = [...new Set(projects.map(p => p['ID Cliente']))];
    const projectNames = [...new Set(projects.map(p => p['Nombre del Proyecto']))];
    const statuses = [...new Set(projects.map(p => p['Status del Proyecto']))];
    const staffNames = [...new Set(projects.flatMap(p => p.resources.map(r => r['Nombre Completo Staff'])))];
    return { clients, projectNames, statuses, staffNames };
  }, [projects]);


  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('projects')}</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsReportModalOpen(true)}
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
              {t('addNewProject')}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder={t('searchProjects')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('idProject')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('client')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('projectName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('country')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <tr key={project['ID Proyecto']} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{project['ID Proyecto']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project['ID Cliente']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project['Nombre del Proyecto']}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ project['Status del Proyecto'] === 'Completado' ? 'bg-green-100 text-green-800' : project['Status del Proyecto'] === 'En Progreso' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {t(`status${project['Status del Proyecto'].replace(' ','')}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{project['Pais donde se ejecutara']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEdit(project)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"><PencilIcon className="h-5 w-5" /></button>
                        <button onClick={() => onDelete(project['ID Proyecto'])} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><TrashIcon className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('noProjects')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ReportFilterModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={handleGenerateFilteredReport}
        filterOptions={reportFilterOptions}
      />
    </>
  );
};

export default ProjectList;
