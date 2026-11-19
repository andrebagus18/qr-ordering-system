import { getTableQr } from "@/services/tables.services";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useTables() {
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const qrCode = searchParams.get("table");

  const fetchTable = useCallback(async () => {
    if (!qrCode) {
      setLoading(false);
      return;
    }
    try {
      const response = await getTableQr();
      setTable(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Gagal mengambil data meja:", error);
      setTable(null);
    } finally {
      setLoading(false);
    }
  }, [qrCode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTable();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchTable]);

  return {
    table,
    loading,
  };
}
