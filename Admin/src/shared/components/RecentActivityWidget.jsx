import React from 'react';
import { useGetAuditLogsQuery } from '../../services/adminAuthApi';
import { Clock, ShieldAlert, CheckCircle2, UserCheck, KeyRound } from 'lucide-react';

export const RecentActivityWidget = () => {
  const { data: auditData, isLoading } = useGetAuditLogsQuery({ limit: 5 });
  const logs = auditData?.logs || [];

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
          <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
            Recent Activity Log
          </h3>
        </div>
        <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase">
          Live Feed
        </span>
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
          Loading system activity logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
          No recent system activity logged.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.slice(0, 5).map((log) => (
            <div
              key={log._id}
              className="flex items-start gap-3 p-3 rounded-2xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#26283A]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#704F38]/10 dark:bg-[#E8B84E]/10 text-[#704F38] dark:text-[#E8B84E] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#1F2029] dark:text-white truncate">
                    {log.action || 'System Audit Event'}
                  </span>
                  <span className="text-[9px] font-bold text-[#797979] dark:text-[#A0AEC0] whitespace-nowrap ml-1">
                    {new Date(log.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-[#475569] dark:text-[#CBD5E1] truncate mt-0.5">
                  {typeof log.details === 'object' && log.details !== null
                    ? JSON.stringify(log.details)
                    : String(log.details || log.ipAddress || 'System action executed')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
