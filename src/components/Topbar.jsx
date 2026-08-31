import { useState, useEffect } from 'react';

export default function Topbar({ title, toggleSidebar, activeStation, setActiveStation }) {
  const [currentTime, setCurrentTime] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // ... (Logika waktu tetap sama seperti sebelumnya) ...
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    const timer = setInterval(() => {
      const now = new Date();
      if (isMobile) {
        setCurrentTime(now.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':'));
      } else {
        setCurrentTime(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
      }
    }, 1000);
    return () => { clearInterval(timer); window.removeEventListener('resize', handleResize); };
  }, [isMobile]);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm px-3 px-md-4 d-flex justify-content-between align-items-center">
      
      <div className="d-flex align-items-center">
        <button onClick={toggleSidebar} className="btn btn-link d-md-none rounded-circle mr-2 p-0" style={{ width: '40px', height: '40px' }}>
          <i className="fas fa-bars text-primary fa-lg"></i>
        </button>
        <h1 className="h4 mb-0 text-gray-800 font-weight-bold topbar-title mr-auto">{title}</h1>
      </div>
      
      <div className="d-flex align-items-center">
        {/* DROPDOWN PEMILIH STASIUN */}
        <select 
          className="form-select form-select-sm shadow-sm font-weight-bold mr-3" 
          style={{ borderRadius: '20px', padding: '0.4rem 1rem', border: '1px solid #4e73df', color: '#4e73df', cursor: 'pointer' }}
          value={activeStation}
          onChange={(e) => setActiveStation(Number(e.target.value))}
        >
          <option value={1}>Stasiun 1 (BME280)</option>
          <option value={2}>Stasiun 2 (DHT & BH1750)</option>
        </select>

        <span className="text-gray-600 font-weight-bold topbar-date d-none d-sm-block">{currentTime}</span>
      </div>
    </nav>
  );
}