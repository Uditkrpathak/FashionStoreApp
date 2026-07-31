import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../order-service/.env') });

const ATLAS_URI = process.env.ORDER_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

async function resetAllData() {
  console.log('🚀 Starting Clean Slate Reset & Fresh Data Seeding on Cloud Database...');

  try {
    const getUri = (dbName) => {
      if (ATLAS_URI.includes('cluster0.6xhipcg.mongodb.net')) {
        return ATLAS_URI.replace(/\/fashion_[a-z]+|\/fashion_store|\/\?/, `/${dbName}?`);
      }
      return `${ATLAS_URI}/${dbName}`;
    };

    // 1. Reset Orders Database
    const ordersUri = getUri('fashion_orders');
    console.log(`Connecting to Orders DB: ${ordersUri.split('@')[1] || ordersUri}...`);
    const ordersConn = await mongoose.createConnection(ordersUri);
    const OrderModel = ordersConn.model('Order', new mongoose.Schema({}, { strict: false }));
    const TicketModel = ordersConn.model('Ticket', new mongoose.Schema({}, { strict: false }));
    
    const deletedOrders = await OrderModel.deleteMany({});
    const deletedTickets = await TicketModel.deleteMany({});
    console.log(`✅ Cleared Orders DB: Deleted ${deletedOrders.deletedCount} orders & ${deletedTickets.deletedCount} tickets.`);
    await ordersConn.close();

    // 2. Reset Cart Database
    const cartUri = getUri('fashion_cart');
    const cartConn = await mongoose.createConnection(cartUri);
    const CartModel = cartConn.model('Cart', new mongoose.Schema({}, { strict: false }));
    const deletedCarts = await CartModel.deleteMany({});
    console.log(`✅ Cleared Cart DB: Deleted ${deletedCarts.deletedCount} active carts.`);
    await cartConn.close();

    // 3. Reset Auth Audit Logs & Sessions (Preserving Super Admin User)
    const authUri = getUri('fashion_auth');
    const authConn = await mongoose.createConnection(authUri);
    const SessionModel = authConn.model('Session', new mongoose.Schema({}, { strict: false }));
    const AuditLogModel = authConn.model('AuditLog', new mongoose.Schema({}, { strict: false }));
    const deletedSessions = await SessionModel.deleteMany({});
    const deletedLogs = await AuditLogModel.deleteMany({});
    console.log(`✅ Cleared Auth DB: Deleted ${deletedSessions.deletedCount} sessions & ${deletedLogs.deletedCount} audit logs.`);
    await authConn.close();

    // 4. Reset & Seed Catalog Database
    const catalogUri = getUri('fashion_catalog');
    const catalogConn = await mongoose.createConnection(catalogUri);
    const CategoryModel = catalogConn.model('Category', new mongoose.Schema({
      name: String,
      image: String,
      productCount: { type: Number, default: 0 }
    }));
    const ProductModel = catalogConn.model('Product', new mongoose.Schema({
      title: String,
      sku: String,
      brand: String,
      price: Number,
      originalPrice: Number,
      category: mongoose.Schema.Types.ObjectId,
      images: [String],
      sizes: [String],
      colors: [String],
      isFeatured: Boolean,
      rating: Number,
      reviewsCount: Number,
      description: String,
      gender: String
    }, { timestamps: true }));

    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    console.log(`✅ Cleared Catalog DB: Deleted old products and categories.`);

    // Initialize Categories
    const catJacket = await CategoryModel.create({ name: 'Jacket', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', productCount: 0 });
    const catShirt = await CategoryModel.create({ name: 'Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', productCount: 0 });
    const catTShirt = await CategoryModel.create({ name: 'T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', productCount: 0 });
    const catDress = await CategoryModel.create({ name: 'Dress', image: 'https://images.unsplash.com/photo-1515347619362-67343e808207', productCount: 0 });
    const catJeans = await CategoryModel.create({ name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d', productCount: 0 });
    const catShoes = await CategoryModel.create({ name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', productCount: 0 });
    const catBlazer = await CategoryModel.create({ name: 'Blazer', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf', productCount: 0 });
    const catTrousers = await CategoryModel.create({ name: 'Trousers', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80', productCount: 0 });

    const freshProducts = [
      // Jackets
      { title: 'Brown Leather Biker Jacket', sku: 'PRD-882191', brand: 'Zara', price: 120.00, originalPrice: 160.00, category: catJacket._id, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Brown'], isFeatured: true, rating: 4.9, reviewsCount: 124, description: 'Premium brown leather jacket tailored for a sleek modern look.', gender: 'Men' },
      { title: 'Classic Black Denim Jacket', sku: 'PRD-772102', brand: 'Puma', price: 85.00, originalPrice: 110.00, category: catJacket._id, images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0'], sizes: ['M', 'L', 'XL'], colors: ['Black'], isFeatured: true, rating: 4.6, reviewsCount: 88, description: 'Durable black denim jacket with reinforced stitching.', gender: 'Men' },
      { title: 'Nike Waterproof Windbreaker', sku: 'PRD-663114', brand: 'Nike', price: 95.00, originalPrice: 130.00, category: catJacket._id, images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'], sizes: ['S', 'M', 'L'], colors: ['White', 'Blue'], isFeatured: true, rating: 4.8, reviewsCount: 142, description: 'Lightweight weather-resistant windbreaker with zip hood.', gender: 'Unisex' },

      // Shirts
      { title: 'Crisp Cotton White Oxford Shirt', sku: 'PRD-551092', brand: 'Zara', price: 55.00, originalPrice: 75.00, category: catShirt._id, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c'], sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], isFeatured: true, rating: 4.7, reviewsCount: 195, description: '100% organic cotton oxford shirt for formal and business casual wear.', gender: 'Men' },
      { title: 'Blue Slim Fit Formal Shirt', sku: 'PRD-441992', brand: 'H&M', price: 48.00, originalPrice: 65.00, category: catShirt._id, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf'], sizes: ['S', 'M', 'L'], colors: ['Blue'], isFeatured: false, rating: 4.5, reviewsCount: 82, description: 'Tailored slim-fit dress shirt with sharp collar collar.', gender: 'Men' },

      // T-Shirts
      { title: 'Essential White Crewneck Tee', sku: 'PRD-331001', brand: 'Nike', price: 28.00, originalPrice: 35.00, category: catTShirt._id, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], isFeatured: true, rating: 4.8, reviewsCount: 310, description: 'Ultra-soft ring-spun cotton everyday crewneck t-shirt.', gender: 'Unisex' },
      { title: 'Streetwear Oversized Black Graphic Tee', sku: 'PRD-221088', brand: 'Puma', price: 38.00, originalPrice: 50.00, category: catTShirt._id, images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], sizes: ['M', 'L', 'XL'], colors: ['Black'], isFeatured: true, rating: 4.6, reviewsCount: 120, description: '240 GSM heavy cotton oversized drop-shoulder graphic tee.', gender: 'Unisex' },

      // Dresses
      { title: 'Elegant Floral Summer Maxi Dress', sku: 'PRD-110022', brand: 'Zara', price: 95.00, originalPrice: 130.00, category: catDress._id, images: ['https://images.unsplash.com/photo-1515347619362-67343e808207'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Yellow', 'Floral'], isFeatured: true, rating: 4.9, reviewsCount: 240, description: 'Flowy floral chiffon maxi dress with high side slit.', gender: 'Women' },
      { title: 'Timeless Little Black Cocktail Dress', sku: 'PRD-110033', brand: 'Mango', price: 110.00, originalPrice: 150.00, category: catDress._id, images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956'], sizes: ['XS', 'S', 'M'], colors: ['Black'], isFeatured: true, rating: 4.9, reviewsCount: 185, description: 'Sophisticated bodycon little black evening dress.', gender: 'Women' },

      // Jeans & Pants
      { title: 'Levis 501 Original Straight Jeans', sku: 'PRD-998811', brand: 'Levis', price: 90.00, originalPrice: 120.00, category: catJeans._id, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], sizes: ['30', '32', '34', '36'], colors: ['Blue'], isFeatured: true, rating: 4.9, reviewsCount: 420, description: 'Iconic straight leg denim jeans in medium blue wash.', gender: 'Men' },
      { title: 'Tailored Slim Fit Chino Trousers', sku: 'PRD-998822', brand: 'Zara', price: 65.00, originalPrice: 85.00, category: catTrousers._id, images: ['https://images.unsplash.com/photo-1584865288642-42078afe6942'], sizes: ['30', '32', '34'], colors: ['Khaki', 'Navy'], isFeatured: false, rating: 4.7, reviewsCount: 115, description: 'Stretch cotton tailored slim-fit chinos.', gender: 'Men' }
    ];

    await ProductModel.insertMany(freshProducts);

    // Update category product counts
    const cats = [catJacket, catShirt, catTShirt, catDress, catJeans, catShoes, catBlazer, catTrousers];
    for (const c of cats) {
      const count = await ProductModel.countDocuments({ category: c._id });
      await CategoryModel.findByIdAndUpdate(c._id, { productCount: count });
    }

    console.log(`✅ Catalog DB Re-seeded: Created 8 clean categories & ${freshProducts.length} fresh products.`);
    await catalogConn.close();

    console.log('🎉 ALL PREVIOUS DATA REMOVED CLEANLY! SYSTEM READY FOR FRESH DEMO / TESTING.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

resetAllData();
