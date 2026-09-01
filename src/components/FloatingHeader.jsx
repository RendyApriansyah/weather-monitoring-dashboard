import { useState, useEffect } from 'react';

export default function FloatingHeader({ activePage, setActivePage, activeStation, setActiveStation, toggleSidebar }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="floating-header-container">
      <div className="floating-header shadow-lg">
        
        {/* BAGIAN KIRI: Logo & Link Desktop */}
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center mr-4 header-logo-container">
            <div className="logo-bg">
              <img src="/websitelogo.svg" alt="Logo" className="brand-logo" />
            </div>
            <span className="font-weight-bold text-white mb-0 brand-text">
              EMD<span></span>
            </span>
          </div>

          <div className="nav-links d-none d-md-flex align-items-center">
            <button className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
              Dashboard
            </button>
            <button className={activePage === 'history' ? 'active' : ''} onClick={() => setActivePage('history')}>
              Histori Data
            </button>
          </div>
        </div>

        {/* BAGIAN KANAN: Waktu, Dropdown, dan Tombol Mobile */}
        <div className="d-flex align-items-center header-right-controls">
          
          <div className="time-display d-none d-md-block">
            {currentTime}
          </div>
          
          <div className="select-wrapper d-none d-md-block">
            <select 
              className="station-dropdown"
              value={activeStation}
              onChange={(e) => setActiveStation(Number(e.target.value))}
            >
              <option value={1}>Stasiun 1 (BME)</option>
              <option value={2}>Stasiun 2 (DHT)</option>
            </select>
          </div>

          {/* Tombol Hamburger (Hanya tampil di Mobile) */}
          <button 
            className="btn btn-link d-md-none p-0 text-white ml-2 btn-no-outline" 
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars fa-lg"></i>
          </button>

        </div>
      </div>
    </div>
  );
}