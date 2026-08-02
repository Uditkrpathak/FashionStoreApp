import React, { useState, useEffect } from 'react';
import { 
  useGetAdminOrdersQuery, 
  useUpdateOrderStatusMutation,
  useCreateShipmentMutation,
  useProcessReturnActionMutation,
  useProcessRefundMutation,
  useCreateReplacementOrderMutation
} from '../services/adminOrderApi';
import { 
  Check, Truck, CheckCircle2, XCircle, Clock, X, MapPin, AlertTriangle, 
  RotateCcw, DollarSign, FileText, CreditCard, ExternalLink, Package, ShoppingBag, ShieldCheck
} from 'lucide-react';
import { Loader } from '../shared/components/Loader';
import { FulfillmentVelocityChart } from '../shared/components/FulfillmentVelocityChart';
import { useGetAdminUsersQuery } from '../services/adminAuthApi';

const STATUS_TABS = [
  { id: '', label: 'All Orders' },
  { id: 'placed', label: 'Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'return_requested', label: 'Return Requests' },
  { id: 'returned', label: 'Returned' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const OrderFulfillmentPage = ({ initialStatusFilter = '' }) => {
  const [activeStatus, setActiveStatus] = useState(initialStatusFilter);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Shipment Modal State
  const [shipmentModalOrder, setShipmentModalOrder] = useState(null);
  const [courierName, setCourierName] = useState('FedEx Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  // Return & Refund Modal State
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnActionType, setReturnActionType] = useState('approve'); // 'approve' | 'reject'
  const [returnResolution, setReturnResolution] = useState('refund'); // 'refund' | 'replacement'
  const [adminNotes, setAdminNotes] = useState('');

  const { data, isLoading, refetch } = useGetAdminOrdersQuery({
    status: activeStatus || undefined,
    limit: 50,
  });

  const { data: usersData } = useGetAdminUsersQuery({ limit: 100 });

  const orders = data?.orders || [];
  const registeredUsers = usersData?.users || [];

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [createShipment, { isLoading: isDispatching }] = useCreateShipmentMutation();
  const [processReturnAction, { isLoading: isProcessingReturn }] = useProcessReturnActionMutation();
  const [processRefund, { isLoading: isRefunding }] = useProcessRefundMutation();
  const [createReplacementOrder, { isLoading: isCreatingReplacement }] = useCreateReplacementOrderMutation();

  // Keyboard listener for Escape key to close modals/drawers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShipmentModalOrder(null);
        setReturnModalOrder(null);
        setDrawerVisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleOpenShipmentModal = (order) => {
    setShipmentModalOrder(order);
    setTrackingNumber(`TRK-${Math.floor(100000 + Math.random() * 900000)}`);
    setTrackingUrl('');
  };

  const handleDispatchShipment = async (e) => {
    e.preventDefault();
    if (!shipmentModalOrder) return;
    try {
      await createShipment({
        id: shipmentModalOrder._id,
        courierName,
        trackingNumber: trackingNumber.trim(),
        trackingUrl: trackingUrl.trim() || undefined
      }).unwrap();
      setShipmentModalOrder(null);
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to create shipment');
    }
  };

  const handleOpenReturnModal = (order) => {
    setReturnModalOrder(order);
    setReturnActionType('approve');
    setReturnResolution('refund');
    setAdminNotes('');
  };

  const handleProcessReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnModalOrder) return;
    try {
      await processReturnAction({
        id: returnModalOrder._id,
        action: returnActionType,
        returnType: returnResolution,
        adminNotes: adminNotes.trim()
      }).unwrap();

      if (returnActionType === 'approve') {
        if (returnResolution === 'refund') {
          await processRefund({ id: returnModalOrder._id, refundMode: 'Original Payment Method' }).unwrap();
        } else if (returnResolution === 'replacement') {
          await createReplacementOrder(returnModalOrder._id).unwrap();
        }
      }

      setReturnModalOrder(null);
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to process return request');
    }
  };

  const handleOpenDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Fulfillment Pipeline & SLA Velocity SVG Chart */}
      <FulfillmentVelocityChart orders={orders} />

      {/* Sticky Status Tabs Filter with Count Badges */}
      <div className="bg-white dark:bg-[#181926] p-3 rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex gap-2 overflow-x-auto transition-colors">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.id;
          const count = tab.id
            ? orders.filter((o) => (o.orderStatus || 'placed') === tab.id).length
            : orders.length;

          return (
            <button
              key={tab.id || 'all'}
              onClick={() => setActiveStatus(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-[#704F38] text-white shadow-md'
                  : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#2A2C3F] hover:text-[#1F2029] dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EDEDED] dark:bg-[#262838] text-[#1F2029] dark:text-white'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[950px]">
            <thead>
              <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer Details</th>
                <th className="px-5 py-4">Items Ordered</th>
                <th className="px-5 py-4">Fulfillment SLA</th>
                <th className="px-5 py-4">Grand Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions & Courier Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
              {isLoading ? (
                <tr>
                  <td colSpan="7">
                    <Loader message="Loading Order Lifecycle Data..." />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-[#797979] dark:text-[#A0AEC0] font-bold">No orders found matching criteria.</td></tr>
              ) : (
                orders.map((order) => {
                  const currentStatus = order.orderStatus || 'placed';
                  const now = new Date();
                  const deadline = order.slaDeadline ? new Date(order.slaDeadline) : new Date(new Date(order.createdAt).getTime() + 24 * 3600000);
                  const diffHours = (deadline - now) / (1000 * 60 * 60);

                  let slaBadge = 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border-[#A7F3D0] dark:border-[#064E3B]/50';
                  let slaLabel = 'On Track';

                  if (currentStatus !== 'delivered' && currentStatus !== 'cancelled' && currentStatus !== 'returned') {
                    if (diffHours < 0) {
                      slaBadge = 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]/50 animate-pulse';
                      slaLabel = 'SLA Breached';
                    } else if (diffHours <= 4) {
                      slaBadge = 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#B45309]/50';
                      slaLabel = 'At Risk (<4h)';
                    }
                  } else {
                    slaLabel = 'Completed';
                    slaBadge = 'bg-gray-100 dark:bg-[#11121E] text-gray-600 dark:text-[#A0AEC0] border-gray-200 dark:border-[#2A2C3F]';
                  }

                  const custName = order.shippingAddress?.name || order.customerDetails?.name || 'Customer';
                  const custEmail = (order.customerDetails?.email || order.shippingAddress?.email || '').toLowerCase();
                  const custFirstChar = custName.charAt(0).toUpperCase();

                  const matchingUser = registeredUsers.find(
                    (u) => u._id === order.userId || 
                           (u.email && u.email.toLowerCase() === custEmail) || 
                           (u.name && u.name.toLowerCase() === custName.toLowerCase())
                  );

                  const custAvatar = order.customerDetails?.avatar || order.shippingAddress?.avatar || order.user?.avatar || matchingUser?.avatar;

                  return (
                    <tr key={order._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                      {/* Order ID & Date */}
                      <td className="px-5 py-4 cursor-pointer whitespace-nowrap" onClick={() => handleOpenDrawer(order)}>
                        <div className="font-mono font-black text-xs text-[#704F38] dark:text-[#E8B84E] select-all tracking-tight">
                          #ORD-{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>

                      {/* Customer Profile Avatar Image & Info */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] dark:bg-[#11121E] border border-[#E2E8F0] dark:border-[#2A2C3F] flex items-center justify-center font-black text-sm text-[#704F38] dark:text-[#E8B84E] shadow-sm flex-shrink-0 overflow-hidden">
                            {custAvatar ? (
                              <img
                                src={custAvatar}
                                alt={custName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              custFirstChar
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#1F2029] dark:text-white">{custName}</div>
                            <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] font-medium">
                              {order.customerDetails?.phone || order.shippingAddress?.phone || 'Phone linked'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Items Preview */}
                      <td className="px-5 py-4">
                        {(() => {
                          const firstItem = order.items?.[0];
                          const itemImg = firstItem?.image || firstItem?.images?.[0] || firstItem?.thumbnail;
                          const itemTitle = firstItem?.title;

                          return (
                            <div className="flex items-center gap-2.5">
                              {itemImg && (
                                <img
                                  src={itemImg}
                                  alt={itemTitle || 'Product'}
                                  className="w-9 h-9 rounded-xl object-cover border border-[#EDEDED] dark:border-[#2A2C3F] flex-shrink-0"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              <div>
                                <span className="font-extrabold text-xs text-[#1F2029] dark:text-white block">
                                  {order.items?.length || 1} Item(s)
                                </span>
                                {itemTitle && (
                                  <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] truncate max-w-[150px] font-medium mt-0.5">
                                    {itemTitle}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* SLA Badge */}
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase border inline-flex items-center gap-1.5 ${slaBadge}`}>
                          {slaLabel === 'SLA Breached' && <AlertTriangle className="w-3 h-3" />}
                          {slaLabel}
                        </span>
                      </td>

                      {/* Grand Total */}
                      <td className="px-5 py-4 font-black text-[#704F38] dark:text-[#E8B84E]">
                        <div className="text-sm font-black">₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}</div>
                        <div className="text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] mt-0.5">
                          {(!order.paymentMethod || order.paymentMethod === 'cod' || order.paymentMethod?.type === 'cod' || order.paymentMethod === 'COD') ? '📦 COD' : '💳 Paid Online'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase border ${
                          currentStatus === 'placed' ? 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#B45309]/50' :
                          currentStatus === 'confirmed' ? 'bg-[#EEF2FF] dark:bg-[#312E81]/30 text-[#4338CA] dark:text-[#818CF8] border-[#C7D2FE] dark:border-[#312E81]/50' :
                          currentStatus === 'shipped' ? 'bg-[#F3E8FF] dark:bg-[#581C87]/30 text-[#6B21A8] dark:text-[#C084FC] border-[#E9D5FF] dark:border-[#581C87]/50' :
                          currentStatus === 'delivered' ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border-[#A7F3D0] dark:border-[#064E3B]/50' :
                          currentStatus === 'return_requested' ? 'bg-[#FFF7ED] dark:bg-[#7C2D12]/30 text-[#C2410C] dark:text-[#FB923C] border-[#FFEDD5] dark:border-[#7C2D12]/50 animate-pulse' :
                          currentStatus === 'returned' ? 'bg-[#F3F4F6] dark:bg-[#1F2937]/30 text-[#4B5563] dark:text-[#9CA3AF] border-[#E5E7EB] dark:border-[#374151]' :
                          'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]/50'
                        }`}>
                          {currentStatus === 'return_requested' ? 'RETURN REQUESTED' : currentStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex gap-2 flex-wrap justify-end">
                          {currentStatus === 'placed' && (
                            <button
                              onClick={() => handleStateTransition(order._id, 'confirmed', 'Admin confirmed order')}
                              className="inline-flex items-center gap-1.5 bg-[#704F38] hover:bg-[#8C6244] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md shadow-[#704F38]/20 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" /> Confirm
                            </button>
                          )}
                          {(currentStatus === 'confirmed' || currentStatus === 'placed') && (
                            <button
                              onClick={() => handleOpenShipmentModal(order)}
                              className="inline-flex items-center gap-1.5 bg-[#1F2029] dark:bg-[#11121E] hover:bg-[#704F38] dark:hover:bg-[#E8B84E] text-white dark:text-[#E8B84E] dark:hover:text-[#1F2029] px-3 py-1.5 rounded-xl text-xs font-black border border-[#EDEDED] dark:border-[#2A2C3F] shadow-sm transition-all"
                            >
                              <Truck className="w-3.5 h-3.5" /> Create Shipment
                            </button>
                          )}
                          {currentStatus === 'shipped' && (
                            <button
                              onClick={() => handleStateTransition(order._id, 'delivered', 'Package delivered')}
                              className="inline-flex items-center gap-1.5 bg-[#047857] hover:bg-[#065F46] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md shadow-[#047857]/20 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Deliver
                            </button>
                          )}
                          {currentStatus === 'return_requested' && (
                            <button
                              onClick={() => handleOpenReturnModal(order)}
                              className="inline-flex items-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md shadow-[#C2410C]/20 transition-all animate-pulse"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Review Return Request
                            </button>
                          )}
                          {currentStatus === 'delivered' && (
                            <button
                              onClick={() => handleOpenReturnModal(order)}
                              className="inline-flex items-center gap-1.5 bg-[#1F2029] dark:bg-[#11121E] hover:bg-[#704F38] text-white px-3 py-1.5 rounded-xl text-xs font-black border border-[#EDEDED] dark:border-[#2A2C3F] shadow-sm transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Initiate Return
                            </button>
                          )}
                          {currentStatus === 'returned' && (
                            <button
                              onClick={() => handleOpenReturnModal(order)}
                              className="inline-flex items-center gap-1.5 bg-[#704F38] hover:bg-[#8C6244] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Process Refund
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenDrawer(order)}
                            className="bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#1F2029] dark:text-white transition-all shadow-sm"
                          >
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
      </div>

      {/* Dispatch Shipment Modal */}
      {shipmentModalOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED] dark:border-[#262838] transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] dark:border-[#262838] pb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#704F38] dark:text-[#E8B84E]" />
                <h3 className="text-base font-black text-[#1F2029] dark:text-white">Create & Dispatch Shipment</h3>
              </div>
              <button onClick={() => setShipmentModalOrder(null)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchShipment} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Courier Partner *</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-sm font-bold text-[#1F2029] dark:text-white"
                >
                  <option value="FedEx Express">FedEx Express</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="DHL Express">DHL Express</option>
                  <option value="DTDC Express">DTDC Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="TRK-987654"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-sm font-mono font-bold text-[#1F2029] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Tracking URL (Optional)</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.courier.com/TRK-987654"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-xs font-medium text-[#1F2029] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShipmentModalOrder(null)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] text-xs font-extrabold text-[#797979] dark:text-[#A0AEC0]">Cancel</button>
                <button type="submit" disabled={isDispatching} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                  {isDispatching ? 'Dispatching...' : 'Dispatch Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return & Refund Action Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED] dark:border-[#262838] transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] dark:border-[#262838] pb-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#C2410C]" />
                <h3 className="text-base font-black text-[#1F2029] dark:text-white">Return & Refund Request</h3>
              </div>
              <button onClick={() => setReturnModalOrder(null)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessReturnSubmit} className="space-y-4">
              {returnModalOrder.returnRequest?.reason && (
                <div className="bg-[#FFF7ED] dark:bg-[#7C2D12]/30 p-3 rounded-2xl border border-[#FFEDD5] dark:border-[#7C2D12]/50 text-xs">
                  <div className="font-extrabold text-[#C2410C] dark:text-[#FB923C] uppercase text-[10px] mb-1">
                    Customer Return Reason:
                  </div>
                  <div className="font-bold text-[#1F2029] dark:text-white">
                    "{returnModalOrder.returnRequest.reason}"
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-2">Return Decision</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnActionType('approve')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      returnActionType === 'approve' ? 'bg-[#047857] text-white border-[#047857]' : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                    }`}
                  >
                    Approve Return
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnActionType('reject')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      returnActionType === 'reject' ? 'bg-[#B91C1C] text-white border-[#B91C1C]' : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                    }`}
                  >
                    Reject Request
                  </button>
                </div>
              </div>

              {returnActionType === 'approve' && (
                <div>
                  <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-2">Resolution Mode</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReturnResolution('refund')}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        returnResolution === 'refund' ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                      }`}
                    >
                      Refund & Credit Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnResolution('replacement')}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        returnResolution === 'replacement' ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                      }`}
                    >
                      Replacement Order
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Administrative Notes</label>
                <textarea
                  placeholder="Specify return verification details or rejection reasons..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full h-20 px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-xs font-medium text-[#1F2029] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setReturnModalOrder(null)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] text-xs font-extrabold text-[#797979] dark:text-[#A0AEC0]">Cancel</button>
                <button type="submit" disabled={isProcessingReturn || isRefunding || isCreatingReplacement} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                  {isProcessingReturn ? 'Processing...' : 'Apply Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Drawer Modal */}
      {drawerVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-[#EDEDED] dark:border-[#262838] space-y-5 transition-colors">
            <div className="flex justify-between items-center border-b border-[#EDEDED] dark:border-[#262838] pb-4">
              <h3 className="text-lg font-black text-[#1F2029] dark:text-white">Order Details #ORD-{selectedOrder?._id?.slice(-6)?.toUpperCase()}</h3>
              <button onClick={() => setDrawerVisible(false)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {selectedOrder?.shipmentDetails?.trackingNumber && (
              <div className="bg-[#F3E8FF] dark:bg-[#581C87]/30 p-4 rounded-2xl border border-[#E9D5FF] dark:border-[#581C87]/50 flex justify-between items-center">
                <div>
                  <div className="text-xs font-black text-[#6B21A8] dark:text-[#C084FC] uppercase">Shipment Dispatch Info</div>
                  <div className="text-xs font-bold text-[#1F2029] dark:text-white mt-0.5">
                    {selectedOrder.shipmentDetails.courierName} • Tracking: <span className="font-mono">{selectedOrder.shipmentDetails.trackingNumber}</span>
                  </div>
                </div>
                {selectedOrder.shipmentDetails.trackingUrl && (
                  <a href={selectedOrder.shipmentDetails.trackingUrl} target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[#6B21A8] dark:text-[#C084FC] underline flex items-center gap-1">
                    Track Live <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {selectedOrder?.creditNoteId && (
              <div className="bg-[#ECFDF5] dark:bg-[#064E3B]/30 p-3 rounded-2xl border border-[#A7F3D0] dark:border-[#064E3B]/50 flex items-center gap-2 text-xs font-extrabold text-[#047857] dark:text-[#34D399]">
                <FileText className="w-4 h-4" />
                Credit Note Issued: {selectedOrder.creditNoteId} (Refund Processed)
              </div>
            )}

            <div className="bg-[#FDFBF9] dark:bg-[#11121E] rounded-2xl p-4 border border-[#EDEDED] dark:border-[#2A2C3F] space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#704F38] dark:text-[#E8B84E] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Customer & Shipping Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#797979] dark:text-[#A0AEC0] font-medium block mb-0.5">Customer Name & ID:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-[#1F2029] dark:text-white">
                      {selectedOrder?.customerDetails?.name || selectedOrder?.shippingAddress?.name || selectedOrder?.shippingAddress?.fullName || 'Customer'}
                    </span>
                    {selectedOrder?.userId && (
                      <span className="text-[10px] font-mono font-bold text-[#704F38] dark:text-[#E8B84E] bg-white dark:bg-[#181926] px-1.5 py-0.5 rounded border border-[#EDEDED] dark:border-[#262838] select-all">
                        #USR-{selectedOrder.userId.slice(-6).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[#797979] dark:text-[#A0AEC0] font-medium block mb-0.5">Contact Details:</span>
                  <div className="font-extrabold text-[#1F2029] dark:text-white">
                    {selectedOrder?.customerDetails?.phone || selectedOrder?.shippingAddress?.phone || 'No Phone'}
                    {(selectedOrder?.customerDetails?.email || selectedOrder?.shippingAddress?.email)
                      ? ` • ${selectedOrder?.customerDetails?.email || selectedOrder?.shippingAddress?.email}`
                      : ''}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-[#EDEDED] dark:border-[#2A2C3F]">
                <span className="text-[#797979] dark:text-[#A0AEC0] font-medium text-xs block mb-0.5">Delivery Address:</span>
                <div className="text-xs text-[#1F2029] dark:text-white font-extrabold">
                  {[
                    selectedOrder?.shippingAddress?.line1 || selectedOrder?.shippingAddress?.address,
                    selectedOrder?.shippingAddress?.line2,
                    selectedOrder?.shippingAddress?.city,
                    selectedOrder?.shippingAddress?.state,
                    selectedOrder?.shippingAddress?.pincode || selectedOrder?.shippingAddress?.zip
                  ].filter(Boolean).join(', ') || 'No shipping address provided'}
                </div>
              </div>
            </div>

            <div className="bg-[#FDFBF9] dark:bg-[#11121E] rounded-2xl p-4 border border-[#EDEDED] dark:border-[#2A2C3F] space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#704F38] dark:text-[#E8B84E] uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Payment & Billing Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#797979] dark:text-[#A0AEC0] font-medium block mb-0.5">Payment Method:</span>
                  <div className="font-extrabold text-[#1F2029] dark:text-white">
                    {(!selectedOrder?.paymentMethod || selectedOrder?.paymentMethod === 'cod' || selectedOrder?.paymentMethod?.type === 'cod' || selectedOrder?.paymentMethod === 'COD')
                      ? 'Cash on Delivery (COD)'
                      : (typeof selectedOrder?.paymentMethod === 'string' ? selectedOrder?.paymentMethod : selectedOrder?.paymentMethod?.label || selectedOrder?.paymentMethod?.name || 'Online Payment')}
                  </div>
                </div>
                <div>
                  <span className="text-[#797979] dark:text-[#A0AEC0] font-medium block mb-0.5">Payment Status:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      (selectedOrder?.paymentStatus === 'completed' || selectedOrder?.paymentStatus === 'paid')
                        ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border-[#A7F3D0] dark:border-[#064E3B]/50'
                        : 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#B45309]/50'
                    }`}>
                      {(selectedOrder?.paymentStatus === 'completed' || selectedOrder?.paymentStatus === 'paid')
                        ? 'PAID / COMPLETED'
                        : 'PENDING (COLLECT ON DELIVERY)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FDFBF9] dark:bg-[#11121E] rounded-2xl p-4 border border-[#EDEDED] dark:border-[#2A2C3F]">
              <div className="font-bold text-xs text-[#1F2029] dark:text-white uppercase tracking-wider mb-3">Order Items</div>
              <div className="divide-y divide-[#EDEDED] dark:divide-[#2A2C3F]">
                {selectedOrder?.items?.map((item, idx) => {
                  const prodId = item.productId || item.product || item._id;
                  const formattedProdId = prodId ? prodId.toString().slice(-8).toUpperCase() : 'N/A';
                  return (
                    <div key={idx} className="flex py-2.5 text-xs items-center">
                      <div className="flex-1">
                        <div className="font-extrabold text-[#1F2029] dark:text-white">{item.title}</div>
                        <div className="text-[10px] font-mono text-[#797979] dark:text-[#A0AEC0] mt-0.5 flex items-center gap-1">
                          <span>Product ID:</span>
                          <span className="font-bold text-[#704F38] dark:text-[#E8B84E] select-all bg-white dark:bg-[#181926] px-1.5 py-0.5 rounded border border-[#EDEDED] dark:border-[#262838]">
                            #{formattedProdId}
                          </span>
                        </div>
                      </div>
                      <div className="text-[#797979] dark:text-[#A0AEC0] font-bold mr-4">Size: {item.size} | Color: {item.color}</div>
                      <div className="font-black text-[#704F38] dark:text-[#E8B84E]">{item.qty} x ₹{item.priceAtAdd || item.price}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#FDFBF9] dark:bg-[#11121E] rounded-2xl p-4 border border-[#EDEDED] dark:border-[#2A2C3F]">
              <div className="font-bold text-xs text-[#1F2029] dark:text-white uppercase tracking-wider mb-3">Lifecycle Timeline</div>
              <div className="space-y-2.5">
                {selectedOrder?.statusHistory?.map((hist, idx) => {
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#704F38] dark:text-[#E8B84E]" />
                      <div>
                        <span className="font-extrabold text-[#1F2029] dark:text-white">{hist.status?.toUpperCase()}</span>
                        <span className="text-[#797979] dark:text-[#A0AEC0] font-medium ml-2">
                          {hist.timestamp ? new Date(hist.timestamp).toLocaleString() : ''}
                        </span>
                        {hist.reason && <span className="text-[#704F38] dark:text-[#E8B84E] font-semibold ml-2">• {hist.reason}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
