import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // 1. Impor konektor database yang baru dibuat
import './App.css';

function App() {
  // State untuk menyimpan data (default kita buat '--' jika data belum masuk)
  const [sensorData, setSensorData] = useState({
    temperature: '--',
    humidity: '--',
    pressure: '--',
  });

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // --- 1. Logika Jam (Tetap Sama) ---
    const timer = setInterval(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };
      setCurrentTime(now.toLocaleDateString('id-ID', options));
    }, 1000);

    // --- 2. Ambil Data Terakhir Saat Web Dibuka (Sama seperti SELECT ... ORDER BY DESC LIMIT 1) ---
    const fetchLatestData = async () => {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(); // Ambil 1 baris saja

      // Jika data ditemukan, update tampilan
      if (data) {
        setSensorData({
          temperature: data.temperature,
          humidity: data.humidity,
          pressure: data.pressure,
        });
      }
    };

    fetchLatestData();

    // --- 3. Listener Real-Time (Fitur andalan arsitektur modern) ---
    // Ini akan "mendengarkan" database. Jika ada INSERT baru dari sensor, layar otomatis update!
    const subscription = supabase
      .channel('sensor_listener')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_data' }, (payload) => {
        console.log("Data baru masuk dari sensor!", payload.new);
        setSensorData({
          temperature: payload.new.temperature,
          humidity: payload.new.humidity,
          pressure: payload.new.pressure,
        });
      })
      .subscribe();

    // Bersihkan memori saat komponen ditutup
    return () => {
      clearInterval(timer);
      supabase.removeChannel(subscription);
    };
  }, []);
  // 3. TAMPILAN (JSX): Perhatikan semua 'class' berubah menjadi 'className'
  return (
    // Tambahkan class d-flex dan vh-100 agar memenuhi layar tanpa terpotong
    <div id="wrapper" className="d-flex vh-100 w-100 overflow-hidden">
      
      {/* Sidebar - Tambahkan shadow untuk efek modern */}
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion shadow" id="accordionSidebar">
        <a className="sidebar-brand d-flex align-items-center justify-content-center py-4" href="/">
          <div className="sidebar-brand-icon"><i className="fas fa-cloud-sun fa-2x"></i></div>
          <div className="sidebar-brand-text mx-3">Weather Station</div>
        </a>
        <hr className="sidebar-divider my-0" />
        <li className="nav-item active">
          <a className="nav-link" href="/"><i className="fas fa-fw fa-tachometer-alt"></i><span>Dashboard</span></a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/history"><i className="fas fa-fw fa-table"></i><span>Data Historis</span></a>
        </li>
      </ul>

      {/* Content Wrapper - Gunakan flex-fill agar membentang memenuhi sisa layar */}
      <div id="content-wrapper" className="d-flex flex-column flex-fill bg-light overflow-auto">
        <div id="content">
          
          {/* Topbar - Buat lebih bersih */}
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item mx-1 d-flex align-items-center">
                <span className="mr-3 d-none d-lg-inline text-gray-600 font-weight-bold">{currentTime}</span>
              </li>
            </ul>
          </nav>

          {/* Main Content Area */}
          <div className="container-fluid px-4">
            <h1 className="h3 mb-4 text-gray-800 font-weight-bold">Dashboard Pengukuran Cuaca</h1>
            
            <div className="row">
              {/* Kartu Suhu */}
              <div className="col-xl-4 col-md-6 mb-4">
                <div className="card border-left-warning shadow-sm h-100 py-3 rounded-lg border-0">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-2">Suhu Saat Ini</div>
                        <div className="h3 mb-0 font-weight-bold text-gray-800">{sensorData.temperature} °C</div>
                      </div>
                      <div className="col-auto"><i className="fas fa-thermometer-half fa-3x text-gray-300"></i></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kartu Kelembapan */}
              <div className="col-xl-4 col-md-6 mb-4">
                <div className="card border-left-primary shadow-sm h-100 py-3 rounded-lg border-0">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-2">Kelembapan</div>
                        <div className="h3 mb-0 font-weight-bold text-gray-800">{sensorData.humidity}%</div>
                      </div>
                      <div className="col-auto"><i className="fas fa-tint fa-3x text-gray-300"></i></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kartu Tekanan */}
              <div className="col-xl-4 col-md-6 mb-4">
                <div className="card border-left-success shadow-sm h-100 py-3 rounded-lg border-0">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-2">Tekanan Udara</div>
                        <div className="h3 mb-0 font-weight-bold text-gray-800">{sensorData.pressure} hPa</div>
                      </div>
                      <div className="col-auto"><i className="fas fa-wind fa-3x text-gray-300"></i></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;