import React, { useState } from 'react';
import Header from './components/Header';
import ProjectManagerApp from './components/ProjectManagerApp';
import StaffDatabaseApp from './components/StaffDatabaseApp';
import { useLanguage } from './hooks/useLanguage';


const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<'projects' | 'staff'>('projects');
  const { language } = useLanguage(); // To force re-render on lang change

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans" key={language}>
       <Header currentApp={currentApp} setCurrentApp={setCurrentApp} />
       <main className="container mx-auto p-4 md:p-8">
        {currentApp === 'projects' && <ProjectManagerApp />}
        {currentApp === 'staff' && <StaffDatabaseApp />}
      </main>
       <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; 2024 Telecor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
