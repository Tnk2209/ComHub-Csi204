import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Menu, X, ShoppingCart, Heart, Package, Home, Wrench, ShoppingBag, User, LogOut, Shield } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguagePicker from './LanguagePicker';
import { useAuth } from '../../contexts/AuthContext';

function Header({ currentPage, onNavigate }) {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Grouped navigation with icons
  const navGroups = [
    {
      id: 'home',
      icon: Home,
      label: t('nav.home'),
      pages: ['landing']
    },
    {
      id: 'builder',
      icon: Wrench,
      label: t('nav.builder'),
      pages: ['builder']
    },
    {
      id: 'shop',
      icon: ShoppingBag,
      label: t('nav.shop'),
      pages: ['catalog', 'product', 'wishlist', 'cart']
    },
    {
      id: 'orders',
      icon: Package,
      label: t('nav.orders'),
      pages: ['order-tracking']
    },
  ];

  const isActive = (pages) => pages.includes(currentPage);

  return (
    <header className="ios-glass sticky top-0 z-50 transition-all">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left Side: Brand Logo */}
        <div className="flex items-center flex-shrink-0">
          <span
            onClick={() => onNavigate('landing')}
            className="text-xl font-semibold tracking-wider text-blue cursor-pointer hover:opacity-85 transition-opacity"
          >
            ComHub
          </span>
        </div>

        {/* Center: Grouped Navigation (Desktop) — hidden for Admin */}
        {user?.role !== 'Admin' && (
        <nav className="hidden md:flex items-center gap-1">
          {navGroups.map((group) => {
            const Icon = group.icon;
            const active = isActive(group.pages);

            return (
              <button
                key={group.id}
                onClick={() => onNavigate(group.pages[0])}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'text-blue bg-blue/10 font-semibold'
                    : 'text-text-secondary hover:text-blue hover:bg-bg-secondary'
                }`}
                title={group.label}
              >
                <Icon className="w-4 h-4" />
                <span>{group.label}</span>
              </button>
            );
          })}
        </nav>
        )}

        {/* Right Side: Icons & Auth */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Action Icons removed — moved into profile dropdown for Customer */}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-primary hover:text-blue transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Settings Dropdown (Desktop) */}
          <div className="hidden md:block relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-lg  text-text-primary hover:text-blue transition-all cursor-pointer flex items-center justify-center hover:bg-bg-secondary ${
                isSettingsOpen ? 'border-blue text-blue bg-bg-secondary' : ''
              }`}
              title="System Preferences"
              aria-expanded={isSettingsOpen}
              aria-haspopup="true"
            >
              <Settings className={`w-5 h-5 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90' : 'hover:rotate-45'}`} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-bg-surface rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] p-4 z-50 flex flex-col gap-4">
                <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider border-b border-separator-light dark:border-separator-dark pb-2">
                  System Preferences / ตั้งค่าระบบ
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">Language / ภาษา</span>
                  <LanguagePicker />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">Theme / ธีม</span>
                  <ThemeToggle />
                </div>
              </div>
            )}
          </div>

          {/* Separator (Desktop) */}
          <div className="hidden md:block h-6 w-px bg-separator-light dark:bg-separator-dark" />

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3" ref={profileRef}>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-text-primary hover:text-blue text-sm font-medium px-3 py-2 rounded-lg transition-all cursor-pointer hover:bg-bg-secondary"
                >
                  <div className="w-7 h-7 rounded-full bg-blue/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue" />
                  </div>
                  <span>{user.first_name || user.email}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-bg-surface rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] py-2 z-50">
                    {user.role === 'Admin' && (
                      <button
                        onClick={() => { onNavigate('admin-dashboard'); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-blue hover:bg-bg-secondary transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </button>
                    )}
                    {user.role !== 'Admin' && (
                      <>
                        <button
                          onClick={() => { onNavigate('order-tracking'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-blue hover:bg-bg-secondary transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          {t('nav.orders')}
                        </button>
                        <button
                          onClick={() => { onNavigate('wishlist'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-blue hover:bg-bg-secondary transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          {t('nav.wishlist')}
                        </button>
                        <button
                          onClick={() => { onNavigate('cart'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-blue hover:bg-bg-secondary transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {t('nav.cart')}
                        </button>
                        <div className="my-1 border-t border-separator-light dark:border-separator-dark" />
                      </>
                    )}
                    <button
                      onClick={() => { logout(); setIsProfileOpen(false); onNavigate('landing'); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <User className="w-4 h-4" />
                {t('nav.account')}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bg-surface border-t border-separator-light dark:border-separator-dark">
          <nav className="px-4 py-4 space-y-2">
            {/* Grouped Navigation — hidden for Admin */}
            {user?.role !== 'Admin' && navGroups.map((group) => {
              const Icon = group.icon;
              const active = isActive(group.pages);

              return (
                <button
                  key={group.id}
                  onClick={() => {
                    onNavigate(group.pages[0]);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'text-blue bg-blue/10 font-semibold'
                      : 'text-text-secondary hover:text-blue hover:bg-bg-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {group.label}
                </button>
              );
            })}

            {/* Quick Access Section — hidden for Admin */}
            {user?.role !== 'Admin' && (
            <div className="pt-4 border-t border-separator-light dark:border-separator-dark space-y-2">
              <button
                onClick={() => {
                  onNavigate('order-tracking');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 text-sm font-medium text-text-secondary hover:text-blue px-4 py-3 rounded-lg hover:bg-bg-secondary transition-all"
              >
                <Package className="w-5 h-5" />
                {t('nav.orders')}
              </button>
              <button
                onClick={() => {
                  onNavigate('wishlist');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 text-sm font-medium text-text-secondary hover:text-blue px-4 py-3 rounded-lg hover:bg-bg-secondary transition-all"
              >
                <Heart className="w-5 h-5" />
                {t('nav.wishlist')}
              </button>
              <button
                onClick={() => {
                  onNavigate('cart');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between text-sm font-medium text-text-secondary hover:text-blue px-4 py-3 rounded-lg hover:bg-bg-secondary transition-all"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  {t('nav.cart')}
                </div>
              </button>
            </div>
            )}

            {/* Auth Section */}
            <div className="pt-4 border-t border-separator-light dark:border-separator-dark flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">{user.first_name || user.email}</span>
                    <span className="text-xs ml-2 text-text-tertiary">({user.role})</span>
                  </div>
                  {user.role === 'Admin' && (
                    <button
                      onClick={() => { onNavigate('admin-dashboard'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 text-sm font-medium text-text-secondary hover:text-blue px-4 py-3 rounded-lg hover:bg-bg-secondary transition-all"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); onNavigate('landing'); }}
                    className="w-full flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-lg transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <User className="w-5 h-5" />
                  {t('nav.account')}
                </button>
              )}

              {/* Settings */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-semibold text-text-secondary">Language</span>
                  <LanguagePicker />
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-semibold text-text-secondary">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}

export default Header;
