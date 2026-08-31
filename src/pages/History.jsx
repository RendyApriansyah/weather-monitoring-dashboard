import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function History({ activeStation }) {
  const [tableData, setTableData] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ROWS_PER_PAGE = 25;

  // Nama tabel bergantung pada stasiun yang aktif
  const tableName = activeStation === 1 ? 'sensor_data' : 'station_2_data';

  const formatWaktu = (isoString) => {
    if (!isoString) return '--';
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoadingTable(true);
      const from = (currentPage - 1) * ROWS_PER_PAGE;
      const to = from + ROWS_PER_PAGE - 1;

      const { count } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
      if (count) setTotalPages(Math.ceil(count / ROWS_PER_PAGE));

      const { data } = await supabase.from(tableName).select('*').order('created_at', { ascending: false }).range(from, to);
      if (data) setTableData(data);
      setIsLoadingTable(false);
    };
    
    fetchTableData();
  }, [currentPage, activeStation]); // Akan fetch ulang jika pindah halaman ATAU pindah stasiun

  // Reset pagination ke halaman 1 setiap kali stasiun diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStation]);

  const handleDownloadFilteredCSV = async () => {
    try {
      setIsDownloading(true);
      let dataToExport = []; 

      // 1. Logika Pengambilan Data dari Supabase
      if (startDate && endDate) {
        const start = new Date(`${startDate}T00:00:00`).toISOString();
        const end = new Date(`${endDate}T23:59:59`).toISOString();

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .gte('created_at', start)
          .lte('created_at', end)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        if (!data || data.length === 0) {
          alert("Tidak ada data terekam pada rentang tanggal tersebut.");
          setIsDownloading(false);
          return;
        }
        dataToExport = data;
      } else {
        // Jika tanggal kosong, jangan ekspor 25 baris di tabel, 
        // melainkan ambil 1000 data terakhir langsung dari database
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000);
          
        if (error) throw error;
        if (!data || data.length === 0) {
          alert(`Belum ada data terekam untuk Stasiun ${activeStation}.`);
          setIsDownloading(false);
          return;
        }
        dataToExport = data;
      }

      // 2. Perakitan File CSV
      const param3Header = activeStation === 1 ? 'Tekanan Udara (hPa)' : 'Intensitas Cahaya (Lux)';
      let csvContent = `No,Suhu (°C),Kelembapan (%),${param3Header},Waktu Pencatatan\n`;
      
      dataToExport.forEach((row, index) => {
        const param3Value = activeStation === 1 ? row.pressure : row.light_intensity;
        
        // Membersihkan data null jika sensor sempat gagal mengirim
        const temp = row.temperature ?? '';
        const hum = row.humidity ?? '';
        const p3 = param3Value ?? '';
        
        csvContent += `${index + 1},${temp},${hum},${p3},"${formatWaktu(row.created_at)}"\n`;
      });

      // 3. Proses Pengunduhan (Bug Teratasi)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const fileName = (startDate && endDate) 
        ? `Laporan_Stasiun${activeStation}_${startDate}_${endDate}.csv` 
        : `Data_Stasiun${activeStation}_Terbaru.csv`;
        
      link.setAttribute("href", url); // <-- Ini adalah baris penting yang terlewat sebelumnya
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Membersihkan memori browser setelah file terunduh

    } catch (error) {
      console.error("Gagal mengekspor CSV:", error);
      alert("Terjadi kesalahan jaringan saat mengunduh laporan.");
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <>
      <p className="mb-4 text-gray-600">
        Menampilkan riwayat data operasional <b>Stasiun {activeStation}</b>. Gunakan fitur paginasi di bawah tabel untuk navigasi, atau filter rentang tanggal untuk mengunduh laporan utuh.
      </p>
      
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header py-3 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <h6 className="m-0 font-weight-bold text-primary mb-3 mb-md-0">Tabel Data Pengukuran</h6>
          <div className="d-flex flex-column flex-md-row align-items-md-center">
             <div className="d-flex align-items-center mb-2 mb-md-0 mr-md-3">
               <small className="text-muted mr-2 d-none d-md-inline">Mulai:</small>
               <input type="date" className="form-control form-control-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
               <span className="mx-2">-</span>
               <small className="text-muted mr-2 d-none d-md-inline">Akhir:</small>
               <input type="date" className="form-control form-control-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
             </div>
             <button onClick={handleDownloadFilteredCSV} disabled={isDownloading} className="btn btn-sm btn-success shadow-sm w-100">
                <i className={`fas ${isDownloading ? 'fa-spinner fa-spin' : 'fa-download'} fa-sm text-white-50 mr-2`}></i> 
                {isDownloading ? 'Memproses...' : 'Ekspor CSV'}
             </button>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive table-scrollable-container m-0">
            <table className="table table-bordered table-hover table-striped table-sticky-header mb-0" width="100%" cellSpacing="0">
              <thead className="thead-light">
                <tr>
                  <th>No</th>
                  <th>Suhu (°C)</th>
                  <th>Kelembapan (%)</th>
                  {/* HEADER TABEL DINAMIS */}
                  <th>{activeStation === 1 ? 'Tekanan Udara (hPa)' : 'Intensitas Cahaya (Lux)'}</th>
                  <th>Waktu Pencatatan</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingTable ? (
                  <tr><td colSpan="5" className="text-center py-5">Memuat data Stasiun {activeStation}...</td></tr>
                ) : tableData.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5">Belum ada data tersedia untuk Stasiun {activeStation}</td></tr>
                ) : (
                  tableData.map((row, index) => (
                    <tr key={row.id}>
                      <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                      <td>{row.temperature}</td>
                      <td>{row.humidity}</td>
                      {/* BARIS DATA DINAMIS */}
                      <td>{activeStation === 1 ? row.pressure : row.light_intensity}</td>
                      <td>{formatWaktu(row.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
          <small className="text-muted font-weight-bold">
            Halaman {currentPage} dari {totalPages}
          </small>
          <div>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || isLoadingTable} className="btn btn-sm btn-outline-primary mr-2 font-weight-bold">
              <i className="fas fa-chevron-left mr-1"></i> Sebelumnya
            </button>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || isLoadingTable} className="btn btn-sm btn-outline-primary font-weight-bold">
              Selanjutnya <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}