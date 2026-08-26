export default function Sidebar({ activePage, setActivePage }) {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion shadow-sm" id="accordionSidebar">
      <div className="sidebar-brand d-flex align-items-center justify-content-center py-4" style={{ cursor: 'pointer' }} onClick={() => setActivePage('dashboard')}>
        <div className="sidebar-brand-icon"><i className="fas fa-cloud-sun fa-2x"></i></div>
        <div className="sidebar-brand-text mx-3">Weather Station</div>
      </div>
      <hr className="sidebar-divider my-0" />
      
      <li className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
        <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setActivePage('dashboard'); }}>
          <i className="fas fa-fw fa-tachometer-alt"></i><span>Dashboard</span>
        </a>
      </li>
      <li className={`nav-item ${activePage === 'history' ? 'active' : ''}`}>
        <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setActivePage('history'); }}>
          <i className="fas fa-fw fa-table"></i><span>Data Historis</span>
        </a>
      </li>
    </ul>
  );
}