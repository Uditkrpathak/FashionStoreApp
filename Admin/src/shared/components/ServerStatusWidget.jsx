import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Server } from 'lucide-react';

export const ServerStatusWidget = () => {
  const [services, setServices] = useState([
    { name: 'Gateway Service', port: 5000, latency: 12, status: 'online' },
    { name: 'Auth Service', port: 5001, latency: 18, status: 'online' },
    { name: 'Catalog Service', port: 5002, latency: 24, status: 'online' },
    { name: 'Cart Service', port: 5003, latency: 15, status: 'online' },
    { name: 'Order Service', port: 5004, latency: 29, status: 'online' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          latency: Math.floor(10 + Math.random() * 25),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
          <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
            Server Status
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-black text-[#10B981] bg-[#ECFDF5] dark:bg-[#064E3B] px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3" /> 100% Operational
        </span>
      </div>

      {/* Latency Micro-Bar Chart */}
      <div className="flex items-end justify-between gap-1.5 h-16 pt-2 pb-1 border-b border-[#EDEDED] dark:border-[#262838] mb-4">
        {services.map((srv, idx) => {
          const heightPercent = Math.min(100, Math.max(25, (srv.latency / 40) * 100));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div
                className="w-full bg-[#704F38]/20 dark:bg-[#E8B84E]/20 group-hover:bg-[#704F38] dark:group-hover:bg-[#E8B84E] rounded-t-md transition-all duration-300 relative"
                style={{ height: `${heightPercent}%` }}
              >
                {/* Hover Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1F2029] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  {srv.latency}ms
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Services List */}
      <div className="space-y-2">
        {services.map((srv, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#475569] dark:text-[#CBD5E1] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {srv.name}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#797979] dark:text-[#A0AEC0]">
              {srv.latency} ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
