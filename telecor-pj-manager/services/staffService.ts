import { Staff } from '../types';

const STAFF_STORAGE_KEY = 'telecorStaff';
const AFP_STORAGE_KEY = 'telecorAfpOptions';

/**
 * NOTE ON DATA PERSISTENCE:
 * This service uses the browser's localStorage to persist staff data.
 * This allows the application to function offline and without a backend.
 */

// Centralized function to get raw data from localStorage
const _getRawStaff = (): Staff[] => {
  try {
    const staffJSON = localStorage.getItem(STAFF_STORAGE_KEY);
    return staffJSON ? JSON.parse(staffJSON) : [];
  } catch (error) {
    console.error("Error reading staff data from localStorage:", error);
    return []; // Return empty array on error to prevent crashes
  }
}

const getStaff = async (): Promise<Staff[]> => {
  const staffList = _getRawStaff();
  // Sorting is a presentation concern, do it here before returning.
  return staffList.sort((a, b) => a.apellidos.localeCompare(b.apellidos));
};

const saveStaff = async (staffMember: Staff): Promise<Staff> => {
  if (!staffMember) {
    throw new Error("Staff data is missing.");
  }

  const memberToSave = { ...staffMember, nombreCompleto: `${staffMember.nombres} ${staffMember.apellidos}`.trim() };

  try {
    const staffList = _getRawStaff();
    const existingIndex = staffList.findIndex(s => s.id === memberToSave.id);
    
    let updatedStaffList;
    if (existingIndex > -1) {
      // Use map for an immutable update
      updatedStaffList = staffList.map(s => s.id === memberToSave.id ? memberToSave : s);
    } else {
      // Use spread for an immutable update
      updatedStaffList = [...staffList, memberToSave];
    }
    
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedStaffList));
    return memberToSave;
  } catch (error) {
      console.error("Failed to save staff to localStorage:", error);
      throw new Error(`Failed to save staff member: ${error.message}`);
  }
};

const deleteStaff = async (staffId: string): Promise<void> => {
    try {
        const staffList = _getRawStaff();
        const newStaffList = staffList.filter(s => s.id !== staffId);
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(newStaffList));
    } catch(error) {
        console.error("Failed to delete staff from localStorage:", error);
        throw new Error('Failed to delete staff member. Please try again.');
    }
};

export const getAfpOptions = async (): Promise<string[]> => {
    try {
        const afpOptionsJSON = localStorage.getItem(AFP_STORAGE_KEY);
        if (afpOptionsJSON) {
            return JSON.parse(afpOptionsJSON);
        }
    } catch (error) {
        console.error("Failed to get AFP options from localStorage:", error);
    }
    // Fallback to local defaults if localStorage fails or is empty
    const defaultOptions = ['Confia', 'Crecer'];
    try {
        localStorage.setItem(AFP_STORAGE_KEY, JSON.stringify(defaultOptions));
    } catch(e) {
        console.error("Could not save initial AFP options to localStorage", e);
    }
    return defaultOptions;
}

export const addAfpOption = async (option: string): Promise<string[]> => {
    try {
        const currentOptions = await getAfpOptions();
        if (option && !currentOptions.includes(option)) {
            const newOptions = [...currentOptions, option];
            localStorage.setItem(AFP_STORAGE_KEY, JSON.stringify(newOptions));
            return newOptions;
        }
        return currentOptions;
    } catch (error) {
        console.error("Failed to add AFP option to localStorage:", error);
        throw error; // Re-throw to be handled by the component
    }
}


export { getStaff, saveStaff, deleteStaff };