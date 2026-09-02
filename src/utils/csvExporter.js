import { formatDateTime } from './date';

/**
 * Mengonversi array data sensor menjadi file CSV dan mengunduhnya ke peramban.
 * 
 * @param {Object} options
 * @param {Array} options.data - Data baris sensor dari database
 * @param {Object} options.stationConfig - Konfigurasi stasiun aktif
 * @param {string} options.filename - Nama file CSV yang akan diunduh
 */
export const exportSensorDataToCSV = ({ data, stationConfig, filename }) => {
  if (!data || data.length === 0) {
    throw new Error('Tidak ada data yang dapat diekspor.');
  }

  const p3Key = stationConfig.parameter3.key;
  const p3Header = `${stationConfig.parameter3.label} (${stationConfig.parameter3.unit})`;

  let csvContent = `No,Suhu (°C),Kelembapan (%),${p3Header},Waktu Pencatatan\n`;

  data.forEach((row, index) => {
    const temp = row.temperature ?? '';
    const hum = row.humidity ?? '';
    const p3 = row[p3Key] ?? '';
    const waktu = formatDateTime(row.created_at);

    csvContent += `${index + 1},${temp},${hum},${p3},"${waktu}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename || `Data_Stasiun_${stationConfig.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

