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
      ordersData?.orders?.forEach(o => {
        csvRows.push([
          o._id,
          new Date(o.createdAt).toLocaleDateString(),
          `"${o.shippingAddress?.name || 'Customer'}"`,
          o.totals?.grandTotal || 0,
          o.paymentStatus,
          o.orderStatus
        ]);
      });
    } else if (reportType === 'audit') {
      csvRows.push(['Timestamp', 'Admin ID', 'Actor Role', 'Action', 'Target Entity', 'Target ID', 'SHA256 Hash']);
      auditData?.logs?.forEach(l => {
        csvRows.push([
          new Date(l.createdAt).toLocaleString(),
          l.adminId,
          l.actorRole || 'admin',
          l.action,
          l.targetEntity,
          l.targetId || '',
          l.hash || ''
        ]);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggles = configData?.config?.featureToggles || {
    couponsEnabled: true,
    returnsEnabled: true,
    instantRefundsEnabled: true,
    maintenanceMode: false
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: REPORTS EXPORTER */}
      <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-black text-[#1F2029]">Reports & Data Exporter</h3>
          <p className="text-xs text-[#797979]">Download formatted CSV sales, tax, and audit logs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleExportCSV('sales')}
            className="p-4 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-xl text-left transition-all hover:scale-[1.01]"
          >
            <FileSpreadsheet className="w-5 h-5 text-[#704F38] mb-2" />
            <div className="text-xs font-black text-[#1F2029]">Sales Revenue Report</div>
            <div className="text-[11px] text-[#797979] mt-0.5">Export all completed orders and total revenue.</div>
          </button>

          <button
            onClick={() => handleExportCSV('orders')}
            className="p-4 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-xl text-left transition-all hover:scale-[1.01]"
          >
            <FileSpreadsheet className="w-5 h-5 text-[#704F38] mb-2" />
            <div className="text-xs font-black text-[#1F2029]">Order Fulfillment Report</div>
            <div className="text-[11px] text-[#797979] mt-0.5">Export order statuses and delivery SLA details.</div>
          </button>

          <button
            onClick={() => handleExportCSV('audit')}
            className="p-4 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-xl text-left transition-all hover:scale-[1.01]"
          >
            <FileSpreadsheet className="w-5 h-5 text-[#704F38] mb-2" />
            <div className="text-xs font-black text-[#1F2029]">Audit Log Evidence CSV</div>
            <div className="text-[11px] text-[#797979] mt-0.5">Export SHA-256 tamper-evident log records.</div>
          </button>
        </div>
      </div>

      {/* SECTION 2: MODULE FEATURE TOGGLES (KILL SWITCHES) */}
      <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-black text-[#1F2029]">System Feature Toggles (Kill Switches)</h3>
          <p className="text-xs text-[#797979]">Enable or disable key platform features instantly across microservices.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-[#FDFBF9] rounded-xl border border-[#EDEDED]">
            <div>
              <div className="text-xs font-black text-[#1F2029]">Promo Coupon Module</div>
              <div className="text-[11px] text-[#797979]">Allow customers to apply promo codes during checkout.</div>
            </div>
            <button onClick={() => handleToggleFeature('couponsEnabled')} disabled={isUpdatingConfig}>
              {toggles.couponsEnabled ? <ToggleRight className="w-8 h-8 text-[#704F38]" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FDFBF9] rounded-xl border border-[#EDEDED]">
            <div>
              <div className="text-xs font-black text-[#1F2029]">Return & Refund Requests</div>
              <div className="text-[11px] text-[#797979]">Allow customers to initiate returns on delivered items.</div>
            </div>
            <button onClick={() => handleToggleFeature('returnsEnabled')} disabled={isUpdatingConfig}>
              {toggles.returnsEnabled ? <ToggleRight className="w-8 h-8 text-[#704F38]" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FDFBF9] rounded-xl border border-[#EDEDED]">
            <div>
              <div className="text-xs font-black text-[#1F2029]">Instant Credit Note Refunds</div>
              <div className="text-[11px] text-[#797979]">Enable automated ledger safe credit note refund issuance.</div>
            </div>
            <button onClick={() => handleToggleFeature('instantRefundsEnabled')} disabled={isUpdatingConfig}>
              {toggles.instantRefundsEnabled ? <ToggleRight className="w-8 h-8 text-[#704F38]" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FDFBF9] rounded-xl border border-[#EDEDED]">
            <div>
              <div className="text-xs font-black text-[#1F2029]">Store Maintenance Mode</div>
              <div className="text-[11px] text-[#797979]">Temporarily restrict customer ordering.</div>
            </div>
            <button onClick={() => handleToggleFeature('maintenanceMode')} disabled={isUpdatingConfig}>
              {toggles.maintenanceMode ? <ToggleRight className="w-8 h-8 text-red-600" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: SHA-256 AUDIT LOG TAMPER-VERIFICATION TOOL */}
      <div className="bg-white p-6 rounded-2xl border border-[#EDEDED] shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#EDEDED] pb-4">
          <div>
            <h3 className="text-base font-black text-[#1F2029]">Cryptographic Audit Log Verification</h3>
            <p className="text-xs text-[#797979]">Verify that no audit log records have been modified or deleted from MongoDB.</p>
          </div>
          <button
            onClick={handleVerifyClick}
            disabled={isVerifying}
            className="px-4 py-2 bg-[#704F38] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            {isVerifying ? 'Verifying Chain...' : 'Run SHA-256 Chain Verification'}
          </button>
        </div>

        {integrityStatus && (
          <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-3 ${
            integrityStatus.isTampered
              ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
              : 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
          }`}>
            {integrityStatus.isTampered ? <ShieldAlert className="w-5 h-5 flex-shrink-0" /> : <ShieldCheck className="w-5 h-5 flex-shrink-0" />}
            <div>
              <div>{integrityStatus.statusMessage}</div>
              <div className="text-[11px] font-normal opacity-85 mt-0.5">Verified {integrityStatus.totalLogsVerified} log entries against unbroken SHA-256 previousHash links.</div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[10px] font-black uppercase">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin ID</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">SHA-256 Hash Chain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]">
              {isLoadingAudit ? (
                <tr><td colSpan="5"><Loader message="Loading Log Evidence..." /></td></tr>
              ) : (
                auditData?.logs?.slice(0, 10).map((log) => (
                  <tr key={log._id} className="hover:bg-[#FDFBF9]/50">
                    <td className="py-3 px-4 text-[#797979]">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-[#1F2029]">{log.adminId} ({log.actorRole || 'admin'})</td>
                    <td className="py-3 px-4 font-extrabold text-[#704F38]">{log.action}</td>
                    <td className="py-3 px-4 text-[#797979]">{log.targetEntity}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-[#797979] max-w-xs truncate" title={log.hash}>
                      {log.hash || 'Legacy Unhashed'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
