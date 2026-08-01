import React from 'react';
import { useGetAuditLogsQuery } from '../services/adminAuthApi';
import { FileText, RefreshCw, Clock, ShieldAlert } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const AuditLogsPage = () => {
  const { data, isLoading, refetch } = useGetAuditLogsQuery({});

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white dark:bg-[#181926] p-4 sm:p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FDFBF9] dark:bg-[#11121E] flex items-center justify-center border border-[#EDEDED] dark:border-[#2A2C3F]">
            <FileText className="w-5 h-5 text-[#704F38] dark:text-[#E8B84E]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#1F2029] dark:text-white">Platform Audit Trail & Change Log</h2>
            <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">Tamper-evident system activity and administrative action ledger.</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="p-3 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-2xl transition-all shadow-sm self-end sm:self-auto"
          title="Refresh Logs"
        >
          <RefreshCw className="w-4 h-4 text-[#1F2029] dark:text-white" />
        </button>
      </div>

      {/* Table-First Audit Log */}
      <div className="bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Timestamp</th>
                <th className="px-5 py-4">Action</th>
                <th className="px-5 py-4">Target Entity</th>
                <th className="px-5 py-4">Admin ID</th>
                <th className="px-5 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <Loader message="Loading Audit Trail..." />
                  </td>
                </tr>
              ) : data?.logs?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-[#797979] dark:text-[#A0AEC0]">
                    <ShieldAlert className="w-8 h-8 text-[#797979] dark:text-[#A0AEC0] mx-auto mb-2" />
                    <div className="font-bold text-xs">No audit logs recorded yet.</div>
                  </td>
                </tr>
              ) : (
                data?.logs?.map((log) => (
                  <tr key={log._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                    <td className="px-5 py-4 text-xs font-medium text-[#797979] dark:text-[#A0AEC0] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-black text-xs text-[#704F38] dark:text-[#E8B84E]">
                      {log.action}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#1F2029] dark:text-white">
                      {log.targetModel} {log.targetId ? `(#${log.targetId.slice(-6).toUpperCase()})` : ''}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-xs text-[#797979] dark:text-[#A0AEC0] select-all">
                      {log.adminId ? `#USR-${log.adminId.slice(-6).toUpperCase()}` : 'System Auto'}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#797979] dark:text-[#A0AEC0] max-w-xs truncate">
                      {typeof log.details === 'object' && log.details !== null
                        ? JSON.stringify(log.details)
                        : String(log.details || log.ipAddress || 'System Action')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
