import { formatDateTime } from './date';

/**
 * Converts sensor data array into a CSV file and triggers a browser download.
 * 
 * @param {Object} options
 * @param {Array} options.data - Sensor row data from the database
 * @param {Object} options.stationConfig - Active station configuration
 * @param {string} options.filename - File name for the downloaded CSV
 */
export const exportSensorDataToCSV = ({ data, stationConfig, filename }) => {
  if (!data || data.length === 0) {
    throw new Error('No data available to export.');
  }

  const p3Key = stationConfig.parameter3.key;
  const p3Header = `${stationConfig.parameter3.label} (${stationConfig.parameter3.unit})`;

  let csvContent = `No,Temperature (°C),Humidity (%),${p3Header},Recorded Time\n`;

  data.forEach((row, index) => {
    const temp = row.temperature ?? '';
    const hum = row.humidity ?? '';
    const p3 = row[p3Key] ?? '';
    const formattedTime = formatDateTime(row.created_at);

    csvContent += `${index + 1},${temp},${hum},${p3},"${formattedTime}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename || `Data_Station_${stationConfig.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

