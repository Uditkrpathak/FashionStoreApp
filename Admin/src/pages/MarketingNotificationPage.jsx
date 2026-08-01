import React, { useState, useEffect } from 'react';
import { 
  useGetAdminCouponsQuery, 
  useCreateCouponMutation, 
  useDeleteCouponMutation 
} from '../services/adminCouponApi';
import { Ticket, Plus, Trash2, Bell, AlertTriangle, Send, CheckCircle2, X } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const MarketingNotificationPage = () => {
  const [activeTab, setActiveTab] = useState('coupons'); // 'coupons' | 'templates' | 'dlq'

  // Coupon state
  const [createModal, setCreateModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState(10);
  const [discountType, setDiscountType] = useState('percentage');
  const [minOrderAmount, setMinOrderAmount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCreateModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data: couponData, isLoading, refetch } = useGetAdminCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleCreateCouponSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (discountType === 'percentage' && Number(discountValue) > 100) {
      return alert('Percentage discount cannot exceed 100%.');
    }
    if (Number(discountValue) <= 0) {
      return alert('Discount value must be greater than 0.');
    }
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
      alert(err.data?.message || 'Failed to create promo coupon');
    }
  };

  const handleDeleteCouponItem = async (id) => {
    if (confirm('Delete promo coupon?')) {
      try {
        await deleteCoupon(id).unwrap();
        refetch();
      } catch (err) {
        alert('Failed to delete coupon');
      }
    }
  };

  const coupons = couponData?.coupons || [];

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="bg-white dark:bg-[#181926] p-3 rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex justify-between items-center transition-colors">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'coupons'
                ? 'bg-[#704F38] text-white shadow-md'
                : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#2A2C3F]'
            }`}
          >
            Promo Vouchers ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'templates'
                ? 'bg-[#704F38] text-white shadow-md'
                : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#2A2C3F]'
            }`}
          >
            Push Notification Triggers
          </button>
        </div>

        {activeTab === 'coupons' && (
          <button
            onClick={() => setCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-black shadow-md shadow-[#704F38]/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        )}
      </div>

      {activeTab === 'coupons' && (
        <div className="bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="px-5 py-4">Coupon Code</th>
                  <th className="px-5 py-4">Discount</th>
                  <th className="px-5 py-4">Min. Order Value</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
                {isLoading ? (
                  <tr><td colSpan="5"><Loader message="Loading Promo Vouchers..." /></td></tr>
                ) : coupons.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-[#797979] dark:text-[#A0AEC0] font-bold">No promo coupons available.</td></tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                      <td className="px-5 py-4 font-mono font-black text-xs text-[#704F38] dark:text-[#E8B84E] select-all">
                        {c.code}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-[#1F2029] dark:text-white">
                        {c.discountType === 'percentage' ? `${c.discountValue || c.discountPercent}% OFF` : `₹${c.discountValue} OFF`}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-[#797979] dark:text-[#A0AEC0]">
                        ₹{c.minOrderAmount || 0}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#064E3B]/50">
                          ACTIVE
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteCouponItem(c._id)}
                          className="p-2 bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border border-[#FECACA] dark:border-[#7F1D1D]/50 hover:bg-[#EF4444] text-[#B91C1C] dark:text-[#F87171] hover:text-white rounded-xl shadow-sm transition-all"
                          title="Delete Coupon"
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

      {activeTab === 'templates' && (
        <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm space-y-4 text-xs text-[#797979] dark:text-[#A0AEC0] font-medium transition-colors">
          <div className="flex items-center gap-2 font-black text-[#1F2029] dark:text-white text-sm">
            <Bell className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Push Notification Triggers & Automated Reminders
          </div>
          <p>Order status updates and fulfillment tracking notifications are automatically dispatched to mobile devices upon lifecycle state changes.</p>
        </div>
      )}

      {/* Create Coupon Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED] dark:border-[#262838] transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] dark:border-[#262838] pb-4">
              <h3 className="text-base font-black text-[#1F2029] dark:text-white">Create Promo Coupon</h3>
              <button onClick={() => setCreateModal(false)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-sm font-mono font-bold text-[#1F2029] dark:text-white uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-xs font-bold text-[#1F2029] dark:text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-sm font-bold text-[#1F2029] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-sm font-bold text-[#1F2029] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setCreateModal(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] text-xs font-extrabold text-[#797979] dark:text-[#A0AEC0]">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                  {isCreating ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
