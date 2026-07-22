import User from '../models/User.js';
import Setting from '../models/Setting.js';

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
      adminUser.password = 'Admin@123';
      adminUser.role = 'super_admin';
      adminUser.permissions = ['*'];
      adminUser.status = 'active';
      adminUser.isVerified = true;
      await adminUser.save();
      console.log('✅ [Seed Admin] Updated admin@fashionstore.com credentials & super_admin role.');
    }

    // Seed default settings
    const defaultSettings = [
      { key: 'store_name', value: 'FashionStore' },
      { key: 'support_email', value: 'support@fashionstore.com' },
      { key: 'support_phone', value: '+91 1800 123 456' },
      { key: 'cod_enabled', value: 'true' },
      { key: 'free_shipping_limit', value: '999' }
    ];

    for (const s of defaultSettings) {
      const exists = await Setting.findOne({ key: s.key });
      if (!exists) {
        await Setting.create(s);
        console.log(`✅ [Seed Settings] Seeded default setting: ${s.key} = ${s.value}`);
      }
    }
  } catch (err) {
    console.error('⚠️ [Seed Admin] Failed to seed default admin:', err.message);
  }
};
