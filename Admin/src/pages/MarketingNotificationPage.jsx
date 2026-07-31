import React, { useState } from 'react';
import { 
  useGetAdminCouponsQuery, 
  useCreateCouponMutation, 
  useDeleteCouponMutation 
} from '../services/adminCouponApi';
import { Ticket, Plus, Trash2, Bell, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const MarketingNotificationPage = () => {
  const [activeTab, setActiveTab] = useState('coupons'); // 'coupons' | 'templates' | 'dlq'

  // Coupon state
  const [createModal, setCreateModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState(10);
  const [discountType, setDiscountType] = useState('percentage');
  const [minOrderAmount, setMinOrderAmount] = useState(0);

  const { data: couponData, isLoading, refetch } = useGetAdminCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleCreateCouponSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      await createCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        discountPercent: discountType === 'percentage' ? Number(discountValue) : undefined,
        minOrderAmount: Number(minOrderAmount),
        isActive: true
      }).unwrap();
      setCreateModal(false);
      setCode('');
      setDiscountValue(10);
      setMinOrderAmount(0);
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCouponClick = async (id) => {
    if (confirm('Delete this coupon code?')) {
      try {
        await deleteCoupon(id).unwrap();
        refetch();
      } catch (err) {
        alert('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2 border-b md:border-b-0 border-[#EDEDED] w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'coupons' ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] hover:text-[#1F2029]'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Promo Coupons Management
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'templates' ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] hover:text-[#1F2029]'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notification Rules & Templates
          </button>
        </div>

        {activeTab === 'coupons' && (
          <button
            onClick={() => setCreateModal(true)}
            className="px-4 py-2.5 bg-[#704F38] hover:bg-[#8C6244] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Coupon Code
          </button>
        )}
      </div>

      {/* TAB 1: PROMO COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead>
                <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="px-5 py-4">Coupon Code</th>
                  <th className="px-5 py-4">Discount Rate</th>
                  <th className="px-5 py-4">Min. Spend Requirement</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED]">
                {isLoading ? (
                  <tr><td colSpan="5"><Loader message="Loading Promo Coupons..." /></td></tr>
                ) : couponData?.coupons?.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-[#797979]">No promo coupons created.</td></tr>
                ) : (
                  couponData?.coupons?.map((c) => (
                    <tr key={c._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                      <td className="px-5 py-4 font-black text-[#704F38] tracking-wider uppercase">{c.code}</td>
                      <td className="px-5 py-4 font-extrabold text-[#1F2029]">
                        {c.discountType === 'percentage' ? `${c.discountValue || c.discountPercent}% OFF` : `₹${c.discountValue} OFF`}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-[#797979]">
                        ₹{(c.minOrderAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                          ACTIVE
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteCouponClick(c._id)}
                          className="p-2 bg-[#FEF2F2] hover:bg-red-100 text-[#E57373] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATION TEMPLATES & RULES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm space-y-3">
            <h3 className="text-sm font-black text-[#1F2029]">Order Event Triggers</h3>
            <p className="text-xs text-[#797979]">Rule-based mappings for automatic transactional notifications.</p>
            <div className="space-y-2">
              <div className="p-3 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl text-xs font-bold text-[#1F2029] flex justify-between">
                <span>ORDER_PLACED → Email & Push</span>
                <span className="text-[#047857]">ACTIVE</span>
              </div>
              <div className="p-3 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl text-xs font-bold text-[#1F2029] flex justify-between">
                <span>ORDER_SHIPPED → Courier Dispatch SMS</span>
                <span className="text-[#047857]">ACTIVE</span>
              </div>
              <div className="p-3 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl text-xs font-bold text-[#1F2029] flex justify-between">
                <span>TICKET_RESOLVED → Support Resolution Email</span>
                <span className="text-[#047857]">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-4">
              <h3 className="text-base font-black text-[#1F2029]">Create Promo Coupon Code</h3>
              <button onClick={() => setCreateModal(false)} className="text-[#797979] hover:text-[#1F2029]">✕</button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-black uppercase text-[#704F38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl text-xs font-bold"
                >
                  <option value="percentage">Percentage Off (%)</option>
                  <option value="fixed">Fixed Amount Off (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Min Order Amount (Auto-Revalidated in Cart)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl text-sm font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setCreateModal(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-5 py-2.5 rounded-xl bg-[#704F38] text-white text-xs font-extrabold shadow-md">
                  {isCreating ? 'Creating...' : 'Save Coupon Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
