import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function DashboardLayout({ 
  children, 
  role, 
  activeMenu, 
  onSelectMenu, 
  onLogout, 
  currentPage, 
  onNavigate 
}) {
  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans transition-colors">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex flex-1">
        <Sidebar 
          role={role} 
          activeMenu={activeMenu} 
          onSelectMenu={onSelectMenu} 
          onLogout={onLogout} 
        />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
