import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ activeStation }) {
  const [sensorData, setSensorData] = useState({ temperature: '--', humidity: '--', parameter3: '--' });
  const [days, setDays] = useState(1);
  const [historicalStats, setHistoricalStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isDataValid = (t, h, p3) => {
    return t !== null && h !== null && p3 !== null;
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const tableName = activeStation === 1 ? 'sensor_data' : 'station_2_data';
    const rpcName = activeStation === 1 ? 'get_historical_stats' : 'get_station2_stats';

    const fetchLatestData = async () => {
      const { data } = await supabase.from(tableName).select('*').order('created_at', { ascending: false }).limit(1).single();
      if (data) {
        const p3 = activeStation === 1 ? data.pressure : data.light_intensity;
        if (isDataValid(data.temperature, data.humidity, p3)) {
          setSensorData({ temperature: data.temperature, humidity: data.humidity, parameter3: p3 });
        } else {
          setSensorData({ temperature: 'ERR', humidity: 'ERR', parameter3: 'ERR' });
        }
      }
    };
    
    const fetchChartData = async () => {
      const { data: statsData } = await supabase.rpc(rpcName, { interval_days: days });
      if (statsData && statsData.length > 0) setHistoricalStats(statsData[0]);

      const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const selectQuery = activeStation === 1 ? 'created_at, temperature, humidity, pressure' : 'created_at, temperature, humidity, light_intensity';
      
      const { data: chartResult } = await supabase.from(tableName).select(selectQuery).gte('created_at', fromDate).order('created_at', { ascending: true });
      
      if (chartResult) {
        setChartData(chartResult.map(item => ({
          ...item, 
          timeLabel: days === 1 ? new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
          parameter3_value: activeStation === 1 ? item.pressure : item.light_intensity
        })));
      }
    };

    fetchLatestData();
    fetchChartData();

    const subscription = supabase.channel(`sensor_listener_${tableName}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: tableName }, (payload) => {
        const p3 = activeStation === 1 ? payload.new.pressure : payload.new.light_intensity;
        setSensorData({ temperature: payload.new.temperature, humidity: payload.new.humidity, parameter3: p3 });
      }).subscribe();

    return () => {
      supabase.removeChannel(subscription);
      window.removeEventListener('resize', handleResize);
    };
  }, [days, activeStation]);

  const currentCards = [
    {
      title: 'Suhu Saat Ini',
      value: `${sensorData.temperature} °C`,
      icon: 'fa-thermometer-half',
      colorClass: 'temperature',
      borderClass: 'border-bottom-temperature'
    },
    {
      title: 'Kelembapan',
      value: `${sensorData.humidity}%`,
      icon: 'fa-tint',
      colorClass: 'primary',
      borderClass: 'border-bottom-primary'
    },
    {
      title: activeStation === 1 ? 'Tekanan Udara' : 'Intensitas Cahaya',
      value: `${sensorData.parameter3} ${activeStation === 1 ? 'hPa' : 'Lux'}`,
      icon: activeStation === 1 ? 'fa-wind' : 'fa-sun',
      colorClass: activeStation === 1 ? 'success' : 'info',
      borderClass: activeStation === 1 ? 'border-bottom-success' : 'border-bottom-info'
    }
  ];

  const statsList = [
    {
      title: 'Statistik Suhu (°C)',
      colorClass: 'text-temperature',
      max: historicalStats?.temp_max ?? '--',
      avg: historicalStats?.temp_avg ?? '--',
      min: historicalStats?.temp_min ?? '--'
    },
    {
      title: 'Statistik Kelembapan (%)',
      colorClass: 'text-primary',
      max: historicalStats?.hum_max ?? '--',
      avg: historicalStats?.hum_avg ?? '--',
      min: historicalStats?.hum_min ?? '--'
    },
    {
      title: activeStation === 1 ? 'Statistik Tekanan (hPa)' : 'Statistik Cahaya (Lux)',
      colorClass: activeStation === 1 ? 'text-success' : 'text-info',
      max: activeStation === 1 ? (historicalStats?.pres_max ?? '--') : (historicalStats?.light_max ?? '--'),
      avg: activeStation === 1 ? (historicalStats?.pres_avg ?? '--') : (historicalStats?.light_avg ?? '--'),
      min: activeStation === 1 ? (historicalStats?.pres_min ?? '--') : (historicalStats?.light_min ?? '--')
    }
  ];

  const charts = [
    {
      title: 'Grafik Tren Suhu (°C)',
      colorClass: 'text-temperature',
      dataKey: 'temperature',
      name: 'Suhu (°C)',
      stroke: '#d39e00'
    },
    {
      title: 'Grafik Tren Kelembapan (%)',
      colorClass: 'text-primary',
      dataKey: 'humidity',
      name: 'Kelembapan (%)',
      stroke: '#4e73df'
    },
    {
      title: activeStation === 1 ? 'Grafik Tren Tekanan Udara (hPa)' : 'Grafik Tren Intensitas Cahaya (Lux)',
      colorClass: activeStation === 1 ? 'text-success' : 'text-info',
      dataKey: 'parameter3_value',
      name: activeStation === 1 ? 'Tekanan (hPa)' : 'Cahaya (Lux)',
      stroke: activeStation === 1 ? '#1cc88a' : '#36b9cc'
    }
  ];

  return (
    <>
      <div className="row mb-4">
        {currentCards.map((card, idx) => (
          <div key={idx} className="col-xl-4 col-md-6 mb-4 mb-xl-0">
            <div className={`card shadow-sm h-100 py-3 rounded-lg border-0 card-border-bottom ${card.borderClass}`}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className={`text-xs font-weight-bold text-${card.colorClass} text-uppercase mb-2`}>
                    {card.title}
                  </div>
                  <div className="h3 mb-0 font-weight-bold text-gray-800">
                    {card.value}
                  </div>
                </div>
                <i className={`fas ${card.icon} fa-3x text-gray-300`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-4 mt-md-5">
        <h1 className="h5 mb-0 text-gray-800 font-weight-bold">Analisis Historis {activeStation === 1 ? '(BME280)' : '(DHT & BH1750)'}</h1>
        <div className="d-block d-md-none">
          <select className="form-select form-select-sm shadow-sm font-weight-bold text-primary border-0 mobile-dropdown" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={1}>24 Jam Terakhir</option><option value={7}>7 Hari Terakhir</option><option value={30}>30 Hari Terakhir</option>
          </select>
        </div>
        <div className="d-none d-md-block btn-group shadow-sm">
          <button onClick={() => setDays(1)} className={`btn btn-sm ${days === 1 ? 'btn-primary' : 'btn-white bg-white text-dark'}`}>24 Jam</button>
          <button onClick={() => setDays(7)} className={`btn btn-sm ${days === 7 ? 'btn-primary' : 'btn-white bg-white text-dark'}`}>7 Hari</button>
          <button onClick={() => setDays(30)} className={`btn btn-sm ${days === 30 ? 'btn-primary' : 'btn-white bg-white text-dark'}`}>30 Hari</button>
        </div>
      </div>

      <div className="card shadow-sm rounded-lg border-0 mb-4 p-4 bg-white">
        <div className="row text-center">
          {statsList.map((stat, idx) => (
            <div key={idx} className="col-12 col-md-4 stat-divider">
              <h6 className={`${stat.colorClass} font-weight-bold mb-3`}>{stat.title}</h6>
              <div className="d-flex justify-content-around">
                <div><small className="text-muted d-block">Max</small><b>{stat.max}</b></div>
                <div><small className="text-muted d-block">Avg</small><b>{stat.avg}</b></div>
                <div><small className="text-muted d-block">Min</small><b>{stat.min}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        {charts.map((chart, idx) => (
          <div key={idx} className="col-12 mb-4">
            <div className="card shadow-sm rounded-lg border-0 p-3 p-md-4 bg-white h-100">
              <h6 className={`${chart.colorClass} font-weight-bold mb-4`}>{chart.title}</h6>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: isMobile ? -25 : -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                    <XAxis dataKey="timeLabel" tick={{ fontSize: 12, fill: '#888' }} tickMargin={10} minTickGap={40} />
                    <YAxis tick={{ fontSize: 12, fill: '#888' }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" name={chart.name} dataKey={chart.dataKey} stroke={chart.stroke} strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
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
