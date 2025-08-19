import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { getProjects, saveProject as saveProjectToService, deleteProject as deleteProjectFromService } from '../services/sheetService';
import { generateReport, ReportFilters } from '../services/pdfGenerator';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import { useLanguage } from '../hooks/useLanguage';
import Notification from './common/Notification';

type View = 'list' | 'form';

const ProjectManagerApp: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { t } = useLanguage();

  const fetchProjects = useCallback(() => {
    setIsLoading(true);
    getProjects()
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
        setNotification({ message: t('fetchProjectsError'), type: 'error' });
        setIsLoading(false);
      });
  }, [t]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleShowNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const handleAddNew = () => {
    setEditingProject(null);
    setView('form');
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setView('form');
  };

  const handleCancel = () => {
    setEditingProject(null);
    setView('list');
  };

  const handleSave = async (project: Project) => {
    try {
      await saveProjectToService(project);
      handleShowNotification(t('projectSavedSuccess'));
      setView('list');
      fetchProjects(); // Refetch to get the latest data
    } catch (error) {
      console.error("Failed to save project:", error);
      handleShowNotification(t('projectSavedError'), 'error');
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm(t('confirmDeleteProject'))) {
      try {
        await deleteProjectFromService(projectId);
        handleShowNotification(t('projectDeletedSuccess'));
        fetchProjects();
      } catch (error) {
        console.error("Failed to delete project:", error);
        handleShowNotification(t('projectDeletedError'), 'error');
      }
    }
  };

  const handleGenerateReport = async (filters: ReportFilters) => {
    if (projects.length === 0) {
      handleShowNotification(t('noProjectsForReport'), 'error');
      return;
    }
    try {
      await generateReport(projects, t, filters);
      handleShowNotification(t('reportGeneratedSuccess'));
    } catch (error) {
      console.error("Failed to generate report:", error);
      handleShowNotification(t('reportGeneratedError'), 'error');
    }
  };

  return (
    <>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {view === 'list' && (
              <ProjectList
                projects={projects}
                onAddNew={handleAddNew}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onGenerateReport={handleGenerateReport}
              />
            )}
            {view === 'form' && (
              <ProjectForm
                projectToEdit={editingProject}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </>
        )}
    </>
  );
};

export default ProjectManagerApp;
