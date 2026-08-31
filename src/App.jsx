import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // STATE BARU: Menyimpan stasiun yang sedang aktif (Default: 1)
  const [activeStation, setActiveStation] = useState(1);

  return (
    <div id="wrapper" className="d-flex vh-100 w-100 overflow-hidden bg-light position-relative">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div id="content-wrapper" className="d-flex flex-column flex-fill overflow-auto w-100">
        <div id="content">
          
          {/* Kirim state activeStation ke Topbar agar bisa diubah melalui dropdown */}
          <Topbar 
            title={activePage === 'dashboard' ? 'Dashboard Pengukuran Cuaca' : 'Data Historis Pengukuran Cuaca'} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            activeStation={activeStation}
            setActiveStation={setActiveStation}
          />

          <div className="container-fluid px-4 pb-4">
            {/* Kirim activeStation ke halaman agar tabel & grafik menyesuaikan */}
            {activePage === 'dashboard' ? <Dashboard activeStation={activeStation} /> : <History activeStation={activeStation} />}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;