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
import { OrderFulfillmentPage } from './pages/OrderFulfillmentPage';
import { TicketManagementPage } from './pages/TicketManagementPage';
import { FinanceManagementPage } from './pages/FinanceManagementPage';
import { MarketingNotificationPage } from './pages/MarketingNotificationPage';
import { SettingsReportsPage } from './pages/SettingsReportsPage';

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

      case 'orders':
        return (
          <PermissionGuard requiredPermission="orders.view">
            <OrderFulfillmentPage initialStatusFilter={initialOrderStatusFilter} />
          </PermissionGuard>
        );

      case 'tickets':
        return (
          <PermissionGuard requiredPermission="orders.view">
            <TicketManagementPage />
          </PermissionGuard>
        );

      case 'finance':
        return (
          <PermissionGuard requiredPermission="orders.view">
            <FinanceManagementPage />
          </PermissionGuard>
        );

      case 'marketing':
        return (
          <PermissionGuard requiredPermission="settings.edit">
            <MarketingNotificationPage />
          </PermissionGuard>
        );

      case 'settings':
        return (
          <PermissionGuard requiredPermission="audit.view">
            <SettingsReportsPage />
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
      case 'users': return 'User Management, Roles & Active Sessions';
      case 'catalog': return 'Products & Catalog Inventory';
      case 'product_form': return editingProduct ? 'Edit Product Listing' : 'Create Product Listing';
      case 'orders': return 'Order Lifecycle & Courier Fulfillment';
      case 'tickets': return 'Grievance & Support Tickets';
      case 'finance': return 'Payment Logs, Invoices & Credit Notes';
      case 'marketing': return 'Notifications & Promo Campaigns';
      case 'settings': return 'Reports, System Settings & Audit Logs';
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
