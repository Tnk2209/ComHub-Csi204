import React from 'react';
import Header from './Header';
import Footer from './Footer';

function MainLayout({ children, currentPage, onNavigate }) {
  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans transition-colors">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
