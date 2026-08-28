import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function History() {
  const [tableData, setTableData] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  
  // State Filter Tanggal
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // State Paginasi Baru
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ROWS_PER_PAGE = 25;

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

  // Effect Paginasi: Hanya mengambil 25 baris dari Supabase sesuai halaman aktif
  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoadingTable(true);
      
      // Kalkulasi indeks data (misal Halaman 1 = 0-24, Halaman 2 = 25-49)
      const from = (currentPage - 1) * ROWS_PER_PAGE;
      const to = from + ROWS_PER_PAGE - 1;

      // 1. Ambil Total Baris untuk menghitung jumlah halaman
      const { count } = await supabase
        .from('sensor_data')
        .select('*', { count: 'exact', head: true });

      if (count) setTotalPages(Math.ceil(count / ROWS_PER_PAGE));

      // 2. Ambil sebagian data sesuai rentang (range)
      const { data } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (data) setTableData(data);
      setIsLoadingTable(false);
    };
    fetchTableData();
  }, [currentPage]); // Akan berjalan otomatis setiap kali currentPage berubah

  const handleDownloadFilteredCSV = async () => {
    setIsDownloading(true);
    let dataToExport = tableData; 

    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00`).toISOString();
      const end = new Date(`${endDate}T23:59:59`).toISOString();

      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        alert("Gagal atau tidak ada data pada rentang tersebut.");
        setIsDownloading(false);
        return;
      }
      dataToExport = data;
    }

    let csvContent = "No,Suhu (°C),Kelembapan (%),Tekanan Udara (hPa),Waktu Pencatatan\n";
    dataToExport.forEach((row, index) => {
      csvContent += `${index + 1},${row.temperature},${row.humidity},${row.pressure},"${formatWaktu(row.created_at)}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const fileName = (startDate && endDate) ? `Laporan_Cuaca_${startDate}_hingga_${endDate}.csv` : `Data_Cuaca_Terbaru.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
  };

  return (
    <>
      <p className="mb-4 text-gray-600">
        Menampilkan riwayat data operasional. Gunakan fitur paginasi di bawah tabel untuk navigasi, atau filter rentang tanggal untuk mengunduh laporan utuh.
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
        
        <div className="card-body p-0"> {/* Padding dihilangkan agar tabel membaur bersih dengan card */}
          <div className="table-responsive table-scrollable-container m-0">
            <table className="table table-bordered table-hover table-striped table-sticky-header mb-0" width="100%" cellSpacing="0">
              <thead className="thead-light">
                <tr>
                  <th>No</th>
                  <th>Suhu (°C)</th>
                  <th>Kelembapan (%)</th>
                  <th>Tekanan Udara (hPa)</th>
                  <th>Waktu Pencatatan</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingTable ? (
                  <tr><td colSpan="5" className="text-center py-5">Memuat data...</td></tr>
                ) : tableData.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5">Belum ada data tersedia</td></tr>
                ) : (
                  tableData.map((row, index) => (
                    <tr key={row.id}>
                      {/* Kalkulasi nomor urut agar berlanjut di halaman berikutnya */}
                      <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                      <td>{row.temperature}</td>
                      <td>{row.humidity}</td>
                      <td>{row.pressure}</td>
                      <td>{formatWaktu(row.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kontrol Navigasi Paginasi */}
        <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
          <small className="text-muted font-weight-bold">
            Halaman {currentPage} dari {totalPages}
          </small>
          <div>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1 || isLoadingTable} 
              className="btn btn-sm btn-outline-primary mr-2 font-weight-bold"
            >
              <i className="fas fa-chevron-left mr-1"></i> Sebelumnya
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages || isLoadingTable} 
              className="btn btn-sm btn-outline-primary font-weight-bold"
            >
              Selanjutnya <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}