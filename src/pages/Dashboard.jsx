import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { getStationConfig } from '../config/stations';
import { useSensorRealtime } from '../hooks/useSensorRealtime';
import { useHistoricalData } from '../hooks/useHistoricalData';

const ICON_COMPONENTS = {
  Thermometer,
  Droplets,
  Wind,
  Sun
};

export default function Dashboard({ activeStation = 1 }) {
  const [days, setDays] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const stationConfig = getStationConfig(activeStation);
  const { sensorData } = useSensorRealtime(stationConfig);
  const { stats, chartData } = useHistoricalData(stationConfig, days);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const p3 = stationConfig.parameter3;
  const p3Icon = ICON_COMPONENTS[p3.iconName] || Sun;

  // 1. Kartu Pengukuran Real-Time
  const metricCards = [
    {
      title: 'Suhu Saat Ini',
      value: `${sensorData.temperature} °C`,
      Icon: Thermometer,
      textClass: 'text-temperature',
      borderClass: 'border-bottom-temperature'
    },
    {
      title: 'Kelembapan',
      value: `${sensorData.humidity}%`,
      Icon: Droplets,
      textClass: 'text-primary',
      borderClass: 'border-bottom-primary'
    },
    {
      title: p3.label,
      value: `${sensorData.parameter3} ${p3.unit}`,
      Icon: p3Icon,
      textClass: p3.textClass,
      borderClass: p3.borderClass
    }
  ];

  // 2. Ringkasan Statistik Dinamis (RPC)
  const prefix = stationConfig.rpcStatsPrefix;
  const statsList = [
    {
      title: 'Statistik Suhu (°C)',
      textClass: 'text-temperature',
      max: stats?.temp_max ?? '--',
      avg: stats?.temp_avg ?? '--',
      min: stats?.temp_min ?? '--'
    },
    {
      title: 'Statistik Kelembapan (%)',
      textClass: 'text-primary',
      max: stats?.hum_max ?? '--',
      avg: stats?.hum_avg ?? '--',
      min: stats?.hum_min ?? '--'
    },
    {
      title: `Statistik ${p3.shortLabel} (${p3.unit})`,
      textClass: p3.textClass,
      max: stats?.[`${prefix}_max`] ?? '--',
      avg: stats?.[`${prefix}_avg`] ?? '--',
      min: stats?.[`${prefix}_min`] ?? '--'
    }
  ];

  // 3. Konfigurasi Deret Grafik
  const charts = [
    {
      title: 'Grafik Tren Suhu (°C)',
      textClass: 'text-temperature',
      dataKey: 'temperature',
      name: 'Suhu (°C)',
      stroke: 'var(--color-temperature)'
    },
    {
      title: 'Grafik Tren Kelembapan (%)',
      textClass: 'text-primary',
      dataKey: 'humidity',
      name: 'Kelembapan (%)',
      stroke: 'var(--color-primary)'
    },
    {
      title: `Grafik Tren ${p3.label} (${p3.unit})`,
      textClass: p3.textClass,
      dataKey: 'parameter3_value',
      name: `${p3.shortLabel} (${p3.unit})`,
      stroke: p3.stroke
    }
  ];

  return (
    <>
      {/* KARTU METRIK UTAMA */}
      <div className="row mb-4">
        {metricCards.map((card, idx) => {
          const CardIcon = card.Icon;
          return (
            <div key={idx} className="col-xl-4 col-md-6 mb-4 mb-xl-0">
              <div className={`card shadow-sm h-100 py-3 rounded-lg border-0 card-border-bottom ${card.borderClass}`}>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <div className={`text-xs font-weight-bold ${card.textClass} text-uppercase mb-2`}>
                      {card.title}
                    </div>
                    <div className="h3 mb-0 font-weight-bold text-gray-800">
                      {card.value}
                    </div>
                  </div>
                  <CardIcon size={44} className="text-gray-300" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* HEADER SECTION ANALISIS & FILTER RENTANG */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4 mt-md-5">
        <h1 className="h5 mb-0 text-gray-800 font-weight-bold">
          Analisis Historis ({stationConfig.sensor})
        </h1>
        <div className="d-block d-md-none">
          <select
            className="form-select form-select-sm shadow-sm font-weight-bold text-primary border-0 mobile-dropdown"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            aria-label="Pilih Interval Waktu"
          >
            <option value={1}>24 Jam Terakhir</option>
            <option value={7}>7 Hari Terakhir</option>
            <option value={30}>30 Hari Terakhir</option>
          </select>
        </div>
        <div className="d-none d-md-block btn-group shadow-sm">
          {[
            { val: 1, label: '24 Jam' },
            { val: 7, label: '7 Hari' },
            { val: 30, label: '30 Hari' }
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setDays(val)}
              className={`btn btn-sm ${days === val ? 'btn-primary' : 'btn-white bg-white text-dark'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KARTU STATISTIK MAX / AVG / MIN */}
      <div className="card shadow-sm rounded-lg border-0 mb-4 p-4 bg-white">
        <div className="row text-center">
          {statsList.map((stat, idx) => (
            <div key={idx} className="col-12 col-md-4 stat-divider">
              <h6 className={`${stat.textClass} font-weight-bold mb-3`}>{stat.title}</h6>
              <div className="d-flex justify-content-around">
                <div><small className="text-muted d-block">Max</small><b>{stat.max}</b></div>
                <div><small className="text-muted d-block">Avg</small><b>{stat.avg}</b></div>
                <div><small className="text-muted d-block">Min</small><b>{stat.min}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BAGAN GRAFIK TREN (RECHARTS) */}
      <div className="row">
        {charts.map((chart, idx) => (
          <div key={idx} className="col-12 mb-4">
            <div className="card shadow-sm rounded-lg border-0 p-3 p-md-4 bg-white h-100">
              <h6 className={`${chart.textClass} font-weight-bold mb-4`}>{chart.title}</h6>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: isMobile ? -25 : -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                    <XAxis
                      dataKey="timeLabel"
                      tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                      tickMargin={10}
                      minTickGap={40}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        boxShadow: 'var(--shadow-sticky)'
                      }}
                    />
                    <Line
                      type="monotone"
                      name={chart.name}
                      dataKey={chart.dataKey}
                      stroke={chart.stroke}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
