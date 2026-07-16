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
        title: 'Brown Leather Jacket', brand: "Zara", price: 83.97, originalPrice: 120.00, category: catJacket._id, 
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'], 
        sizes: ['S','M','L','XL'], colors: ['Brown'], isFeatured: true, rating: 4.9, reviewCount: 124,
        description: 'Premium brown leather jacket tailored for a sleek, modern look.' 
      },
      { 
        title: 'Yellow Casual Shirt', brand: "H&M", price: 35.00, originalPrice: 45.00, category: catShirt._id, 
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 'https://images.unsplash.com/photo-1603252109303-2751441dd157'], 
        sizes: ['M','L','XL'], colors: ['Yellow', 'White'], isFeatured: true, rating: 4.8, reviewCount: 89,
        description: 'Bright and stylish yellow shirt perfect for casual outings.' 
      },
      { 
        title: 'Earthy Brown Suit', brand: "Zara", price: 120.00, originalPrice: 180.00, category: catJacket._id, 
        images: ['https://images.unsplash.com/photo-1594938298596-eb5f1fd546fb', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf'], 
        sizes: ['S','M','L','XL'], colors: ['Brown', 'Black'], isFeatured: true, rating: 4.7, reviewCount: 45,
        description: 'Elegant brown suite tailored for professional and formal events.' 
      },
      { 
        title: 'Casual White Tee', brand: "Nike", price: 25.00, originalPrice: 35.00, category: catTShirt._id, 
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], 
        sizes: ['S','M','L','XL'], colors: ['White','Black'], isFeatured: false, rating: 4.5, reviewCount: 200,
        description: 'Comfortable and breathable casual white t-shirt.' 
      },
      { 
        title: 'Black Denim Jacket', brand: "Puma", price: 65.00, originalPrice: 85.00, category: catJacket._id, 
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0'], 
        sizes: ['M','L','XL','XXL'], colors: ['Black'], isFeatured: false, rating: 4.4, reviewCount: 64,
        description: 'Classic fit black denim jacket with high durability and standard design.' 
      },
      { 
        title: 'Striped Dress Shirt', brand: "Fila", price: 42.00, originalPrice: 60.00, category: catShirt._id, 
        images: ['https://images.unsplash.com/photo-1620012253295-c05518e993be'], 
        sizes: ['S','M','L'], colors: ['Blue', 'White'], isFeatured: true, rating: 4.3, reviewCount: 31,
        description: 'Fine cotton striped dress shirt for corporate and formal wear.' 
      },
      { 
        title: 'Classic Blue Jeans', brand: "Adidas", price: 55.00, originalPrice: 75.00, category: catPant._id, 
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], 
        sizes: ['30','32','34','36'], colors: ['Blue'], isFeatured: true, rating: 4.6, reviewCount: 154,
        description: 'Standard straight-fit blue denim jeans with a heavy vintage wash.' 
      },
      { 
        title: 'Active Tech Joggers', brand: "Nike", price: 48.00, originalPrice: 60.00, category: catPant._id, 
        images: ['https://images.unsplash.com/photo-1517462964-21fdcec3f25b'], 
        sizes: ['S','M','L','XL'], colors: ['Gray', 'Black'], isFeatured: true, rating: 4.8, reviewCount: 198,
        description: 'Slim fit tech fleece joggers with zip pockets and breathable panels.' 
      },
      { 
        title: 'Graphic Print Tee', brand: "Adidas", price: 28.00, originalPrice: 38.00, category: catTShirt._id, 
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], 
        sizes: ['M','L','XL'], colors: ['Black', 'Red'], isFeatured: false, rating: 4.2, reviewCount: 77,
        description: 'Streetwear graphic tee made from lightweight ring-spun cotton.' 
      },
      { 
        title: 'Red Cocktail Dress', brand: "Gucci", price: 189.99, originalPrice: 280.00, category: catDress._id, 
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8'], 
        sizes: ['XS','S','M','L'], colors: ['Red'], isFeatured: true, rating: 4.9, reviewCount: 110,
        description: 'Stunning red cocktail gown with elegant drapery for special dinners.' 
      },
      { 
        title: 'Summer Floral Maxi', brand: "Zara", price: 58.00, originalPrice: 85.00, category: catDress._id, 
        images: ['https://images.unsplash.com/photo-1515347619362-67343e808207'], 
        sizes: ['S','M','L'], colors: ['White', 'Pink'], isFeatured: true, rating: 4.7, reviewCount: 88,
        description: 'Breathable and flowy floral maxi dress, perfect for garden parties.' 
      },
      { 
        title: 'Urban Cargo Pants', brand: "Reebok", price: 49.99, originalPrice: 70.00, category: catPant._id, 
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], 
        sizes: ['30','32','34'], colors: ['Beige', 'Olive'], isFeatured: false, rating: 4.4, reviewCount: 42,
        description: 'Multi-pocket cargo trousers engineered for rugged everyday use.' 
      },
      { 
        title: 'Premium V-Neck Tee', brand: "Puma", price: 32.00, originalPrice: 45.00, category: catTShirt._id, 
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], 
        sizes: ['S','M','L','XL'], colors: ['Black', 'Blue'], isFeatured: false, rating: 4.5, reviewCount: 92,
        description: 'Super-soft combed cotton V-neck t-shirt designed for all-day comfort.' 
      },
      { 
        title: 'Cozy Knit Cardigan', brand: "Fila", price: 78.00, originalPrice: 110.00, category: catJacket._id, 
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985'], 
        sizes: ['M','L','XL'], colors: ['Gray'], isFeatured: false, rating: 4.6, reviewCount: 56,
        description: 'Thick, premium knit cardigan with horn buttons to stay warm and fashionable.' 
      },
      { 
        title: 'Silk Evening Gown', brand: "Reebok", price: 210.00, originalPrice: 300.00, category: catDress._id, 
        images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c'], 
        sizes: ['S','M','L'], colors: ['Blue', 'Purple'], isFeatured: true, rating: 5.0, reviewCount: 15,
        description: 'Luxurious heavy silk formal evening gown with open back detail.' 
      }
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
    const { q, categoryId, sort, limit = 20, isFeatured, brand, rating, priceMin, priceMax } = req.query;
    let filter = {};
    if (q) filter.title = new RegExp(q, 'i');
    if (categoryId) filter.category = categoryId;
    if (isFeatured) filter.isFeatured = isFeatured === 'true';

    // Filter by brand
    if (brand && brand !== 'All') {
      filter.brand = new RegExp(`^${brand}$`, 'i');
    }

    // Filter by rating (greater than or equal to)
    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    // Filter by price range
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }

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
