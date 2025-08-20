import React, { useState, useEffect, useCallback } from 'react';
import { Staff } from '../types';
import { getStaff, saveStaff as saveStaffToService, deleteStaff as deleteStaffFromService } from '../services/staffService';
import { generateStaffReport } from '../services/staffPdfGenerator';
import StaffList from './staff/StaffList';
import StaffForm from './staff/StaffForm';
import { useLanguage } from '../hooks/useLanguage';
import Notification from './common/Notification';

type View = 'list' | 'form';

const StaffDatabaseApp: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { t } = useLanguage();

  const fetchStaff = useCallback(() => {
    setIsLoading(true);
    getStaff()
      .then(data => {
        setStaffList(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch staff:", err);
        setNotification({ message: t('fetchStaffError'), type: 'error' });
        setIsLoading(false);
      });
  }, [t]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleShowNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const handleAddNew = () => {
    setEditingStaff(null);
    setView('form');
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setView('form');
  };

  const handleCancel = () => {
    setEditingStaff(null);
    setView('list');
  };

  const handleSave = async (staff: Staff) => {
    try {
      await saveStaffToService(staff);
      handleShowNotification(t('staffSavedSuccess'));
      setView('list');
      fetchStaff(); // Refetch to get the latest data
    } catch (error) {
      console.error("Failed to save staff:", error);
      handleShowNotification(t('staffSavedError'), 'error');
    }
  };

  const handleDelete = async (staffId: string) => {
    if (window.confirm(t('confirmDeleteStaff'))) {
      try {
        await deleteStaffFromService(staffId);
        handleShowNotification(t('staffDeletedSuccess'));
        fetchStaff();
      } catch (error) {
        console.error("Failed to delete staff:", error);
        handleShowNotification(t('staffDeletedError'), 'error');
      }
    }
  };

  const handleGenerateReport = async () => {
    if (staffList.length === 0) {
      handleShowNotification(t('noStaff'), 'error');
      return;
    }
    try {
      await generateStaffReport(staffList, t);
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
            <StaffList
              staffList={staffList}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGenerateReport={handleGenerateReport}
            />
          )}
          {view === 'form' && (
            <StaffForm
              staffToEdit={editingStaff}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </>
  );
};

export default StaffDatabaseApp;
