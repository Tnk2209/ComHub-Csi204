import React, { useState } from 'react';
import Landing from './pages/Landing/Landing';
import PCBuilder from './pages/PCBuilder/PCBuilder';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  const [currentPage, setCurrentPage] = useState('builder'); // Default to builder page as requested
  const [userRole, setUserRole] = useState('Admin'); // Simulation state for backoffice role: Admin | Staff | Manager
  const [activeMenu, setActiveMenu] = useState('products'); // Selected menu within dashboard

  // Simple Router renderer for page content only
  const renderPageContent = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onStartBuilding={() => setCurrentPage('builder')} onNavigate={setCurrentPage} />;
      case 'builder':
        return <PCBuilder onNavigate={setCurrentPage} />;
      
      // Simulation paths for backoffice dashboards
      case 'dashboard-admin':
        return (
          <div className="bg-app-surface border border-app-border p-6 rounded-lg">
            <h2 className="text-xl font-bold text-app-text mb-4">Admin Controls Dashboard</h2>
            <p className="text-app-text-muted">Manage database products CRUD and user access controls here.</p>
            <div className="mt-4 flex gap-4">
              <button onClick={() => { setUserRole('Staff'); setCurrentPage('dashboard-staff'); }} className="bg-brand-blue hover:opacity-90 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded text-sm cursor-pointer">
                Switch to Staff Dashboard
              </button>
              <button onClick={() => { setUserRole('Manager'); setCurrentPage('dashboard-manager'); }} className="bg-brand-blue hover:opacity-90 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded text-sm cursor-pointer">
                Switch to Manager Dashboard
              </button>
            </div>
          </div>
        );
      case 'dashboard-staff':
        return (
          <div className="bg-app-surface border border-app-border p-6 rounded-lg">
            <h2 className="text-xl font-bold text-app-text mb-4">Staff Assembly Dashboard</h2>
            <p className="text-app-text-muted">View assembly queue, print bills, and log thermal Burn-in tests.</p>
            <button onClick={() => { setUserRole('Admin'); setCurrentPage('dashboard-admin'); }} className="mt-4 bg-brand-blue hover:opacity-90 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded text-sm cursor-pointer">
              Back to Admin Panel
            </button>
          </div>
        );
      case 'dashboard-manager':
        return (
          <div className="bg-app-surface border border-app-border p-6 rounded-lg">
            <h2 className="text-xl font-bold text-app-text mb-4">Manager Business Dashboard</h2>
            <p className="text-app-text-muted">Analyze sales metrics, configure prebuilt templates, and moderate reviews.</p>
            <button onClick={() => { setUserRole('Admin'); setCurrentPage('dashboard-admin'); }} className="mt-4 bg-brand-blue hover:opacity-90 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded text-sm cursor-pointer">
              Back to Admin Panel
            </button>
          </div>
        );

      default:
        return <PCBuilder onNavigate={setCurrentPage} />;
    }
  };

  // Check if current route is a dashboard/backoffice page
  const isDashboardRoute = currentPage.startsWith('dashboard-');

  // Handle menu changes in Dashboard
  const handleSelectMenu = (menuId) => {
    if (menuId === 'home') {
      setCurrentPage('landing');
    } else if (menuId === 'products' || menuId === 'accounts' || menuId === 'payments') {
      setUserRole('Admin');
      setCurrentPage('dashboard-admin');
      setActiveMenu(menuId);
    } else if (menuId === 'queue' || menuId === 'burnin' || menuId === 'logistics') {
      setUserRole('Staff');
      setCurrentPage('dashboard-staff');
      setActiveMenu(menuId);
    } else if (menuId === 'dashboard' || menuId === 'templates' || menuId === 'moderation') {
      setUserRole('Manager');
      setCurrentPage('dashboard-manager');
      setActiveMenu(menuId);
    }
  };

  const handleLogout = () => {
    setCurrentPage('landing');
  };

  if (isDashboardRoute) {
    return (
      <DashboardLayout
        role={userRole}
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      >
        {renderPageContent()}
      </DashboardLayout>
    );
  }

  return (
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPageContent()}
    </MainLayout>
  );
}

export default App;

