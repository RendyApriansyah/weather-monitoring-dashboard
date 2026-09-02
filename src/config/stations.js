/**
 * Konfigurasi Terpusat Seluruh Stasiun Sensor IoT EMD
 * 
 * Untuk menambahkan Stasiun baru (misal Stasiun 3):
 * Cukup tambahkan entri objek baru pada STATIONS di bawah ini
 * tanpa perlu mengubah kode komponen tampilan.
 */
export const STATIONS = {
  1: {
    id: 1,
    name: 'Stasiun 1 (BME280)',
    shortName: 'Stasiun 1 (BME)',
    sensor: 'BME280',
    tableName: 'sensor_data',
    rpcName: 'get_historical_stats',
    rpcStatsPrefix: 'pres', // pres_max, pres_avg, pres_min
    parameter3: {
      key: 'pressure',
      label: 'Tekanan Udara',
      shortLabel: 'Tekanan',
      unit: 'hPa',
      iconName: 'Wind',
      colorClass: 'success',
      borderClass: 'border-bottom-success',
      textClass: 'text-success',
      stroke: '#1cc88a'
    }
  },
  2: {
    id: 2,
    name: 'Stasiun 2 (DHT & BH1750)',
    shortName: 'Stasiun 2 (DHT)',
    sensor: 'DHT & BH1750',
    tableName: 'station_2_data',
    rpcName: 'get_station2_stats',
    rpcStatsPrefix: 'light', // light_max, light_avg, light_min
    parameter3: {
      key: 'light_intensity',
      label: 'Intensitas Cahaya',
      shortLabel: 'Cahaya',
      unit: 'Lux',
      iconName: 'Sun',
      colorClass: 'info',
      borderClass: 'border-bottom-info',
      textClass: 'text-info',
      stroke: '#36b9cc'
    }
  }
};

export const DEFAULT_STATION_ID = 1;
export const STATION_LIST = Object.values(STATIONS);

export const getStationConfig = (stationId) => {
  const numericId = Number(stationId);
  return STATIONS[numericId] || STATIONS[DEFAULT_STATION_ID];
};

