import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div id="wrapper" className="d-flex vh-100 w-100 overflow-hidden bg-light">
      
      {/* Komponen Navigasi Kiri */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div id="content-wrapper" className="d-flex flex-column flex-fill overflow-auto">
        <div id="content">
          
          {/* Komponen Bar Atas */}
          <Topbar title={activePage === 'dashboard' ? 'Dashboard Pengukuran Cuaca' : 'Data Historis Pengukuran Cuaca'} />

          {/* Area Konten Utama yang Berganti-ganti */}
          <div className="container-fluid px-4 pb-4">
            {activePage === 'dashboard' ? <Dashboard /> : <History />}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;