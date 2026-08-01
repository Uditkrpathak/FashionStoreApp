import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetAdminUsersQuery, 
  useUpdateUserRoleMutation, 
  useToggleUserStatusMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetActiveSessionsQuery,
  useRevokeSessionMutation
} from '../services/adminAuthApi';
import {
  setUserViewMode,
  toggleStarUser,
  setUserSearch,
  setUserRoleFilter,
  setUserPage,
  selectUserViewMode,
  selectStarredUsers,
  selectUserSearchQuery,
  selectUserRoleFilter,
  selectUserPage,
} from '../app/adminUiSlice';
import { UserCard } from '../shared/components/UserCard';
import { 
  Search, Shield, UserX, UserCheck, RefreshCw, X, Check, KeyRound, 
  Laptop, Smartphone, Power, Plus, ShieldAlert, Eye, EyeOff, Activity, Sliders,
  Star, MoreHorizontal, Mail, Phone, MessageSquare, LayoutGrid, List
} from 'lucide-react';
import { Loader } from '../shared/components/Loader';

const ALL_CAPABILITIES = [
  { key: 'users.view', label: 'View Customer Profiles & Users' },
  { key: 'users.manage', label: 'Promote / Demote Roles' },
  { key: 'users.block', label: 'Block / Suspend Accounts' },
  { key: 'products.view', label: 'View Catalog & Inventory' },
  { key: 'products.edit', label: 'Create & Edit Products' },
  { key: 'categories.edit', label: 'Manage Categories' },
  { key: 'orders.view', label: 'View Platform Orders' },
  { key: 'orders.status.update', label: 'Advance Order Lifecycle' },
  { key: 'dashboard.view', label: 'Access Revenue Dashboard' },
  { key: 'settings.edit', label: 'Manage Store Config & Coupons' },
  { key: 'audit.view', label: 'View Audit Logs & Integrity' },
  { key: 'roles.manage', label: 'Create & Edit Dynamic Roles' },
  { key: 'sessions.manage', label: 'Manage Active Sessions (Force Logout)' },
];

