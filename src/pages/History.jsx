import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function History() {
  const [tableData, setTableData] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      setIsLoadingTable(true);
      const { data } = await supabase.from('sensor_data').select('*').order('created_at', { ascending: false }).limit(200);
      if (data) setTableData(data);
      setIsLoadingTable(false);
    };
    fetchTableData();
  }, []);

  const handleDownloadCSV = () => {
    if (tableData.length === 0) return;
    let csvContent = "No,Suhu (°C),Kelembapan (%),Tekanan Udara (hPa),Waktu Pencatatan\n";
    tableData.forEach((row, index) => {
      const time = new Date(row.created_at).toLocaleString('id-ID');
      csvContent += `${index + 1},${row.temperature},${row.humidity},${row.pressure},"${time}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Cuaca_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <p className="mb-4 text-gray-600">Berikut adalah seluruh data yang terekam oleh stasiun cuaca. Menampilkan 200 data terakhir.</p>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header py-3 bg-white d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">Tabel Data Pengukuran</h6>
          <button onClick={handleDownloadCSV} className="btn btn-sm btn-success shadow-sm">
            <i className="fas fa-download fa-sm text-white-50 mr-2"></i> Ekspor ke CSV
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
              <thead className="thead-light">
                <tr><th>No</th><th>Suhu (°C)</th><th>Kelembapan (%)</th><th>Tekanan Udara (hPa)</th><th>Waktu Pencatatan</th></tr>
              </thead>
              <tbody>
                {isLoadingTable ? <tr><td colSpan="5" className="text-center py-4">Memuat data...</td></tr> : 
                  tableData.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td><td>{row.temperature}</td><td>{row.humidity}</td><td>{row.pressure}</td>
                    <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}