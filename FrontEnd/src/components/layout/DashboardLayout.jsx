import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const PATH_TO_MENU = {
  '/admin-dashboard': 'dashboard',
  '/admin-products': 'products',
  '/admin-accounts': 'accounts',
  '/admin-payment': 'payments',
  '/admin-orders': 'orders',
};

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu = PATH_TO_MENU[location.pathname] || 'dashboard';

  const handleNavigate = (page) => navigate(`/${page}`);

  const handleSelectMenu = (menuId) => {
    const routes = {
      dashboard: '/admin-dashboard',
      products: '/admin-products',
      accounts: '/admin-accounts',
      payments: '/admin-payment',
      orders: '/admin-orders',
      home: '/landing',
    };
    navigate(routes[menuId] || '/admin-dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans transition-colors">
      <Header currentPage="admin" onNavigate={handleNavigate} />
      <div className="flex flex-1">
        <Sidebar
          role={user?.role}
          activeMenu={activeMenu}
          onSelectMenu={handleSelectMenu}
          onLogout={handleLogout}
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
