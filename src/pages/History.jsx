import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getStationConfig } from '../config/stations';
import { useTableHistory, DEFAULT_ROWS_PER_PAGE } from '../hooks/useTableHistory';
import { formatDateTime } from '../utils/date';
import { exportSensorDataToCSV } from '../utils/csvExporter';
import { supabase } from '../lib/supabaseClient';

export default function History({ activeStation = 1 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const stationConfig = getStationConfig(activeStation);
  const { tableData, totalPages, isLoading } = useTableHistory(stationConfig, currentPage);

  const p3 = stationConfig.parameter3;

  const handleDownloadFilteredCSV = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      const { tableName } = stationConfig;
      let dataToExport = [];

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
          alert('Tidak ada data terekam pada rentang tanggal tersebut.');
          return;
        }
        dataToExport = data;
      } else {
        // Ambil hingga 1000 data terakhir jika filter tanggal kosong
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (error) throw error;
        if (!data || data.length === 0) {
          alert(`Belum ada data terekam untuk ${stationConfig.name}.`);
          return;
        }
        dataToExport = data;
      }

      const fileName = startDate && endDate
        ? `Laporan_${stationConfig.shortName.replace(/\s+/g, '_')}_${startDate}_${endDate}.csv`
        : `Data_${stationConfig.shortName.replace(/\s+/g, '_')}_Terbaru.csv`;

      exportSensorDataToCSV({
        data: dataToExport,
        stationConfig,
        filename: fileName
      });
    } catch (error) {
      console.error('Gagal mengekspor CSV:', error);
      alert('Terjadi kesalahan jaringan saat mengunduh laporan CSV.');
      setDownloadError(error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <p className="mb-4 text-gray-600">
        Menampilkan riwayat data operasional <b>{stationConfig.name}</b>. Gunakan fitur paginasi di bawah tabel untuk navigasi, atau filter rentang tanggal untuk mengunduh laporan utuh.
      </p>

      {downloadError && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {downloadError}
        </div>
      )}

      <div className="card shadow-sm border-0 mb-4">
        {/* HEADER TABEL & FILTER TANGGAL */}
        <div className="card-header py-3 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <h6 className="m-0 font-weight-bold text-primary mb-3 mb-md-0">
            Tabel Data Pengukuran ({stationConfig.sensor})
          </h6>
          <div className="d-flex flex-column flex-md-row align-items-md-center">
            <div className="d-flex align-items-center mb-2 mb-md-0 mr-md-3">
              <small className="text-muted mr-2 d-none d-md-inline">Mulai:</small>
              <input
                type="date"
                className="form-control form-control-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Tanggal Mulai"
              />
              <span className="mx-2">-</span>
              <small className="text-muted mr-2 d-none d-md-inline">Akhir:</small>
              <input
                type="date"
                className="form-control form-control-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="Tanggal Akhir"
              />
            </div>
            <button
              onClick={handleDownloadFilteredCSV}
              disabled={isDownloading}
              className="btn btn-sm btn-success shadow-sm w-100 d-flex align-items-center justify-content-center"
            >
              {isDownloading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Download size={16} className="mr-2" />
              )}
              {isDownloading ? 'Memproses...' : 'Ekspor CSV'}
            </button>
          </div>
        </div>

        {/* ISI TABEL */}
        <div className="card-body p-0">
          <div className="table-responsive table-scrollable-container m-0">
            <table className="table table-bordered table-hover table-striped table-sticky-header mb-0" width="100%" cellSpacing="0">
              <thead className="thead-light">
                <tr>
                  <th>No</th>
                  <th>Suhu (°C)</th>
                  <th>Kelembapan (%)</th>
                  <th>{p3.label} ({p3.unit})</th>
                  <th>Waktu Pencatatan</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <Loader2 size={24} className="animate-spin d-inline mr-2 text-primary" />
                      Memuat data {stationConfig.shortName}...
                    </td>
                  </tr>
                ) : tableData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      Belum ada data tersedia untuk {stationConfig.name}
                    </td>
                  </tr>
                ) : (
                  tableData.map((row, index) => (
                    <tr key={row.id}>
                      <td>{(currentPage - 1) * DEFAULT_ROWS_PER_PAGE + index + 1}</td>
                      <td>{row.temperature ?? '--'}</td>
                      <td>{row.humidity ?? '--'}</td>
                      <td>{row[p3.key] ?? '--'}</td>
                      <td>{formatDateTime(row.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER TABEL / PAGINASI */}
        <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
          <small className="text-muted font-weight-bold">
            Halaman {currentPage} dari {totalPages}
          </small>
          <div className="d-flex align-items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="btn btn-sm btn-outline-primary mr-2 font-weight-bold d-flex align-items-center"
            >
              <ChevronLeft size={16} className="mr-1" /> Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
              className="btn btn-sm btn-outline-primary font-weight-bold d-flex align-items-center"
            >
              Selanjutnya <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}