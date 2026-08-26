import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({ temperature: '--', humidity: '--', pressure: '--' });
  const [days, setDays] = useState(1);
  const [historicalStats, setHistoricalStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchLatestData = async () => {
      const { data } = await supabase.from('sensor_data').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (data) setSensorData({ temperature: data.temperature, humidity: data.humidity, pressure: data.pressure });
    };
    
    const fetchChartData = async () => {
      const { data: statsData } = await supabase.rpc('get_historical_stats', { interval_days: days });
      if (statsData && statsData.length > 0) setHistoricalStats(statsData[0]);

      const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data: chartResult } = await supabase.from('sensor_data').select('created_at, temperature, humidity, pressure').gte('created_at', fromDate).order('created_at', { ascending: true });
      if (chartResult) {
        setChartData(chartResult.map(item => ({
          ...item, timeLabel: days === 1 ? new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        })));
      }
    };

    fetchLatestData();
    fetchChartData();

    const subscription = supabase.channel('sensor_listener').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_data' }, (payload) => {
        setSensorData({ temperature: payload.new.temperature, humidity: payload.new.humidity, pressure: payload.new.pressure });
    }).subscribe();

    return () => supabase.removeChannel(subscription);
  }, [days]);

  return (
    <>
      <div className="row mb-4">
        <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
          <div className="card shadow-sm h-100 py-3 rounded-lg border-0 border-bottom-warning" style={{ borderBottomWidth: '4px' }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div><div className="text-xs font-weight-bold text-warning text-uppercase mb-2">Suhu Saat Ini</div><div className="h3 mb-0 font-weight-bold text-gray-800">{sensorData.temperature} °C</div></div>
              <i className="fas fa-thermometer-half fa-3x text-gray-300"></i>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 mb-4 mb-xl-0">
          <div className="card shadow-sm h-100 py-3 rounded-lg border-0 border-bottom-primary" style={{ borderBottomWidth: '4px' }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div><div className="text-xs font-weight-bold text-primary text-uppercase mb-2">Kelembapan</div><div className="h3 mb-0 font-weight-bold text-gray-800">{sensorData.humidity}%</div></div>
              <i className="fas fa-tint fa-3x text-gray-300"></i>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-12">
          <div className="card shadow-sm h-100 py-3 rounded-lg border-0 border-bottom-success" style={{ borderBottomWidth: '4px' }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div><div className="text-xs font-weight-bold text-success text-uppercase mb-2">Tekanan Udara</div><div className="h3 mb-0 font-weight-bold text-gray-800">{sensorData.pressure} hPa</div></div>
              <i className="fas fa-wind fa-3x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h1 className="h5 mb-0 text-gray-800 font-weight-bold">Analisis Historis</h1>
        <div className="btn-group shadow-sm">
          <button onClick={() => setDays(1)} className={`btn btn-sm ${days === 1 ? 'btn-primary' : 'btn-white bg-white text-dark'}`}>24 Jam</button>
          <button onClick={() => setDays(7)} className={`btn btn-sm ${days === 7 ? 'btn-primary' : 'btn-white bg-white text-dark'}`}>7 Hari</button>
          <button onClick={() => setDays(30)} className={`btn btn-sm ${days === 30 ? 'btn-primary' : 'btn-white bg-white text-dark'}`}>30 Hari</button>
        </div>
      </div>

      <div className="card shadow-sm rounded-lg border-0 mb-4 p-4 bg-white">
        <div className="row text-center">
          <div className="col-md-4 border-right"><h6 className="text-warning font-weight-bold mb-3">Statistik Suhu (°C)</h6><div className="d-flex justify-content-around"><div><small className="text-muted d-block">Max</small><b>{historicalStats?.temp_max || '--'}</b></div><div><small className="text-muted d-block">Avg</small><b>{historicalStats?.temp_avg || '--'}</b></div><div><small className="text-muted d-block">Min</small><b>{historicalStats?.temp_min || '--'}</b></div></div></div>
          <div className="col-md-4 border-right"><h6 className="text-primary font-weight-bold mb-3">Statistik Kelembapan (%)</h6><div className="d-flex justify-content-around"><div><small className="text-muted d-block">Max</small><b>{historicalStats?.hum_max || '--'}</b></div><div><small className="text-muted d-block">Avg</small><b>{historicalStats?.hum_avg || '--'}</b></div><div><small className="text-muted d-block">Min</small><b>{historicalStats?.hum_min || '--'}</b></div></div></div>
          <div className="col-md-4"><h6 className="text-success font-weight-bold mb-3">Statistik Tekanan (hPa)</h6><div className="d-flex justify-content-around"><div><small className="text-muted d-block">Max</small><b>{historicalStats?.pres_max || '--'}</b></div><div><small className="text-muted d-block">Avg</small><b>{historicalStats?.pres_avg || '--'}</b></div><div><small className="text-muted d-block">Min</small><b>{historicalStats?.pres_min || '--'}</b></div></div></div>
        </div>
      </div>

      <div className="card shadow-sm rounded-lg border-0 p-4 bg-white">
        <h6 className="text-gray-800 font-weight-bold mb-4">Grafik Tren Suhu & Kelembapan</h6>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis dataKey="timeLabel" tick={{ fontSize: 12, fill: '#888' }} tickMargin={10} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#888' }} domain={['auto', 'auto']} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#888' }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Line yAxisId="left" type="monotone" name="Suhu (°C)" dataKey="temperature" stroke="#f6c23e" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" name="Kelembapan (%)" dataKey="humidity" stroke="#4e73df" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}