import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminUser, logout } from '../app/authSlice';
import { hasPermission } from './PermissionGuard';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Ticket,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu
} from 'lucide-react';

export const AdminLayout = ({ activeTab, onTabChange, title, children }) => {
  const user = useSelector(selectAdminUser);
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard.view' },
    { id: 'catalog', label: 'Products & Categories', icon: ShoppingBag, perm: 'products.view' },
    { id: 'orders', label: 'Orders & Fulfillment', icon: Package, perm: 'orders.view' },
    { id: 'users', label: 'Users & Roles', icon: Users, perm: 'users.view' },
    { id: 'coupons', label: 'Promo Coupons', icon: Ticket, perm: 'settings.edit' },
    { id: 'audit', label: 'Audit Logs', icon: FileText, perm: 'audit.view' },
  ];

  const navItems = allNavItems.filter((item) => hasPermission(user, item.perm));

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF9] text-[#1F2029]">
      {/* Sidebar - Client Primary Dark Theme #1F2029 */}
      <aside
        className={`bg-[#1F2029] text-white flex flex-col justify-between transition-all duration-200 z-50 ${
          sidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center px-5 py-5 border-b border-[#2D2E3A] gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#704F38] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-base font-extrabold text-white tracking-wide">FashionStore</div>
                <div className="text-[10px] font-black text-[#D4C4B7] tracking-widest uppercase">ADMIN PORTAL</div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center w-full px-3.5 py-3 rounded-xl transition-all duration-150 text-left font-semibold text-sm ${
                    isActive
                      ? 'bg-[#704F38] text-white shadow-lg shadow-[#704F38]/30 font-bold'
                      : 'text-[#9A9AB0] hover:bg-[#2A2B37] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#9A9AB0]'}`} />
                  {!sidebarCollapsed && <span className="ml-3 flex-1">{item.label}</span>}
                  {!sidebarCollapsed && isActive && <ChevronRight className="w-4 h-4 text-[#D4C4B7]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#2D2E3A] flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'Admin User'}</div>
              <div className="text-[10px] font-extrabold text-[#E8B84E] uppercase tracking-wider mt-0.5">
                {(user?.role || 'admin').replace('_', ' ')}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg bg-[#E57373]/10 hover:bg-[#E57373]/20 text-[#E57373] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#EDEDED] flex items-center justify-between px-7 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-[#FDFBF9] text-[#797979] hover:text-[#1F2029] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-[#1F2029] tracking-tight">{title || 'Overview'}</h1>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-7 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
};
