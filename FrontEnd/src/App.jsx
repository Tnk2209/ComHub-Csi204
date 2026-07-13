import React, { useState } from 'react';
import Landing from './pages/Landing/Landing';
import PCBuilder from './pages/PCBuilder/PCBuilder';

function App() {
  const [currentPage, setCurrentPage] = useState('builder'); // Default to builder page as requested

  // Simple Router renderer
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onStartBuilding={() => setCurrentPage('builder')} onNavigate={setCurrentPage} />;
      case 'builder':
        return <PCBuilder onNavigate={setCurrentPage} />;
      default:
        return <PCBuilder onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-gray-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-[#222a36] bg-[#0d0f12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span 
              onClick={() => setCurrentPage('landing')} 
              className="text-xl font-bold tracking-wider text-[#00c2ff] cursor-pointer hover:opacity-85 transition-opacity"
            >
              ComHub
            </span>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button 
                onClick={() => setCurrentPage('landing')}
                className={`transition-colors cursor-pointer ${currentPage === 'landing' ? 'text-white border-b-2 border-[#00c2ff] pb-1' : 'text-gray-400 hover:text-white'}`}
              >
                Home & Catalog
              </button>
              <button 
                onClick={() => setCurrentPage('builder')}
                className={`transition-colors cursor-pointer ${currentPage === 'builder' ? 'text-white border-b-2 border-[#00c2ff] pb-1' : 'text-gray-400 hover:text-white'}`}
              >
                PC Builder
              </button>
              <a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a>
              <a href="#community" className="text-gray-400 hover:text-white transition-colors">Community</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-white transition-colors cursor-pointer">Sign In</button>
            <button className="bg-[#00c2ff] hover:bg-[#00c2ff]/90 text-slate-950 text-sm font-semibold px-4 py-2 rounded transition-all cursor-pointer">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Content */}
      <div className="flex-grow">
        {renderPage()}
      </div>

      {/* Shared Footer */}
      <footer className="border-t border-[#222a36] bg-[#0d0f12]/50 py-8 text-center text-xs text-gray-500 mt-10">
        <p>© 2026 ComHub Digital Lab. พัฒนาขึ้นสำหรับวิชา csi 204 (Systems Analysis and Design)</p>
      </footer>
    </div>
  );
}

export default App;
