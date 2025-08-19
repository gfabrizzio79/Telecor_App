import { Project } from '../types';

const PROJECTS_STORAGE_KEY = 'telecorProjects';

/**
 * NOTE ON DATA PERSISTENCE:
 * This service uses the browser's localStorage to persist project data.
 * This allows the application to function offline and without a backend.
 */

const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsJSON = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return projectsJSON ? JSON.parse(projectsJSON) : [];
  } catch (error) {
    console.error("Failed to fetch projects from localStorage:", error);
    throw new Error("Failed to load projects. The data in localStorage might be corrupt.");
  }
};

const saveProject = async (project: Project): Promise<Project> => {
  if (!project) {
    throw new Error("Project data is missing.");
  }
  
  try {
    const projects = await getProjects();
    let projectToSave = { ...project };

    const existingIndex = projectToSave['ID Proyecto'] 
      ? projects.findIndex(p => p['ID Proyecto'] === projectToSave['ID Proyecto']) 
      : -1;

    let updatedProjects;
    if (existingIndex > -1) {
      // Use map for immutable update
      updatedProjects = projects.map(p => p['ID Proyecto'] === projectToSave['ID Proyecto'] ? projectToSave : p);
    } else {
      // Assign ID if it's a new project
      if (!projectToSave['ID Proyecto']) {
        projectToSave['ID Proyecto'] = `PROJ-${Date.now()}`;
      }
      // Use spread for immutable update
      updatedProjects = [...projects, projectToSave];
    }
    
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    return projectToSave;
  } catch (error) {
    console.error("Failed to save project to localStorage:", error);
    throw new Error("Failed to save project.");
  }
};


const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const projects = await getProjects();
    const newProjects = projects.filter(p => p['ID Proyecto'] !== projectId);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(newProjects));
  } catch (error) {
     console.error("Failed to delete project from localStorage:", error);
     throw new Error("Failed to delete project. Please try again.");
  }
};

export { getProjects, saveProject, deleteProject };