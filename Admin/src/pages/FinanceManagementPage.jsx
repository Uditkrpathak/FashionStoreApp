import React, { useState, useEffect } from 'react';
import { useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { Loader } from '../shared/components/Loader';
import { FileText, Download, IndianRupee, CreditCard, ShieldCheck, Printer, AlertTriangle, X, CheckCircle2, Clock } from 'lucide-react';

export const FinanceManagementPage = () => {
  const { data, isLoading } = useGetAdminOrdersQuery({ limit: 100 });
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedInvoiceOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePrintInvoice = () => {
    window.print();
  };

  const orders = data?.orders || [];

  const settledRevenue = orders
    ?.filter((o) => {
      const isCOD = String(o.paymentMethod?.type || o.paymentMethod || '').toLowerCase().includes('cod');
      return o.paymentStatus === 'completed' || o.paymentStatus === 'paid' || (isCOD && o.orderStatus === 'delivered');
    })
    .reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0) || 0;

  const onlinePaymentsCount = orders.filter(o => {
    const isCOD = String(o.paymentMethod?.type || o.paymentMethod || '').toLowerCase().includes('cod');
    return !isCOD;
  }).length;

  const codPendingCount = orders.filter(o => {
    const isCOD = String(o.paymentMethod?.type || o.paymentMethod || '').toLowerCase().includes('cod');
    return isCOD && o.orderStatus !== 'delivered';
  }).length;

  return (
    <div className="space-y-6">
      {/* Financial Metric Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#181926] p-5 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#704F38]/10 dark:bg-[#E8B84E]/10 text-[#704F38] dark:text-[#E8B84E] flex items-center justify-center font-black">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Total Settled Revenue</span>
            <span className="text-xl font-black text-[#704F38] dark:text-[#E8B84E] mt-0.5 block">₹{settledRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181926] p-5 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#1D4ED8] dark:text-[#60A5FA] flex items-center justify-center font-black">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Online Gateway Transactions</span>
            <span className="text-xl font-black text-[#1F2029] dark:text-white mt-0.5 block">{onlinePaymentsCount} Payments</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181926] p-5 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">COD Pending Collections</span>
            <span className="text-xl font-black text-[#1F2029] dark:text-white mt-0.5 block">{codPendingCount} Orders</span>
          </div>
        </div>
      </div>

      {/* Payment Ledger Table */}
      <div className="bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-[#EDEDED] dark:border-[#262838] flex justify-between items-center bg-[#FDFBF9] dark:bg-[#11121E]">
          <div>
            <h3 className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Payment Transactions & Tax Ledger Log
            </h3>
            <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">Verified transaction logs, Razorpay payment IDs, and printable delivery receipts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[850px]">
            <thead>
              <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Transaction / Order</th>
                <th className="px-5 py-4">Payment Gateway</th>
                <th className="px-5 py-4">Payment Method</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Tax Invoice & Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
              {isLoading ? (
                <tr><td colSpan="6"><Loader message="Loading Payment Ledger..." /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-[#797979] dark:text-[#A0AEC0] font-bold">No payment records found.</td></tr>
              ) : (
                orders.map((order) => {
                  const rawMethod = typeof order.paymentMethod === 'string'
                    ? order.paymentMethod.toLowerCase()
                    : (order.paymentMethod?.type || order.paymentMethod?.id || order.paymentMethod?.name || '').toLowerCase();
                  
                  const isCOD = rawMethod.includes('cod');
                  const isPaid = order.paymentStatus === 'completed' || order.paymentStatus === 'paid';
                  const isCancelled = order.orderStatus === 'cancelled';

                  const gatewayLabel = isCOD ? 'COD (DIRECT)' : (order.paymentGateway ? order.paymentGateway.toUpperCase() : 'RAZORPAY');
                  
                  const methodLabel = isCOD
                    ? 'Cash on Delivery (COD)'
                    : (rawMethod === 'card' ? 'Credit / Debit Card' : (rawMethod === 'upi' ? 'UPI Instant' : 'Online Payment'));

                  const statusBadge = isCancelled
                    ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]/50'
                    : (isCOD
                      ? 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#B45309]/50'
                      : (isPaid
                        ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border-[#A7F3D0] dark:border-[#064E3B]/50'
                        : (order.paymentStatus === 'refunded' ? 'bg-[#FFF7ED] dark:bg-[#7C2D12]/30 text-[#C2410C] dark:text-[#FB923C] border-[#FFEDD5] dark:border-[#7C2D12]/50' : 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#B45309]/50')));

                  const statusText = isCancelled ? 'CANCELLED' : (isCOD ? 'PENDING (COD)' : (order.paymentStatus || 'PENDING').toUpperCase());

                  const invoiceBtnLabel = isCancelled
                    ? 'Cancelled Invoice'
                    : (isCOD ? 'Delivery Invoice' : (isPaid ? 'Tax Invoice' : 'Pro-Forma Draft'));

                  const custName = order.shippingAddress?.name || order.customerDetails?.name || 'Customer';

                  return (
                    <tr key={order._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono font-black text-xs text-[#704F38] dark:text-[#E8B84E] select-all">
                          #ORD-{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-[#1F2029] dark:text-white font-extrabold mt-0.5">
                          {custName}
                        </div>
                        {order.razorpayPaymentId && (
                          <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] font-mono select-all mt-0.5">
                            Txn: {order.razorpayPaymentId}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase border ${
                          isCOD
                            ? 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#B45309]/50'
                            : 'bg-[#EEF2FF] dark:bg-[#312E81]/30 text-[#4338CA] dark:text-[#818CF8] border-[#C7D2FE] dark:border-[#312E81]/50'
                        }`}>
                          {gatewayLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-extrabold text-[#1F2029] dark:text-white whitespace-nowrap">
                        {methodLabel}
                      </td>
                      <td className="px-5 py-4 font-black text-[#704F38] dark:text-[#E8B84E] text-sm whitespace-nowrap">
                        ₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3.5 py-1.5 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-md shadow-[#704F38]/20 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" /> {invoiceBtnLabel}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable GST Tax Invoice Modal */}
      {selectedInvoiceOrder && (() => {
        const rawMethod = typeof selectedInvoiceOrder.paymentMethod === 'string'
          ? selectedInvoiceOrder.paymentMethod.toLowerCase()
          : (selectedInvoiceOrder.paymentMethod?.type || selectedInvoiceOrder.paymentMethod?.id || '').toLowerCase();
        
        const isCOD = rawMethod.includes('cod');
        const isPaid = selectedInvoiceOrder.paymentStatus === 'completed' || selectedInvoiceOrder.paymentStatus === 'paid';
        const isCancelledOrder = selectedInvoiceOrder.orderStatus === 'cancelled';
        const isReturnApproved = selectedInvoiceOrder.returnRequest?.status === 'approved' || selectedInvoiceOrder.orderStatus === 'returned';
        const isReturnRejected = selectedInvoiceOrder.returnRequest?.status === 'rejected';

        const invoiceHeading = isCancelledOrder
          ? 'Cancelled Order Invoice'
          : isReturnApproved
          ? 'Return Completed Invoice'
          : isReturnRejected
          ? 'Tax Invoice (Return Rejected)'
          : (isCOD ? 'Delivery Invoice & Cash Receipt' : (isPaid ? 'Official GST Tax Invoice' : 'Pro-Forma Invoice'));

        const grandTotal = selectedInvoiceOrder.totals?.grandTotal || 0;
        const subTotal = selectedInvoiceOrder.totals?.subtotal || Math.round(grandTotal * 0.8475);
        const gstTotal = grandTotal - subTotal;
        const cgst = Math.round(gstTotal / 2);
        const sgst = gstTotal - cgst;

        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EDEDED] dark:border-[#262838] space-y-6 transition-colors">
              <div className="flex justify-between items-center border-b border-[#EDEDED] dark:border-[#262838] pb-4">
                <h3 className="text-base font-black text-[#1F2029] dark:text-white">{invoiceHeading}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrintInvoice}
                    className="px-4 py-2 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Printer className="w-4 h-4" /> Print / Save PDF
                  </button>
                  <button onClick={() => setSelectedInvoiceOrder(null)} className="p-2 text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Container */}
              <div id="printable-invoice" className="p-6 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-3xl space-y-6 relative overflow-hidden text-[#1F2029] dark:text-white">
                {isCancelledOrder && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="text-[70px] font-black text-red-500/10 uppercase tracking-widest rotate-[-30deg] select-none">
                      CANCELLED
                    </div>
                  </div>
                )}

                {isReturnApproved && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="text-[55px] font-black text-emerald-500/10 uppercase tracking-widest rotate-[-30deg] select-none text-center leading-none">
                      RETURN<br/>COMPLETED
                    </div>
                  </div>
                )}

                {isReturnRejected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="text-[55px] font-black text-red-500/10 uppercase tracking-widest rotate-[-30deg] select-none text-center leading-none">
                      RETURN<br/>REJECTED
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start border-b border-[#EDEDED] dark:border-[#262838] pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#704F38] dark:text-[#E8B84E]">FashionStore India Pvt Ltd</h2>
                    <p className="text-[11px] text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">GSTIN: 27AAACF1234H1Z5 • PAN: AAACF1234H</p>
                    <p className="text-[10px] text-[#797979] dark:text-[#A0AEC0]">Registered Office: High Street Fashion Hub, Bandra West, Mumbai 400050</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-black text-[#704F38] dark:text-[#E8B84E]">
                      INVOICE #{selectedInvoiceOrder._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-[11px] text-[#797979] dark:text-[#A0AEC0] mt-0.5">
                      Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {isReturnApproved && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs space-y-0.5">
                    <span className="font-extrabold block text-sm">✅ Return Completed</span>
                    <p className="font-medium">Amount will credit in your bank in 3-4 working days.</p>
                  </div>
                )}

                {isReturnRejected && (
                  <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 rounded-2xl text-red-800 dark:text-red-200 text-xs space-y-0.5">
                    <span className="font-extrabold block text-sm">❌ Return Rejected</span>
                    {selectedInvoiceOrder.returnRequest?.adminNotes && (
                      <p className="font-medium">Admin Note: {selectedInvoiceOrder.returnRequest.adminNotes}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs bg-white dark:bg-[#181926] p-4 rounded-2xl border border-[#EDEDED] dark:border-[#262838]">
                  <div>
                    <span className="text-[#797979] dark:text-[#A0AEC0] font-extrabold uppercase text-[10px] tracking-wider block mb-1">Billed To Customer:</span>
                    <span className="font-black text-sm block">{selectedInvoiceOrder.shippingAddress?.name || selectedInvoiceOrder.customerDetails?.name || 'Customer'}</span>
                    <p className="text-[11px] text-[#797979] dark:text-[#A0AEC0] mt-0.5 font-medium">
                      {[
                        selectedInvoiceOrder.shippingAddress?.line1 || selectedInvoiceOrder.shippingAddress?.address,
                        selectedInvoiceOrder.shippingAddress?.city,
                        selectedInvoiceOrder.shippingAddress?.state,
                        selectedInvoiceOrder.shippingAddress?.pincode || selectedInvoiceOrder.shippingAddress?.zip
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#797979] dark:text-[#A0AEC0] font-extrabold uppercase text-[10px] tracking-wider block mb-1">Payment Reference:</span>
                    <span className="font-black text-sm uppercase block text-[#704F38] dark:text-[#E8B84E]">{selectedInvoiceOrder.paymentGateway || 'Razorpay Direct'}</span>
                    <p className="text-[11px] text-[#797979] dark:text-[#A0AEC0] mt-0.5 font-medium">
                      Status: {(selectedInvoiceOrder.paymentStatus || 'pending').toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-[#EDEDED] dark:border-[#262838] rounded-2xl overflow-hidden bg-white dark:bg-[#181926]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] font-black uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Item Description</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
                      {selectedInvoiceOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-extrabold">{item.title} ({item.size} / {item.color})</td>
                          <td className="p-3 text-center font-bold">{item.qty}</td>
                          <td className="p-3 text-right font-bold">₹{item.priceAtAdd || item.price}</td>
                          <td className="p-3 text-right font-black text-[#704F38] dark:text-[#E8B84E]">₹{(item.qty * (item.priceAtAdd || item.price))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tax Breakdown & Totals */}
                <div className="flex justify-end pt-2">
                  <div className="w-56 space-y-1.5 text-xs bg-white dark:bg-[#181926] p-4 rounded-2xl border border-[#EDEDED] dark:border-[#262838]">
                    <div className="flex justify-between text-[#797979] dark:text-[#A0AEC0]">
                      <span>Taxable Amount:</span>
                      <span>₹{subTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#797979] dark:text-[#A0AEC0]">
                      <span>CGST (9%):</span>
                      <span>₹{cgst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#797979] dark:text-[#A0AEC0]">
                      <span>SGST (9%):</span>
                      <span>₹{sgst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-[#704F38] dark:text-[#E8B84E] border-t border-[#EDEDED] dark:border-[#262838] pt-2">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
