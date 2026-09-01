import React from 'react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-white border-top mt-5 pt-4 pb-3 shadow-sm">
      <div className="container-fluid px-3 px-md-5 content-container">
        <div className="row align-items-center text-center text-md-left">

          {/* Kolom Kiri: Navigasi */}
          <div className="col-md-4 mb-3 mb-md-0 text-md-left">
            <h6 className="font-weight-bold text-gray-800 mb-2 footer-nav-title">Navigasi</h6>
            <ul className="list-unstyled mb-0 footer-nav-list">
              <li className="mb-1">
                <button 
                  onClick={() => setActivePage('dashboard')} 
                  className="btn btn-link p-0 text-muted shadow-none footer-nav-link" 
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActivePage('history')} 
                  className="btn btn-link p-0 text-muted shadow-none footer-nav-link" 
                >
                  Histori Data
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom Tengah: Logo Identitas */}
          <div className="col-md-4 mb-3 mb-md-0 text-center">
            <div className="d-flex align-items-center justify-content-center mb-1 footer-logo-container">
              <div className="footer-logo-wrapper">
                <img src="/websitelogo.svg" alt="Logo" className="brand-logo" />
              </div>
              <span className="font-weight-bold text-dark mb-0 footer-brand-text">
                EMD<span></span>
              </span>
            </div>
            <p className="text-muted mb-0 footer-subtitle">
              Enviromental Weather Dashboard
            </p>
          </div>

          {/* Kolom Kanan: Informasi / Lokasi */}
          <div className="col-md-4 text-md-right text-center">
            <h6 className="font-weight-bold text-gray-800 mb-2 footer-info-title">Informasi Stasiun</h6>
            <p className="text-muted mb-0 footer-info-text">
              Palembang, Sumatera Selatan<br/>
              Node 1: BME280 | Node 2: DHT & BH1750
            </p>
          </div>
          
        </div>

        <hr className="my-3 divider-line" />

        {/* Baris Bawah: Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted mb-0 footer-copyright">
              &copy; 2026 M. Rendy Apriansyah. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}