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
  const totalYearRevenue = monthlyData.reduce((acc, d) => acc + d.revenue, 0);
  const totalYearOrders = monthlyData.reduce((acc, d) => acc + d.orders, 0);
  const currentMonthIdx = new Date().getMonth();

  return (
    <div className="bg-white dark:bg-[#181926] p-6 sm:p-7 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm hover:shadow-md transition-all">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#704F38] dark:text-[#E8B84E]" />
              Monthly Sales & Fulfillment Velocity
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#704F38]/10 dark:bg-[#E8B84E]/10 text-[#704F38] dark:text-[#E8B84E] text-[10px] font-black uppercase">
              12 Months
            </span>
          </div>
          <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-1">
            Real order aggregation breakdown across calendar year {currentYear}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-bold text-[#797979] uppercase block">Yearly Volume</span>
            <span className="text-xs font-black text-[#1F2029] dark:text-white">
              ₹{totalYearRevenue.toLocaleString('en-IN')} ({totalYearOrders} orders)
            </span>
          </div>
          <span className="text-xs font-black px-3.5 py-1.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl text-[#704F38] dark:text-[#E8B84E] shadow-xs">
            Year {currentYear}
          </span>
        </div>
      </div>

      {/* Prominent Tall Bar Chart Container with Y-Axis lines */}
      <div className="relative pt-6 pb-2">
        {/* Y-Axis Gridlines */}
        <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none z-0">
          <div className="border-b border-dashed border-[#EDEDED] dark:border-[#262838] w-full flex justify-between items-center text-[9px] text-[#A0AEC0]">
            <span>₹{maxRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-b border-dashed border-[#EDEDED] dark:border-[#262838] w-full flex justify-between items-center text-[9px] text-[#A0AEC0]">
            <span>₹{Math.round(maxRevenue / 2).toLocaleString('en-IN')}</span>
          </div>
          <div className="border-b border-[#EDEDED] dark:border-[#262838] w-full flex justify-between items-center text-[9px] text-[#A0AEC0]">
            <span>₹0</span>
          </div>
        </div>

        {/* Bars Grid (Height 64 / 256px) */}
        <div className="flex items-stretch justify-between gap-2 sm:gap-3.5 h-64 relative z-10 pt-4">
          {monthlyData.map((d, idx) => {
            const heightPercent = d.revenue > 0 ? Math.min(100, Math.max(14, (d.revenue / maxRevenue) * 100)) : 8;
            const isCurrent = idx === currentMonthIdx;

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center justify-end gap-2 group relative h-full">
                {/* Bar Track & Fill */}
                <div className="w-full bg-[#F8FAFC] dark:bg-[#11121E] rounded-t-2xl flex-1 flex items-end overflow-hidden p-1 border border-[#F1F5F9] dark:border-[#1E2033]">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 relative ${
                      isCurrent
                        ? 'bg-gradient-to-t from-[#704F38] to-[#9E7356] dark:from-[#E8B84E] dark:to-[#F3D382] shadow-lg shadow-[#704F38]/20'
                        : 'bg-gradient-to-t from-[#704F38]/30 to-[#704F38]/60 dark:from-[#E8B84E]/30 dark:to-[#E8B84E]/60 group-hover:from-[#704F38] group-hover:to-[#9E7356] dark:group-hover:from-[#E8B84E] dark:group-hover:to-[#F3D382]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Top highlight bar line */}
                    <div className="w-full h-1 bg-white/40 rounded-t-xl" />
                  </div>
                </div>

                {/* Floating Value Pill for active months */}
                {d.revenue > 0 && (
                  <span className="text-[9px] font-black text-[#704F38] dark:text-[#E8B84E] hidden sm:block truncate">
                    ₹{d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}k` : d.revenue}
                  </span>
                )}

                {/* Tooltip Overlay on Hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1F2029] dark:bg-white text-white dark:text-[#1F2029] text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 pointer-events-none whitespace-nowrap z-30">
                  <div className="font-black text-[#E8B84E] dark:text-[#704F38]">₹{d.revenue.toLocaleString('en-IN')}</div>
                  <div className="text-[9px] opacity-80">{d.orders} Delivered Orders</div>
                </div>

                {/* Month Label */}
                <span
                  className={`text-[11px] font-extrabold uppercase transition-colors ${
                    isCurrent
                      ? 'text-[#704F38] dark:text-[#E8B84E] scale-105 font-black'
                      : 'text-[#797979] dark:text-[#A0AEC0] group-hover:text-[#1F2029] dark:group-hover:text-white'
                  }`}
                >
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Stats Strip */}
      <div className="mt-4 pt-4 border-t border-[#EDEDED] dark:border-[#262838] grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Total Revenue</span>
          <span className="text-sm font-black text-[#1F2029] dark:text-white">₹{totalYearRevenue.toLocaleString('en-IN')}</span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Total Orders</span>
          <span className="text-sm font-black text-[#1F2029] dark:text-white">{totalYearOrders}</span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Avg Order Value</span>
          <span className="text-sm font-black text-[#704F38] dark:text-[#E8B84E]">
            ₹{totalYearOrders > 0 ? Math.round(totalYearRevenue / totalYearOrders).toLocaleString('en-IN') : 0}
          </span>
        </div>
      </div>
    </div>
  );
};
