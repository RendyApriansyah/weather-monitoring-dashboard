import { Link } from 'react-router-dom';
import { STATION_LIST } from '../config/stations';

export default function Footer({ activeStation = 1 }) {
  const stationParam = `?station=${activeStation}`;

  const stationNodesText = STATION_LIST.map(
    (st) => `${st.shortName}: ${st.sensor}`
  ).join(' | ');

  return (
    <footer className="bg-white border-top mt-5 pt-4 pb-3 shadow-sm">
      <div className="container-fluid px-3 px-md-5 content-container">
        <div className="row align-items-center text-center text-md-left">
          {/* Left Column: Navigation */}
          <div className="col-md-4 mb-3 mb-md-0 text-md-left">
            <h6 className="font-weight-bold text-gray-800 mb-2 footer-nav-title">Navigation</h6>
            <ul className="list-unstyled mb-0 footer-nav-list">
              <li className="mb-1">
                <Link
                  to={`/${stationParam}`}
                  className="btn btn-link p-0 text-muted shadow-none footer-nav-link"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to={`/history${stationParam}`}
                  className="btn btn-link p-0 text-muted shadow-none footer-nav-link"
                >
                  Data History
                </Link>
              </li>
            </ul>
          </div>

          {/* Center Column: Brand Identity Logo */}
          <div className="col-md-4 mb-3 mb-md-0 text-center">
            <div className="d-flex align-items-center justify-content-center mb-1 footer-logo-container">
              <div className="footer-logo-wrapper">
                <img src="/websitelogo.svg" alt="Logo" className="brand-logo" />
              </div>
              <span className="font-weight-bold text-dark mb-0 footer-brand-text">
                EMD
              </span>
            </div>
            <p className="text-muted mb-0 footer-subtitle">
              Environmental Monitoring Dashboard Ver 2.0
            </p>
          </div>

          {/* Right Column: Station Information / Location */}
          <div className="col-md-4 text-md-right text-center">
            <h6 className="font-weight-bold text-gray-800 mb-2 footer-info-title">Station Information</h6>
            <p className="text-muted mb-0 footer-info-text">
              Palembang | Indralaya, South Sumatra<br />
              {stationNodesText}
            </p>
          </div>
        </div>

        <hr className="my-3 divider-line" />

        {/* Bottom Row: Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted mb-0 footer-copyright">
              &copy; 2026 MRA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}