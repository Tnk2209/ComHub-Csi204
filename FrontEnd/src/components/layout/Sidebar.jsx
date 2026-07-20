import React from 'react';
import {
  LayoutDashboard,
  Database,
  Users,
  CreditCard,
  ShoppingBag,
  LogOut,
  Home
} from 'lucide-react';

function Sidebar({ role, activeMenu, onSelectMenu, onLogout }) {
  const getMenuItems = () => {
    switch (role) {
      case 'Admin':
        return [
          { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { id: 'products', name: 'Products CRUD', icon: Database },
          { id: 'accounts', name: 'Account Controls', icon: Users },
          { id: 'payments', name: 'Payment Review', icon: CreditCard },
          { id: 'orders', name: 'Order Management', icon: ShoppingBag },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-app-surface border-r border-app-border flex flex-col min-h-[calc(100vh-4rem)] transition-colors">
      {/* Role Indicator Banner */}
      <div className="p-4 border-b border-app-border bg-app-bg/50">
        <span className="text-xs text-app-text-muted uppercase tracking-wider block font-semibold">Logged in as</span>
        <span className="text-sm font-bold text-brand-blue">{role || 'User'}</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue'
                  : 'text-app-text-muted hover:bg-app-bg/50 hover:text-app-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation (Logout/Home) */}
      <div className="p-4 border-t border-app-border space-y-1">
        <button
          onClick={() => onSelectMenu('home')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-app-text-muted hover:bg-app-bg/50 hover:text-app-text cursor-pointer transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Store
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
