import React from 'react';
import { useGetDashboardStatsQuery, useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Loader } from '../shared/components/Loader';
import { RevenueChart } from '../shared/components/RevenueChart';
import { MonthlyBarChart } from '../shared/components/MonthlyBarChart';
import { RoleDonutChart } from '../shared/components/RoleDonutChart';
import { CustomerReviewsWidget } from '../shared/components/CustomerReviewsWidget';
import { ServerStatusWidget } from '../shared/components/ServerStatusWidget';
import { FigmaContactsWidget } from '../shared/components/FigmaContactsWidget';
import { RecentActivityWidget } from '../shared/components/RecentActivityWidget';

export const DashboardPage = ({ onNavigateToTab }) => {
  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery();
  const { data: pendingOrdersData, isLoading: isPendingLoading } = useGetAdminOrdersQuery({ status: 'placed', limit: 5 });

  const stats = statsData?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    placedCount: 0,
    confirmedCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
    pendingFulfillment: 0,
    monthlyStats: [],
  };

  const miniKpiCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: '#704F38', bg: '#FDFBF9' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF' },
    { title: 'Pending Orders', value: stats.pendingFulfillment.toString(), icon: Clock, color: '#F59E0B', bg: '#FFFBEB' },
    { title: 'Delivered', value: stats.deliveredCount.toString(), icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
  ];

  if (isStatsLoading) {
    return <Loader message="Loading Super Admin Dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Figma 3-Column Master Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT AREA: 2 COLUMNS (MAIN DASHBOARD ANALYTICS & CHARTS) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Top Section: 4 KPI Mini Cards + Revenue Sparkline Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* 4 Mini KPI Grid */}
            <div className="grid grid-cols-2 gap-4">
              {miniKpiCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#181926] p-4 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: card.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">
                        {card.title}
                      </span>
                      <span className="text-lg font-black text-[#1F2029] dark:text-white mt-0.5 block truncate">
                        {card.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Revenue Analytics Sparkline Chart */}
            <div>
              <RevenueChart
                monthlyStats={stats.monthlyStats}
                totalRevenue={stats.totalRevenue}
                totalOrders={stats.totalOrders}
              />
            </div>
          </div>

          {/* 12-Month Sales & Fulfillment Bar Chart */}
          <div>
            <MonthlyBarChart monthlyStats={stats.monthlyStats} />
          </div>

          {/* Mid Row: User Role Donut Chart & Customer Reviews Widget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoleDonutChart />
            <CustomerReviewsWidget onNavigateToCatalog={onNavigateToTab} />
          </div>

          {/* Urgent Action Queue (Pending Fulfillment Table) */}
          <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
                  Urgent Fulfillment Queue
                </h3>
                <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium">
                  {pendingOrdersData?.orders?.length || 0} orders waiting for processing
                </p>
              </div>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('orders')}
                  className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] hover:underline flex items-center gap-1"
                >
                  Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isPendingLoading ? (
              <div className="py-6 text-center text-xs text-[#797979]">Loading pending queue...</div>
            ) : pendingOrdersData?.orders?.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0] font-bold">
                No pending orders. Platform fulfillment up to date!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[10px] font-extrabold uppercase tracking-wider">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
                    {pendingOrdersData?.orders?.map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#704F38] dark:text-[#E8B84E]">
                          #{ord._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 font-extrabold text-[#1F2029] dark:text-white">
                          {ord.customerDetails?.name || 'Customer'}
                        </td>
                        <td className="px-4 py-3 font-black text-[#1F2029] dark:text-white">
                          ₹{ord.totals?.grandTotal || ord.totals?.subtotal || 0}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] font-black text-[9px] uppercase border border-[#FDE68A] dark:border-[#B45309]/50">
                            {ord.orderStatus || 'Placed'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onNavigateToTab && onNavigateToTab('orders')}
                            className="px-3 py-1 bg-[#704F38] hover:bg-[#8C6244] text-white text-[10px] font-bold rounded-lg shadow-sm"
                          >
                            Process
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR: 1 COLUMN (LIVE WIDGETS & AUDIT TIMELINE) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Widget 1: Server Microservice Health Status Bar Graph */}
          <ServerStatusWidget />

          {/* Widget 2: Real Customer Contacts Grid with User Profile Avatars */}
          <FigmaContactsWidget onNavigateToUsers={onNavigateToTab} />

          {/* Widget 3: Live System Audit Activity Log */}
          <RecentActivityWidget />
        </div>

      </div>
    </div>
  );
};
