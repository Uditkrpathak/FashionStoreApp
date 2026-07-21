import React, { useState } from 'react';
import { useGetAdminUsersQuery, useUpdateUserRoleMutation, useToggleUserStatusMutation } from '../services/adminAuthApi';
import { Search, Shield, UserX, UserCheck, RefreshCw, X, Check } from 'lucide-react';

const PERMISSION_OPTIONS = [
  { key: 'users.view', label: 'View Users' },
  { key: 'users.manage', label: 'Manage Roles' },
  { key: 'users.block', label: 'Block Accounts' },
  { key: 'products.view', label: 'View Catalog' },
  { key: 'products.edit', label: 'Edit Products & Categories' },
  { key: 'orders.view', label: 'View Orders' },
  { key: 'orders.status.update', label: 'Process & Update Orders' },
  { key: 'dashboard.view', label: 'View Dashboard Analytics' },
  { key: 'settings.edit', label: 'Manage Coupons & Settings' },
  { key: 'audit.view', label: 'View Audit Logs' },
];

export const UserManagementPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [targetStatus, setTargetStatus] = useState('blocked');
  const [statusReason, setStatusReason] = useState('');

  const { data, isLoading, refetch } = useGetAdminUsersQuery({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter || undefined,
  });

  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    setSelectedPermissions(user.permissions || []);
    setRoleModalVisible(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    try {
      await updateUserRole({ id: selectedUser._id, role: selectedRole, permissions: selectedPermissions }).unwrap();
      setRoleModalVisible(false);
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to update user role');
    }
  };

  const handleOpenStatusModal = (user) => {
    setSelectedUser(user);
    setTargetStatus(user.status === 'blocked' ? 'active' : 'blocked');
    setStatusReason('');
    setStatusModalVisible(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedUser) return;
    try {
      await toggleUserStatus({ id: selectedUser._id, status: targetStatus, reason: statusReason || 'Admin Action' }).unwrap();
      setStatusModalVisible(false);
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to update user status');
    }
  };

  const togglePermission = (key) => {
    if (selectedPermissions.includes(key)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== key));
    } else {
      setSelectedPermissions([...selectedPermissions, key]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm items-center">
        <div className="flex-1 flex items-center bg-[#FDFBF9] border border-[#EDEDED] rounded-xl px-3.5 w-full">
          <Search className="w-4 h-4 text-[#797979] mr-2" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['', 'admin', 'user'].map((r) => (
            <button
              key={r || 'all'}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === r ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] border border-[#EDEDED] hover:text-[#1F2029]'
              }`}
            >
              {r ? r.toUpperCase() : 'ALL ROLES'}
            </button>
          ))}
        </div>

        <button onClick={() => refetch()} className="p-2.5 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4 text-[#1F2029]" />
        </button>
      </div>

      {/* Table-First User List */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
              <th className="px-5 py-4">User Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDED]">
            {isLoading ? (
              <tr><td colSpan="5" className="p-8 text-center text-[#797979]">Loading Users...</td></tr>
            ) : data?.users?.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-[#797979]">No users match criteria.</td></tr>
            ) : (
              data?.users?.map((user) => (
                <tr key={user._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                  <td className="px-5 py-4 font-extrabold text-[#1F2029]">{user.name}</td>
                  <td className="px-5 py-4 text-[#797979] font-medium">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                      user.role === 'admin' || user.role === 'super_admin'
                        ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                        : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                    }`}>
                      {(user.role || 'user').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                      user.status === 'blocked'
                        ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                        : 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                    }`}>
                      {(user.status || 'active').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-1.5">
                    <button onClick={() => handleOpenRoleModal(user)} title="Edit Role" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-[#3B82F6] transition-colors">
                      <Shield className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenStatusModal(user)} title="Toggle Status" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg transition-colors">
                      {user.status === 'blocked' ? <UserCheck className="w-4 h-4 text-[#4CAF50]" /> : <UserX className="w-4 h-4 text-[#E57373]" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Role Modal */}
      {roleModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1F2029]">Manage Role & Scopes</h3>
              <button onClick={() => setRoleModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Select Role for {selectedUser?.name}:</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {['user', 'admin', 'product_manager', 'order_manager', 'super_admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedRole === r ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'
                  }`}
                >
                  {r.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Granted Capability Scopes:</label>
            <div className="max-h-48 overflow-y-auto bg-[#FDFBF9] p-3 rounded-xl border border-[#EDEDED] space-y-1">
              {PERMISSION_OPTIONS.map((p) => {
                const checked = selectedPermissions.includes(p.key);
                return (
                  <div key={p.key} onClick={() => togglePermission(p.key)} className="flex items-center p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                    <input type="checkbox" checked={checked} onChange={() => {}} className="mr-3 accent-[#704F38]" />
                    <span className="text-xs font-bold text-[#1F2029]">{p.label}</span>
                    <span className="text-[11px] text-[#797979] ml-2">({p.key})</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setRoleModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
              <button onClick={handleSaveRole} disabled={isUpdatingRole} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                {isUpdatingRole ? 'Saving...' : 'Save Role & Scopes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {statusModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1F2029]">Account Status Action</h3>
              <button onClick={() => setStatusModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Set Status for {selectedUser?.name}:</label>
            <div className="flex gap-2 mb-5">
              {['active', 'blocked', 'suspended'].map((s) => (
                <button
                  key={s}
                  onClick={() => setTargetStatus(s)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    targetStatus === s ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Reason for Audit Record:</label>
            <textarea
              placeholder="Specify reason for account status change..."
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              className="w-full h-20 p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-xs font-medium outline-none focus:border-[#704F38]"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setStatusModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
              <button onClick={handleSaveStatus} disabled={isTogglingStatus} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                {isTogglingStatus ? 'Applying...' : 'Apply Status Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
