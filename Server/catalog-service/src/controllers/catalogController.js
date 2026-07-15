import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

export const seedData = async (req, res) => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    
    // Categories matching the UI mockups
    const catJacket = await new Category({ name: 'Jacket', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', productCount: 15 }).save();
    const catShirt = await new Category({ name: 'Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', productCount: 20 }).save();
    const catPant = await new Category({ name: 'Pant', image: 'https://images.unsplash.com/photo-1584865288642-42078afe6942', productCount: 10 }).save();
    const catTShirt = await new Category({ name: 'T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', productCount: 25 }).save();
    const catDress = await new Category({ name: 'Dress', image: 'https://images.unsplash.com/photo-1515347619362-67343e808207', productCount: 12 }).save();

    const prods = [
      { 
        title: 'Brown Jacket', brand: "Female's Style", price: 83.97, originalPrice: 120.00, category: catJacket._id, 
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', 'https://images.unsplash.com/photo-1544441893-675973e31985'], 
        sizes: ['S','M','L','XL','XXL','XXXL'], colors: ['Brown'], isFeatured: true, rating: 4.9, reviewCount: 124,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' 
      },
      { 
        title: 'Yellow Shirt', brand: "Men's Wear", price: 120.00, originalPrice: 150.00, category: catShirt._id, 
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 'https://images.unsplash.com/photo-1603252109303-2751441dd157'], 
        sizes: ['M','L','XL'], colors: ['Yellow', 'White'], isFeatured: true, rating: 5.0, reviewCount: 89,
        description: 'Bright and stylish yellow shirt perfect for casual outings.' 
      },
      { 
        title: 'Brown Suite', brand: "Men's Tailored", price: 120.00, originalPrice: 180.00, category: catJacket._id, 
        images: ['https://images.unsplash.com/photo-1594938298596-eb5f1fd546fb', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf'], 
        sizes: ['S','M','L','XL'], colors: ['Brown', 'Black'], isFeatured: true, rating: 5.0, reviewCount: 45,
        description: 'Elegant brown suite tailored for professional and formal events.' 
      },
      { 
        title: 'Casual White Tee', brand: "Basics", price: 25.00, originalPrice: 35.00, category: catTShirt._id, 
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], 
        sizes: ['S','M','L','XL'], colors: ['White','Black'], isFeatured: false, rating: 4.5, reviewCount: 200,
        description: 'Comfortable and breathable casual white t-shirt.' 
      },
    ];
    await Product.insertMany(prods);
    res.json({ success: true, message: 'Database seeded successfully with new fashion images.' });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { q, categoryId, sort, limit = 20, isFeatured } = req.query;
    let filter = {};
    if (q) filter.title = new RegExp(q, 'i');
    if (categoryId) filter.category = categoryId;
    if (isFeatured) filter.isFeatured = isFeatured === 'true';

    let query = Product.find(filter).populate('category', 'name');
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    if (sort === 'price_desc') query = query.sort({ price: -1 });
    if (sort === 'newest') query = query.sort({ createdAt: -1 });

    const products = await query.limit(parseInt(limit));
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName = 'Anonymous' } = req.body;
    const userId = req.headers['x-user-id'] || 'anonymous';
    
    const review = new Review({ productId, userId, rating, text: comment, userName, comment });
    await review.save();

    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating, reviewCount: reviews.length });

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
