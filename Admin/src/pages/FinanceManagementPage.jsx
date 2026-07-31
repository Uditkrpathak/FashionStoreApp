import React, { useState } from 'react';
import { useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { CreditCard, Printer, FileText, CheckCircle2, Search, Download, RefreshCw } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const FinanceManagementPage = () => {
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useGetAdminOrdersQuery({
    limit: 50,
  });

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm items-center">
        <div className="w-full sm:w-80 flex items-center bg-[#FDFBF9] border border-[#EDEDED] rounded-xl px-3.5">
          <Search className="w-4 h-4 text-[#797979] mr-2" />
          <input
            type="text"
            placeholder="Search Transactions by Order ID or Payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029]"
          />
        </div>

        <button onClick={() => refetch()} className="p-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl flex items-center gap-2 text-xs font-bold text-[#1F2029]">
          <RefreshCw className="w-4 h-4" /> Refresh Payments
        </button>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#EDEDED] bg-[#FDFBF9]">
          <h3 className="text-sm font-black text-[#1F2029]">PCI-Compliant Payment Transactions & Ledger Log</h3>
          <p className="text-xs text-[#797979]">Tokenized payment reference logs and credit note records.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[850px]">
            <thead>
              <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Transaction ID / Order</th>
                <th className="px-5 py-4">Gateway</th>
                <th className="px-5 py-4">Payment Method</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Invoice & Credit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]">
              {isLoading ? (
                <tr><td colSpan="6"><Loader message="Loading Payment Ledger..." /></td></tr>
              ) : data?.orders?.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-[#797979]">No payment records found.</td></tr>
              ) : (
                data?.orders?.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-black text-[#1F2029]">#{order._id.slice(-8).toUpperCase()}</div>
                      {order.razorpayPaymentId && (
                        <div className="text-[10px] text-[#797979] font-mono select-all">PayID: {order.razorpayPaymentId}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#704F38] uppercase">
                      {order.paymentGateway || 'Razorpay'}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#797979]">
                      {order.paymentMethod?.brand || order.paymentMethod?.type || 'COD / Online'}
                    </td>
                    <td className="px-5 py-4 font-black text-[#704F38]">
                      ₹{order.totals?.grandTotal?.toLocaleString('en-IN') || '0'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                        order.paymentStatus === 'completed' ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]' :
                        order.paymentStatus === 'refunded' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      }`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-3 py-1.5 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-xs font-bold text-[#1F2029] inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#704F38]" /> Invoice / PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Preview & Printable View */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EDEDED] space-y-6">
            <div className="flex justify-between items-center border-b border-[#EDEDED] pb-4">
              <h3 className="text-base font-black text-[#1F2029]">Official Tax Invoice</h3>
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
                  <p className="text-xs text-[#797979]">Tax Invoice & Official Receipt</p>
                  <p className="text-xs text-[#797979] font-mono mt-1">GSTIN: 27AAAAA0000A1Z5</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-[#704F38]">INVOICE #{selectedInvoiceOrder._id.slice(-8).toUpperCase()}</div>
                  <div className="text-xs text-[#797979]">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</div>
                  {selectedInvoiceOrder.creditNoteId && (
                    <div className="text-xs font-black text-orange-600 mt-1">CREDIT NOTE: {selectedInvoiceOrder.creditNoteId}</div>
                  )}
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-extrabold text-[#1F2029] uppercase mb-1">Billed To:</div>
                  <div className="font-bold text-[#1F2029]">{selectedInvoiceOrder.shippingAddress?.name || 'Customer'}</div>
                  <div className="text-[#797979]">Phone: {selectedInvoiceOrder.shippingAddress?.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#1F2029] uppercase mb-1">Shipping Address:</div>
                  <div className="text-[#797979]">
                    {[
                      selectedInvoiceOrder.shippingAddress?.line1,
                      selectedInvoiceOrder.shippingAddress?.city,
                      selectedInvoiceOrder.shippingAddress?.state,
                      selectedInvoiceOrder.shippingAddress?.pincode
                    ].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white border-y border-[#EDEDED] text-[#797979] font-bold">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEDED]">
                  {selectedInvoiceOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-[#1F2029]">{item.title} ({item.color}, {item.size})</td>
                      <td className="py-2.5 px-3 text-[#797979]">{item.qty}</td>
                      <td className="py-2.5 px-3 text-[#797979]">₹{item.priceAtAdd || item.price}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#1F2029]">₹{(item.qty * (item.priceAtAdd || item.price)).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end border-t border-[#EDEDED] pt-4 text-xs space-y-1">
                <div className="w-48 space-y-1">
                  <div className="flex justify-between text-[#797979]">
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoiceOrder.totals?.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#797979]">
                    <span>Shipping Fee:</span>
                    <span>₹{selectedInvoiceOrder.totals?.shipping?.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedInvoiceOrder.totals?.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount:</span>
                      <span>-₹{selectedInvoiceOrder.totals?.discount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-[#704F38] border-t border-[#EDEDED] pt-2">
                    <span>Grand Total:</span>
                    <span>₹{selectedInvoiceOrder.totals?.grandTotal?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
