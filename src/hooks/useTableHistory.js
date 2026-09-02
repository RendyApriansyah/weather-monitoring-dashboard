import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const DEFAULT_ROWS_PER_PAGE = 25;

/**
 * Custom Hook untuk memuat data tabel riwayat terpaginasi
 */
export function useTableHistory(stationConfig, currentPage = 1, pageSize = DEFAULT_ROWS_PER_PAGE) {
  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async () => {
    const { tableName } = stationConfig;

    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // Hitung total baris
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      if (typeof count === 'number') {
        setTotalCount(count);
        setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
      }

      // Ambil baris sesuai range
      const { data, error: dataError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (dataError) throw dataError;

      if (data) {
        setTableData(data);
      }
    } catch (err) {
      console.error(`[useTableHistory] Gagal memuat data tabel ${stationConfig.tableName}:`, err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [stationConfig, currentPage, pageSize]);

  useEffect(() => {
    let isCancelled = false;

    // Masuk ke microtask agar tidak memicu peringatan render bertingkat React 19
    Promise.resolve().then(() => {
      if (!isCancelled) {
        setIsLoading(true);
        setError(null);
        fetchPage();
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [fetchPage]);

  return { tableData, totalPages, totalCount, isLoading, error, refetch: fetchPage };
}

