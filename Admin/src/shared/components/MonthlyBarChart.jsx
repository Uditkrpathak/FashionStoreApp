import React from 'react';
import { BarChart3 } from 'lucide-react';

export const MonthlyBarChart = ({ monthlyStats = [] }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  // Map real monthly stats array to 12 months
  const monthlyData = months.map((m, idx) => {
    const monthNum = idx + 1;
    const found = monthlyStats.find(
      (s) => s.monthNum === monthNum || s.month === m || s.month === monthNum
    );
    return {
      month: m,
      revenue: found ? found.revenue || 0 : 0,
      orders: found ? found.orders || 0 : 0,
    };
  });

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1000);
  const currentMonthIdx = new Date().getMonth();

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
            Monthly Sales & Fulfillment Velocity
          </h3>
          <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">
            Real order aggregation breakdown across 12 calendar months
          </p>
        </div>
        <span className="text-xs font-black px-3 py-1 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl text-[#704F38] dark:text-[#E8B84E]">
          Year {currentYear}
        </span>
      </div>

      {/* 12 Month Bar Graph */}
      <div className="flex items-stretch justify-between gap-2.5 h-48 pt-4 pb-2 border-b border-[#EDEDED] dark:border-[#262838]">
        {monthlyData.map((d, idx) => {
          const heightPercent = d.revenue > 0 ? Math.min(100, Math.max(15, (d.revenue / maxRevenue) * 100)) : 10;
          const isCurrent = idx === currentMonthIdx;

          return (
            <div key={d.month} className="flex-1 flex flex-col items-center justify-end gap-2 group relative h-full">
              {/* Bar Track Container */}
              <div className="w-full bg-[#F1F5F9] dark:bg-[#11121E] rounded-t-xl flex-1 flex items-end overflow-hidden p-0.5">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isCurrent
                      ? 'bg-[#704F38] dark:bg-[#E8B84E] shadow-md'
                      : 'bg-[#704F38]/30 dark:bg-[#E8B84E]/30 group-hover:bg-[#704F38] dark:group-hover:bg-[#E8B84E]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1F2029] dark:bg-[#11121E] border border-white/20 text-white text-[10px] font-extrabold px-2 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                <div>₹{d.revenue.toLocaleString('en-IN')}</div>
                <div className="text-[9px] text-[#A0AEC0]">{d.orders} Orders</div>
              </div>

              <span
                className={`text-[11px] font-extrabold uppercase ${
                  isCurrent
                    ? 'text-[#704F38] dark:text-[#E8B84E]'
                    : 'text-[#797979] dark:text-[#A0AEC0]'
                }`}
              >
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
