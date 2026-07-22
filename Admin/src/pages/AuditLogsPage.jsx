import React from 'react';
import { useGetAuditLogsQuery } from '../services/adminAuthApi';
import { FileText, RefreshCw, Clock, ShieldAlert } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const AuditLogsPage = () => {
  const { data, isLoading, refetch } = useGetAuditLogsQuery({});

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDFBF9] flex items-center justify-center border border-[#EDEDED]">
            <FileText className="w-5 h-5 text-[#704F38]" />
          </div>
          <h2 className="text-base font-black text-[#1F2029]">Platform Audit Trail & Change Log</h2>
        </div>
        <button onClick={() => refetch()} className="p-2.5 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4 text-[#1F2029]" />
        </button>
      </div>

      {/* Table-First Audit Log */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
          <thead>
            <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
              <th className="px-5 py-4">Timestamp</th>
              <th className="px-5 py-4">Action</th>
              <th className="px-5 py-4">Target Entity</th>
              <th className="px-5 py-4">Admin ID</th>
              <th className="px-5 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDED]">
            {isLoading ? (
              <tr>
                <td colSpan="5">
                  <Loader message="Loading Audit Trail..." />
                </td>
              </tr>
            ) : data?.logs?.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-[#797979]">
                  <ShieldAlert className="w-8 h-8 text-[#797979] mx-auto mb-2" />
                  <div className="font-bold text-xs">No audit logs recorded yet.</div>
                </td>
              </tr>
            ) : (
              data?.logs?.map((log) => (
                <tr key={log._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                  <td className="px-5 py-4 text-xs text-[#797979]">
                    <div className="inline-flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#797979]" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-black tracking-wider uppercase border border-[#BFDBFE]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-extrabold text-[#1F2029]">{log.targetEntity}</td>
                  <td className="px-5 py-4 text-xs font-medium text-[#797979]">{log.adminId ? `#${log.adminId.slice(-8)}` : 'System'}</td>
                  <td className="px-5 py-4 text-xs text-[#797979] max-w-xs truncate font-mono">
                    {JSON.stringify(log.details || {})}
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
