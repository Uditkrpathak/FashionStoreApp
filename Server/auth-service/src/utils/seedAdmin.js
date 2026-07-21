import User from '../models/User.js';

export const seedDefaultAdmin = async () => {
  try {
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
      // Ensure role is admin/super_admin
      if (adminUser.role === 'user') {
        adminUser.role = 'super_admin';
        adminUser.permissions = ['*'];
        adminUser.status = 'active';
        await adminUser.save();
        console.log('✅ [Seed Admin] Promoted admin@fashionstore.com to super_admin role.');
      } else {
        console.log('ℹ️ [Seed Admin] Admin account exists: admin@fashionstore.com');
      }
    }
  } catch (err) {
    console.error('⚠️ [Seed Admin] Failed to seed default admin:', err.message);
  }
};
