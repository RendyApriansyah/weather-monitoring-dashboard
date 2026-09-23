/**
 * Date & Time Formatting Utilities for EMD Dashboard
 */

/**
 * Formats ISO string to full format: DD/MM/YYYY HH:mm
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
 * Formats short time for daily interval charts (e.g. 14:30)
 */
export const formatTimeShort = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * Formats short date for weekly/monthly interval charts (e.g. 02 Sep)
 */
export const formatDateShort = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

/**
 * Gets the current time string in WIB (e.g. 14:30 WIB)
 */
export const getCurrentTimeStringWIB = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB';
};

