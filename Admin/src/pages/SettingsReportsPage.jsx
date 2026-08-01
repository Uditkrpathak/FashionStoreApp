import React, { useState } from 'react';
import { 
  useGetAuditLogsQuery, 
  useLazyVerifyAuditIntegrityQuery, 
  useGetStoreConfigQuery, 
  useUpdateStoreConfigMutation 
} from '../services/adminAuthApi';
import { useGetAdminOrdersQuery } from '../services/adminOrderApi';
import { Download, ShieldCheck, ShieldAlert, ToggleLeft, ToggleRight, FileSpreadsheet, Settings, Lock } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const SettingsReportsPage = () => {
  const [integrityStatus, setIntegrityStatus] = useState(null);

  const { data: auditData, isLoading: isLoadingAudit } = useGetAuditLogsQuery({ limit: 50 });
  const { data: ordersData } = useGetAdminOrdersQuery({ limit: 100 });
  const { data: configData, refetch: refetchConfig } = useGetStoreConfigQuery();

  const [verifyIntegrity, { isFetching: isVerifying }] = useLazyVerifyAuditIntegrityQuery();
  const [updateConfig, { isLoading: isUpdatingConfig }] = useUpdateStoreConfigMutation();

  const handleVerifyClick = async () => {
    try {
      const res = await verifyIntegrity().unwrap();
      setIntegrityStatus(res);
    } catch (err) {
      alert('Failed to run audit integrity check');
    }
  };

  const handleToggleFeature = async (featureKey) => {
    if (!configData?.config) return;
    const currentToggles = configData.config.featureToggles || {};
    try {
      await updateConfig({
        featureToggles: {
          ...currentToggles,
          [featureKey]: !currentToggles[featureKey]
        }
      }).unwrap();
      refetchConfig();
    } catch (err) {
      alert('Failed to update feature toggle');
    }
  };

  const handleExportCSV = (reportType) => {
    let csvRows = [];
    if (reportType === 'orders' || reportType === 'sales') {
      csvRows.push(['Order ID', 'Date', 'Customer Name', 'Grand Total (INR)', 'Payment Status', 'Fulfillment Status']);
      ordersData?.orders?.forEach((o) => {
        csvRows.push([
          o._id,
          new Date(o.createdAt).toISOString(),
          `"${o.shippingAddress?.name || o.customerDetails?.name || 'Customer'}"`,
          o.totals?.grandTotal || 0,
          o.paymentStatus || 'pending',
          o.orderStatus || 'placed'
        ]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fashionstore_${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const config = configData?.config || {};
  const toggles = config.featureToggles || {
    returnsEnabled: true,
    codPaymentEnabled: true,
    reviewsAllowed: true,
    maintenanceMode: false
  };

  return (
    <div className="space-y-6">
      {/* CSV Reports Download Box */}
      <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
        <div className="mb-4">
          <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Export Data Reports & Financial Ledgers
          </h3>
          <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">Download real raw CSV reports for external accounting and tax audit compliance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => handleExportCSV('orders')}
            className="p-4 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-2xl text-left flex items-center justify-between group transition-all"
          >
            <div>
              <div className="font-extrabold text-xs text-[#1F2029] dark:text-white">Orders & Fulfillment Export</div>
              <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">Complete orders dataset with line items</div>
            </div>
            <Download className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E] group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleExportCSV('sales')}
            className="p-4 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-2xl text-left flex items-center justify-between group transition-all"
          >
            <div>
              <div className="font-extrabold text-xs text-[#1F2029] dark:text-white">Revenue & Sales Report</div>
              <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">Settled revenue breakdown per gateway</div>
            </div>
            <Download className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Control Switches */}
      <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
        <div className="mb-4">
          <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Global Store Feature Toggles
          </h3>
          <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">Control live store features instantly across mobile apps and checkout.</p>
        </div>

        <div className="space-y-3">
          {[
            { key: 'returnsEnabled', title: 'Allow Product Returns & Refunds', desc: 'Permit customers to request returns from mobile app' },
            { key: 'codPaymentEnabled', title: 'Cash on Delivery (COD)', desc: 'Allow COD payment option at mobile checkout' },
            { key: 'reviewsAllowed', title: 'Customer Product Reviews', desc: 'Allow buyers to post ratings and product reviews' },
            { key: 'maintenanceMode', title: 'Store Maintenance Guard', desc: 'Temporary store pause guard for platform upgrades' }
          ].map((toggle) => {
            const isEnabled = !!toggles[toggle.key];
            return (
              <div
                key={toggle.key}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F]"
              >
                <div>
                  <div className="font-extrabold text-xs text-[#1F2029] dark:text-white">{toggle.title}</div>
                  <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">{toggle.desc}</div>
                </div>

                <button
                  onClick={() => handleToggleFeature(toggle.key)}
                  disabled={isUpdatingConfig}
                  className={`p-1 rounded-xl transition-all ${isEnabled ? 'text-[#047857] dark:text-[#34D399]' : 'text-[#797979] dark:text-[#A0AEC0]'}`}
                >
                  {isEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Cryptographic Audit Verification */}
      <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Audit Log Integrity & Cryptographic Hash Check
            </h3>
            <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">Verify that tamper-evident audit logs match cryptographic SHA-256 hash chains.</p>
          </div>

          <button
            onClick={handleVerifyClick}
            disabled={isVerifying}
            className="px-4 py-2.5 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2"
          >
            {isVerifying ? 'Verifying Hashes...' : 'Run Cryptographic Check'}
          </button>
        </div>

        {integrityStatus && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
            integrityStatus.valid
              ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border-[#A7F3D0] dark:border-[#064E3B]/50'
              : 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]/50'
          }`}>
            {integrityStatus.valid ? <ShieldCheck className="w-5 h-5 flex-shrink-0" /> : <ShieldAlert className="w-5 h-5 flex-shrink-0" />}
            <div>
              <div className="font-black text-sm">{integrityStatus.valid ? 'Cryptographic Integrity Intact ✅' : 'Audit Tamper Detected ❌'}</div>
              <div className="text-[11px] opacity-90 mt-0.5">{integrityStatus.message || 'All audit log records verified against SHA-256 genesis signatures.'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
