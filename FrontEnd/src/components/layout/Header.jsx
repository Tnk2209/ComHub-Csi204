import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Menu, X, ShoppingCart, Heart, Package, Home, Wrench, ShoppingBag, User, LogOut, Shield, ClipboardList, MapPin } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguagePicker from './LanguagePicker';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Swal from 'sweetalert2';
import logo from '../../assets/comhub.png';

function Header({ currentPage, onNavigate }) {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoutConfirm = () => {
    Swal.fire({
      title: t('logout.confirm_title', 'คุณต้องการออกจากระบบใช่หรือไม่?'),
      text: t('logout.confirm_text', 'กดยืนยันเพื่อออกจากระบบ หรือยกเลิกเพื่ออยู่ต่อ'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: t('logout.confirm_btn', 'ออกจากระบบ'),
      cancelButtonText: t('logout.cancel_btn', 'ยกเลิก'),
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        onNavigate('landing');
      }
    });
  };

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
      id: 'order-history',
      icon: ClipboardList,
      label: t('nav.order_history'),
      pages: ['order-history']
    },
    {
      id: 'order-tracking',
      icon: MapPin,
      label: t('nav.order_tracking'),
      pages: ['order-tracking']
    },
  ];

  const isActive = (pages) => pages.includes(currentPage);

  return (
    <header className="ios-glass sticky top-0 z-50 transition-all">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left Side: Brand Logo */}
        <div className="flex items-center flex-shrink-0">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
            title="ComHub"
          >
            <img src={logo} alt="ComHub Logo" className="h-15 w-auto object-contain" />
          </div>
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

          {/* Desktop Wishlist & Cart Icons next to User Profile */}
          {isAuthenticated && user?.role !== 'Admin' && (
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate('wishlist')}
                className={`p-2 rounded-lg transition-all relative cursor-pointer hover:bg-bg-secondary ${
                  currentPage === 'wishlist' ? 'text-blue bg-blue/10' : 'text-text-primary hover:text-blue'
                }`}
                title={t('nav.wishlist')}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('cart')}
                className={`p-2 rounded-lg transition-all relative cursor-pointer hover:bg-bg-secondary ${
                  currentPage === 'cart' ? 'text-blue bg-blue/10' : 'text-text-primary hover:text-blue'
                }`}
                title={t('nav.cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center scale-90">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-primary hover:text-blue transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Separator (Desktop) */}
          <div className="hidden md:block h-6 w-px bg-separator-light dark:bg-separator-dark" />

          {/* Unified Profile & Settings Dropdown (Desktop) */}
          <div className="hidden md:flex items-center gap-3" ref={profileRef}>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-text-primary hover:text-blue text-sm font-medium px-3 py-2 rounded-lg transition-all cursor-pointer hover:bg-bg-secondary"
              >
                <div className="w-7 h-7 rounded-full bg-blue/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue" />
                </div>
                <span>{isAuthenticated ? (user.first_name || user.email) : t('nav.account')}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-bg-surface rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] py-2.5 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-1.5 text-xs text-text-tertiary border-b border-separator-light dark:border-separator-dark pb-2 mb-2 truncate">
                        {t('nav.logged_in_as')}: <span className="font-semibold text-text-primary">{user.role}</span>
                      </div>
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
                            onClick={() => { onNavigate('order-history'); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-blue hover:bg-bg-secondary transition-colors"
                          >
                            <ClipboardList className="w-4 h-4" />
                            {t('nav.order_history')}
                          </button>
                          <button
                            onClick={() => { onNavigate('order-tracking'); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-blue hover:bg-bg-secondary transition-colors"
                          >
                            <MapPin className="w-4 h-4" />
                            {t('nav.order_tracking')}
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
                        </>
                      )}
                    </>
                  ) : (
                    <div className="px-3 pb-2.5 border-b border-separator-light dark:border-separator-dark mb-2">
                      <button
                        onClick={() => { onNavigate('login'); setIsProfileOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 bg-blue hover:bg-blue/90 text-white text-xs font-semibold py-2 rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        <User className="w-3.5 h-3.5" />
                        {t('nav.signin')} / {t('nav.signup')}
                      </button>
                    </div>
                  )}

                  {/* System Preferences */}
                  <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold text-text-primary">
                    <span>Language / ภาษา</span>
                    <LanguagePicker />
                  </div>

                  <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold text-text-primary">
                    <span>Theme / ธีม</span>
                    <ThemeToggle />
                  </div>

                  {isAuthenticated && (
                    <>
                      <div className="my-1.5 border-t border-separator-light dark:border-separator-dark" />
                      <button
                        onClick={handleLogoutConfirm}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
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
                  onNavigate('order-history');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 text-sm font-medium text-text-secondary hover:text-blue px-4 py-3 rounded-lg hover:bg-bg-secondary transition-all"
              >
                <ClipboardList className="w-5 h-5" />
                {t('nav.order_history')}
              </button>
              <button
                onClick={() => {
                  onNavigate('order-tracking');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 text-sm font-medium text-text-secondary hover:text-blue px-4 py-3 rounded-lg hover:bg-bg-secondary transition-all"
              >
                <MapPin className="w-5 h-5" />
                {t('nav.order_tracking')}
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
                    onClick={handleLogoutConfirm}
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