export const UserManagementPage = () => {
  const dispatch = useDispatch();

  // Redux UI State
  const userViewMode = useSelector(selectUserViewMode);
  const starredUsers = useSelector(selectStarredUsers);
  const search = useSelector(selectUserSearchQuery);
  const roleFilter = useSelector(selectUserRoleFilter);
  const page = useSelector(selectUserPage);

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'activity' | 'roles' | 'sessions'

  // Modal Dialog States
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [targetStatus, setTargetStatus] = useState('blocked');
  const [statusReason, setStatusReason] = useState('');
  const [userDetailModal, setUserDetailModal] = useState(null);

  // Roles Tab state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePerms, setNewRolePerms] = useState([]);
  const [createRoleModal, setCreateRoleModal] = useState(false);

  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetAdminUsersQuery({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter || undefined,
  });

  const { data: rolesData, isLoading: isLoadingRoles, refetch: refetchRoles } = useGetRolesQuery();
  const { data: sessionsData, isLoading: isLoadingSessions, refetch: refetchSessions } = useGetActiveSessionsQuery({ page: 1, limit: 30 });

  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdatingRoleDoc }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();
  const [revokeSession, { isLoading: isRevokingSession }] = useRevokeSessionMutation();

  const handleOpenRoleModal = useCallback((user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    setSelectedPermissions(user.permissions || []);
    setRoleModalVisible(true);
  }, []);

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    try {
      await updateUserRole({ id: selectedUser._id, role: selectedRole, permissions: selectedPermissions }).unwrap();
      setRoleModalVisible(false);
      refetchUsers();
    } catch (err) {
      alert(err.data?.message || 'Failed to update user role');
    }
  };

  const handleOpenStatusModal = useCallback((user) => {
    setSelectedUser(user);
    setTargetStatus(user.status === 'blocked' ? 'active' : 'blocked');
    setStatusReason('');
    setStatusModalVisible(true);
  }, []);

  const handleOpenDetail = useCallback((user) => {
    setUserDetailModal(user);
  }, []);

  const handleToggleStar = useCallback((userId) => {
    dispatch(toggleStarUser(userId));
  }, [dispatch]);

  const handleCloseAllModals = useCallback(() => {
    setRoleModalVisible(false);
    setStatusModalVisible(false);
    setUserDetailModal(null);
    setCreateRoleModal(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseAllModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseAllModals]);

  const handleSaveStatus = async () => {
    if (!selectedUser) return;
    if (!statusReason.trim()) {
      alert('A reason is mandatory for changing user account status.');
      return;
    }
    try {
      await toggleUserStatus({ id: selectedUser._id, status: targetStatus, reason: statusReason.trim() }).unwrap();
      setStatusModalVisible(false);
      refetchUsers();
    } catch (err) {
      alert(err.data?.message || 'Failed to update user status');
    }
  };

  const handleCreateRoleSubmit = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      await createRole({
        name: newRoleName.trim(),
        description: newRoleDesc.trim(),
        permissions: newRolePerms
      }).unwrap();
      setCreateRoleModal(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setNewRolePerms([]);
      refetchRoles();
    } catch (err) {
      alert(err.data?.message || 'Failed to create role');
    }
  };

  const handleDeleteRoleClick = async (roleObj) => {
    if (roleObj.isSystem) {
      alert('Cannot delete core system role.');
      return;
    }
    if (confirm(`Are you sure you want to delete role '${roleObj.name}'?`)) {
      try {
        await deleteRole(roleObj._id).unwrap();
        refetchRoles();
      } catch (err) {
        alert(err.data?.message || 'Failed to delete role');
      }
    }
  };

  const handleRevokeSessionClick = async (sessionItem) => {
    if (confirm(`Revoke active session for ${sessionItem.userEmail} (${sessionItem.ipAddress})?`)) {
      try {
        await revokeSession({ jti: sessionItem.jti }).unwrap();
        refetchSessions();
      } catch (err) {
        alert(err.data?.message || 'Failed to revoke session');
      }
    }
  };

  const togglePermission = (key) => {
    if (selectedPermissions.includes(key)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== key));
    } else {
      setSelectedPermissions([...selectedPermissions, key]);
    }
  };

  const toggleNewRolePermission = (key) => {
    if (newRolePerms.includes(key)) {
      setNewRolePerms(newRolePerms.filter((p) => p !== key));
    } else {
      setNewRolePerms([...newRolePerms, key]);
    }
  };

  const toggleStarUser = (userId) => {
    if (starredUsers.includes(userId)) {
      setStarredUsers(starredUsers.filter((id) => id !== userId));
    } else {
      setStarredUsers([...starredUsers, userId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header & Sub-Tabs Navigation */}
      <div className="bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2 border-b md:border-b-0 border-[#EDEDED] w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] hover:text-[#1F2029]'
            }`}
          >
            <Shield className="w-4 h-4" />
            Customer & Admin Accounts
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'roles' ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] hover:text-[#1F2029]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Role & Access Matrix
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'sessions' ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] hover:text-[#1F2029]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Active Sessions & Revocation
          </button>
        </div>

        {activeTab === 'roles' && (
          <button
            onClick={() => setCreateRoleModal(true)}
            className="px-4 py-2.5 bg-[#704F38] hover:bg-[#8C6244] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Custom Role
          </button>
        )}
      </div>

      {/* TAB 1: USER ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Top Bar: Search, Filters & View Mode Switcher */}
          <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-[#181926] p-4 rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm items-center transition-colors">
            {/* Search Input */}
            <div className="flex-1 flex items-center bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl px-3.5 w-full">
              <Search className="w-4 h-4 text-[#797979] dark:text-[#A0AEC0] mr-2" />
              <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => dispatch(setUserSearch(e.target.value))}
                className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029] dark:text-white placeholder-[#797979] dark:placeholder-[#A0AEC0]"
              />
            </div>

            {/* Role Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
              {['', 'super_admin', 'admin', 'user'].map((r) => (
                <button
                  key={r || 'all'}
                  onClick={() => dispatch(setUserRoleFilter(r))}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    roleFilter === r
                      ? 'bg-[#704F38] text-white shadow-md'
                      : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#2A2C3F] hover:text-[#1F2029] dark:hover:text-white'
                  }`}
                >
                  {r ? r.toUpperCase().replace('_', ' ') : 'ALL ROLES'}
                </button>
              ))}
            </div>

            {/* View Mode Toggle (Figma Grid vs Table) */}
            <div className="flex items-center gap-1 bg-[#FDFBF9] dark:bg-[#11121E] p-1 rounded-xl border border-[#EDEDED] dark:border-[#2A2C3F]">
              <button
                onClick={() => dispatch(setUserViewMode('grid'))}
                className={`p-2 rounded-lg transition-all ${
                  userViewMode === 'grid'
                    ? 'bg-[#704F38] text-white shadow-md'
                    : 'text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white'
                }`}
                title="Grid View (Figma Design)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch(setUserViewMode('table'))}
                className={`p-2 rounded-lg transition-all ${
                  userViewMode === 'table'
                    ? 'bg-[#704F38] text-white shadow-md'
                    : 'text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => refetchUsers()}
              className="p-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-xl transition-colors"
              title="Refresh User List"
            >
              <RefreshCw className="w-4 h-4 text-[#1F2029] dark:text-white" />
            </button>
          </div>

          {/* FIGMA GRID VIEW */}
          {userViewMode === 'grid' && (
            <div>
              {isLoadingUsers ? (
                <div className="py-12 bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838]">
                  <Loader message="Loading Customer Cards..." />
                </div>
              ) : usersData?.users?.length === 0 ? (
                <div className="p-12 text-center text-[#797979] dark:text-[#A0AEC0] font-bold bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838]">
                  No users found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {usersData?.users?.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      isStarred={starredUsers.includes(user._id)}
                      onToggleStar={handleToggleStar}
                      onOpenDetail={handleOpenDetail}
                      onOpenRoleModal={handleOpenRoleModal}
                      onOpenStatusModal={handleOpenStatusModal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TABLE VIEW */}
          {userViewMode === 'table' && (
            <div className="bg-white dark:bg-[#181926] rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[750px]">
                  <thead>
                    <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                      <th className="px-5 py-4">User Name</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan="5">
                          <Loader message="Loading User Accounts..." />
                        </td>
                      </tr>
                    ) : usersData?.users?.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-[#797979] dark:text-[#A0AEC0]">No users match criteria.</td></tr>
                    ) : (
                      usersData?.users?.map((user) => (
                        <tr key={user._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#11121E] border border-[#E2E8F0] dark:border-[#2A2C3F] flex items-center justify-center font-black text-sm text-[#704F38] dark:text-[#E8B84E] overflow-hidden flex-shrink-0">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name || 'Avatar'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  (user.name || user.email || 'U').charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-[#1F2029] dark:text-white">{user.name}</div>
                                <div className="text-[10px] font-mono font-bold text-[#704F38] dark:text-[#E8B84E] mt-0.5 select-all">
                                  #USR-{user._id.slice(-6).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[#797979] dark:text-[#A0AEC0] font-medium">{user.email}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                              user.role === 'admin' || user.role === 'super_admin'
                                ? 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#B45309]/50'
                                : 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#1D4ED8] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#1E3A8A]/50'
                            }`}>
                              {(user.role || 'user').replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                              user.status === 'blocked'
                                ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D]/50'
                                : 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#064E3B]/50'
                            }`}>
                              {(user.status || 'active').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right space-x-1.5">
                            <button onClick={() => setUserDetailModal(user)} title="View User Detail & Activity" className="p-2 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-lg text-[#1F2029] dark:text-white transition-colors">
                              <Activity className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleOpenRoleModal(user)} title="Edit Role & Permissions" className="p-2 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-lg text-[#3B82F6] transition-colors">
                              <Shield className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleOpenStatusModal(user)} title="Account Status Action" className="p-2 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-lg transition-colors">
                              {user.status === 'blocked' ? <UserCheck className="w-4 h-4 text-[#4CAF50]" /> : <UserX className="w-4 h-4 text-[#E57373]" />}
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
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingRoles ? (
            <div className="col-span-2">
              <Loader message="Loading Dynamic Roles Matrix..." />
            </div>
          ) : (
            rolesData?.roles?.map((roleObj) => (
              <div key={roleObj._id} className="bg-white rounded-2xl p-6 border border-[#EDEDED] shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-[#1F2029] capitalize">{roleObj.name.replace('_', ' ')}</h3>
                        {roleObj.isSystem && (
                          <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-black uppercase px-2 py-0.5 rounded border border-[#FDE68A]">
                            Core System Role
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#797979] font-medium mt-1">{roleObj.description || 'No description provided.'}</p>
                    </div>

                    {!roleObj.isSystem && (
                      <button onClick={() => handleDeleteRoleClick(roleObj)} className="text-[#E57373] hover:text-red-700 text-xs font-bold">
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="border-t border-[#EDEDED] pt-3 mt-3">
                    <label className="text-[11px] font-black text-[#1F2029] uppercase tracking-wider block mb-2">Granted Capabilities ({roleObj.permissions?.length || 0}):</label>
                    <div className="flex flex-wrap gap-1.5">
                      {roleObj.permissions?.includes('*') ? (
                        <span className="bg-[#ECFDF5] text-[#047857] text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-[#A7F3D0]">
                          FULL PLATFORM CONTROL (*)
                        </span>
                      ) : roleObj.permissions?.map((p) => (
                        <span key={p} className="bg-[#FDFBF9] text-[#1F2029] text-[10px] font-bold px-2 py-0.5 rounded border border-[#EDEDED]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: ACTIVE SESSIONS & REVOCATION */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#EDEDED] flex justify-between items-center bg-[#FDFBF9]">
            <div>
              <h3 className="text-sm font-black text-[#1F2029]">Active Admin Sessions</h3>
              <p className="text-xs text-[#797979]">Monitor active logins and revoke tokens instantly across all gateway microservices.</p>
            </div>
            <button onClick={() => refetchSessions()} className="p-2 bg-white border border-[#EDEDED] rounded-xl">
              <RefreshCw className="w-4 h-4 text-[#1F2029]" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">IP Address</th>
                  <th className="px-5 py-4">User Agent / Device</th>
                  <th className="px-5 py-4">Login Time</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED]">
                {isLoadingSessions ? (
                  <tr><td colSpan="5"><Loader message="Fetching Active Sessions..." /></td></tr>
                ) : sessionsData?.sessions?.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-[#797979]">No active sessions logged.</td></tr>
                ) : (
                  sessionsData?.sessions?.map((sess) => (
                    <tr key={sess._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                      <td className="px-5 py-4 font-extrabold text-[#1F2029]">
                        <div>{sess.userEmail}</div>
                        <span className="text-[10px] font-black text-[#704F38] uppercase">{sess.userRole}</span>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-[#797979]">{sess.ipAddress}</td>
                      <td className="px-5 py-4 text-xs text-[#797979] max-w-xs truncate" title={sess.userAgent}>
                        {sess.userAgent}
                      </td>
                      <td className="px-5 py-4 text-xs text-[#797979]">
                        {new Date(sess.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleRevokeSessionClick(sess)}
                          disabled={isRevokingSession}
                          className="px-3 py-1.5 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto"
                        >
                          <Power className="w-3.5 h-3.5" />
                          Force Logout
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

      {/* Role Management Modal */}
      {roleModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1F2029]">Manage Role & Scopes</h3>
              <button onClick={() => setRoleModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Role for {selectedUser?.name}:</label>
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

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Granted Capabilities:</label>
            <div className="max-h-48 overflow-y-auto bg-[#FDFBF9] p-3 rounded-xl border border-[#EDEDED] space-y-1">
              {ALL_CAPABILITIES.map((p) => {
                const checked = selectedPermissions.includes(p.key);
                return (
                  <div key={p.key} onClick={() => togglePermission(p.key)} className="flex items-center p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                    <input type="checkbox" checked={checked} onChange={() => {}} className="mr-3 accent-[#704F38]" />
                    <span className="text-xs font-bold text-[#1F2029]">{p.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setRoleModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
              <button onClick={handleSaveRole} disabled={isUpdatingRole} className="px-5 py-2.5 rounded-xl bg-[#704F38] text-white text-xs font-extrabold shadow-md">
                {isUpdatingRole ? 'Saving...' : 'Save Role & Scopes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {createRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-4">
              <h3 className="text-lg font-black text-[#1F2029]">Create Custom Role</h3>
              <button onClick={() => setCreateRoleModal(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regional Support Manager"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Description</label>
                <textarea
                  placeholder="Scope and purpose of this custom role..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full h-20 px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-2">Select Granted Capabilities</label>
                <div className="max-h-48 overflow-y-auto bg-[#FDFBF9] p-3 rounded-xl border border-[#EDEDED] space-y-1">
                  {ALL_CAPABILITIES.map((p) => {
                    const checked = newRolePerms.includes(p.key);
                    return (
                      <div key={p.key} onClick={() => toggleNewRolePermission(p.key)} className="flex items-center p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                        <input type="checkbox" checked={checked} onChange={() => {}} className="mr-3 accent-[#704F38]" />
                        <span className="text-xs font-bold text-[#1F2029]">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setCreateRoleModal(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
                <button type="submit" disabled={isCreatingRole} className="px-5 py-2.5 rounded-xl bg-[#704F38] text-white text-xs font-extrabold shadow-md">
                  {isCreatingRole ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Status Modal */}
      {statusModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
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

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Mandatory Audit Reason:</label>
            <textarea
              placeholder="Specify reason for account status change..."
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              className="w-full h-20 p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-xs font-medium outline-none focus:border-[#704F38]"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setStatusModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
              <button onClick={handleSaveStatus} disabled={isTogglingStatus} className="px-5 py-2.5 rounded-xl bg-[#704F38] text-white text-xs font-extrabold shadow-md">
                {isTogglingStatus ? 'Applying...' : 'Apply Status Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Activity & Profile Detail Modal */}
      {userDetailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-4">
              <div>
                <h3 className="text-base font-black text-[#1F2029]">{userDetailModal.name}</h3>
                <span className="text-xs text-[#797979]">{userDetailModal.email}</span>
              </div>
              <button onClick={() => setUserDetailModal(null)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-[#FDFBF9] p-4 rounded-xl border border-[#EDEDED]">
                <h4 className="text-xs font-extrabold text-[#1F2029] uppercase mb-2">Activity History Log</h4>
                {!userDetailModal.activityLogs || userDetailModal.activityLogs.length === 0 ? (
                  <p className="text-xs text-[#797979]">No activity logs recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {userDetailModal.activityLogs.map((act, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-[#EDEDED]">
                        <span className="font-bold text-[#704F38]">{act.action}</span>
                        <span className="text-[11px] text-[#797979]">{new Date(act.timestamp).toLocaleString()} ({act.ip})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
