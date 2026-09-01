import { useState } from 'react';
import FloatingHeader from './components/FloatingHeader';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeStation, setActiveStation] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isStationMenuOpen, setIsStationMenuOpen] = useState(false); 

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false); 
  };

  return (
    // PERUBAHAN: Menambahkan d-flex flex-column agar tata letak tidak terputus
    <div className="main-layout main-layout-bg w-100 position-relative d-flex flex-column">
      
      <FloatingHeader 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activeStation={activeStation} 
        setActiveStation={setActiveStation}
        toggleSidebar={() => setIsMobileSidebarOpen(true)}
      />

      <div className={`mobile-sidebar-overlay ${isMobileSidebarOpen ? 'open' : ''}`} onClick={() => setIsMobileSidebarOpen(false)}></div>
      <div className={`mobile-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <span className="font-weight-bold text-dark mb-0 brand-text">
            EMD<span></span>
          </span>
          <button className="btn btn-link text-dark p-0" onClick={() => setIsMobileSidebarOpen(false)}>
            <img src="/websitelogo.svg" alt="Logo" className="brand-logo" />
          </button>
        </div>

        <div className="d-flex flex-column mt-2">
          <button className={`mobile-nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => handlePageChange('dashboard')}>
            <i className="fas fa-chart-line mr-3"></i> Dashboard
          </button>
          <button className={`mobile-nav-item ${activePage === 'history' ? 'active' : ''}`} onClick={() => handlePageChange('history')}>
            <i className="fas fa-table mr-3"></i> Histori Data
          </button>
          
          <hr className="my-2 mx-3 divider-line"/>

          {/* TOMBOL MENU LIPAT STASIUN CUACA */}
          <button 
            className="mobile-nav-item d-flex justify-content-between align-items-center" 
            onClick={() => setIsStationMenuOpen(!isStationMenuOpen)}
          >
            <span><i className="fas fa-satellite-dish mr-3"></i> Pilih Stasiun</span>
            <i className={`fas fa-chevron-${isStationMenuOpen ? 'up' : 'down'} fa-sm text-muted`}></i>
          </button>
          
          {/* DAFTAR OPSI STASIUN (MUNCUL JIKA DIKLIK) */}
          {isStationMenuOpen && (
            <div className="d-flex flex-column bg-light pb-2">
              <button 
                className={`mobile-sub-item ${activeStation === 1 ? 'active' : ''}`}
                onClick={() => { setActiveStation(1); setIsMobileSidebarOpen(false); }}
              >
                Stasiun 1 (BME280)
              </button>
              <button 
                className={`mobile-sub-item ${activeStation === 2 ? 'active' : ''}`}
                onClick={() => { setActiveStation(2); setIsMobileSidebarOpen(false); }}
              >
                Stasiun 2 (DHT & BH)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PERUBAHAN: Menambahkan flex-grow-1 agar mendorong footer ke bawah */}
      <div className="content-spacer content-container container-fluid px-3 px-md-5 flex-grow-1">
        {activePage === 'dashboard' ? (
          <Dashboard activeStation={activeStation} /> 
        ) : (
          <History activeStation={activeStation} />
        )}
      </div>

      {/* PERUBAHAN: Memasukkan komponen Footer di paling bawah */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}

export default App;