import React from 'react';
import { PackageCheck, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';

export const OrderStatusFunnelChart = ({ stats }) => {
  const placed = stats?.placedCount || 0;
  const confirmed = stats?.confirmedCount || 0;
  const shipped = stats?.shippedCount || 0;
  const delivered = stats?.deliveredCount || 0;
  const cancelled = stats?.cancelledCount || 0;
  const total = stats?.totalOrders || (placed + confirmed + shipped + delivered + cancelled) || 1;

  const stages = [
    { label: 'Placed', count: placed, color: '#F59E0B', bg: '#FFFBEB', darkBg: '#78350F/30', icon: Clock },
    { label: 'Confirmed', count: confirmed, color: '#3B82F6', bg: '#EFF6FF', darkBg: '#1E3A8A/30', icon: PackageCheck },
    { label: 'Shipped', count: shipped, color: '#8B5CF6', bg: '#F5F3FF', darkBg: '#4C1D95/30', icon: Truck },
    { label: 'Delivered', count: delivered, color: '#10B981', bg: '#ECFDF5', darkBg: '#064E3B/30', icon: CheckCircle2 },
    { label: 'Cancelled', count: cancelled, color: '#EF4444', bg: '#FEF2F2', darkBg: '#7F1D1D/30', icon: XCircle },
  ];

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
          Order Lifecycle Funnel
        </h3>
        <span className="text-xs font-bold text-[#797979] dark:text-[#A0AEC0]">
          {total} Total Orders
        </span>
      </div>

      <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mb-4">
        Distribution across fulfillment pipeline stages
      </p>

      {/* Grid of Funnel Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-2">
        {stages.map((st) => {
          const Icon = st.icon;
          const pct = Math.round((st.count / total) * 100);

          return (
            <div
              key={st.label}
              className="p-3.5 rounded-2xl border border-[#EDEDED] dark:border-[#262838] bg-[#FDFBF9] dark:bg-[#11121E] flex flex-col justify-between space-y-2 hover:border-[#704F38] dark:hover:border-[#E8B84E] transition-all"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: st.color + '20' }}
                >
                  <Icon className="w-4 h-4" style={{ color: st.color }} />
                </div>
                <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0]">
                  {pct}%
                </span>
              </div>

              <div>
                <span className="text-lg font-black text-[#1F2029] dark:text-white block">
                  {st.count}
                </span>
                <span className="text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider">
                  {st.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#E2E8F0] dark:bg-[#202232] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(8, pct)}%`, backgroundColor: st.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
