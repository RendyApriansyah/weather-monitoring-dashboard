import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function History() {
  const [tableData, setTableData] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  
  // State baru untuk Filter Tanggal
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Effect: Tetap memuat 200 data terakhir untuk preview tabel di halaman
  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoadingTable(true);
      const { data } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
        
      if (data) setTableData(data);
      setIsLoadingTable(false);
    };
    fetchTableData();
  }, []);

  // Fungsi Pintar: Download CSV Berdasarkan Filter
  const handleDownloadFilteredCSV = async () => {
    setIsDownloading(true);
    let dataToExport = tableData; // Default: pakai data tabel jika tanggal tidak diisi

    // Jika pengguna mengisi kedua tanggal, ambil data baru dari Supabase
    if (startDate && endDate) {
      // Tambahkan waktu 00:00:00 di awal dan 23:59:59 di akhir agar sehari penuh terbaca
      const start = new Date(`${startDate}T00:00:00`).toISOString();
      const end = new Date(`${endDate}T23:59:59`).toISOString();

      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: true }); // Diurutkan dari data terlama ke terbaru untuk laporan

      if (error) {
        alert("Gagal mengambil data dari database.");
        setIsDownloading(false);
        return;
      }

      if (data && data.length > 0) {
        dataToExport = data;
      } else {
        alert("Tidak ada data yang terekam pada rentang tanggal tersebut.");
        setIsDownloading(false);
        return;
      }
    }

    // Merakit file CSV di komputer Client
    let csvContent = "No,Suhu (°C),Kelembapan (%),Tekanan Udara (hPa),Waktu Pencatatan\n";
    dataToExport.forEach((row, index) => {
      const time = new Date(row.created_at).toLocaleString('id-ID');
      csvContent += `${index + 1},${row.temperature},${row.humidity},${row.pressure},"${time}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    // Penamaan file dinamis berdasarkan filter
    const fileName = (startDate && endDate) 
      ? `Laporan_Cuaca_${startDate}_hingga_${endDate}.csv` 
      : `Data_Cuaca_Terakhir_${new Date().toISOString().slice(0,10)}.csv`;
      
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
  };

  return (
    <>
      <p className="mb-4 text-gray-600">
        Berikut adalah pratinjau 200 data terakhir yang terekam oleh stasiun cuaca. 
        Gunakan rentang tanggal di bawah ini jika Anda ingin mengunduh riwayat lengkap pada periode tertentu.
      </p>
      
      <div className="card shadow-sm border-0 mb-4">
        
        {/* Header Tabel dengan Kontrol Filter (Dibuat responsif untuk Mobile) */}
        <div className="card-header py-3 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <h6 className="m-0 font-weight-bold text-primary mb-3 mb-md-0">Tabel Data Pengukuran</h6>
          
          <div className="d-flex flex-column flex-md-row align-items-md-center">
             <div className="d-flex align-items-center mb-2 mb-md-0 mr-md-3">
               <small className="text-muted mr-2 d-none d-md-inline">Mulai:</small>
               <input 
                 type="date" 
                 className="form-control form-control-sm" 
                 value={startDate} 
                 onChange={e => setStartDate(e.target.value)} 
               />
               <span className="mx-2">-</span>
               <small className="text-muted mr-2 d-none d-md-inline">Akhir:</small>
               <input 
                 type="date" 
                 className="form-control form-control-sm" 
                 value={endDate} 
                 onChange={e => setEndDate(e.target.value)} 
               />
             </div>
             
             <button 
               onClick={handleDownloadFilteredCSV} 
               disabled={isDownloading} 
               className="btn btn-sm btn-success shadow-sm w-100"
             >
                <i className={`fas ${isDownloading ? 'fa-spinner fa-spin' : 'fa-download'} fa-sm text-white-50 mr-2`}></i> 
                {isDownloading ? 'Memproses...' : 'Ekspor ke CSV'}
             </button>
          </div>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
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
                  <tr><td colSpan="5" className="text-center py-4">Memuat data...</td></tr>
                ) : tableData.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4">Belum ada data tersedia</td></tr>
                ) : (
                  tableData.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.temperature}</td>
                      <td>{row.humidity}</td>
                      <td>{row.pressure}</td>
                      <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}