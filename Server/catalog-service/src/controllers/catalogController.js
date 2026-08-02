import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

export const seedData = async (req, res, next) => {
  try {
    // Clear existing data to avoid duplication conflicts
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    // 1. Initialize Categories with baseline placeholder images
    const catJacket = await new Category({ name: 'Jacket', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', productCount: 0 }).save();
    const catShirt = await new Category({ name: 'Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', productCount: 0 }).save();
    const catTShirt = await new Category({ name: 'T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', productCount: 0 }).save();
    const catDress = await new Category({ name: 'Dress', image: 'https://images.unsplash.com/photo-1515347619362-67343e808207', productCount: 0 }).save();
    const catJeans = await new Category({ name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d', productCount: 0 }).save();
    const catShoes = await new Category({ name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', productCount: 0 }).save();
    const catBlazer = await new Category({ name: 'Blazer', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf', productCount: 0 }).save();
    const catTrousers = await new Category({ name: 'Trousers', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80', productCount: 0 }).save();

    const prods = [
      // ==========================================
      // === JACKETS (Men & Women) ===
      // ==========================================
      {
        title: 'Brown Leather Jacket', brand: "Zara", price: 83.97, originalPrice: 120.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Brown'], isFeatured: true, rating: 4.9, reviewsCount: 124, description: 'Premium brown leather jacket tailored for a sleek, modern look.', gender: 'Men'
      },
      {
        title: 'Black Denim Jacket', brand: "Puma", price: 65.00, originalPrice: 85.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0'], sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Black'], isFeatured: false, rating: 4.4, reviewsCount: 64, description: 'Classic fit black denim jacket with high durability.', gender: 'Men'
      },
      {
        title: 'Nike Windbreaker', brand: "Nike", price: 95.00, originalPrice: 130.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'], sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Blue'], isFeatured: true, rating: 4.8, reviewsCount: 142, description: 'Lightweight Nike windbreaker with hood.', gender: 'Men'
      },
      {
        title: 'Reebok Winter Parka', brand: "Reebok", price: 145.00, originalPrice: 200.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27'], sizes: ['M', 'L', 'XL'], colors: ['Navy'], isFeatured: true, rating: 4.3, reviewsCount: 35, description: 'Heavy duty insulated winter parka.', gender: 'Men'
      },
      {
        title: 'Puma Fleece Hoodie', brand: "Puma", price: 55.00, originalPrice: 75.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7'], sizes: ['M', 'L', 'XL'], colors: ['Grey', 'Black'], isFeatured: false, rating: 4.1, reviewsCount: 78, description: 'Warm fleece hoodie from Puma.', gender: 'Men'
      },
      {
        title: 'Cozy Knit Cardigan', brand: "H&M", price: 78.00, originalPrice: 110.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985'], sizes: ['S', 'M', 'L'], colors: ['Gray'], isFeatured: false, rating: 4.6, reviewsCount: 56, description: 'Thick premium knit cardigan.', gender: 'Women'
      },
      {
        title: 'Adidas Track Jacket', brand: "Adidas", price: 80.00, originalPrice: 110.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b'], sizes: ['S', 'M', 'L'], colors: ['Black', 'White'], isFeatured: true, rating: 4.5, reviewsCount: 96, description: 'Classic Adidas three-stripe track jacket.', gender: 'Women'
      },
      {
        title: 'Fila Puffer Coat', brand: "Fila", price: 110.00, originalPrice: 150.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'], sizes: ['S', 'M', 'L'], colors: ['Red', 'Black'], isFeatured: false, rating: 4.0, reviewsCount: 52, description: 'Bright red puffer coat from Fila.', gender: 'Women'
      },
      {
        title: 'Zara Trench Coat', brand: "Zara", price: 135.00, originalPrice: 190.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Beige'], isFeatured: true, rating: 4.6, reviewsCount: 68, description: 'Double breasted waterproof trench coat.', gender: 'Women'
      },
      {
        title: 'Nike Dri-FIT Sports Jacket', brand: "Nike", price: 85.00, originalPrice: 120.00, category: catJacket._id,
        images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'], sizes: ['S', 'M', 'L'], colors: ['Pink'], isFeatured: true, rating: 4.7, reviewsCount: 88, description: 'Full-zip structural warm up jacket.', gender: 'Women'
      },

      // ==========================================
      // === SHIRTS (Men & Women) ===
      // ==========================================
      {
        title: 'Yellow Casual Shirt', brand: "H&M", price: 35.00, originalPrice: 45.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c'], sizes: ['M', 'L', 'XL'], colors: ['Yellow'], isFeatured: true, rating: 4.8, reviewsCount: 89, description: 'Bright and stylish casual shirt.', gender: 'Men'
      },
      {
        title: 'Striped Dress Shirt', brand: "Zara", price: 42.00, originalPrice: 60.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1620012253295-c05518e993be'], sizes: ['S', 'M', 'L'], colors: ['Blue', 'White'], isFeatured: true, rating: 4.3, reviewsCount: 31, description: 'Fine cotton striped shirt.', gender: 'Men'
      },
      {
        title: 'Nike Dri-FIT Polo', brand: "Nike", price: 45.00, originalPrice: 60.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908'], sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], isFeatured: true, rating: 4.6, reviewsCount: 110, description: 'Athletic fit sweat-wicking polo shirt.', gender: 'Men'
      },
      {
        title: 'Adidas Polo Shirt', brand: "Adidas", price: 38.00, originalPrice: 50.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820'], sizes: ['M', 'L', 'XL'], colors: ['Black'], isFeatured: false, rating: 4.2, reviewsCount: 65, description: 'Breathable training polo.', gender: 'Men'
      },
      {
        title: 'Zara Denim Shirt', brand: "Zara", price: 59.00, originalPrice: 85.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1516257984-b1b4d707412e'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Light Blue'], isFeatured: true, rating: 4.5, reviewsCount: 77, description: 'Soft washed cotton denim shirt.', gender: 'Men'
      },
      {
        title: 'Oversized Satin Shirt', brand: "Zara", price: 49.00, originalPrice: 70.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Emerald', 'White'], isFeatured: true, rating: 4.7, reviewsCount: 54, description: 'Smooth satin button-down shirt with drape.', gender: 'Women'
      },
      {
        title: 'Linen Summer Blouse', brand: "H&M", price: 32.00, originalPrice: 45.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157'], sizes: ['S', 'M', 'L'], colors: ['Beige', 'White'], isFeatured: false, rating: 4.4, reviewsCount: 41, description: 'Pure organic lightweight linen.', gender: 'Women'
      },
      {
        title: 'Plaid Flannel Shirt', brand: "Fila", price: 38.00, originalPrice: 55.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Black'], isFeatured: false, rating: 4.1, reviewsCount: 23, description: 'Cozy flannel check utility shirt.', gender: 'Women'
      },
      {
        title: 'Floral Silk Shirt', brand: "Gucci", price: 140.00, originalPrice: 210.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c'], sizes: ['S', 'M', 'L'], colors: ['Floral'], isFeatured: true, rating: 4.9, reviewsCount: 19, description: 'Luxurious silk shirt with floral arrangement prints.', gender: 'Women'
      },
      {
        title: 'Puma Boyfriend Utility Shirt', brand: "Puma", price: 45.00, originalPrice: 65.00, category: catShirt._id,
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10'], sizes: ['S', 'M', 'L'], colors: ['Olive'], isFeatured: false, rating: 4.0, reviewsCount: 30, description: 'Relaxed loose fit boyfriend utility blouse.', gender: 'Women'
      },

      // ==========================================
      // === T-SHIRTS (Men & Women) ===
      // ==========================================
      {
        title: 'Casual White Tee', brand: "Nike", price: 25.00, originalPrice: 35.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], sizes: ['S', 'M', 'L', 'XL'], colors: ['White'], isFeatured: false, rating: 4.5, reviewsCount: 200, description: 'Comfortable premium everyday cotton white tee.', gender: 'Men'
      },
      {
        title: 'Graphic Print Streetwear Tee', brand: "Adidas", price: 28.00, originalPrice: 38.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], sizes: ['M', 'L', 'XL'], colors: ['Black'], isFeatured: false, rating: 4.2, reviewsCount: 77, description: 'Graphic tee made from heavy ring-spun cotton.', gender: 'Men'
      },
      {
        title: 'Nike Swoosh Sports Tee', brand: "Nike", price: 30.00, originalPrice: 40.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Black'], isFeatured: true, rating: 4.7, reviewsCount: 160, description: 'Classic performance activewear swoosh tee.', gender: 'Men'
      },
      {
        title: 'Adidas Originals Trefoil Tee', brand: "Adidas", price: 32.00, originalPrice: 45.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue'], isFeatured: true, rating: 4.4, reviewsCount: 112, description: 'Vintage look legacy trefoil graphic tee.', gender: 'Men'
      },
      {
        title: 'Puma Performance Gym Tee', brand: "Puma", price: 28.00, originalPrice: 40.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Green'], isFeatured: false, rating: 4.3, reviewsCount: 71, description: 'Lightweight workout top with rapid moisture wicking.', gender: 'Men'
      },
      {
        title: 'Women Cropped Ribbed Tee', brand: "H&M", price: 18.00, originalPrice: 25.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], sizes: ['XS', 'S', 'M', 'L'], colors: ['White', 'Black'], isFeatured: false, rating: 4.3, reviewsCount: 94, description: 'Stretch cotton cropped knit baby tee.', gender: 'Women'
      },
      {
        title: 'Puma Elevated V-Neck', brand: "Puma", price: 24.00, originalPrice: 35.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], sizes: ['S', 'M', 'L'], colors: ['Grey'], isFeatured: false, rating: 4.1, reviewsCount: 38, description: 'Tailored fit V-neck organic cotton tee.', gender: 'Women'
      },
      {
        title: 'Zara Oversized Mineral Tee', brand: "Zara", price: 32.00, originalPrice: 45.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], sizes: ['S', 'M', 'L'], colors: ['Charcoal'], isFeatured: true, rating: 4.6, reviewsCount: 57, description: 'Acid wash relaxed aesthetic tee.', gender: 'Women'
      },
      {
        title: 'Fila Retro Linear Tee', brand: "Fila", price: 26.00, originalPrice: 35.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], sizes: ['S', 'M', 'L'], colors: ['Navy'], isFeatured: false, rating: 3.9, reviewsCount: 42, description: 'Classic heritage linear split logo tee.', gender: 'Women'
      },
      {
        title: 'Adidas Running Aero Tee', brand: "Adidas", price: 35.00, originalPrice: 50.00, category: catTShirt._id,
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Pink'], isFeatured: true, rating: 4.5, reviewsCount: 61, description: 'Breathable engineered running top.', gender: 'Women'
      },

      // ==========================================
      // === DRESSES (Women) ===
      // ==========================================
      {
        title: 'Red Cocktail Dress', brand: "Gucci", price: 189.99, originalPrice: 280.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Red'], isFeatured: true, rating: 4.9, reviewsCount: 110, description: 'Stunning red formal evening gown dress.', gender: 'Women'
      },
      {
        title: 'Summer Floral Maxi', brand: "Zara", price: 58.00, originalPrice: 85.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1515347619362-67343e808207'], sizes: ['S', 'M', 'L'], colors: ['Pink', 'White'], isFeatured: true, rating: 4.7, reviewsCount: 88, description: 'Breathable lightweight flowy summer dress.', gender: 'Women'
      },
      {
        title: 'Nike Performance Tennis Dress', brand: "Nike", price: 75.00, originalPrice: 105.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc'], sizes: ['XS', 'S', 'M', 'L'], colors: ['White'], isFeatured: true, rating: 4.6, reviewsCount: 82, description: 'Athletic fit tennis set with inner shorts layers.', gender: 'Women'
      },
      {
        title: 'Adidas Streetwear Midi Dress', brand: "Adidas", price: 65.00, originalPrice: 90.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1506152983158-b4a74a01c721'], sizes: ['S', 'M', 'L'], colors: ['Black'], isFeatured: false, rating: 4.3, reviewsCount: 64, description: 'Sporty active three-stripes knit bodycon midi.', gender: 'Women'
      },
      {
        title: 'Zara Ribbed Midi Knit', brand: "Zara", price: 79.00, originalPrice: 110.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1515347619362-67343e808207'], sizes: ['S', 'M', 'L'], colors: ['Rust', 'Beige'], isFeatured: true, rating: 4.5, reviewsCount: 51, description: 'Premium texture soft knit structured midi dress.', gender: 'Women'
      },
      {
        title: 'H&M Wrap Casual Dress', brand: "H&M", price: 39.99, originalPrice: 55.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy Floral'], isFeatured: false, rating: 4.0, reviewsCount: 43, description: 'Effortless classic dynamic wrap fastening dress.', gender: 'Women'
      },
      {
        title: 'Silk Luxury Evening Gown', brand: "Gucci", price: 299.00, originalPrice: 450.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c'], sizes: ['S', 'M', 'L'], colors: ['Emerald'], isFeatured: true, rating: 5.0, reviewsCount: 24, description: '100% fine mulberry open back evening gown.', gender: 'Women'
      },
      {
        title: 'Puma Oversized Tee Dress', brand: "Puma", price: 42.00, originalPrice: 60.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'], sizes: ['S', 'M', 'L'], colors: ['Grey'], isFeatured: false, rating: 4.1, reviewsCount: 29, description: 'Sporty casual ultra comfortable daily t-shirt dress.', gender: 'Women'
      },
      {
        title: 'Fila Pleated Retro Dress', brand: "Fila", price: 55.00, originalPrice: 75.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c'], sizes: ['XS', 'S', 'M'], colors: ['Navy'], isFeatured: false, rating: 3.8, reviewsCount: 18, description: 'Heritage styling track panel pleated white lined dress.', gender: 'Women'
      },
      {
        title: 'Linen Vacation Sundress', brand: "H&M", price: 45.00, originalPrice: 65.00, category: catDress._id,
        images: ['https://images.unsplash.com/photo-1515347619362-67343e808207'], sizes: ['S', 'M', 'L'], colors: ['White'], isFeatured: false, rating: 4.2, reviewsCount: 35, description: 'Adjustable strap structured breezy linen sundress.', gender: 'Women'
      },

      // ==========================================
      // === JEANS (Men & Women) ===
      // ==========================================
      {
        title: 'Classic Straight Fit Jeans', brand: "Levi's", price: 59.99, originalPrice: 80.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], sizes: ['30', '32', '34', '36'], colors: ['Blue'], isFeatured: true, rating: 4.7, reviewsCount: 320, description: 'Timeless straight leg rugged vintage denim jeans.', gender: 'Men'
      },
      {
        title: 'Slim Fit Dark Wash Jeans', brand: "Zara", price: 65.00, originalPrice: 90.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246'], sizes: ['30', '32', '34', '36'], colors: ['Dark Blue'], isFeatured: false, rating: 4.4, reviewsCount: 142, description: 'Polished stretch dark indigo tailored slim jeans.', gender: 'Men'
      },
      {
        title: 'Black Distressed Skinny Jeans', brand: "H&M", price: 49.99, originalPrice: 70.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], sizes: ['30', '32', '34'], colors: ['Black'], isFeatured: false, rating: 4.1, reviewsCount: 98, description: 'Modern tapered skinny jeans featuring shredded knee details.', gender: 'Men'
      },
      {
        title: 'Relaxed Tapered Indigo Jeans', brand: "Puma", price: 70.00, originalPrice: 100.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], sizes: ['32', '34', '36'], colors: ['Medium Wash'], isFeatured: true, rating: 4.5, reviewsCount: 63, description: 'Thick raw-feel cotton loose ergonomic utility denim.', gender: 'Men'
      },
      {
        title: 'Athletic Fit Flexible Jeans', brand: "Adidas", price: 75.00, originalPrice: 110.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246'], sizes: ['30', '32', '34', '36'], colors: ['Light Blue'], isFeatured: false, rating: 4.6, reviewsCount: 81, description: 'Engineered multi-flex denim built for mobility.', gender: 'Men'
      },
      {
        title: 'High-Waist Mom Jeans', brand: "Zara", price: 55.00, originalPrice: 75.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], sizes: ['26', '28', '30', '32'], colors: ['Light Blue'], isFeatured: true, rating: 4.6, reviewsCount: 210, description: 'Vintage high-rise relaxed aesthetic mom jeans.', gender: 'Women'
      },
      {
        title: 'Premium Wide Leg Denim', brand: "Zara", price: 69.99, originalPrice: 95.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246'], sizes: ['26', '28', '30'], colors: ['Deep Indigo'], isFeatured: true, rating: 4.8, reviewsCount: 115, description: 'Full length tailored wide profile modern jeans.', gender: 'Women'
      },
      {
        title: 'Super Skinny Shaping Jeans', brand: "H&M", price: 39.99, originalPrice: 55.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], sizes: ['26', '28', '30', '32'], colors: ['Black'], isFeatured: false, rating: 4.3, reviewsCount: 189, description: 'Hyper-stretch premium shaping technology denim panels.', gender: 'Women'
      },
      {
        title: 'Fila High-Rise Dynamic Flare', brand: "Fila", price: 60.00, originalPrice: 85.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246'], sizes: ['28', '30', '32'], colors: ['Blue'], isFeatured: false, rating: 4.2, reviewsCount: 47, description: '70s retro style flare silhouette denim structural lines.', gender: 'Women'
      },
      {
        title: 'Cropped Straight Ankle Jeans', brand: "Levi's", price: 65.00, originalPrice: 90.00, category: catJeans._id,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], sizes: ['26', '28', '30', '32'], colors: ['Medium Wash'], isFeatured: false, rating: 4.5, reviewsCount: 134, description: 'Perfect structural crop cut straight casual denim.', gender: 'Women'
      },

      // ==========================================
      // === SHOES (Men & Women) ===
      // ==========================================
      {
        title: 'Nike Air Max Neo Sport', brand: "Nike", price: 130.00, originalPrice: 170.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['8', '9', '10', '11'], colors: ['Red', 'Black'], isFeatured: true, rating: 4.9, reviewsCount: 540, description: 'Ultimate air cushioning active runner shoes.', gender: 'Men'
      },
      {
        title: 'Adidas Ultraboost Pro', brand: "Adidas", price: 180.00, originalPrice: 180.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['8', '9', '10', '11'], colors: ['White', 'Black'], isFeatured: true, rating: 4.8, reviewsCount: 412, description: 'High responsive rebound running sneakers.', gender: 'Men'
      },
      {
        title: 'Puma Classic Suede Icon', brand: "Puma", price: 75.00, originalPrice: 95.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['8', '9', '10', '11'], colors: ['Black', 'Navy'], isFeatured: false, rating: 4.5, reviewsCount: 230, description: 'Timeless lifestyle low top suede trainers.', gender: 'Men'
      },
      {
        title: 'Leather Dress Oxford Shoes', brand: "Zara", price: 110.00, originalPrice: 160.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['9', '10', '11'], colors: ['Tan', 'Black'], isFeatured: true, rating: 4.6, reviewsCount: 88, description: 'Full grain leather handcrafted dress shoes.', gender: 'Men'
      },
      {
        title: 'Reebok Workout Clean Sneaker', brand: "Reebok", price: 80.00, originalPrice: 110.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['8', '9', '10'], colors: ['White'], isFeatured: false, rating: 4.3, reviewsCount: 114, description: 'Minimalist retro cross training soft court shoes.', gender: 'Men'
      },
      {
        title: 'Nike Air Zoom Pegasus Women', brand: "Nike", price: 120.00, originalPrice: 150.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['6', '7', '8', '9'], colors: ['Pink', 'Grey'], isFeatured: true, rating: 4.8, reviewsCount: 295, description: 'Premium marathon level speed cushioning running shoes.', gender: 'Women'
      },
      {
        title: 'Adidas Cloudfoam Walkers', brand: "Adidas", price: 70.00, originalPrice: 90.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['6', '7', '8', '9'], colors: ['Black'], isFeatured: false, rating: 4.4, reviewsCount: 167, description: 'Ultra light mesh step-in walking athletic shoes.', gender: 'Women'
      },
      {
        title: 'Zara Square Toe Leather Heeled Boots', brand: "Zara", price: 125.00, originalPrice: 180.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['6', '7', '8'], colors: ['Burgundy', 'Black'], isFeatured: true, rating: 4.7, reviewsCount: 52, description: 'Sleek premium real leather statement blocks ankle boots.', gender: 'Women'
      },
      {
        title: 'Puma Cali Pastel Sneakers', brand: "Puma", price: 85.00, originalPrice: 110.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['6', '7', '8', '9'], colors: ['White Pastel'], isFeatured: false, rating: 4.5, reviewsCount: 103, description: 'West coast casual chunky platform lifestyle profile sneakers.', gender: 'Women'
      },
      {
        title: 'Fila Disruptor Chunky Trax', brand: "Fila", price: 90.00, originalPrice: 120.00, category: catShoes._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], sizes: ['7', '8', '9'], colors: ['White'], isFeatured: false, rating: 4.2, reviewsCount: 145, description: 'Iconic chunky serrated sole heavy profile trainers.', gender: 'Women'
      },

      // ==========================================
      // === BLAZERS (Men & Women) ===
      // ==========================================
      {
        title: 'Earthy Slim Fit Suit Blazer', brand: "Zara", price: 120.00, originalPrice: 180.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Brown'], isFeatured: true, rating: 4.7, reviewsCount: 45, description: 'Elegant brown tailored blazer jacket for formal events.', gender: 'Men'
      },
      {
        title: 'Classic Black Tuxedo Blazer', brand: "Zara", price: 145.00, originalPrice: 210.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['M', 'L', 'XL'], colors: ['Black'], isFeatured: true, rating: 4.9, reviewsCount: 61, description: 'Satin lapel sophisticated formal evening dinner blazer jacket.', gender: 'Men'
      },
      {
        title: 'Navy Casual Linen Blazer', brand: "H&M", price: 85.00, originalPrice: 120.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy'], isFeatured: false, rating: 4.2, reviewsCount: 39, description: 'Unstructured regular fit cool lightweight linen layer.', gender: 'Men'
      },
      {
        title: 'Grey Tweed Wool Blazer', brand: "Fila", price: 130.00, originalPrice: 185.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['M', 'L', 'XL'], colors: ['Grey Microcheck'], isFeatured: false, rating: 4.4, reviewsCount: 28, description: 'Heavy structural smart casual winter companion wool blazer.', gender: 'Men'
      },
      {
        title: 'Oversized Corporate Blazer', brand: "Zara", price: 95.00, originalPrice: 140.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Beige'], isFeatured: true, rating: 4.6, reviewsCount: 89, description: 'Relaxed structure double breasted longline tailoring blazer.', gender: 'Women'
      },
      {
        title: 'Pink Pastel Fashion Blazer', brand: "H&M", price: 69.99, originalPrice: 95.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['S', 'M', 'L'], colors: ['Soft Pink'], isFeatured: false, rating: 4.3, reviewsCount: 42, description: 'Chic modern single button brunch event pop fashion blazer.', gender: 'Women'
      },
      {
        title: 'White Structured Dinner Blazer', brand: "Gucci", price: 260.00, originalPrice: 380.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['S', 'M', 'L'], colors: ['Ivory White'], isFeatured: true, rating: 4.9, reviewsCount: 14, description: 'Sharp power shoulders luxury formal blazer jacket precision seams.', gender: 'Women'
      },
      {
        title: 'Houndstooth Casual Blazer', brand: "Zara", price: 110.00, originalPrice: 150.00, category: catBlazer._id,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], sizes: ['S', 'M', 'L'], colors: ['Monochrome Check'], isFeatured: false, rating: 4.1, reviewsCount: 33, description: 'Traditional micro pattern textile modern casualized fit blazer.', gender: 'Women'
      },

      // ==========================================
      // === TROUSERS (Men & Women) ===
      // ==========================================
      {
        title: 'Smart Casual Slim Chinos', brand: "Zara", price: 60.00, originalPrice: 85.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['30', '32', '34', '36'], colors: ['Beige', 'Khaki'], isFeatured: true, rating: 4.5, reviewsCount: 92, description: 'Smart slim-fit stretch premium dynamic cotton trousers.', gender: 'Men'
      },
      {
        title: 'Urban Utility Cargo Pants', brand: "Reebok", price: 49.99, originalPrice: 70.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['30', '32', '34'], colors: ['Olive', 'Beige'], isFeatured: false, rating: 4.4, reviewsCount: 42, description: 'Multi-pocket canvas engineered loose action trousers.', gender: 'Men'
      },
      {
        title: 'Formal Pleated Dress Trousers', brand: "Zara", price: 75.00, originalPrice: 110.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['30', '32', '34', '36'], colors: ['Charcoal Grey'], isFeatured: true, rating: 4.7, reviewsCount: 74, description: 'Sharp center crease office uniform standard premium trousers.', gender: 'Men'
      },
      {
        title: 'Lightweight Linen Vacation Pants', brand: "H&M", price: 40.00, originalPrice: 55.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['32', '34', '36'], colors: ['White'], isFeatured: false, rating: 4.0, reviewsCount: 51, description: 'Elastic comfort drawstring waist breathable summer trousers.', gender: 'Men'
      },
      {
        title: 'Wide Leg Tailored Trousers', brand: "Zara", price: 70.00, originalPrice: 95.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['26', '28', '30', '32'], colors: ['Black', 'Grey'], isFeatured: true, rating: 4.6, reviewsCount: 128, description: 'High waist sophisticated fluid drape long trousers floor length.', gender: 'Women'
      },
      {
        title: 'Ankle Cropped Cigarette Trousers', brand: "H&M", price: 34.99, originalPrice: 48.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['26', '28', '30'], colors: ['Navy'], isFeatured: false, rating: 4.2, reviewsCount: 85, description: 'Stretch crisp office uniform taper fit slim cropped trousers.', gender: 'Women'
      },
      {
        title: 'Breezy Linen Straight Trousers', brand: "Zara", price: 65.00, originalPrice: 95.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Beige'], isFeatured: false, rating: 4.3, reviewsCount: 31, description: 'Straight-leg linen relaxed luxury resortwear lifestyle trousers.', gender: 'Women'
      },
      {
        title: 'Pleated Satin Fluid Trousers', brand: "Gucci", price: 160.00, originalPrice: 240.00, category: catTrousers._id,
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], sizes: ['28', '30'], colors: ['Emerald'], isFeatured: true, rating: 4.8, reviewsCount: 16, description: 'High end high waist heavy glossy drape luxury comfort trousers.', gender: 'Women'
      }
    ];

    // 2. Insert Batch Products
    const insertedProducts = await Product.insertMany(prods);

    // Seed sample reviews for initial products so review screens show active reviews
    const sampleReviews = [];
    const sampleReviewTexts = [
      { rating: 5, comment: 'Absolutely love the material! Fits true to size and feels very high quality.', name: 'Sophia R.', verified: true },
      { rating: 5, comment: 'Great purchase. Color and fabric match the images perfectly.', name: 'Alex M.', verified: true },
      { rating: 4, comment: 'Very comfortable and stylish. Delivery was fast too.', name: 'Daniel K.', verified: false },
      { rating: 5, comment: 'Exceeded my expectations! Will definitely order in another color.', name: 'Emma L.', verified: true },
      { rating: 4, comment: 'Good quality for the price. Highly recommend.', name: 'Michael T.', verified: true },
    ];

    for (const prod of insertedProducts.slice(0, 20)) {
      const count = (prod.title.length % 3) + 2;
      for (let i = 0; i < count; i++) {
        const rev = sampleReviewTexts[(i + prod.title.length) % sampleReviewTexts.length];
        sampleReviews.push({
          productId: prod._id,
          userId: `seed_user_${i + 1}`,
          rating: rev.rating,
          comment: rev.comment,
          userName: rev.name,
          verifiedPurchase: rev.verified,
          status: 'active'
        });
      }
    }
    if (sampleReviews.length > 0) {
      await Review.insertMany(sampleReviews);
      for (const prod of insertedProducts.slice(0, 20)) {
        await recalcProductRating(prod._id.toString());
      }
    }

    // 3. Dynamic Aggregation: Calculate actual counts of inserted items per category to keep indicators fully accurate
    const categoriesList = [catJacket, catShirt, catTShirt, catDress, catJeans, catShoes, catBlazer, catTrousers];
    for (const cat of categoriesList) {
      const count = await Product.countDocuments({ category: cat._id });
      await Category.findByIdAndUpdate(cat._id, { productCount: count });
    }

    res.json({
      success: true,
      message: `Database successfully cleared and re-seeded with ${prods.length} deep category products and sample reviews.`
    });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { q, categoryId, sort, limit = 20, isFeatured, brand, gender, rating, priceMin, priceMax } = req.query;
    let filter = {};

    if (q) {
      const cleanQ = q.trim().replace(/^[#\s]*(PRD-)?/i, '').trim();
      const escapedCleanQ = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const orConditions = [
        { title: new RegExp(escapedCleanQ, 'i') },
        { brand: new RegExp(escapedCleanQ, 'i') },
        { sku: new RegExp(escapedCleanQ, 'i') }
      ];

      const mongoose = (await import('mongoose')).default;
      if (mongoose.Types.ObjectId.isValid(cleanQ)) {
        orConditions.push({ _id: cleanQ });
      }

      if (/^[a-f0-9]{3,24}$/i.test(cleanQ)) {
        try {
          const matchingDocs = await Product.collection.find({
            $expr: {
              $regexMatch: {
                input: { $toString: '$_id' },
                regex: cleanQ,
                options: 'i'
              }
            }
          }, { projection: { _id: 1 } }).toArray();

          if (matchingDocs.length > 0) {
            orConditions.push({ _id: { $in: matchingDocs.map(d => d._id) } });
          }
        } catch (_) { /* fallback to title/brand regex */ }
      }

      filter.$or = orConditions;
    }
    if (categoryId) filter.category = categoryId;
    if (isFeatured) filter.isFeatured = isFeatured === 'true';

    if (gender && gender !== 'All' && gender !== 'null' && gender !== 'undefined') {
      filter.gender = gender;
    }

    if (brand && brand !== 'All' && brand !== 'null' && brand !== 'undefined') {
      filter.brand = new RegExp(`^${brand}$`, 'i');
    }

    if (rating && rating !== 'null' && rating !== 'undefined') {
      const parsedRating = parseFloat(rating);
      if (!isNaN(parsedRating)) {
        filter.rating = { $gte: parsedRating };
      }
    }

    if ((priceMin && priceMin !== 'null' && priceMin !== 'undefined') ||
      (priceMax && priceMax !== 'null' && priceMax !== 'undefined')) {
      const pMin = priceMin ? parseFloat(priceMin) : NaN;
      const pMax = priceMax ? parseFloat(priceMax) : NaN;

      const priceFilter = {};
      if (!isNaN(pMin)) priceFilter.$gte = pMin;
      if (!isNaN(pMax)) priceFilter.$lte = pMax;
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
    }

    // Ensure products must have a defined category
    filter.category = { $exists: true, $ne: null };

    let query = Product.find(filter).populate('category', 'name');
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    if (sort === 'price_desc') query = query.sort({ price: -1 });
    if (sort === 'newest') query = query.sort({ createdAt: -1 });

    const rawProducts = await query.limit(parseInt(limit));
    const products = rawProducts.filter(p => p.category && p.category.name);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ── Helper: recalculate product rating from active reviews ──
const recalcProductRating = async (productId) => {
  try {
    const mongoose = (await import('mongoose')).default;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return { avg: 0, count: 0 };
    }
    const targetObjId = new mongoose.Types.ObjectId(productId);
    const result = await Review.aggregate([
      { $match: { productId: targetObjId, status: 'active' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const avg   = result.length > 0 ? Math.round(result[0].avg * 100) / 100 : 0;
    const count = result.length > 0 ? result[0].count : 0;
    await Product.findByIdAndUpdate(productId, { rating: avg, reviewsCount: count });
    return { avg, count };
  } catch (err) {
    console.error('recalcProductRating error:', err.message);
    return { avg: 0, count: 0 };
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment, productTitle } = req.body;
    const userId   = req.headers['x-user-id'];
    const userName = req.headers['x-user-name'] || 'Anonymous';

    if (!userId) return res.status(401).json({ success: false, message: 'Login required to submit a review' });

    // Validate rating range
    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Validate comment length
    if (comment && comment.length > 500) {
      return res.status(400).json({ success: false, message: 'Review must be 500 characters or less' });
    }

    const mongoose = (await import('mongoose')).default;
    let product = null;
    let targetProductId = productId;

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }

    // If product ID wasn't found in DB (e.g. catalog reseeded after order placement), fallback match by title
    if (!product && productTitle) {
      const escapedTitle = productTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      product = await Product.findOne({ title: new RegExp(`^${escapedTitle}$`, 'i') });
      if (product) {
        targetProductId = product._id.toString();
      }
    }

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Check for duplicate review (handled by unique index, but give friendly error)
    const existing = await Review.findOne({ productId: targetProductId, userId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this product' });
    }

    // Check verified purchase via order-service internal connection
    let verifiedPurchase = false;
    try {
      const orderUri = process.env.ORDER_MONGO_URI || process.env.MONGO_URI || '';
      if (orderUri) {
        let orderConn = mongoose.connections.find(c => c.name === 'fashion_orders');
        if (!orderConn || orderConn.readyState !== 1) {
          orderConn = mongoose.createConnection(orderUri.replace(/\/[^/]*$/, '/fashion_orders'));
        }
        const OrderModel = orderConn.models['Order'] ||
          orderConn.model('Order', new mongoose.Schema({
            userId: String,
            orderStatus: String,
            status: String,
            items: [{ productId: String, title: String }]
          }));
        
        const deliveredOrder = await OrderModel.findOne({
          userId,
          $or: [{ orderStatus: 'delivered' }, { status: 'delivered' }],
          $or: [
            { 'items.productId': targetProductId },
            { 'items.productId': productId },
            ...(productTitle ? [{ 'items.title': new RegExp(`^${productTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }] : [])
          ]
        });
        verifiedPurchase = !!deliveredOrder;
      }
    } catch (_) { /* verified purchase check is optional */ }

    const review = new Review({
      productId: targetProductId, userId, rating: ratingNum,
      comment: (comment || '').trim(),
      userName, status: 'active', verifiedPurchase
    });
    await review.save();

    // Recalculate product rating from active reviews only
    const { avg, count } = await recalcProductRating(targetProductId);

    res.status(201).json({
      success: true,
      review,
      product: { rating: avg, reviewsCount: count }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this product' });
    }
    next(err);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId }  = req.params;
    const page  = Math.max(1, parseInt(req.query.page  || '1', 10));
    const limit = Math.min(50, parseInt(req.query.limit || '10', 10));
    const sortBy = req.query.sortBy || 'recent';

    const sortMap = {
      recent:      { createdAt: -1 },
      helpful:     { helpfulCount: -1, createdAt: -1 },
      rating_high: { rating: -1, createdAt: -1 },
      rating_low:  { rating: 1,  createdAt: -1 },
    };
    const sort = sortMap[sortBy] || sortMap.recent;

    const filter = { productId, status: 'active' };

    const mongoose = (await import('mongoose')).default;
    const targetObjId = (productId && mongoose.Types.ObjectId.isValid(productId))
      ? new mongoose.Types.ObjectId(productId)
      : productId;
    const aggFilter = { productId: targetObjId, status: 'active' };

    const [reviews, total] = await Promise.all([
      Review.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Review.countDocuments(filter)
    ]);

    // Rating breakdown using typed ObjectId filter
    const breakdown = await Review.aggregate([
      { $match: aggFilter },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);
    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    breakdown.forEach(b => { ratingBreakdown[b._id] = b.count; });

    res.json({
      success: true,
      reviews,
      ratingBreakdown,
      pagination: { total, page, pages: Math.ceil(total / limit), limit }
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ADMIN CONTROLLERS (Catalog Service)
// ==========================================

export const createProduct = async (req, res, next) => {
  try {
    const { title, brand, price, category, description, images, sizes, colors, initialRating } = req.body;

    if (!title || !brand || !price || !category || !description || !images || !Array.isArray(images) || images.length === 0 || !sizes || !Array.isArray(sizes) || sizes.length === 0 || !colors || !Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All product details (Title, Brand, Price, Category, Description, Images, Sizes, and Colors) are mandatory.'
      });
    }

    // Apply initialRating seed (0.0–5.0). Once real reviews come in, recalcProductRating overrides this.
    const productData = { ...req.body };
    if (initialRating !== undefined) {
      const seedRating = Math.min(5, Math.max(0, parseFloat(initialRating) || 0));
      productData.rating = Math.round(seedRating * 10) / 10;
      productData.reviewsCount = 0; // no real reviews yet
    }
    delete productData.initialRating;

    // Handle category resolution (ObjectId vs string category name)
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        productData.category = category;
      } else {
        const categoryName = String(category).trim();
        let catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
        if (!catDoc) {
          catDoc = await Category.create({ name: categoryName });
        }
        productData.category = catDoc._id;
      }
    }

    const product = new Product(productData);
    await product.save();

    // Update category product count
    if (product.category) {
      const count = await Product.countDocuments({ category: product.category });
      await Category.findByIdAndUpdate(product.category, { productCount: count });
    }

    res.status(201).json({ success: true, product });
  } catch (err) {
    if (typeof next === 'function') {
      next(err);
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.category) {
      if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
        const categoryName = String(updateData.category).trim();
        let catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
        if (!catDoc) {
          catDoc = await Category.create({ name: categoryName });
        }
        updateData.category = catDoc._id;
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    if (typeof next === 'function') {
      next(err);
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.category) {
      const count = await Product.countDocuments({ category: product.category });
      await Category.findByIdAndUpdate(product.category, { productCount: count });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const reviews = await Review.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments();
    res.json({
      success: true,
      reviews,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteReviewAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action = 'deleted' } = req.body; // 'hidden' | 'deleted'

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Soft delete — preserve for audit trail
    review.status = action === 'hidden' ? 'hidden' : 'deleted';
    await review.save();

    // Recalculate product rating from remaining active reviews
    if (review.productId) {
      await recalcProductRating(review.productId.toString());
    }

    res.json({ success: true, message: `Review ${action} successfully` });
  } catch (err) {
    next(err);
  }
};

export const toggleProductVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.isHidden = typeof isHidden === 'boolean' ? isHidden : !product.isHidden;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isHidden ? 'hidden' : 'made visible'} successfully`,
      product
    });
  } catch (err) {
    next(err);
  }
};

export const bulkProductVisibility = async (req, res, next) => {
  try {
    const { productIds, action } = req.body; // action: 'hide' | 'show'

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: 'productIds array is required' });
    }

    const isHidden = action === 'hide';
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { isHidden } }
    );

    res.json({
      success: true,
      message: `Bulk ${action} processed successfully`,
      affectedCount: result.modifiedCount || result.nModified || 0,
      totalRequested: productIds.length
    });
  } catch (err) {
    next(err);
  }
};

export const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock, lowStockThreshold } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (stock !== undefined) product.stock = Math.max(0, parseInt(stock, 10));
    if (lowStockThreshold !== undefined) product.lowStockThreshold = Math.max(0, parseInt(lowStockThreshold, 10));

    await product.save();

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};



