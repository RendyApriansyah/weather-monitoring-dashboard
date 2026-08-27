import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  // State baru untuk mendeteksi apakah sidebar dibuka (khusus mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div id="wrapper" className="d-flex vh-100 w-100 overflow-hidden bg-light position-relative">
      
      {/* Komponen Navigasi Kiri */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>

      <div id="content-wrapper" className="d-flex flex-column flex-fill overflow-auto w-100">
        <div id="content">
          
          {/* Topbar diberikan fungsi untuk menekan tombol hamburger */}
          <Topbar 
            title={activePage === 'dashboard' ? 'Dashboard Pengukuran Cuaca' : 'Data Historis Pengukuran Cuaca'} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <div className="container-fluid px-4 pb-4">
            {activePage === 'dashboard' ? <Dashboard /> : <History />}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;