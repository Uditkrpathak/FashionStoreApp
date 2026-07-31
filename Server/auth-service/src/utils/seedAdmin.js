import User from '../models/User.js';
import Role from '../models/Role.js';

export const seedDefaultAdmin = async () => {
  try {
    // 1. Seed System Roles
    const systemRoles = [
      {
        name: 'super_admin',
        description: 'Full operational control, RBAC policy management, and session revocation.',
        permissions: ['*'],
        isSystem: true,
      },
      {
        name: 'admin',
        description: 'General administrative access across products, categories, coupons, and orders.',
        permissions: [
          'users.view', 'users.manage', 'users.block',
          'products.view', 'products.edit', 'categories.edit',
          'orders.view', 'orders.status.update', 'dashboard.view',
          'settings.edit', 'audit.view', 'roles.manage', 'sessions.manage'
        ],
        isSystem: true,
      },
      {
        name: 'product_manager',
        description: 'Managing product listings, categories, inventory, and reviews.',
        permissions: ['products.view', 'products.edit', 'categories.edit'],
        isSystem: true,
      },
      {
        name: 'order_manager',
        description: 'Processing orders, advancing order status through state machine, tracking.',
        permissions: ['orders.view', 'orders.status.update'],
        isSystem: true,
      },
      {
        name: 'inventory_manager',
        description: 'Stock level updates and low-stock monitoring.',
        permissions: ['products.view', 'products.edit'],
        isSystem: true,
      },
      {
        name: 'marketing_admin',
        description: 'Managing promotional coupon codes and campaign rules.',
        permissions: ['settings.edit'],
        isSystem: true,
      },
      {
        name: 'support',
        description: 'Customer support ticket handling and order status viewing.',
        permissions: ['orders.view', 'users.view'],
        isSystem: true,
      },
    ];

    for (const r of systemRoles) {
      const existing = await Role.findOne({ name: r.name });
      if (!existing) {
        await Role.create(r);
        console.log(`✅ [Seed Role] Created system role: ${r.name}`);
      }
    }

    // 2. Seed Default Super Admin Account
    const adminEmail = 'admin@fashionstore.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = new User({
        name: 'System Super Admin',
        email: adminEmail,
        password: 'Admin@123',
        phone: '+18005550199',
        role: 'super_admin',
        permissions: ['*'],
        status: 'active',
        isVerified: true,
      });
      await adminUser.save();
      console.log('✅ [Seed Admin] Default Super Admin account created: admin@fashionstore.com / Admin@123');
    } else {
      adminUser.password = 'Admin@123';
      adminUser.role = 'super_admin';
      adminUser.permissions = ['*'];
      adminUser.status = 'active';
      adminUser.isVerified = true;
      await adminUser.save();
      console.log('✅ [Seed Admin] Updated admin@fashionstore.com credentials & super_admin role.');
    }
  } catch (err) {
    console.error('⚠️ [Seed Admin] Failed to seed default admin and roles:', err.message);
  }
};
