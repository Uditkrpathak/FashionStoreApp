import React, { useState } from 'react';
import { useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { Loader } from '../shared/components/Loader';
import { FileText, Download, DollarSign, CreditCard, ShieldCheck, Printer, AlertTriangle } from 'lucide-react';

export const FinanceManagementPage = () => {
  const { data, isLoading } = useGetAdminOrdersQuery({ limit: 100 });
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  const handlePrintInvoice = () => {
    window.print();
  };

  const totalRevenue = data?.orders
    ?.filter((o) => {
      const isCOD = String(o.paymentMethod?.type || o.paymentMethod || '').toLowerCase().includes('cod');
      return o.paymentStatus === 'completed' || o.paymentStatus === 'paid' || (isCOD && o.orderStatus === 'delivered');
    })
    .reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F2029]">Financial Ledger & Tax Invoices</h2>
          <p className="text-xs text-[#797979] font-medium mt-1">PCI-compliant transaction audit trails, credit notes, and automated delivery invoices.</p>
        </div>

        <div className="bg-[#FDFBF9] px-4 py-3 rounded-xl border border-[#EDEDED] flex items-center gap-3">
          <div className="p-2 bg-[#704F38]/10 text-[#704F38] rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black text-[#797979] uppercase tracking-wider">Total Settled Revenue</div>
            <div className="text-base font-black text-[#704F38]">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Payment Ledger Table */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EDEDED] flex justify-between items-center bg-[#FDFBF9]">
          <div>
            <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#704F38]" /> Payment Transactions & Ledger Log
            </h3>
            <p className="text-xs text-[#797979]">Verified payment reference logs, COD invoices, and credit note records.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[850px]">
            <thead>
              <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Transaction / Order</th>
                <th className="px-5 py-4">Gateway</th>
                <th className="px-5 py-4">Payment Method</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Invoice & PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]">
              {isLoading ? (
                <tr><td colSpan="6"><Loader message="Loading Payment Ledger..." /></td></tr>
              ) : data?.orders?.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-[#797979]">No payment records found.</td></tr>
              ) : (
                data?.orders?.map((order) => {
                  const rawMethod = typeof order.paymentMethod === 'string'
                    ? order.paymentMethod.toLowerCase()
                    : (order.paymentMethod?.type || order.paymentMethod?.id || order.paymentMethod?.name || '').toLowerCase();
                  
                  const isCOD = rawMethod.includes('cod');
                  const isPaid = order.paymentStatus === 'completed' || order.paymentStatus === 'paid';

                  const gatewayLabel = isCOD ? 'COD (DIRECT)' : (order.paymentGateway ? order.paymentGateway.toUpperCase() : 'RAZORPAY');
                  
                  const methodLabel = isCOD
                    ? 'Cash on Delivery (COD)'
                    : (rawMethod === 'card' ? 'Credit / Debit Card' : (rawMethod === 'upi' ? 'UPI Instant' : 'Online Payment'));

                  const statusBadge = isCOD
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                    : (isPaid
                      ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                      : (order.paymentStatus === 'refunded' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'));

                  const statusText = isCOD ? 'PAY ON DELIVERY' : (order.paymentStatus || 'PENDING').toUpperCase();

                  const invoiceBtnLabel = isCOD
                    ? 'Delivery Invoice'
                    : (isPaid ? 'Tax Invoice' : 'Pro-Forma Draft');

                  return (
                    <tr key={order._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-[#704F38] select-all">#ORD-{order._id.slice(-6).toUpperCase()}</div>
                        {order.razorpayPaymentId && (
                          <div className="text-[10px] text-[#797979] font-mono select-all">PayID: {order.razorpayPaymentId}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-[#704F38] uppercase">
                        {gatewayLabel}
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-[#797979]">
                        {methodLabel}
                      </td>
                      <td className="px-5 py-4 font-black text-[#704F38]">
                        ₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-1.5 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-xs font-bold text-[#1F2029] inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#704F38]" /> {invoiceBtnLabel}
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

      {/* Invoice Modal Preview & Printable View */}
      {selectedInvoiceOrder && (() => {
        const rawMethod = typeof selectedInvoiceOrder.paymentMethod === 'string'
          ? selectedInvoiceOrder.paymentMethod.toLowerCase()
          : (selectedInvoiceOrder.paymentMethod?.type || selectedInvoiceOrder.paymentMethod?.id || '').toLowerCase();
        
        const isCOD = rawMethod.includes('cod');
        const isPaid = selectedInvoiceOrder.paymentStatus === 'completed' || selectedInvoiceOrder.paymentStatus === 'paid';

        const invoiceHeading = isCOD
          ? 'Delivery Invoice & Cash Receipt'
          : (isPaid ? 'Official Tax Invoice' : 'Pro-Forma Invoice');

        const invoiceSubheading = isCOD
          ? 'Payment Method: Cash on Delivery (Pay upon Package Delivery)'
          : (isPaid ? 'Payment Status: COMPLETED / PAID' : 'PRO-FORMA DRAFT - AWAITING ONLINE PAYMENT');

        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EDEDED] space-y-6">
              <div className="flex justify-between items-center border-b border-[#EDEDED] pb-4">
                <h3 className="text-base font-black text-[#1F2029]">{invoiceHeading}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrintInvoice}
                    className="px-3.5 py-2 bg-[#704F38] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md"
                  >
                    <Printer className="w-4 h-4" /> Print / Save PDF
                  </button>
                  <button onClick={() => setSelectedInvoiceOrder(null)} className="p-2 text-[#797979] hover:text-[#1F2029]">
                    ✕
                  </button>
                </div>
              </div>

              {/* Printable Invoice Container */}
              <div id="printable-invoice" className="p-6 bg-[#FDFBF9] border border-[#EDEDED] rounded-2xl space-y-6">
                <div className="flex justify-between items-start border-b border-[#EDEDED] pb-4">
                  <div>
                    <h1 className="text-xl font-black text-[#1F2029]">FashionStore Enterprise</h1>
                    <p className="text-xs text-[#797979] font-medium mt-0.5">{invoiceSubheading}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-black text-[#704F38]">INVOICE #INV-2026-{selectedInvoiceOrder._id.slice(-6).toUpperCase()}</div>
                    <div className="text-xs text-[#797979]">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</div>
                    {selectedInvoiceOrder.creditNoteId && (
                      <div className="text-xs font-black text-orange-600 mt-1">CREDIT NOTE: {selectedInvoiceOrder.creditNoteId}</div>
                    )}
                  </div>
                </div>

                {/* Customer & Shipping Info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-extrabold text-[#1F2029] uppercase mb-1">Customer Details:</div>
                    <div className="font-bold text-[#1F2029]">
                      {selectedInvoiceOrder.customerDetails?.name || selectedInvoiceOrder.shippingAddress?.name || selectedInvoiceOrder.shippingAddress?.fullName || 'Customer'}
                    </div>
                    {selectedInvoiceOrder.userId && (
                      <div className="text-[10px] font-mono text-[#704F38] mt-0.5">
                        Customer ID: #USR-{selectedInvoiceOrder.userId.slice(-6).toUpperCase()}
                      </div>
                    )}
                    <div className="text-[#797979] mt-1">
                      Phone: {selectedInvoiceOrder.customerDetails?.phone || selectedInvoiceOrder.shippingAddress?.phone || 'N/A'}
                    </div>
                    {(selectedInvoiceOrder.customerDetails?.email || selectedInvoiceOrder.shippingAddress?.email) && (
                      <div className="text-[#797979]">
                        Email: {selectedInvoiceOrder.customerDetails?.email || selectedInvoiceOrder.shippingAddress?.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-[#1F2029] uppercase mb-1">Delivery Address:</div>
                    <div className="text-[#797979]">
                      {[
                        selectedInvoiceOrder.shippingAddress?.line1 || selectedInvoiceOrder.shippingAddress?.address,
                        selectedInvoiceOrder.shippingAddress?.line2,
                        selectedInvoiceOrder.shippingAddress?.city,
                        selectedInvoiceOrder.shippingAddress?.state,
                        selectedInvoiceOrder.shippingAddress?.pincode || selectedInvoiceOrder.shippingAddress?.zip
                      ].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EDEDED] text-[#797979] font-extrabold uppercase">
                      <th className="py-2">Item Description</th>
                      <th className="py-2">Variant</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEDED]">
                    {selectedInvoiceOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-bold text-[#1F2029]">
                          <div>{item.title}</div>
                          {(item.productId || item._id) && (
                            <div className="text-[10px] font-mono text-[#797979]">
                              Product ID: #PRD-{(item.productId || item._id).toString().slice(-6).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 text-[#797979]">Size: {item.size} | Color: {item.color}</td>
                        <td className="py-2.5 text-center font-bold">{item.qty}</td>
                        <td className="py-2.5 text-right">₹{item.priceAtAdd || item.price}</td>
                        <td className="py-2.5 text-right font-black text-[#704F38]">₹{(item.priceAtAdd || item.price) * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Invoice Totals */}
                <div className="border-t border-[#EDEDED] pt-4 flex justify-end">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#797979]">
                      <span>Subtotal:</span>
                      <span className="font-bold text-[#1F2029]">₹{selectedInvoiceOrder.totals?.subtotal?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#797979]">
                      <span>Shipping Fee:</span>
                      <span className="font-bold text-[#1F2029]">₹{selectedInvoiceOrder.totals?.shipping || 0}</span>
                    </div>
                    {selectedInvoiceOrder.totals?.discount > 0 && (
                      <div className="flex justify-between text-[#047857]">
                        <span>Promo Discount:</span>
                        <span className="font-bold">-₹{selectedInvoiceOrder.totals.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-[#EDEDED] pt-2 text-sm font-black text-[#704F38]">
                      <span>Grand Total:</span>
                      <span>₹{selectedInvoiceOrder.totals?.grandTotal?.toLocaleString('en-IN')}</span>
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
