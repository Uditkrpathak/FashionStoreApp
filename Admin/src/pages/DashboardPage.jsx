import React, { useState } from 'react';
import { useGetDashboardStatsQuery, useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, ArrowRight, BarChart2, ShieldCheck, Server } from 'lucide-react';
import { Loader } from '../shared/components/Loader';
import { RevenueChart } from '../shared/components/RevenueChart';
import { MonthlyBarChart } from '../shared/components/MonthlyBarChart';
import { RoleDonutChart } from '../shared/components/RoleDonutChart';
import { CategoryDistributionChart } from '../shared/components/CategoryDistributionChart';
import { OrderStatusFunnelChart } from '../shared/components/OrderStatusFunnelChart';
import { FulfillmentVelocityChart } from '../shared/components/FulfillmentVelocityChart';
import { ServerStatusWidget } from '../shared/components/ServerStatusWidget';
import { CustomerReviewsWidget } from '../shared/components/CustomerReviewsWidget';
import { SupportTicketsWidget } from '../shared/components/SupportTicketsWidget';
import { FigmaContactsWidget } from '../shared/components/FigmaContactsWidget';
import { RecentActivityWidget } from '../shared/components/RecentActivityWidget';

export const DashboardPage = ({ onNavigateToTab }) => {
  const { data: statsData, isLoading: isStatsLoading } = useGetDashboardStatsQuery();
  const { data: pendingOrdersData, isLoading: isPendingLoading } = useGetAdminOrdersQuery({ status: 'placed', limit: 5 });
  const [activeTelemetryTab, setActiveTelemetryTab] = useState('revenue'); // 'revenue' | 'velocity' | 'servers'

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
    <div className="space-y-6 md:space-y-8 min-w-0">
      {/* Top Section: Responsive 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {miniKpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#181926] p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm hover:shadow-md transition-all flex items-center gap-3 min-w-0"
            >
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: card.bg }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: card.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block truncate">
                  {card.title}
                </span>
                <span className="text-sm sm:text-xl font-black text-[#1F2029] dark:text-white mt-0.5 block truncate">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Lifecycle Funnel Stage Overview */}
      <OrderStatusFunnelChart stats={stats} />

      {/* Main 3-Column Master Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start min-w-0">
        
        {/* LEFT AREA: 2 COLUMNS (ANALYTICS, CHARTS & TABLES) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8 min-w-0">

          {/* Interactive Graph Selector Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#EDEDED] dark:border-[#262838]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTelemetryTab('revenue')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTelemetryTab === 'revenue'
                    ? 'bg-[#704F38] text-white shadow-md'
                    : 'bg-white dark:bg-[#181926] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#262838] hover:text-[#1F2029] dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> Revenue Analytics
              </button>

              <button
                onClick={() => setActiveTelemetryTab('velocity')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTelemetryTab === 'velocity'
                    ? 'bg-[#704F38] text-white shadow-md'
                    : 'bg-white dark:bg-[#181926] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#262838] hover:text-[#1F2029] dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> SLA Velocity Curve
              </button>

              <button
                onClick={() => setActiveTelemetryTab('servers')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTelemetryTab === 'servers'
                    ? 'bg-[#704F38] text-white shadow-md'
                    : 'bg-white dark:bg-[#181926] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#262838] hover:text-[#1F2029] dark:hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" /> Microservice Latency
              </button>
            </div>
            
            <span className="text-[10px] font-black text-[#704F38] dark:text-[#E8B84E] uppercase hidden sm:block whitespace-nowrap">
              Interactive Telemetry
            </span>
          </div>

          {/* Active Primary Graph Rendering */}
          <div className="min-w-0">
            {activeTelemetryTab === 'revenue' && (
              <RevenueChart
                monthlyStats={stats.monthlyStats}
                totalRevenue={stats.totalRevenue}
                totalOrders={stats.totalOrders}
              />
            )}
            {activeTelemetryTab === 'velocity' && (
              <FulfillmentVelocityChart orders={pendingOrdersData?.orders || []} />
            )}
            {activeTelemetryTab === 'servers' && (
              <ServerStatusWidget />
            )}
          </div>

          {/* Large 12-Month Sales & Fulfillment Bar Chart */}
          <div className="min-w-0">
            <MonthlyBarChart monthlyStats={stats.monthlyStats} />
          </div>

          {/* Mid Row: Category Sales & User Role Donut Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
            <CategoryDistributionChart />
            <RoleDonutChart />
          </div>

          {/* Customer Reviews Widget */}
          <div className="min-w-0">
            <CustomerReviewsWidget onNavigateToCatalog={onNavigateToTab} />
          </div>

          {/* Urgent Action Queue (Pending Fulfillment Table) */}
          <div className="bg-white dark:bg-[#181926] p-4 sm:p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
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
                  className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] hover:underline flex items-center gap-1 self-start sm:self-auto"
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
              <div className="overflow-x-auto -mx-2 sm:mx-0">
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
                            className="px-3 py-1 bg-[#704F38] hover:bg-[#8C6244] text-white text-[10px] font-bold rounded-lg shadow-sm transition-all"
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
        <div className="lg:col-span-1 space-y-6 md:space-y-8 min-w-0">
          {/* Widget 1: Customer Support Queue */}
          <SupportTicketsWidget onNavigateToTickets={onNavigateToTab} />

          {/* Widget 2: Real Customer Contacts Grid with User Profile Avatars */}
          <FigmaContactsWidget onNavigateToUsers={onNavigateToTab} />

          {/* Widget 3: Live System Audit Activity Log */}
          <RecentActivityWidget />
        </div>

      </div>
    </div>
  );
};
