import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminUser, logout } from '../app/authSlice';
import { hasPermission } from './PermissionGuard';
import brandIcon from '../assets/icon.png';
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
      {/* Sidebar - Client Primary Dark Theme with Solid Colors */}
      <aside
        className={`bg-[#1F2029] text-white flex flex-col justify-between transition-all duration-300 z-50 border-r border-[#2E303F]/20 ${sidebarCollapsed ? 'w-[72px]' : 'w-64'
          }`}
      >
        <div>
          {/* Brand Header */}
          <div className={`flex items-center border-b border-[#2D2E3A]/50 gap-3 py-5 transition-all duration-300 ${sidebarCollapsed ? 'justify-center px-0' : 'px-5'
            }`}>
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-md p-1 border border-[#D4C4B7]/20 flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img src={brandIcon} alt="FashionStore Admin" className="w-full h-full object-contain" />
            </div>
            {!sidebarCollapsed && (
              <div className="transition-opacity duration-300">
                <div className="text-base font-extrabold text-white tracking-wide">FashionStore</div>
                <div className="text-[10px] font-black text-[#D4C4B7] tracking-widest uppercase">ADMIN PORTAL</div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className={`p-3 space-y-2 transition-all duration-300 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 font-semibold text-sm ${sidebarCollapsed
                    ? 'w-12 h-12 justify-center mx-auto'
                    : 'px-3.5 py-3 hover:translate-x-1.5 w-full'
                    } ${isActive
                      ? 'bg-[#704F38] text-white shadow-lg shadow-[#704F38]/25 font-bold'
                      : 'text-[#9A9AB0] hover:bg-[#2A2B37]/60 hover:text-white'
                    }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-[#E8B84E]"></span>
                  )}
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-250 ${isActive ? 'text-[#E8B84E] scale-105' : 'text-[#9A9AB0] group-hover:text-white group-hover:scale-105'
                    }`} />
                  {!sidebarCollapsed && <span className="ml-3 flex-1 text-left">{item.label}</span>}
                  {!sidebarCollapsed && isActive && <ChevronRight className="w-4 h-4 text-[#D4C4B7] animate-pulse" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className={`border-t border-[#2D2E3A]/50 flex flex-col gap-4 transition-all duration-300 ${sidebarCollapsed ? 'p-3 items-center' : 'p-4'
          }`}>
          {sidebarCollapsed ? (
            /* Collapsed User Avatar & Logout Button */
            <div className="flex flex-col items-center gap-3 w-full animate-fadeIn">
              <div
                className="w-10 h-10 rounded-xl bg-black flex items-center justify-center font-black text-white text-sm shadow-md border border-white/10 uppercase cursor-default transition-all duration-300 hover:rotate-6"
                title={user?.name || 'Admin'}
              >
                {(user?.name || 'A').charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#E57373]/10 hover:bg-[#E57373]/20 text-[#E57373] transition-all duration-200 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Expanded User Profile & Logout Button */
            <div className="flex flex-col w-full gap-3 animate-fadeIn">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center font-black text-white text-sm shadow-md border border-white/10 uppercase flex-shrink-0">
                  {(user?.name || 'A').charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-extrabold text-white truncate">{user?.name || 'Admin User'}</div>
                  <div className="text-[10px] font-black text-[#E8B84E] uppercase tracking-wider mt-0.5">
                    {(user?.role || 'admin').replace('_', ' ')}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-white text-black font-bold text-xs transition-all duration-200 hover:scale-[1.02]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
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
