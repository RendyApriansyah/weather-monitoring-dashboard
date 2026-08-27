export default function Sidebar({ activePage, setActivePage, isSidebarOpen, toggleSidebar }) {
  // Mode sidebar berdasarkan state
  const sidebarClass = isSidebarOpen ? 'sidebar-open' : 'sidebar-closed';

  // Fungsi untuk navigasi & otomatis tutup sidebar di HP
  const handleNavigation = (page) => {
    setActivePage(page);
    if (window.innerWidth < 768) {
      toggleSidebar(); // Sidebar otomatis menutup setelah diklik di layar kecil
    }
  };

  return (
    <ul className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion shadow-sm ${sidebarClass}`} id="accordionSidebar">
      
      {/* LOGO DIGANTI TOMBOL HAMBURGER */}
      <div className="sidebar-brand d-flex align-items-center justify-content-center py-4" style={{ cursor: 'pointer' }} onClick={toggleSidebar}>
        <div className="sidebar-brand-icon">
          <i className="fas fa-bars fa-2x"></i>
        </div>
        <div className="sidebar-brand-text mx-3">Weather</div>
      </div>
      <hr className="sidebar-divider my-0" />
      
      {/* MENU 1: DASHBOARD */}
      <li className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
        <a className="nav-link d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); handleNavigation('dashboard'); }}>
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span className="ml-2">Dashboard</span>
        </a>
      </li>
      
      {/* MENU 2: HISTORIS */}
      <li className={`nav-item ${activePage === 'history' ? 'active' : ''}`}>
        <a className="nav-link d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); handleNavigation('history'); }}>
          <i className="fas fa-fw fa-table"></i>
          <span className="ml-2">Data Historis</span>
        </a>
      </li>
      
    </ul>
  );
}