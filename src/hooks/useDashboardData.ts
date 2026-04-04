"use client";

import { useState, useEffect, useCallback } from "react";

interface DashboardData {
  tasks: any[];
  projects: any[];
  stats: {
    tasksCompleted: number;
    inProgress: number;
    scheduled: number;
    documents: number;
  };
  activities: any[];
  lastUpdated: string;
}

const defaultData: DashboardData = {
  tasks: [],
  projects: [],
  stats: {
    tasksCompleted: 0,
    inProgress: 0,
    scheduled: 0,
    documents: 0,
  },
  activities: [],
  lastUpdated: new Date().toISOString(),
};

export function useDashboardData(refreshInterval: number = 30000) {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/data");
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = useCallback(async (updates: Partial<DashboardData>) => {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
      return result.success;
    } catch (err) {
      setError(String(err));
      return false;
    }
  }, []);

  // 初始載入
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 定期更新
  useEffect(() => {
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  // 頁面重新獲得焦點時更新
  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, updateData };
}
