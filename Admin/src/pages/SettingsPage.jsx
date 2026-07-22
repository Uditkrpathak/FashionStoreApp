import React, { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingMutation } from '../services/adminAuthApi';
import { Settings, Save, RefreshCw, ToggleLeft, ToggleRight, Building, Mail, Phone, ShoppingCart } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const SettingsPage = () => {
  const { data, isLoading, refetch } = useGetSettingsQuery();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  // Settings State variables
  const [storeName, setStoreName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [codEnabled, setCodEnabled] = useState(true);
  const [freeShippingLimit, setFreeShippingLimit] = useState(0);

  // Sync settings when loaded
  useEffect(() => {
    if (data?.settings) {
      const nameSet = data.settings.find(s => s.key === 'store_name');
      const emailSet = data.settings.find(s => s.key === 'support_email');
      const phoneSet = data.settings.find(s => s.key === 'support_phone');
      const codSet = data.settings.find(s => s.key === 'cod_enabled');
      const shippingSet = data.settings.find(s => s.key === 'free_shipping_limit');

      if (nameSet) setStoreName(nameSet.value);
      if (emailSet) setSupportEmail(emailSet.value);
      if (phoneSet) setSupportPhone(phoneSet.value);
      if (codSet) setCodEnabled(codSet.value === 'true' || codSet.value === true);
      if (shippingSet) setFreeShippingLimit(Number(shippingSet.value) || 0);
    }
  }, [data]);

  const handleSaveSetting = async (key, value) => {
    try {
      await updateSetting({ key, value }).unwrap();
      refetch();
      alert(`Setting '${key}' saved successfully!`);
    } catch (err) {
      alert(err.data?.message || `Failed to save setting '${key}'`);
    }
  };

  if (isLoading) {
    return <Loader message="Loading store configurations..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top action header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center border border-[#BFDBFE]">
            <Settings className="w-5 h-5 text-[#1D4ED8]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#1F2029]">Store Settings</h2>
            <p className="text-xs text-[#797979] font-medium">Manage corporate identities and payment thresholds</p>
          </div>
        </div>
        <button onClick={() => refetch()} className="p-2.5 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4 text-[#1F2029]" />
        </button>
      </div>

      {/* Grid containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info Card */}
        <div className="bg-white rounded-xl p-6 border border-[#EDEDED] shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#1F2029] uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-[#704F38]" /> General Store Parameters
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Store Brand Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FashionStore Premium"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-xs font-semibold outline-none focus:border-[#704F38] text-[#1F2029]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveSetting('store_name', storeName)}
                  disabled={isUpdating}
                  className="px-4 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl shadow-md flex items-center justify-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Coordinates Card */}
        <div className="bg-white rounded-xl p-6 border border-[#EDEDED] shadow-sm space-y-4">
          <h3 className="text-xs font-black text-[#1F2029] uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#704F38]" /> Helpdesk Coordinates
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Customer Care Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="support@fashionstore.com"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-xs font-semibold outline-none focus:border-[#704F38] text-[#1F2029]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveSetting('support_email', supportEmail)}
                  disabled={isUpdating}
                  className="px-4 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl shadow-md flex items-center justify-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Support Helpline Phone</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+91 1800 123 456"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-xs font-semibold outline-none focus:border-[#704F38] text-[#1F2029]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveSetting('support_phone', supportPhone)}
                  disabled={isUpdating}
                  className="px-4 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl shadow-md flex items-center justify-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Rules Card */}
        <div className="bg-white rounded-xl p-6 border border-[#EDEDED] shadow-sm space-y-4">
          <h3 className="text-xs font-black text-[#1F2029] uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#704F38]" /> Checkout & Payments Rules
          </h3>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-3.5 bg-[#FDFBF9] rounded-xl border border-[#EDEDED]">
              <div>
                <div className="text-xs font-bold text-[#1F2029]">Allow Cash on Delivery (COD)</div>
                <div className="text-[10px] text-[#797979] font-semibold mt-0.5">Toggle customer checkout cash mode</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !codEnabled;
                  setCodEnabled(nextVal);
                  handleSaveSetting('cod_enabled', nextVal);
                }}
                className="text-[#704F38]"
              >
                {codEnabled ? (
                  <ToggleRight className="w-10 h-10 text-[#704F38]" fill="currentColor" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-[#797979]" />
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Free Shipping Minimum Threshold (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="999"
                  value={freeShippingLimit}
                  onChange={(e) => setFreeShippingLimit(Number(e.target.value) || 0)}
                  className="flex-1 p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-xs font-semibold outline-none focus:border-[#704F38] text-[#1F2029]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveSetting('free_shipping_limit', freeShippingLimit)}
                  disabled={isUpdating}
                  className="px-4 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl shadow-md flex items-center justify-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
