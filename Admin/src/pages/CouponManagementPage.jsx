import React, { useState } from 'react';
import { useGetAdminCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../services/adminCouponApi';
import { Ticket, Plus, Trash2, Edit3, X } from 'lucide-react';

export const CouponManagementPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');

  const { data, isLoading, refetch } = useGetAdminCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCode(coupon.code);
      setDiscountType(coupon.discountType || 'percentage');
      setDiscountValue(coupon.discountValue?.toString() || coupon.discountPercent?.toString() || '');
      setMinOrderAmount(coupon.minOrderAmount?.toString() || '');
      setMaxDiscount(coupon.maxDiscount?.toString() || '');
    } else {
      setEditingCoupon(null);
      setCode('');
      setDiscountType('percentage');
      setDiscountValue('');
      setMinOrderAmount('');
      setMaxDiscount('');
    }
    setModalVisible(true);
  };

  const handleSaveCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!code || !discountValue) return alert('Please enter coupon code and discount value');

    const payload = {
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: parseFloat(discountValue),
      discountPercent: discountType === 'percentage' ? parseFloat(discountValue) : undefined,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
    };

    try {
      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon._id, ...payload }).unwrap();
      } else {
        await createCoupon(payload).unwrap();
      }
      setModalVisible(false);
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (window.confirm(`Delete coupon "${couponCode}"?`)) {
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
      {/* Top Header Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#EDEDED] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center border border-[#FDE68A]">
            <Ticket className="w-5 h-5 text-[#B45309]" />
          </div>
          <h2 className="text-base font-black text-[#1F2029]">Active & Scheduled Promo Coupons</h2>
        </div>
        <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md shadow-[#704F38]/20 transition-all">
          <Plus className="w-4 h-4" /> Create Promo Coupon
        </button>
      </div>

      {/* Table-First Coupons List */}
      <div className="bg-white rounded-2xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
              <th className="px-5 py-4">Promo Code</th>
              <th className="px-5 py-4">Discount Type</th>
              <th className="px-5 py-4">Discount Value</th>
              <th className="px-5 py-4">Min Order (₹)</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDED]">
            {isLoading ? (
              <tr><td colSpan="6" className="p-8 text-center text-[#797979]">Loading Coupons...</td></tr>
            ) : data?.coupons?.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-[#797979]">No promo coupons created yet.</td></tr>
            ) : (
              data?.coupons?.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                  <td className="px-5 py-4 font-black text-[#704F38] tracking-widest">{coupon.code}</td>
                  <td className="px-5 py-4 text-[#797979] font-medium capitalize">{coupon.discountType || 'percentage'}</td>
                  <td className="px-5 py-4 font-extrabold text-[#1F2029]">
                    {coupon.discountType === 'fixed' ? `₹${coupon.discountValue}` : `${coupon.discountValue || coupon.discountPercent}% OFF`}
                  </td>
                  <td className="px-5 py-4 text-[#797979] font-medium">₹{coupon.minOrderAmount || 0}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                      coupon.isActive
                        ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                        : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                    }`}>
                      {coupon.isActive ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-1.5">
                    <button onClick={() => handleOpenModal(coupon)} title="Edit Coupon" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-[#3B82F6] transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(coupon._id, coupon.code)} title="Delete Coupon" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-[#E57373] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1F2029]">{editingCoupon ? 'Edit Promo Coupon' : 'Create New Promo Coupon'}</h3>
              <button onClick={() => setModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Coupon Code *</label>
                <input type="text" required placeholder="e.g. SUMMER20, FLAT50" value={code} onChange={(e) => setCode(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38] uppercase tracking-wider" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Discount Type *</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDiscountType('percentage')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${discountType === 'percentage' ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'}`}>Percentage (%)</button>
                  <button type="button" onClick={() => setDiscountType('fixed')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${discountType === 'fixed' ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'}`}>Fixed Amount (₹)</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Discount Value *</label>
                  <input type="number" step="0.01" required placeholder="200" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Min Order (₹)</label>
                  <input type="number" step="0.01" placeholder="500" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
                <button type="submit" disabled={isCreating || isUpdating} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                  {isCreating || isUpdating ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
