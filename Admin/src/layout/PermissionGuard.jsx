import React from 'react';
import { useSelector } from 'react-redux';
import { selectAdminUser } from '../app/authSlice';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const hasPermission = (user, requiredPermission, allowedRoles) => {
  if (!user) return false;
  const userRole = user.role || 'user';
  const permissions = user.permissions || [];

  if (userRole === 'super_admin') return true;
  if (allowedRoles && allowedRoles.includes(userRole)) return true;

  if (userRole === 'admin') {
    if (requiredPermission === 'users.manage' || requiredPermission === 'users.view') {
      return false;
    }
    return true;
  }

  if (userRole === 'product_manager' && (requiredPermission?.startsWith('products.') || requiredPermission === 'dashboard.view')) {
    return true;
  }
  if (userRole === 'order_manager' && (requiredPermission?.startsWith('orders.') || requiredPermission === 'dashboard.view')) {
    return true;
  }

  if (requiredPermission) {
    if (permissions.includes('*') || permissions.includes(requiredPermission)) {
      return true;
    }
  }

  return false;
};

export const PermissionGuard = ({ requiredPermission, allowedRoles, children, onNavigateBack }) => {
  const user = useSelector(selectAdminUser);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <ShieldAlert className="w-14 h-14 text-[#E57373]" />
        <h2 className="text-xl font-bold text-[#1F2029] mt-4">Authentication Required</h2>
        <p className="text-sm text-[#797979] mt-1">Please sign in with an administrator account.</p>
      </div>
    );
  }

  const isAuthorized = hasPermission(user, requiredPermission, allowedRoles);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <div className="w-16 h-16 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-[#E57373]" />
        </div>
        <h2 className="text-xl font-black text-[#1F2029]">403 - Access Denied</h2>
        <p className="text-sm text-[#797979] max-w-md mt-2 leading-relaxed">
          Your role (<strong className="text-[#704F38]">{(user.role || 'user').toUpperCase()}</strong>) does not have permission ({requiredPermission}) to view or manage this module.
        </p>
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#704F38] text-white text-sm font-bold shadow-md hover:bg-[#8C6244] transition-colors mt-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}
      </div>
    );
  }

  return children;
};
