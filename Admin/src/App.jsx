import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAdminAuthenticated } from './app/authSlice';
import { AdminLayout } from './layout/AdminLayout';
import { PermissionGuard } from './layout/PermissionGuard';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { CatalogManagementPage } from './pages/CatalogManagementPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { CouponManagementPage } from './pages/CouponManagementPage';
import { OrderFulfillmentPage } from './pages/OrderFulfillmentPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export function App() {
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [initialOrderStatusFilter, setInitialOrderStatusFilter] = useState('');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleNavigateToOrders = (statusFilter = '') => {
    setInitialOrderStatusFilter(statusFilter);
    setActiveTab('orders');
  };

  const handleNavigateToCreateProduct = () => {
    setEditingProduct(null);
    setActiveTab('product_form');
  };

  const handleNavigateToEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('product_form');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <PermissionGuard requiredPermission="dashboard.view">
            <DashboardPage onNavigateToOrders={handleNavigateToOrders} />
          </PermissionGuard>
        );

      case 'users':
        return (
          <PermissionGuard requiredPermission="users.view">
            <UserManagementPage />
          </PermissionGuard>
        );

      case 'catalog':
        return (
          <PermissionGuard requiredPermission="products.view">
            <CatalogManagementPage
              onNavigateToCreateProduct={handleNavigateToCreateProduct}
              onNavigateToEditProduct={handleNavigateToEditProduct}
            />
          </PermissionGuard>
        );

      case 'product_form':
        return (
          <PermissionGuard requiredPermission="products.edit">
            <ProductFormPage
              productToEdit={editingProduct}
              onBack={() => setActiveTab('catalog')}
            />
          </PermissionGuard>
        );

      case 'coupons':
        return (
          <PermissionGuard requiredPermission="settings.edit">
            <CouponManagementPage />
          </PermissionGuard>
        );

      case 'orders':
        return (
          <PermissionGuard requiredPermission="orders.view">
            <OrderFulfillmentPage initialStatusFilter={initialOrderStatusFilter} />
          </PermissionGuard>
        );

      case 'audit':
        return (
          <PermissionGuard requiredPermission="audit.view">
            <AuditLogsPage />
          </PermissionGuard>
        );

      default:
        return (
          <PermissionGuard requiredPermission="dashboard.view">
            <DashboardPage onNavigateToOrders={handleNavigateToOrders} />
          </PermissionGuard>
        );
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard & Key Performance Indicators';
      case 'users': return 'User & Role Management';
      case 'catalog': return 'Products & Categories Inventory';
      case 'product_form': return editingProduct ? 'Edit Product Listing' : 'Create Product Listing';
      case 'coupons': return 'Promo Coupon Management';
      case 'orders': return 'Order Lifecycle & Fulfillment';
      case 'audit': return 'Audit Logs & Change Records';
      default: return 'Admin Portal';
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} title={getTitle()}>
      {renderTabContent()}
    </AdminLayout>
  );
}

export default App;
