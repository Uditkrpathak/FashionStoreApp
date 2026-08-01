import React, { useState } from 'react';
import { 
  useGetAdminOrdersQuery, 
  useUpdateOrderStatusMutation,
  useCreateShipmentMutation,
  useProcessReturnActionMutation,
  useProcessRefundMutation,
  useCreateReplacementOrderMutation
} from '../services/adminOrderApi';
import { Check, Truck, CheckCircle2, XCircle, Clock, X, MapPin, AlertTriangle, RotateCcw, DollarSign, FileText, CreditCard } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

const STATUS_TABS = [
  { id: '', label: 'All Orders' },
  { id: 'placed', label: 'Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
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

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [createShipment, { isLoading: isDispatching }] = useCreateShipmentMutation();
  const [processReturnAction, { isLoading: isProcessingReturn }] = useProcessReturnActionMutation();
  const [processRefund, { isLoading: isRefunding }] = useProcessRefundMutation();
  const [createReplacementOrder, { isLoading: isCreatingReplacement }] = useCreateReplacementOrderMutation();

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
      {/* Sticky Status Tabs Filter */}
      <div className="bg-white p-3 rounded-xl border border-[#EDEDED] shadow-sm flex gap-2 overflow-x-auto">
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead>
              <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Fulfillment SLA</th>
                <th className="px-5 py-4">Grand Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions & Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]">
              {isLoading ? (
                <tr>
                  <td colSpan="7">
                    <Loader message="Loading Order Lifecycle Data..." />
                  </td>
                </tr>
              ) : data?.orders?.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-[#797979]">No orders found matching criteria.</td></tr>
              ) : (
                data?.orders?.map((order) => {
                  const currentStatus = order.orderStatus || 'placed';
                  const now = new Date();
                  const deadline = order.slaDeadline ? new Date(order.slaDeadline) : new Date(new Date(order.createdAt).getTime() + 24 * 3600000);
                  const diffHours = (deadline - now) / (1000 * 60 * 60);

                  let slaBadge = 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]';
                  let slaLabel = 'On Track';

                  if (currentStatus !== 'delivered' && currentStatus !== 'cancelled' && currentStatus !== 'returned') {
                    if (diffHours < 0) {
                      slaBadge = 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] animate-pulse';
                      slaLabel = 'SLA Breached';
                    } else if (diffHours <= 4) {
                      slaBadge = 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
                      slaLabel = 'At Risk (<4h)';
                    }
                  } else {
                    slaLabel = 'Completed';
                    slaBadge = 'bg-gray-100 text-gray-600 border-gray-200';
                  }

                  return (
                    <tr key={order._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                      <td className="px-5 py-4 cursor-pointer" onClick={() => handleOpenDrawer(order)}>
                        <div className="font-mono font-bold text-[#704F38] select-all">
                          #ORD-{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-[#797979] font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-5 py-4 text-[#1F2029] font-medium">
                        {order.shippingAddress?.name || 'Customer'}
                      </td>
                      <td className="px-5 py-4 text-[#797979] font-medium">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border inline-flex items-center gap-1 ${slaBadge}`}>
                          {slaLabel === 'SLA Breached' && <AlertTriangle className="w-3 h-3" />}
                          {slaLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-[#704F38]">
                        <div>₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}</div>
                        <div className="text-[10px] font-extrabold text-[#797979] mt-0.5">
                          {(!order.paymentMethod || order.paymentMethod === 'cod' || order.paymentMethod?.type === 'cod' || order.paymentMethod === 'COD') ? '📦 COD' : '💳 Paid Online'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border ${
                          currentStatus === 'placed' ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]' :
                          currentStatus === 'confirmed' ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' :
                          currentStatus === 'shipped' ? 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]' :
                          currentStatus === 'delivered' ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]' :
                          currentStatus === 'returned' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
                        }`}>
                          {currentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex gap-1.5 flex-wrap justify-end">
                          {currentStatus === 'placed' && (
                            <button onClick={() => handleStateTransition(order._id, 'confirmed', 'Admin confirmed order')} className="inline-flex items-center gap-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                              <Check className="w-3.5 h-3.5" /> Confirm
                            </button>
                          )}
                          {(currentStatus === 'confirmed' || currentStatus === 'placed') && (
                            <button onClick={() => handleOpenShipmentModal(order)} className="inline-flex items-center gap-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                              <Truck className="w-3.5 h-3.5" /> Create Shipment
                            </button>
                          )}
                          {currentStatus === 'shipped' && (
                            <button onClick={() => handleStateTransition(order._id, 'delivered', 'Package delivered')} className="inline-flex items-center gap-1 bg-[#4CAF50] hover:bg-[#43A047] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Deliver
                            </button>
                          )}
                          {currentStatus === 'delivered' && (
                            <button onClick={() => handleOpenReturnModal(order)} className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
                              <RotateCcw className="w-3.5 h-3.5" /> Return / Refund
                            </button>
                          )}
                          <button onClick={() => handleOpenDrawer(order)} className="bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#1F2029] transition-colors">
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="text-base font-black text-[#1F2029]">Create & Dispatch Shipment</h3>
              </div>
              <button onClick={() => setShipmentModalOrder(null)} className="text-[#797979] hover:text-[#1F2029]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchShipment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Courier Partner *</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-bold text-[#1F2029]"
                >
                  <option value="FedEx Express">FedEx Express</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="DHL Express">DHL Express</option>
                  <option value="DTDC Express">DTDC Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="TRK-987654"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-mono font-bold text-[#1F2029]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Tracking URL (Optional)</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.courier.com/TRK-987654"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-xs font-medium text-[#1F2029]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShipmentModalOrder(null)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
                <button type="submit" disabled={isDispatching} className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-extrabold shadow-md">
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-[#1F2029]">Return & Refund Request</h3>
              </div>
              <button onClick={() => setReturnModalOrder(null)} className="text-[#797979] hover:text-[#1F2029]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-2">Return Decision</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnActionType('approve')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      returnActionType === 'approve' ? 'bg-[#047857] text-white border-[#047857]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'
                    }`}
                  >
                    Approve Return
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnActionType('reject')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      returnActionType === 'reject' ? 'bg-[#B91C1C] text-white border-[#B91C1C]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'
                    }`}
                  >
                    Reject Request
                  </button>
                </div>
              </div>

              {returnActionType === 'approve' && (
                <div>
                  <label className="block text-xs font-bold text-[#1F2029] uppercase mb-2">Resolution Mode</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReturnResolution('refund')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        returnResolution === 'refund' ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'
                      }`}
                    >
                      Refund & Credit Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnResolution('replacement')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        returnResolution === 'replacement' ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'
                      }`}
                    >
                      Replacement Order
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Administrative Notes</label>
                <textarea
                  placeholder="Specify return verification details or rejection reasons..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full h-20 px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setReturnModalOrder(null)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
                <button type="submit" disabled={isProcessingReturn || isRefunding || isCreatingReplacement} className="px-5 py-2.5 rounded-xl bg-[#704F38] text-white text-xs font-extrabold shadow-md">
                  {isProcessingReturn ? 'Processing...' : 'Apply Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Drawer Modal */}
      {drawerVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-[#EDEDED] space-y-5">
            <div className="flex justify-between items-center border-b border-[#EDEDED] pb-4">
              <h3 className="text-lg font-black text-[#1F2029]">Order Details #ORD-{selectedOrder?._id?.slice(-6)?.toUpperCase()}</h3>
              <button onClick={() => setDrawerVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            {selectedOrder?.shipmentDetails?.trackingNumber && (
              <div className="bg-[#F3E8FF] p-4 rounded-xl border border-[#E9D5FF] flex justify-between items-center">
                <div>
                  <div className="text-xs font-black text-[#6B21A8] uppercase">Shipment Dispatch Info</div>
                  <div className="text-xs font-bold text-[#1F2029] mt-0.5">
                    {selectedOrder.shipmentDetails.courierName} • Tracking: <span className="font-mono">{selectedOrder.shipmentDetails.trackingNumber}</span>
                  </div>
                </div>
                {selectedOrder.shipmentDetails.trackingUrl && (
                  <a href={selectedOrder.shipmentDetails.trackingUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#6B21A8] underline">
                    Track Live
                  </a>
                )}
              </div>
            )}

            {selectedOrder?.creditNoteId && (
              <div className="bg-[#ECFDF5] p-3 rounded-xl border border-[#A7F3D0] flex items-center gap-2 text-xs font-extrabold text-[#047857]">
                <FileText className="w-4 h-4" />
                Credit Note Issued: {selectedOrder.creditNoteId} (Refund Processed)
              </div>
            )}

            <div className="bg-[#FDFBF9] rounded-xl p-4 border border-[#EDEDED] space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#704F38] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#704F38]" /> Customer & Shipping Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#797979] font-medium block mb-0.5">Customer Name & ID:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-[#1F2029]">
                      {selectedOrder?.customerDetails?.name || selectedOrder?.shippingAddress?.name || selectedOrder?.shippingAddress?.fullName || 'Customer'}
                    </span>
                    {selectedOrder?.userId && (
                      <span className="text-[10px] font-mono font-bold text-[#704F38] bg-white px-1.5 py-0.5 rounded border border-[#EDEDED] select-all">
                        #USR-{selectedOrder.userId.slice(-6).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[#797979] font-medium block mb-0.5">Contact Details:</span>
                  <div className="font-extrabold text-[#1F2029]">
                    {selectedOrder?.customerDetails?.phone || selectedOrder?.shippingAddress?.phone || 'No Phone'}
                    {(selectedOrder?.customerDetails?.email || selectedOrder?.shippingAddress?.email)
                      ? ` • ${selectedOrder?.customerDetails?.email || selectedOrder?.shippingAddress?.email}`
                      : ''}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-[#EDEDED]">
                <span className="text-[#797979] font-medium text-xs block mb-0.5">Delivery Address:</span>
                <div className="text-xs text-[#1F2029] font-bold">
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

            <div className="bg-[#FDFBF9] rounded-xl p-4 border border-[#EDEDED] space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-[#704F38] uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-[#704F38]" /> Payment & Billing Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#797979] font-medium block mb-0.5">Payment Method:</span>
                  <div className="font-extrabold text-[#1F2029]">
                    {(!selectedOrder?.paymentMethod || selectedOrder?.paymentMethod === 'cod' || selectedOrder?.paymentMethod?.type === 'cod' || selectedOrder?.paymentMethod === 'COD')
                      ? 'Cash on Delivery (COD)'
                      : (typeof selectedOrder?.paymentMethod === 'string' ? selectedOrder?.paymentMethod : selectedOrder?.paymentMethod?.label || selectedOrder?.paymentMethod?.name || 'Online Payment')}
                  </div>
                </div>
                <div>
                  <span className="text-[#797979] font-medium block mb-0.5">Payment Status:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                      (selectedOrder?.paymentStatus === 'completed' || selectedOrder?.paymentStatus === 'paid')
                        ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                        : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                    }`}>
                      {(selectedOrder?.paymentStatus === 'completed' || selectedOrder?.paymentStatus === 'paid')
                        ? 'PAID / COMPLETED'
                        : 'PENDING (COLLECT ON DELIVERY)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FDFBF9] rounded-xl p-4 border border-[#EDEDED]">
              <div className="font-bold text-xs text-[#1F2029] uppercase tracking-wider mb-3">Order Items</div>
              <div className="divide-y divide-[#EDEDED]">
                {selectedOrder?.items?.map((item, idx) => {
                  const prodId = item.productId || item.product || item._id;
                  const formattedProdId = prodId ? prodId.toString().slice(-8).toUpperCase() : 'N/A';
                  return (
                    <div key={idx} className="flex py-2.5 text-xs items-center">
                      <div className="flex-1">
                        <div className="font-bold text-[#1F2029]">{item.title}</div>
                        <div className="text-[10px] font-mono text-[#797979] mt-0.5 flex items-center gap-1">
                          <span>Product ID:</span>
                          <span className="font-bold text-[#704F38] select-all bg-[#FDFBF9] px-1.5 py-0.5 rounded border border-[#EDEDED]">
                            #{formattedProdId}
                          </span>
                        </div>
                      </div>
                      <div className="text-[#797979] font-medium mr-4">Size: {item.size} | Color: {item.color}</div>
                      <div className="font-black text-[#704F38]">{item.qty} x ₹{item.priceAtAdd || item.price}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#FDFBF9] rounded-xl p-4 border border-[#EDEDED]">
              <div className="font-bold text-xs text-[#1F2029] uppercase tracking-wider mb-3">Lifecycle Timeline</div>
              <div className="space-y-2.5">
                {selectedOrder?.statusHistory?.map((hist, idx) => {
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#704F38]" />
                      <div>
                        <span className="font-extrabold text-[#1F2029]">{hist.status?.toUpperCase()}</span>
                        <span className="text-[#797979] font-medium ml-2">
                          {hist.timestamp ? new Date(hist.timestamp).toLocaleString() : ''}
                        </span>
                        {hist.reason && <span className="text-[#704F38] font-semibold ml-2">• {hist.reason}</span>}
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
