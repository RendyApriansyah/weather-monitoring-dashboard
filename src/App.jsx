import { useState } from 'react';
import { Routes, Route, Navigate, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Table, Radio, ChevronDown, ChevronUp } from 'lucide-react';
import FloatingHeader from './components/FloatingHeader';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Footer from './components/Footer';
import { DEFAULT_STATION_ID, STATION_LIST } from './config/stations';
import './App.css';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const activeStation = Number(searchParams.get('station')) || DEFAULT_STATION_ID;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isStationMenuOpen, setIsStationMenuOpen] = useState(false);

  const handleStationChange = (id) => {
    setSearchParams({ station: id });
  };

  const handlePageNavigation = (path) => {
    navigate(`${path}?station=${activeStation}`);
    setIsMobileSidebarOpen(false);
  };

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className="main-layout main-layout-bg w-100 position-relative d-flex flex-column">
      {/* HEADER MELAYANG */}
      <FloatingHeader
        activeStation={activeStation}
        onStationChange={handleStationChange}
        toggleSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* OVERLAY & SIDEBAR MOBILE (OFF-CANVAS) */}
      <div
        className={`mobile-sidebar-overlay ${isMobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      ></div>

      <div className={`mobile-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <span className="font-weight-bold text-dark mb-0 brand-text">
            EMD
          </span>
          <button className="btn btn-link text-dark p-0" onClick={() => setIsMobileSidebarOpen(false)}>
            <img src="/websitelogo.svg" alt="Logo" className="brand-logo" />
          </button>
        </div>

        <div className="d-flex flex-column mt-2">
          <button
            className={`mobile-nav-item d-flex align-items-center ${isCurrentPath('/') ? 'active' : ''}`}
            onClick={() => handlePageNavigation('/')}
          >
            <LineChart size={18} className="mr-3" /> Dashboard
          </button>

          <button
            className={`mobile-nav-item d-flex align-items-center ${isCurrentPath('/history') ? 'active' : ''}`}
            onClick={() => handlePageNavigation('/history')}
          >
            <Table size={18} className="mr-3" /> Histori Data
          </button>

          <hr className="my-2 mx-3 divider-line" />

          {/* MENU LIPAT PILIH STASIUN DINAMIS */}
          <button
            className="mobile-nav-item d-flex justify-content-between align-items-center"
            onClick={() => setIsStationMenuOpen(!isStationMenuOpen)}
          >
            <span className="d-flex align-items-center">
              <Radio size={18} className="mr-3" /> Pilih Stasiun
            </span>
            {isStationMenuOpen ? (
              <ChevronUp size={16} className="text-muted" />
            ) : (
              <ChevronDown size={16} className="text-muted" />
            )}
          </button>

          {isStationMenuOpen && (
            <div className="d-flex flex-column bg-light pb-2">
              {STATION_LIST.map((st) => (
                <button
                  key={st.id}
                  className={`mobile-sub-item ${activeStation === st.id ? 'active' : ''}`}
                  onClick={() => {
                    handleStationChange(st.id);
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  {st.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KONTEN UTAMA DENGAN ROUTING */}
      <main className="content-spacer content-container container-fluid px-3 px-md-5 flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard key={activeStation} activeStation={activeStation} />} />
          <Route path="/history" element={<History key={activeStation} activeStation={activeStation} />} />
          <Route path="*" element={<Navigate to={`/?station=${activeStation}`} replace />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer activeStation={activeStation} />
    </div>
  );
}

export default App;