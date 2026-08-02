import React from 'react';
import { useGetTicketsQuery } from '../../services/adminOrderApi';
import { MessageSquare, ArrowRight, AlertCircle, Clock, CheckCircle2, User } from 'lucide-react';

export const SupportTicketsWidget = ({ onNavigateToTickets }) => {
  const { data, isLoading } = useGetTicketsQuery({ limit: 5 });
  const tickets = data?.tickets || [];
  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'escalated').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'escalated':
        return <span className="px-2 py-0.5 rounded bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 text-[#EF4444] font-black text-[9px] uppercase border border-[#FCA5A5] dark:border-[#991B1B]/50 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" /> Escalated</span>;
      case 'open':
        return <span className="px-2 py-0.5 rounded bg-[#FFFBEB] dark:bg-[#78350F]/40 text-[#B45309] dark:text-[#FBBF24] font-black text-[9px] uppercase border border-[#FDE68A] dark:border-[#B45309]/50 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Open</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#3B82F6] font-black text-[9px] uppercase border border-[#BFDBFE] dark:border-[#1D4ED8]/50">In Progress</span>;
      case 'closed':
      case 'resolved':
        return <span className="px-2 py-0.5 rounded bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#10B981] font-black text-[9px] uppercase border border-[#A7F3D0] dark:border-[#047857]/50 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Resolved</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-[9px] uppercase">{status || 'Open'}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
            <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
              Customer Support Queue
            </h3>
            {openCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#704F38] text-white text-[9px] font-black">
                {openCount} Active
              </span>
            )}
          </div>
          <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">
            Recent customer support tickets requiring response
          </p>
        </div>

        {onNavigateToTickets && (
          <button
            onClick={() => onNavigateToTickets('tickets')}
            className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] hover:underline flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
          Loading support queue...
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#797979] dark:text-[#A0AEC0] font-bold">
          No open support tickets. Customer support queue up to date! 🎉
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const ticketNum = t.ticketNumber || `#TKT-${(t._id || '').slice(-6).toUpperCase()}`;
            return (
              <div
                key={t._id}
                onClick={() => onNavigateToTickets && onNavigateToTickets('tickets')}
                className="p-3.5 rounded-2xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#262838] hover:border-[#704F38] dark:hover:border-[#E8B84E] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#704F38] dark:text-[#E8B84E]">
                      {ticketNum}
                    </span>
                    {t.category && (
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-white dark:bg-[#1F2029] border border-[#EDEDED] dark:border-[#2D2F45] rounded text-[#797979] uppercase">
                        {t.category}
                      </span>
                    )}
                  </div>
                  <div>{getStatusBadge(t.status)}</div>
                </div>

                <div className="text-xs font-extrabold text-[#1F2029] dark:text-white group-hover:text-[#704F38] dark:group-hover:text-[#E8B84E] transition-colors truncate">
                  {t.subject || 'Customer Support Request'}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EDEDED]/60 dark:border-[#262838] text-[10px] text-[#797979] dark:text-[#A0AEC0]">
                  <span className="flex items-center gap-1 font-bold">
                    <User className="w-3 h-3 text-[#704F38] dark:text-[#E8B84E]" />
                    {t.userName || 'Customer'}
                  </span>
                  <span className="font-medium">
                    {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
