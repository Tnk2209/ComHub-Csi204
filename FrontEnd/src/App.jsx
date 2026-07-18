import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import PCBuilder from './pages/PCBuilder/PCBuilder';
import Catalog from './pages/Catalog/Catalog';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import CartCheckout from './pages/CartCheckout/CartCheckout';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import Wishlist from './pages/Wishlist/Wishlist';
import AdminProducts from './pages/AdminProducts/AdminProducts';
import AdminAccounts from './pages/AdminAccounts/AdminAccounts';
import AdminPaymentReview from './pages/AdminPayment/AdminPaymentReview';
import Auth from './pages/Auth/Auth';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Wrapper component to inject navigate prop into pages
function PageWrapper({ Component, layout = 'main', ...props }) {
  const navigate = useNavigate();

  const handleNavigate = (page, data) => {
    if (data) {
      // For pages that need to pass data, use state
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

  return <MainLayout onNavigate={handleNavigate}>{content}</MainLayout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<PageWrapper Component={Landing} />} />
        <Route path="/builder" element={<PageWrapper Component={PCBuilder} />} />
        <Route path="/catalog" element={<PageWrapper Component={Catalog} />} />
        <Route path="/product-detail" element={<PageWrapper Component={ProductDetail} />} />
        <Route path="/cart" element={<PageWrapper Component={CartCheckout} />} />
        <Route path="/order-tracking" element={<PageWrapper Component={OrderTracking} />} />
        <Route path="/wishlist" element={<PageWrapper Component={Wishlist} />} />

        {/* Auth Pages (no layout) */}
        <Route path="/login" element={<PageWrapper Component={Auth} layout="none" />} />
        <Route path="/register" element={<PageWrapper Component={Auth} layout="none" />} />
        <Route path="/auth" element={<PageWrapper Component={Auth} layout="none" />} />

        {/* Admin Pages (dashboard layout) */}
        <Route path="/admin-products" element={<PageWrapper Component={AdminProducts} layout="dashboard" />} />
        <Route path="/admin-accounts" element={<PageWrapper Component={AdminAccounts} layout="dashboard" />} />
        <Route path="/admin-payment" element={<PageWrapper Component={AdminPaymentReview} layout="dashboard" />} />

        {/* 404 - Redirect to landing */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
