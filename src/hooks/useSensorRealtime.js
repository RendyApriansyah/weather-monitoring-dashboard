import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Custom Hook untuk pemantauan data sensor real-time
 * Mendukung pembacaan awal + WebSocket Supabase listener
 */
export function useSensorRealtime(stationConfig) {
  const [sensorData, setSensorData] = useState({
    temperature: '--',
    humidity: '--',
    parameter3: '--'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const { tableName, parameter3 } = stationConfig;
    const p3Key = parameter3.key;

    const isDataValid = (t, h, p3) => t !== null && h !== null && p3 !== null;

    const fetchLatestData = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (isMounted && data) {
          const p3 = data[p3Key];
          if (isDataValid(data.temperature, data.humidity, p3)) {
            setSensorData({
              temperature: data.temperature,
              humidity: data.humidity,
              parameter3: p3
            });
          } else {
            setSensorData({ temperature: 'ERR', humidity: 'ERR', parameter3: 'ERR' });
          }
        }
      } catch (err) {
        console.error(`[useSensorRealtime] Gagal mengambil data awal ${tableName}:`, err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLatestData();

    // Setup Supabase Realtime Channel
    const channelName = `realtime_${tableName}_${Date.now()}`;
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: tableName },
        (payload) => {
          if (!isMounted) return;
          const newRow = payload.new;
          const p3 = newRow[p3Key];
          if (isDataValid(newRow.temperature, newRow.humidity, p3)) {
            setSensorData({
              temperature: newRow.temperature,
              humidity: newRow.humidity,
              parameter3: p3
            });
          } else {
            setSensorData({ temperature: 'ERR', humidity: 'ERR', parameter3: 'ERR' });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, [stationConfig]);

  return { sensorData, isLoading, error };
}

