import React, { useState, useEffect, useCallback } from 'react';
import { Activity, ShieldCheck, Server, AlertTriangle, RefreshCw } from 'lucide-react';

const SERVICE_CONFIGS = [
  { name: 'Gateway Service', port: 5000, endpoint: 'http://localhost:5000/health' },
  { name: 'Auth Service', port: 5001, endpoint: 'http://localhost:5001/health' },
  { name: 'Catalog Service', port: 5002, endpoint: 'http://localhost:5002/health' },
  { name: 'Cart Service', port: 5003, endpoint: 'http://localhost:5003/health' },
  { name: 'Order Service', port: 5004, endpoint: 'http://localhost:5004/health' },
];

export const ServerStatusWidget = () => {
  const [services, setServices] = useState(
    SERVICE_CONFIGS.map((s) => ({
      ...s,
      latency: 0,
      status: 'checking', // 'online' | 'degraded' | 'offline' | 'checking'
    }))
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pingAllServices = useCallback(async () => {
    setIsRefreshing(true);
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const gatewayHealthUrl = apiBase.endsWith('/api/v1') 
      ? apiBase.replace('/api/v1', '/health/services') 
      : 'http://localhost:5000/health/services';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(gatewayHealthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data?.services)) {
          setServices(data.services.map(s => ({
            name: s.name,
            port: s.port,
            latency: s.latency || 10,
            status: s.status || 'online'
          })));
          setIsRefreshing(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[SERVER STATUS WIDGET] Gateway aggregator ping failed, falling back to individual pings:', err.message);
    }

    // Fallback: Ping each endpoint individually
    const updated = await Promise.all(
      SERVICE_CONFIGS.map(async (srv) => {
        const start = performance.now();
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const res = await fetch(srv.endpoint, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' },
          });
          clearTimeout(timeoutId);

          const duration = Math.round(performance.now() - start);

          if (res.ok) {
            return {
              ...srv,
              latency: Math.max(1, duration),
              status: duration > 300 ? 'degraded' : 'online',
            };
          } else {
            return { ...srv, latency: duration, status: 'degraded' };
          }
        } catch (err) {
          return { ...srv, latency: 0, status: 'offline' };
        }
      })
    );

    setServices(updated);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    pingAllServices();
    const interval = setInterval(pingAllServices, 6000);
    return () => clearInterval(interval);
  }, [pingAllServices]);

  const onlineCount = services.filter((s) => s.status === 'online' || s.status === 'degraded').length;
  const operationalPercent = Math.round((onlineCount / services.length) * 100);
  const maxLatency = Math.max(...services.map((s) => s.latency), 50);

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
          <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
            Live Server Status
          </h3>
          <button
            onClick={pingAllServices}
            disabled={isRefreshing}
            className="text-[#797979] hover:text-[#704F38] dark:hover:text-[#E8B84E] transition-colors p-1"
            title="Refresh Health Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <span
          className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full ${
            operationalPercent === 100
              ? 'text-[#10B981] bg-[#ECFDF5] dark:bg-[#064E3B]/40'
              : operationalPercent >= 60
              ? 'text-[#F59E0B] bg-[#FFFBEB] dark:bg-[#78350F]/40'
              : 'text-[#EF4444] bg-[#FEF2F2] dark:bg-[#7F1D1D]/40'
          }`}
        >
          {operationalPercent === 100 ? (
            <ShieldCheck className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          {operationalPercent}% Operational
        </span>
      </div>

      {/* Latency Real Micro-Bar Chart */}
      <div className="flex items-stretch justify-between gap-2 h-20 pt-3 pb-2 border-b border-[#EDEDED] dark:border-[#262838] mb-4">
        {services.map((srv) => {
          const heightPercent =
            srv.status === 'offline'
              ? 8
              : Math.min(100, Math.max(15, (srv.latency / maxLatency) * 100));

          return (
            <div key={srv.name} className="flex-1 flex flex-col items-center justify-end gap-1 group relative h-full">
              <div className="w-full bg-[#F1F5F9] dark:bg-[#11121E] rounded-t-lg flex-1 flex items-end overflow-hidden p-0.5">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    srv.status === 'offline'
                      ? 'bg-[#EF4444]'
                      : srv.status === 'degraded'
                      ? 'bg-[#F59E0B]'
                      : 'bg-[#704F38] dark:bg-[#E8B84E] group-hover:opacity-90'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Hover Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1F2029] dark:bg-white text-white dark:text-[#1F2029] text-[9px] font-black px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {srv.status === 'offline' ? 'Offline (Unreachable)' : `${srv.latency} ms (${srv.name})`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Services List with Live Response Latency & Status Pills */}
      <div className="space-y-2.5">
        {services.map((srv) => (
          <div key={srv.name} className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#475569] dark:text-[#CBD5E1] flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  srv.status === 'online'
                    ? 'bg-[#10B981] animate-pulse'
                    : srv.status === 'degraded'
                    ? 'bg-[#F59E0B]'
                    : srv.status === 'checking'
                    ? 'bg-[#94A3B8]'
                    : 'bg-[#EF4444]'
                }`}
              />
              {srv.name}
              <span className="text-[9px] font-mono text-[#94A3B8]">:{srv.port}</span>
            </span>

            <span className="font-mono text-[10px] font-bold">
              {srv.status === 'checking' ? (
                <span className="text-[#94A3B8]">Pinging...</span>
              ) : srv.status === 'offline' ? (
                <span className="text-[#EF4444] font-black uppercase text-[9px]">Offline</span>
              ) : (
                <span className="text-[#10B981] dark:text-[#E8B84E] font-black">{srv.latency} ms</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
