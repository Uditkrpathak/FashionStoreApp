import React, { useState } from 'react';
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from '../services/adminOrderApi';
import { Check, Truck, CheckCircle2, XCircle, Clock, X, MapPin } from 'lucide-react';

const STATUS_TABS = [
  { id: '', label: 'All Orders' },
  { id: 'placed', label: 'Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const OrderFulfillmentPage = ({ initialStatusFilter = '' }) => {
  const [activeStatus, setActiveStatus] = useState(initialStatusFilter);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { data, isLoading, refetch } = useGetAdminOrdersQuery({
    status: activeStatus || undefined,
    limit: 50,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStateTransition = async (orderId, targetStatus, reason) => {
    try {
      await updateOrderStatus({ id: orderId, status: targetStatus, reason }).unwrap();
      refetch();
      if (selectedOrder && selectedOrder._id === orderId) {
        setDrawerVisible(false);
      }
    } catch (err) {
      alert(err.data?.message || `Failed to transition status to ${targetStatus}`);
    }
  };

  const handleOpenDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  return (
    <div className="space-y-6">
      {/* Sticky Status Tabs Filter */}
      <div className="bg-white p-3 rounded-2xl border border-[#EDEDED] shadow-sm flex gap-2 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.id;
          return (
            <button
              key={tab.id || 'all'}
              onClick={() => setActiveStatus(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#704F38] text-white shadow-md'
                  : 'bg-[#FDFBF9] text-[#797979] border border-[#EDEDED] hover:text-[#1F2029]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table-First Orders Listing */}
      <div className="bg-white rounded-2xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Items Count</th>
              <th className="px-5 py-4">Grand Total</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">State Transition Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDED]">
            {isLoading ? (
              <tr><td colSpan="6" className="p-8 text-center text-[#797979]">Loading Orders...</td></tr>
            ) : data?.orders?.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-[#797979]">No orders found matching criteria.</td></tr>
            ) : (
              data?.orders?.map((order) => {
                const currentStatus = order.orderStatus || 'placed';
                return (
                  <tr key={order._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                    <td className="px-5 py-4 cursor-pointer" onClick={() => handleOpenDrawer(order)}>
                      <div className="font-black text-[#1F2029]">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-[11px] text-[#797979] font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-5 py-4 text-[#1F2029] font-medium">
                      {order.shippingAddress?.name || 'Customer'}
                    </td>
                    <td className="px-5 py-4 text-[#797979] font-medium">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-5 py-4 font-black text-[#704F38]">
                      ₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border ${
                        currentStatus === 'placed' ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]' :
                        currentStatus === 'confirmed' ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' :
                        currentStatus === 'shipped' ? 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]' :
                        currentStatus === 'delivered' ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]' :
                        'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
                      }`}>
                        {currentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-1.5">
                        {currentStatus === 'placed' && (
                          <button onClick={() => handleStateTransition(order._id, 'confirmed', 'Admin confirmed order')} className="inline-flex items-center gap-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                            <Check className="w-3.5 h-3.5" /> Confirm
                          </button>
                        )}
                        {currentStatus === 'confirmed' && (
                          <button onClick={() => handleStateTransition(order._id, 'shipped', 'Order dispatched')} className="inline-flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                            <Truck className="w-3.5 h-3.5" /> Ship
                          </button>
                        )}
                        {currentStatus === 'shipped' && (
                          <button onClick={() => handleStateTransition(order._id, 'delivered', 'Package delivered')} className="inline-flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#43A047] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Deliver
                          </button>
                        )}
                        {(currentStatus === 'placed' || currentStatus === 'confirmed') && (
                          <button onClick={() => handleStateTransition(order._id, 'cancelled', 'Cancelled by Admin')} className="inline-flex items-center gap-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#E57373] border border-[#FCA5A5] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                        )}
                        <button onClick={() => handleOpenDrawer(order)} className="bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] px-3 py-1.5 rounded-lg text-xs font-bold text-[#1F2029] transition-colors">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Details Drawer Modal */}
      {drawerVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-[#EDEDED] space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#1F2029]">Order Details #{selectedOrder?._id?.slice(-8)?.toUpperCase()}</h3>
              <button onClick={() => setDrawerVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-[#FDFBF9] rounded-2xl p-4 border border-[#EDEDED]">
              <div className="flex items-center gap-2 font-bold text-xs text-[#704F38] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-[#704F38]" /> Shipping Address
              </div>
              <div className="font-extrabold text-sm text-[#1F2029]">{selectedOrder?.shippingAddress?.name || 'Customer'}</div>
              <div className="text-xs text-[#797979] font-medium mt-1">
                {selectedOrder?.shippingAddress?.line1}, {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state} - {selectedOrder?.shippingAddress?.pincode}
              </div>
            </div>

            <div className="bg-[#FDFBF9] rounded-2xl p-4 border border-[#EDEDED]">
              <div className="font-bold text-xs text-[#1F2029] uppercase tracking-wider mb-3">Order Items</div>
              <div className="divide-y divide-[#EDEDED]">
                {selectedOrder?.items?.map((item, idx) => (
                  <div key={idx} className="flex py-2.5 text-xs items-center">
                    <div className="flex-1 font-bold text-[#1F2029]">{item.title}</div>
                    <div className="text-[#797979] font-medium mr-4">Size: {item.size} | Color: {item.color}</div>
                    <div className="font-black text-[#704F38]">{item.qty} x ₹{item.priceAtAdd || item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FDFBF9] rounded-2xl p-4 border border-[#EDEDED]">
              <div className="font-bold text-xs text-[#1F2029] uppercase tracking-wider mb-3">Lifecycle Timeline</div>
              <div className="space-y-2">
                {selectedOrder?.statusHistory?.map((hist, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#797979]" />
                    <div>
                      <span className="font-extrabold text-[#1F2029]">{hist.status?.toUpperCase()}</span>
                      <span className="text-[#797979] font-medium ml-2">{new Date(hist.timestamp).toLocaleString()} - {hist.reason || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
