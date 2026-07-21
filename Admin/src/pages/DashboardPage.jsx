import React from 'react';
import { useGetDashboardStatsQuery, useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const DashboardPage = ({ onNavigateToOrders }) => {
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
  };

  const kpiCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: '#704F38', bg: '#FDFBF9', border: '#704F38' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF', border: '#3B82F6' },
    { title: 'Pending Fulfillment', value: stats.pendingFulfillment.toString(), icon: Clock, color: '#FFB74D', bg: '#FFFBEB', border: '#FFB74D' },
    { title: 'Delivered Orders', value: stats.deliveredCount.toString(), icon: CheckCircle, color: '#4CAF50', bg: '#ECFDF5', border: '#4CAF50' },
    { title: 'Cancelled Orders', value: stats.cancelledCount.toString(), icon: AlertTriangle, color: '#E57373', bg: '#FEF2F2', border: '#E57373' },
  ];

  if (isStatsLoading) {
    return <div className="text-center py-16 text-[#797979] font-medium">Loading Platform Metrics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* 4-6 Top KPIs */}
      <div>
        <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#EDEDED] shadow-sm hover:shadow-md transition-shadow flex items-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0" style={{ backgroundColor: card.bg }}>
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#797979] uppercase tracking-wider">{card.title}</div>
                  <div className="text-xl font-black text-[#1F2029] mt-0.5">{card.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fulfillment Status Breakdown */}
      <div>
        <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider mb-4">Fulfillment Breakdown</h3>
        <div className="bg-white p-5 rounded-2xl border border-[#EDEDED] shadow-sm flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-full bg-[#FFFBEB] text-[#B45309] font-bold text-xs border border-[#FDE68A]">
            Placed: {stats.placedCount}
          </div>
          <div className="px-4 py-2 rounded-full bg-[#EFF6FF] text-[#1D4ED8] font-bold text-xs border border-[#BFDBFE]">
            Confirmed: {stats.confirmedCount}
          </div>
          <div className="px-4 py-2 rounded-full bg-[#F3E8FF] text-[#6B21A8] font-bold text-xs border border-[#E9D5FF]">
            Shipped: {stats.shippedCount}
          </div>
          <div className="px-4 py-2 rounded-full bg-[#ECFDF5] text-[#047857] font-bold text-xs border border-[#A7F3D0]">
            Delivered: {stats.deliveredCount}
          </div>
          <div className="px-4 py-2 rounded-full bg-[#FEF2F2] text-[#B91C1C] font-bold text-xs border border-[#FECACA]">
            Cancelled: {stats.cancelledCount}
          </div>
        </div>
      </div>

      {/* Action Queue */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider">Urgent Action Queue (Pending Orders)</h3>
          {onNavigateToOrders && (
            <button
              onClick={() => onNavigateToOrders('placed')}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#704F38] hover:underline"
            >
              View All Orders <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EDEDED] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]">
              {isPendingLoading ? (
                <tr><td colSpan="5" className="p-8 text-center text-[#797979]">Loading Action Queue...</td></tr>
              ) : pendingOrdersData?.orders?.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-[#4CAF50] font-bold">✓ Action queue is clear! All pending orders processed.</td></tr>
              ) : (
                pendingOrdersData?.orders?.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                    <td className="px-5 py-4 font-black text-[#1F2029]">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-4 font-medium text-[#1F2029]">{order.shippingAddress?.name || 'Customer'}</td>
                    <td className="px-5 py-4 font-extrabold text-[#704F38]">₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#B45309] text-[10px] font-black tracking-wider uppercase border border-[#FDE68A]">
                        REQUIRES FULFILLMENT
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onNavigateToOrders && onNavigateToOrders('placed')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#704F38] hover:bg-[#8C6244] text-white font-extrabold text-xs shadow-md shadow-[#704F38]/20 transition-all"
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
  );
};
