
import React from 'react';
import { XCircleIcon } from './Icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const baseClasses = "fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className="flex-grow">{message}</span>
      <button onClick={onClose} className="ml-4">
        <XCircleIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Notification;