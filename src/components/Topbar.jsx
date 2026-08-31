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
    <nav 
      className="navbar navbar-expand navbar-light bg-white mb-4 static-top shadow-sm px-3 px-md-4 py-3 py-md-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center" 
      // Mengubah height menjadi auto agar wadah bisa membesar ke bawah saat mode mobile
      style={{ height: 'auto', minHeight: '70px' }} 
    >
      
      {/* Area Kiri: Tombol Menu & Judul (Memenuhi 100% lebar pada mobile) */}
      <div className="d-flex align-items-center w-100 mb-3 mb-md-0">
        <button onClick={toggleSidebar} className="btn btn-link d-md-none rounded-circle mr-3 p-0" style={{ width: '40px', height: '40px' }}>
          <i className="fas fa-bars text-primary fa-lg"></i>
        </button>
        {/* Mengubah h4 menjadi h5 agar sedikit lebih proporsional di layar kecil, ditambah text-truncate agar rapi jika teks terlalu panjang */}
        <h1 className="h5 mb-0 text-gray-800 font-weight-bold mr-auto text-truncate">{title}</h1>
      </div>
      
      {/* Area Kanan: Dropdown Stasiun & Waktu */}
      <div className="d-flex align-items-center w-100 justify-content-start justify-content-md-end">
        <select 
          className="form-select form-select-sm shadow-sm font-weight-bold mr-0 mr-md-3 flex-grow-1 flex-md-grow-0" 
          style={{ 
            borderRadius: '20px', 
            padding: '0.4rem 1rem', 
            border: '1px solid #4e73df', 
            color: '#4e73df', 
            cursor: 'pointer',
            maxWidth: '100%' // Memastikan dropdown tidak melebihi layar
          }}
          value={activeStation}
          onChange={(e) => setActiveStation(Number(e.target.value))}
        >
          <option value={1}>Stasiun 1 (BME280)</option>
          <option value={2}>Stasiun 2 (DHT & BH1750)</option>
        </select>

        <span className="text-gray-600 font-weight-bold topbar-date d-none d-sm-block ml-3">
          {currentTime}
        </span>
      </div>
      
    </nav>
  );
}