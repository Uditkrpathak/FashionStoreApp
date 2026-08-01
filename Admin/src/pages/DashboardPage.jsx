import React from 'react';
import { useGetDashboardStatsQuery, useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Loader } from '../shared/components/Loader';
import { RevenueChart } from '../shared/components/RevenueChart';
import { UserShowcaseWidget } from '../shared/components/UserShowcaseWidget';

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

  const kpiCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: '#704F38', bg: '#FDFBF9', darkBg: '#1E1B18', border: '#704F38' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF', darkBg: '#1E293B', border: '#3B82F6' },
    { title: 'Pending Fulfillment', value: stats.pendingFulfillment.toString(), icon: Clock, color: '#F59E0B', bg: '#FFFBEB', darkBg: '#312E81', border: '#F59E0B' },
    { title: 'Delivered Orders', value: stats.deliveredCount.toString(), icon: CheckCircle, color: '#10B981', bg: '#ECFDF5', darkBg: '#064E3B', border: '#10B981' },
    { title: 'Cancelled Orders', value: stats.cancelledCount.toString(), icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', darkBg: '#7F1D1D', border: '#EF4444' },
  ];

  if (isStatsLoading) {
    return <Loader message="Loading Platform Metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Top KPI Metric Cards */}
      <div>
        <h3 className="text-xs font-black text-[#1F2029] dark:text-white uppercase tracking-wider mb-4">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#181926] p-5 rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm hover:shadow-md transition-all flex items-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider truncate">
                    {card.title}
                  </div>
                  <div className="text-xl font-black text-[#1F2029] dark:text-white mt-0.5 truncate">
                    {card.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Analytics & User Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            monthlyStats={stats.monthlyStats}
            totalRevenue={stats.totalRevenue}
            totalOrders={stats.totalOrders}
          />
        </div>
        <div className="lg:col-span-1">
          <UserShowcaseWidget onNavigateToUsers={onNavigateToTab} />
        </div>
      </div>

      {/* 3. Fulfillment Status Breakdown */}
      <div>
        <h3 className="text-xs font-black text-[#1F2029] dark:text-white uppercase tracking-wider mb-4">
          Fulfillment Status Breakdown
        </h3>
        <div className="bg-white dark:bg-[#181926] p-5 rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#FFFBEB] dark:bg-[#78350F]/20 text-[#B45309] dark:text-[#FBBF24] font-bold text-xs border border-[#FDE68A] dark:border-[#B45309]/40">
            Placed: {stats.placedCount}
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/20 text-[#1D4ED8] dark:text-[#60A5FA] font-bold text-xs border border-[#BFDBFE] dark:border-[#1E3A8A]/40">
            Confirmed: {stats.confirmedCount}
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#F3E8FF] dark:bg-[#581C87]/20 text-[#6B21A8] dark:text-[#C084FC] font-bold text-xs border border-[#E9D5FF] dark:border-[#581C87]/40">
            Shipped: {stats.shippedCount}
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#ECFDF5] dark:bg-[#064E3B]/20 text-[#047857] dark:text-[#34D399] font-bold text-xs border border-[#A7F3D0] dark:border-[#064E3B]/40">
            Delivered: {stats.deliveredCount}
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 text-[#B91C1C] dark:text-[#F87171] font-bold text-xs border border-[#FECACA] dark:border-[#7F1D1D]/40">
            Cancelled: {stats.cancelledCount}
          </div>
        </div>
      </div>

      {/* 4. Action Queue Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
            Urgent Action Queue (Pending Orders)
          </h3>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('orders')}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#704F38] dark:text-[#E8B84E] hover:underline"
            >
              View All Orders <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-[#181926] rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead>
                <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
                {isPendingLoading ? (
                  <tr>
                    <td colSpan="5">
                      <Loader message="Loading Action Queue..." />
                    </td>
                  </tr>
                ) : pendingOrdersData?.orders?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[#4CAF50] dark:text-[#34D399] font-bold">
                      ✓ Action queue is clear! All pending orders processed.
                    </td>
                  </tr>
                ) : (
                  pendingOrdersData?.orders?.map((order) => (
                    <tr key={order._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                      <td className="px-5 py-4 font-black text-[#1F2029] dark:text-white">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4 font-medium text-[#1F2029] dark:text-[#E2E8F0]">
                        {order.shippingAddress?.name || 'Customer'}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-[#704F38] dark:text-[#E8B84E]">
                        ₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] text-[10px] font-black tracking-wider uppercase border border-[#FDE68A] dark:border-[#B45309]/50">
                          REQUIRES FULFILLMENT
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => onNavigateToTab && onNavigateToTab('orders')}
                          className="px-3.5 py-1.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white font-extrabold text-xs shadow-md shadow-[#704F38]/20 transition-all"
                        >
                          Process →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
