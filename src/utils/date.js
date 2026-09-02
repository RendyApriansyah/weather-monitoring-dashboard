/**
 * Utility Pemformatan Tanggal & Waktu untuk EMD Dashboard
 */

/**
 * Format ISO string ke format lengkap: DD/MM/YYYY HH:mm
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return '--';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '--';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Format jam menit singkat untuk grafik interval harian (misal: 14:30)
 */
export const formatTimeShort = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format tanggal singkat untuk grafik interval mingguan/bulanan (misal: 02 Sep)
 */
export const formatDateShort = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};

/**
 * Mendapatkan teks jam sekarang dalam WIB (misal: 14:30 WIB)
 */
export const getCurrentTimeStringWIB = () => {
  const now = new Date();
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
};

