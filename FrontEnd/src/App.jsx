import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import PCBuilder from './pages/PCBuilder/PCBuilder';
import Catalog from './pages/Catalog/Catalog';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import ProductComparison from './pages/ProductComparison/ProductComparison';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import CartCheckout from './pages/CartCheckout/CartCheckout';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import Wishlist from './pages/Wishlist/Wishlist';
import AdminProducts from './pages/AdminProducts/AdminProducts';
import AdminAccounts from './pages/AdminAccounts/AdminAccounts';
import AdminPaymentReview from './pages/AdminPayment/AdminPaymentReview';
import AdminOrders from './pages/AdminOrders/AdminOrders';
import Auth from './pages/Auth/Auth';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminGuard from './components/AdminGuard';
import CustomerGuard from './components/CustomerGuard';

// Wrapper component to inject navigate prop into pages
function PageWrapper({ Component, layout = 'main', ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Derive currentPage from URL path (e.g. '/order-history' → 'order-history')
  const currentPage = location.pathname.replace(/^\//, '') || 'landing';

  const handleNavigate = (page, data) => {
    if (data) {
      navigate(`/${page}`, { state: data });
    } else {
      navigate(`/${page}`);
    }
  };

  const content = <Component onNavigate={handleNavigate} {...props} />;

  if (layout === 'none') {
    return content;
  }

  if (layout === 'dashboard') {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return <MainLayout currentPage={currentPage} onNavigate={handleNavigate}>{content}</MainLayout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<CustomerGuard><PageWrapper Component={Landing} /></CustomerGuard>} />
        <Route path="/builder" element={<CustomerGuard><PageWrapper Component={PCBuilder} /></CustomerGuard>} />
        <Route path="/catalog" element={<CustomerGuard><PageWrapper Component={Catalog} /></CustomerGuard>} />
        <Route path="/compare" element={<CustomerGuard><PageWrapper Component={ProductComparison} /></CustomerGuard>} />
        <Route path="/product-detail" element={<CustomerGuard><PageWrapper Component={ProductDetail} /></CustomerGuard>} />
        <Route path="/cart" element={<CustomerGuard><PageWrapper Component={CartCheckout} /></CustomerGuard>} />
        <Route path="/order-history" element={<CustomerGuard><PageWrapper Component={OrderHistory} /></CustomerGuard>} />
        <Route path="/order-tracking" element={<CustomerGuard><PageWrapper Component={OrderTracking} /></CustomerGuard>} />
        <Route path="/wishlist" element={<CustomerGuard><PageWrapper Component={Wishlist} /></CustomerGuard>} />

        {/* Auth Pages (no layout) */}
        <Route path="/login" element={<PageWrapper Component={Auth} layout="none" />} />
        <Route path="/register" element={<PageWrapper Component={Auth} layout="none" />} />
        <Route path="/auth" element={<PageWrapper Component={Auth} layout="none" />} />

        {/* Admin Pages (dashboard layout) */}
        <Route path="/admin-dashboard" element={<AdminGuard><PageWrapper Component={AdminDashboard} layout="dashboard" /></AdminGuard>} />
        <Route path="/admin-products" element={<AdminGuard><PageWrapper Component={AdminProducts} layout="dashboard" /></AdminGuard>} />
        <Route path="/admin-accounts" element={<AdminGuard><PageWrapper Component={AdminAccounts} layout="dashboard" /></AdminGuard>} />
        <Route path="/admin-payment" element={<AdminGuard><PageWrapper Component={AdminPaymentReview} layout="dashboard" /></AdminGuard>} />
        <Route path="/admin-orders" element={<AdminGuard><PageWrapper Component={AdminOrders} layout="dashboard" /></AdminGuard>} />

        {/* 404 - Redirect to landing */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
