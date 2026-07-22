import React, { useState } from 'react';
import { 
  useGetAdminOrdersQuery, 
  useUpdateOrderStatusMutation,
  useShipOrderMutation,
  useProcessReturnMutation,
  useLazyGetOrderInvoiceQuery
} from '../services/adminOrderApi';
import { Check, Truck, CheckCircle2, XCircle, Clock, X, MapPin, Printer } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

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

  // Shipment Modal State
  const [shipModalVisible, setShipModalVisible] = useState(false);
  const [shippingCourier, setShippingCourier] = useState('');
  const [shippingTrackingId, setShippingTrackingId] = useState('');
  const [shippingOrderId, setShippingOrderId] = useState(null);

  const { data, isLoading, refetch } = useGetAdminOrdersQuery({
    status: activeStatus || undefined,
    limit: 50,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [shipOrder, { isLoading: isShipping }] = useShipOrderMutation();
  const [processReturn] = useProcessReturnMutation();
  const [triggerGetInvoice, { isFetching: isInvoiceFetching }] = useLazyGetOrderInvoiceQuery();

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

  const handleOpenShipModal = (orderId) => {
    setShippingOrderId(orderId);
    setShippingCourier('');
    setShippingTrackingId('');
    setShipModalVisible(true);
  };

  const handleSaveShipment = async (e) => {
    if (e) e.preventDefault();
    if (!shippingCourier || !shippingTrackingId) return alert('Please enter courier and tracking ID');
    try {
      await shipOrder({ id: shippingOrderId, courier: shippingCourier, trackingId: shippingTrackingId }).unwrap();
      setShipModalVisible(false);
      refetch();
      alert('Shipment registered and order status updated to Shipped');
    } catch (err) {
      alert(err.data?.message || 'Failed to update shipment status');
    }
  };

  const handleProcessReturn = async (orderId, status) => {
    const reason = window.prompt(`Enter reason for ${status} return request:`);
    if (reason === null) return;
    try {
      await processReturn({ id: orderId, status, reason }).unwrap();
      setDrawerVisible(false);
      refetch();
      alert(`Return request was ${status}`);
    } catch (err) {
      alert(err.data?.message || 'Failed to process return request');
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await triggerGetInvoice(orderId).unwrap();
      if (!res.success || !res.invoice) return alert('Failed to get invoice');
      
      const { invoice } = res;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; padding: 40px; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #EEE; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; }
              .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              th, td { padding: 12px; border-bottom: 1px solid #EEE; text-align: left; }
              th { background: #FDFBF9; font-weight: bold; }
              .totals { display: flex; flex-direction: column; align-items: flex-end; font-size: 16px; }
              .total-row { display: flex; justify-content: space-between; width: 250px; padding: 6px 0; }
              .grand-total { font-weight: bold; border-top: 2px solid #111; padding-top: 10px; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="title">FashionStore Invoice</div>
                <div>Invoice No: ${invoice.invoiceNumber}</div>
                <div>Date: ${invoice.issueDate}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: bold;">FashionStore Admin Portal</div>
                <div>Order ID: #${invoice.orderId.toUpperCase()}</div>
              </div>
            </div>
            <div class="details">
              <div>
                <strong>Billed To:</strong>
                <div>${invoice.customer.name}</div>
                <div>${invoice.customer.phone}</div>
                <div>${invoice.customer.email}</div>
              </div>
              <div>
                <strong>Shipping Address:</strong>
                <div>${invoice.customer.address}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product Title</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.title}</td>
                    <td>${item.sku}</td>
                    <td>₹${item.price.toLocaleString('en-IN')}</td>
                    <td>${item.qty}</td>
                    <td style="text-align: right;">₹${item.total.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${invoice.totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>₹${invoice.totals.shipping.toLocaleString('en-IN')}</span>
              </div>
              <div class="total-row">
                <span>Discount:</span>
                <span>-₹${invoice.totals.discount.toLocaleString('en-IN')}</span>
              </div>
              <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>₹${invoice.totals.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      alert('Failed to trigger print window: ' + err.message);
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

      {/* Table-First Orders Listing */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[850px]">
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
              <tr>
                <td colSpan="6">
                  <Loader message="Loading Orders..." />
                </td>
              </tr>
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
                          <button onClick={() => handleOpenShipModal(order._id)} className="inline-flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors">
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
      </div>

      {/* Details Drawer Modal */}
      {drawerVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-[#EDEDED] space-y-5">
            <div className="flex justify-between items-center gap-3">
              <h3 className="text-lg font-black text-[#1F2029]">Order Details #{selectedOrder?._id?.slice(-8)?.toUpperCase()}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder._id)}
                  disabled={isInvoiceFetching}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#704F38] text-white rounded-lg text-xs font-bold shadow-sm transition-colors hover:bg-[#8C6244]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isInvoiceFetching ? 'Loading...' : 'Invoice'}</span>
                </button>
                <button onClick={() => setDrawerVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="bg-[#FDFBF9] rounded-xl p-4 border border-[#EDEDED]">
              <div className="flex items-center gap-2 font-bold text-xs text-[#704F38] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-[#704F38]" /> Shipping Address
              </div>
              <div className="font-extrabold text-sm text-[#1F2029]">
                {selectedOrder?.shippingAddress?.name || selectedOrder?.shippingAddress?.fullName || 'Customer'}
                {selectedOrder?.shippingAddress?.phone ? ` • ${selectedOrder.shippingAddress.phone}` : ''}
              </div>
              <div className="text-xs text-[#797979] font-medium mt-1">
                {[
                  selectedOrder?.shippingAddress?.line1 || selectedOrder?.shippingAddress?.address,
                  selectedOrder?.shippingAddress?.city,
                  selectedOrder?.shippingAddress?.state,
                  selectedOrder?.shippingAddress?.pincode || selectedOrder?.shippingAddress?.zip
                ].filter(Boolean).join(', ') || 'No address specified'}
              </div>
            </div>

            {selectedOrder?.shipmentDetails && (
              <div className="bg-[#EFF6FF] rounded-xl p-4 border border-[#BFDBFE]">
                <div className="font-bold text-xs text-[#1D4ED8] uppercase tracking-wider mb-2">Courier Shipping Info</div>
                <div className="text-xs font-bold text-[#1F2029]">Courier: {selectedOrder.shipmentDetails.courier}</div>
                <div className="text-xs text-[#797979] mt-0.5">Tracking Number: {selectedOrder.shipmentDetails.trackingId}</div>
              </div>
            )}

            <div className="bg-[#FDFBF9] rounded-xl p-4 border border-[#EDEDED]">
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

            {selectedOrder?.returnRequest && (
              <div className="bg-[#FEF2F2] rounded-xl p-4 border border-[#FCA5A5] space-y-2">
                <div className="font-extrabold text-xs text-[#E57373] uppercase tracking-wider">Return Request Details</div>
                <div className="text-xs font-bold text-[#1F2029]">Reason: {selectedOrder.returnRequest.reason}</div>
                <div className="text-xs text-[#797979]">Status: <span className="font-black">{selectedOrder.returnRequest.status?.toUpperCase() || 'PENDING'}</span></div>
                {selectedOrder.returnRequest.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleProcessReturn(selectedOrder._id, 'approved')} className="px-3.5 py-1.5 bg-[#4CAF50] text-white text-xs font-extrabold rounded-lg shadow-sm hover:scale-[1.02] transition-transform">Approve Return</button>
                    <button onClick={() => handleProcessReturn(selectedOrder._id, 'rejected')} className="px-3.5 py-1.5 bg-[#E57373] text-white text-xs font-extrabold rounded-lg shadow-sm hover:scale-[1.02] transition-transform">Reject Return</button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-[#FDFBF9] rounded-xl p-4 border border-[#EDEDED]">
              <div className="font-bold text-xs text-[#1F2029] uppercase tracking-wider mb-3">Lifecycle Timeline</div>
              <div className="space-y-2.5">
                {selectedOrder?.statusHistory?.map((hist, idx) => {
                  const statusNote = hist.reason || (
                    hist.status === 'placed' ? 'Order placed successfully' :
                    hist.status === 'confirmed' ? 'Order confirmed' :
                    hist.status === 'shipped' ? 'Dispatched for delivery' :
                    hist.status === 'delivered' ? 'Package delivered' :
                    hist.status === 'cancelled' ? 'Order cancelled' : 'Updated'
                  );
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#704F38]" />
                      <div>
                        <span className="font-extrabold text-[#1F2029]">{hist.status?.toUpperCase()}</span>
                        <span className="text-[#797979] font-medium ml-2">
                          {hist.timestamp ? new Date(hist.timestamp).toLocaleString() : ''}
                        </span>
                        <span className="text-[#704F38] font-semibold ml-2">
                          • {statusNote}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Modal */}
      {shipModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1F2029]">Register Order Shipment</h3>
              <button onClick={() => setShipModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveShipment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Courier Partner *</label>
                <input type="text" required placeholder="e.g. BlueDart, DHL, FedEx" value={shippingCourier} onChange={(e) => setShippingCourier(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Tracking ID / AWB *</label>
                <input type="text" required placeholder="e.g. 1234567890" value={shippingTrackingId} onChange={(e) => setShippingTrackingId(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShipModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
                <button type="submit" disabled={isShipping} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                  {isShipping ? 'Registering...' : 'Register Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
