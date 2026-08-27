import { useState, useEffect } from 'react';

export default function Topbar({ title, toggleSidebar }) {
  const [currentTime, setCurrentTime] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const timer = setInterval(() => {
      const now = new Date();
      if (isMobile) {
        // Format Mobile: 27/08/2026 18:23
        setCurrentTime(now.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':'));
      } else {
        // Format Desktop: Kamis, 27 Agustus 2026 pukul 18.23
        setCurrentTime(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm px-3 px-md-4">
      
      {/* Tombol Hamburger Khusus Mobile (Diposisikan paling kiri) */}
      <button 
        onClick={toggleSidebar} 
        className="btn btn-link d-md-none rounded-circle mr-2 p-0" 
        style={{ width: '40px', height: '40px' }}
      >
        <i className="fas fa-bars text-primary fa-lg"></i>
      </button>

      {/* Teks Judul */}
      <h1 className="h4 mb-0 text-gray-800 font-weight-bold topbar-title mr-auto">{title}</h1>
      
      {/* Waktu */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item d-flex align-items-center">
          <span className="text-gray-600 font-weight-bold topbar-date">{currentTime}</span>
        </li>
      </ul>
    </nav>
  );
}