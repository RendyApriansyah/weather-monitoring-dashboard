import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { STATION_LIST } from '../config/stations';
import { getCurrentTimeStringWIB } from '../utils/date';

export default function FloatingHeader({ activeStation, onStationChange, toggleSidebar }) {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeStringWIB());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeStringWIB());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Preserve station parameter when navigating
  const stationParam = `?station=${activeStation}`;

  return (
    <div className="floating-header-container">
      <div className="floating-header shadow-lg">
        {/* LEFT SECTION: Logo & Desktop Navigation */}
        <div className="d-flex align-items-center">
          <Link to={`/${stationParam}`} className="d-flex align-items-center mr-4 header-logo-container text-decoration-none">
            <div className="logo-bg">
              <img src="/websitelogo.svg" alt="Logo" className="brand-logo" />
            </div>
            <span className="font-weight-bold text-white mb-0 brand-text">
              EMD
            </span>
          </Link>

          <nav className="nav-links d-none d-md-flex align-items-center">
            <NavLink
              to={`/${stationParam}`}
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Dashboard
            </NavLink>
            <NavLink
              to={`/history${stationParam}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Data History
            </NavLink>
          </nav>
        </div>

        {/* RIGHT SECTION: Time, Dynamic Station Dropdown, and Mobile Button */}
        <div className="d-flex align-items-center header-right-controls">
          <div className="time-display d-none d-md-block">
            {currentTime}
          </div>

          <div className="select-wrapper d-none d-md-block">
            <select
              className="station-dropdown"
              value={activeStation}
              onChange={(e) => onStationChange(Number(e.target.value))}
              aria-label="Select Sensor Station"
            >
              {STATION_LIST.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Hamburger Button (Mobile only) */}
          <button
            className="btn btn-link d-md-none p-0 text-white ml-2 btn-no-outline d-flex align-items-center"
            onClick={toggleSidebar}
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}