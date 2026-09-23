import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatTimeShort, formatDateShort } from '../utils/date';

/**
 * Custom Hook to load summary statistics (RPC) and historical trend chart data
 */
export function useHistoricalData(stationConfig, days = 1) {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const { tableName, rpcName, parameter3 } = stationConfig;
    const p3Key = parameter3.key;

    const fetchHistorical = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Call RPC for statistics (Max / Avg / Min)
        const { data: statsData, error: rpcError } = await supabase.rpc(rpcName, {
          interval_days: days
        });

        if (rpcError) {
          console.warn(`[useHistoricalData] RPC warning (${rpcName}):`, rpcError);
        }

        if (isMounted && statsData && statsData.length > 0) {
          setStats(statsData[0]);
        }

        // 2. Fetch time series data for charts
        const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        const selectQuery = `created_at, temperature, humidity, ${p3Key}`;

        const { data: rawChart, error: chartError } = await supabase
          .from(tableName)
          .select(selectQuery)
          .gte('created_at', fromDate)
          .order('created_at', { ascending: true });

        if (chartError) throw chartError;

        if (isMounted && rawChart) {
          const formatted = rawChart.map((item) => ({
            ...item,
            timeLabel: days === 1 ? formatTimeShort(item.created_at) : formatDateShort(item.created_at),
            parameter3_value: item[p3Key]
          }));
          setChartData(formatted);
        }
      } catch (err) {
        console.error(`[useHistoricalData] Failed to load chart data (${tableName}):`, err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistorical();

    return () => {
      isMounted = false;
    };
  }, [stationConfig, days]);

  return { stats, chartData, isLoading, error };
}

