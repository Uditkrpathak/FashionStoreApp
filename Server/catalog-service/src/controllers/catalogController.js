// import Product from '../models/Product.js';
// import Category from '../models/Category.js';
// import Review from '../models/Review.js';

// export const seedData = async (req, res) => {
//   try {
//     await Category.deleteMany();
//     await Product.deleteMany();

//     // Categories matching the UI mockups
//     const catJacket = await new Category({ name: 'Jacket', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', productCount: 15 }).save();
//     const catShirt = await new Category({ name: 'Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', productCount: 20 }).save();
//     const catPant = await new Category({ name: 'Pant', image: 'https://images.unsplash.com/photo-1584865288642-42078afe6942', productCount: 10 }).save();
//     const catTShirt = await new Category({ name: 'T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', productCount: 25 }).save();
//     const catDress = await new Category({ name: 'Dress', image: 'https://images.unsplash.com/photo-1515347619362-67343e808207', productCount: 12 }).save();

//     const prods = [
//       // === JACKETS (10 products) ===
//       { 
//         title: 'Brown Leather Jacket', brand: "Zara", price: 83.97, originalPrice: 120.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'], 
//         sizes: ['S','M','L','XL'], colors: ['Brown'], isFeatured: true, rating: 4.9, reviewsCount: 124,
//         description: 'Premium brown leather jacket tailored for a sleek, modern look.', gender: 'Men'
//       },
//       { 
//         title: 'Earthy Brown Suit', brand: "Zara", price: 120.00, originalPrice: 180.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1594938298596-eb5f1fd546fb', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf'], 
//         sizes: ['S','M','L','XL'], colors: ['Brown', 'Black'], isFeatured: true, rating: 4.7, reviewsCount: 45,
//         description: 'Elegant brown suite tailored for professional and formal events.', gender: 'Men'
//       },
//       { 
//         title: 'Black Denim Jacket', brand: "Puma", price: 65.00, originalPrice: 85.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0'], 
//         sizes: ['M','L','XL','XXL'], colors: ['Black'], isFeatured: false, rating: 4.4, reviewsCount: 64,
//         description: 'Classic fit black denim jacket with high durability and standard design.', gender: 'Men'
//       },
//       { 
//         title: 'Cozy Knit Cardigan', brand: "Fila", price: 78.00, originalPrice: 110.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1544441893-675973e31985'], 
//         sizes: ['M','L','XL'], colors: ['Gray'], isFeatured: false, rating: 4.6, reviewsCount: 56,
//         description: 'Thick, premium knit cardigan with horn buttons to stay warm and fashionable.', gender: 'Women'
//       },
//       { 
//         title: 'Nike Windbreaker', brand: "Nike", price: 95.00, originalPrice: 130.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'], 
//         sizes: ['S','M','L','XL'], colors: ['White','Blue'], isFeatured: true, rating: 4.8, reviewsCount: 142,
//         description: 'Lightweight Nike windbreaker with hood and zip pockets.', gender: 'Men'
//       },
//       { 
//         title: 'Adidas Track Jacket', brand: "Adidas", price: 80.00, originalPrice: 110.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b'], 
//         sizes: ['S','M','L'], colors: ['Black','White'], isFeatured: true, rating: 4.5, reviewsCount: 96,
//         description: 'Classic Adidas three-stripe track jacket.', gender: 'Women'
//       },
//       { 
//         title: 'Puma Fleece Hoodie', brand: "Puma", price: 55.00, originalPrice: 75.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7'], 
//         sizes: ['M','L','XL'], colors: ['Grey','Black'], isFeatured: false, rating: 4.1, reviewsCount: 78,
//         description: 'Warm fleece hoodie from Puma with dynamic sporty look.', gender: 'Men'
//       },
//       { 
//         title: 'Reebok Winter Parka', brand: "Reebok", price: 145.00, originalPrice: 200.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27'], 
//         sizes: ['M','L','XL'], colors: ['Navy'], isFeatured: true, rating: 4.3, reviewsCount: 35,
//         description: 'Heavy duty insulated winter parka for freezing weather.', gender: 'Men'
//       },
//       { 
//         title: 'Fila Puffer Coat', brand: "Fila", price: 110.00, originalPrice: 150.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'], 
//         sizes: ['S','M','L'], colors: ['Red','Black'], isFeatured: false, rating: 4.0, reviewsCount: 52,
//         description: 'Bright red puffer coat from Fila with high collar.', gender: 'Women'
//       },
//       { 
//         title: 'Zara Trench Coat', brand: "Zara", price: 135.00, originalPrice: 190.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea'], 
//         sizes: ['S','M','L','XL'], colors: ['Beige'], isFeatured: true, rating: 4.6, reviewsCount: 68,
//         description: 'Double breasted waterproof trench coat.', gender: 'Women'
//       },
//       // === SHIRTS (10 products) ===
//       { 
//         title: 'Yellow Casual Shirt', brand: "H&M", price: 35.00, originalPrice: 45.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 'https://images.unsplash.com/photo-1603252109303-2751441dd157'], 
//         sizes: ['M','L','XL'], colors: ['Yellow', 'White'], isFeatured: true, rating: 4.8, reviewsCount: 89,
//         description: 'Bright and stylish yellow shirt perfect for casual outings.', gender: 'Men'
//       },
//       { 
//         title: 'Striped Dress Shirt', brand: "Fila", price: 42.00, originalPrice: 60.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1620012253295-c05518e993be'], 
//         sizes: ['S','M','L'], colors: ['Blue', 'White'], isFeatured: true, rating: 4.3, reviewsCount: 31,
//         description: 'Fine cotton striped dress shirt for corporate and formal wear.', gender: 'Men'
//       },
//       { 
//         title: 'Nike Dri-FIT Polo', brand: "Nike", price: 45.00, originalPrice: 60.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908'], 
//         sizes: ['S','M','L','XL'], colors: ['White','Blue'], isFeatured: true, rating: 4.6, reviewsCount: 110,
//         description: 'Athletic fit polo featuring sweat-wicking Dri-FIT fabric.', gender: 'Men'
//       },
//       { 
//         title: 'Adidas Polo Shirt', brand: "Adidas", price: 38.00, originalPrice: 50.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820'], 
//         sizes: ['M','L','XL'], colors: ['Black','Green'], isFeatured: false, rating: 4.2, reviewsCount: 65,
//         description: 'Breathable polo shirt from Adidas with signature stripe details.', gender: 'Men'
//       },
//       { 
//         title: 'Puma Casual Shirt', brand: "Puma", price: 48.00, originalPrice: 65.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10'], 
//         sizes: ['M','L','XL'], colors: ['Grey'], isFeatured: false, rating: 3.9, reviewsCount: 42,
//         description: 'Premium casual button-up shirt in cotton fleece blend.', gender: 'Men'
//       },
//       { 
//         title: 'Reebok Linen Shirt', brand: "Reebok", price: 50.00, originalPrice: 70.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c'], 
//         sizes: ['M','L','XL'], colors: ['White','Beige'], isFeatured: false, rating: 4.1, reviewsCount: 54,
//         description: 'Super lightweight pure linen shirt for hot summer afternoons.', gender: 'Men'
//       },
//       { 
//         title: 'Fila Plaid Shirt', brand: "Fila", price: 36.00, originalPrice: 50.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22'], 
//         sizes: ['S','M','L','XL'], colors: ['Red','Black'], isFeatured: false, rating: 3.8, reviewsCount: 29,
//         description: 'Casual plaid flannel shirt, perfect for layering.', gender: 'Men'
//       },
//       { 
//         title: 'Zara Denim Shirt', brand: "Zara", price: 59.00, originalPrice: 85.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1516257984-b1b4d707412e'], 
//         sizes: ['S','M','L','XL'], colors: ['Light Blue'], isFeatured: true, rating: 4.5, reviewsCount: 77,
//         description: 'Western-style denim shirt made from soft washed cotton.', gender: 'Men'
//       },
//       { 
//         title: 'H&M Checked Shirt', brand: "H&M", price: 28.00, originalPrice: 40.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf'], 
//         sizes: ['S','M','L'], colors: ['Navy','Red'], isFeatured: false, rating: 3.6, reviewsCount: 83,
//         description: 'Standard checked shirt with chest pocket.', gender: 'Men'
//       },
//       { 
//         title: 'Nike Premium Oxford', brand: "Nike", price: 65.00, originalPrice: 90.00, category: catShirt._id, 
//         images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf'], 
//         sizes: ['S','M','L','XL'], colors: ['White'], isFeatured: true, rating: 4.7, reviewsCount: 104,
//         description: 'Tailored fit Oxford shirt with minimal embroidered branding.', gender: 'Men'
//       },
//       // === PANTS (10 products) ===
//       { 
//         title: 'Classic Blue Jeans', brand: "Adidas", price: 55.00, originalPrice: 75.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1542272604-787c3835535d'], 
//         sizes: ['30','32','34','36'], colors: ['Blue'], isFeatured: true, rating: 4.6, reviewsCount: 154,
//         description: 'Standard straight-fit blue denim jeans with a heavy vintage wash.', gender: 'Men'
//       },
//       { 
//         title: 'Active Tech Joggers', brand: "Nike", price: 48.00, originalPrice: 60.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1517462964-21fdcec3f25b'], 
//         sizes: ['S','M','L','XL'], colors: ['Gray', 'Black'], isFeatured: true, rating: 4.8, reviewsCount: 198,
//         description: 'Slim fit tech fleece joggers with zip pockets and breathable panels.', gender: 'Men'
//       },
//       { 
//         title: 'Urban Cargo Pants', brand: "Reebok", price: 49.99, originalPrice: 70.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], 
//         sizes: ['30','32','34'], colors: ['Beige', 'Olive'], isFeatured: false, rating: 4.4, reviewsCount: 42,
//         description: 'Multi-pocket cargo trousers engineered for rugged everyday use.', gender: 'Men'
//       },
//       { 
//         title: 'Puma Training Pants', brand: "Puma", price: 40.00, originalPrice: 55.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc'], 
//         sizes: ['S','M','L','XL'], colors: ['Black'], isFeatured: false, rating: 4.2, reviewsCount: 56,
//         description: 'Comfortable tapered training pants built for flexible movement.', gender: 'Men'
//       },
//       { 
//         title: 'Fila Retro Joggers', brand: "Fila", price: 45.00, originalPrice: 60.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1551854838-212c50b4c184'], 
//         sizes: ['M','L','XL'], colors: ['White','Blue'], isFeatured: false, rating: 3.7, reviewsCount: 38,
//         description: 'Vintage Fila colorblock joggers with elastic waistband.', gender: 'Men'
//       },
//       { 
//         title: 'Zara Slim Chinos', brand: "Zara", price: 60.00, originalPrice: 85.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246'], 
//         sizes: ['30','32','34','36'], colors: ['Beige','Khaki'], isFeatured: true, rating: 4.5, reviewsCount: 92,
//         description: 'Smart casual slim-fit chinos in premium stretch cotton.', gender: 'Men'
//       },
//       { 
//         title: 'Nike Cargo Sweatpants', brand: "Nike", price: 70.00, originalPrice: 95.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'], 
//         sizes: ['S','M','L','XL'], colors: ['Black','Grey'], isFeatured: true, rating: 4.9, reviewsCount: 215,
//         description: 'Thick fleece cargo sweatpants featuring extra zip utility pockets.', gender: 'Men'
//       },
//       { 
//         title: 'Adidas Performance Tights', brand: "Adidas", price: 50.00, originalPrice: 70.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1506152983158-b4a74a01c721'], 
//         sizes: ['XS','S','M','L'], colors: ['Black'], isFeatured: true, rating: 4.3, reviewsCount: 78,
//         description: 'High-waisted compression tights for yoga and athletic performance.', gender: 'Women'
//       },
//       { 
//         title: 'Reebok Utility Pants', brand: "Reebok", price: 58.00, originalPrice: 80.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], 
//         sizes: ['30','32','34'], colors: ['Olive'], isFeatured: false, rating: 3.9, reviewsCount: 47,
//         description: 'Heavy cotton drill utility pants with reinforced knee overlays.', gender: 'Men'
//       },
//       { 
//         title: 'H&M Basic Sweatpants', brand: "H&M", price: 24.99, originalPrice: 35.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1551854838-212c50b4c184'], 
//         sizes: ['S','M','L','XL'], colors: ['Light Grey'], isFeatured: false, rating: 3.5, reviewsCount: 104,
//         description: 'Budget-friendly basic fleece sweatpants with soft brushed lining.', gender: 'Men'
//       },
//       // === T-SHIRTS (10 products) ===
//       { 
//         title: 'Casual White Tee', brand: "Nike", price: 25.00, originalPrice: 35.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], 
//         sizes: ['S','M','L','XL'], colors: ['White','Black'], isFeatured: false, rating: 4.5, reviewsCount: 200,
//         description: 'Comfortable and breathable casual white t-shirt.', gender: 'Men'
//       },
//       { 
//         title: 'Graphic Print Tee', brand: "Adidas", price: 28.00, originalPrice: 38.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], 
//         sizes: ['M','L','XL'], colors: ['Black', 'Red'], isFeatured: false, rating: 4.2, reviewsCount: 77,
//         description: 'Streetwear graphic tee made from lightweight ring-spun cotton.', gender: 'Men'
//       },
//       { 
//         title: 'Premium V-Neck Tee', brand: "Puma", price: 32.00, originalPrice: 45.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], 
//         sizes: ['S','M','L','XL'], colors: ['Black', 'Blue'], isFeatured: false, rating: 4.5, reviewsCount: 92,
//         description: 'Super-soft combed cotton V-neck t-shirt designed for all-day comfort.', gender: 'Men'
//       },
//       { 
//         title: 'Reebok Training Tee', brand: "Reebok", price: 22.00, originalPrice: 30.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820'], 
//         sizes: ['S','M','L','XL'], colors: ['Grey','Black'], isFeatured: false, rating: 4.0, reviewsCount: 63,
//         description: 'Reebok athletic fit tee made with cool mesh breathable back panel.', gender: 'Men'
//       },
//       { 
//         title: 'Fila Logo Tee', brand: "Fila", price: 26.00, originalPrice: 35.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], 
//         sizes: ['S','M','L','XL'], colors: ['White','Red'], isFeatured: false, rating: 3.6, reviewsCount: 45,
//         description: 'Fila retro sportswear t-shirt with large signature front logo.', gender: 'Men'
//       },
//       { 
//         title: 'Nike Swoosh Tee', brand: "Nike", price: 30.00, originalPrice: 40.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], 
//         sizes: ['S','M','L','XL'], colors: ['Black','White'], isFeatured: true, rating: 4.7, reviewsCount: 160,
//         description: 'Classic swoosh logo tee printed on pure performance cotton.', gender: 'Men'
//       },
//       { 
//         title: 'Adidas Originals Tee', brand: "Adidas", price: 32.00, originalPrice: 45.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c'], 
//         sizes: ['S','M','L','XL'], colors: ['Blue','White'], isFeatured: true, rating: 4.4, reviewsCount: 112,
//         description: 'Classic trefoil logo tee from Adidas Originals collection.', gender: 'Men'
//       },
//       { 
//         title: 'Zara Textured Tee', brand: "Zara", price: 35.00, originalPrice: 50.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], 
//         sizes: ['S','M','L','XL'], colors: ['Beige'], isFeatured: false, rating: 4.1, reviewsCount: 54,
//         description: 'Waffle textured slim tee designed for smart layering.', gender: 'Men'
//       },
//       { 
//         title: 'H&M Slim Fit Tee', brand: "H&M", price: 18.00, originalPrice: 25.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], 
//         sizes: ['S','M','L'], colors: ['Navy','Black'], isFeatured: false, rating: 3.2, reviewsCount: 95,
//         description: 'Cotton stretch basic t-shirt in budget friendly multi-pack options.', gender: 'Men'
//       },
//       { 
//         title: 'Puma Performance Tee', brand: "Puma", price: 28.00, originalPrice: 40.00, category: catTShirt._id, 
//         images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'], 
//         sizes: ['S','M','L','XL'], colors: ['Green'], isFeatured: false, rating: 4.3, reviewsCount: 71,
//         description: 'Puma lightweight training tee with dryCELL moisture control.', gender: 'Men'
//       },
//       // === DRESSES (10 products) ===
//       { 
//         title: 'Red Cocktail Dress', brand: "Gucci", price: 189.99, originalPrice: 280.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8'], 
//         sizes: ['XS','S','M','L'], colors: ['Red'], isFeatured: true, rating: 4.9, reviewsCount: 110,
//         description: 'Stunning red cocktail gown with elegant drapery for special dinners.', gender: 'Women'
//       },
//       { 
//         title: 'Summer Floral Maxi', brand: "Zara", price: 58.00, originalPrice: 85.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1515347619362-67343e808207'], 
//         sizes: ['S','M','L'], colors: ['White', 'Pink'], isFeatured: true, rating: 4.7, reviewsCount: 88,
//         description: 'Breathable and flowy floral maxi dress, perfect for garden parties.', gender: 'Women'
//       },
//       { 
//         title: 'Silk Evening Gown', brand: "Reebok", price: 210.00, originalPrice: 300.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c'], 
//         sizes: ['S','M','L'], colors: ['Blue', 'Purple'], isFeatured: true, rating: 5.0, reviewsCount: 15,
//         description: 'Luxurious silk formal evening gown with open back detail.', gender: 'Women'
//       },
//       { 
//         title: 'Nike Sporty Tennis Dress', brand: "Nike", price: 75.00, originalPrice: 105.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc'], 
//         sizes: ['XS','S','M','L'], colors: ['White','Pink'], isFeatured: true, rating: 4.6, reviewsCount: 82,
//         description: 'Sporty tennis dress with built-in compression shorts and mesh inserts.', gender: 'Women'
//       },
//       { 
//         title: 'Adidas Casual Dress', brand: "Adidas", price: 65.00, originalPrice: 90.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1506152983158-b4a74a01c721'], 
//         sizes: ['XS','S','M','L'], colors: ['Black','Grey'], isFeatured: true, rating: 4.3, reviewsCount: 64,
//         description: 'Classic three-stripes streetwear midi dress from Adidas.', gender: 'Women'
//       },
//       { 
//         title: 'Puma T-Shirt Dress', brand: "Puma", price: 45.00, originalPrice: 65.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'], 
//         sizes: ['S','M','L'], colors: ['Green','Grey'], isFeatured: false, rating: 4.1, reviewsCount: 39,
//         description: 'Casual, relaxed-fit cotton dress styled like an oversized Puma tee.', gender: 'Women'
//       },
//       { 
//         title: 'Fila Pleated Dress', brand: "Fila", price: 52.00, originalPrice: 75.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c'], 
//         sizes: ['S','M','L'], colors: ['Navy','White'], isFeatured: false, rating: 3.8, reviewsCount: 27,
//         description: 'Athletic pleated retro tennis dress with stripe contrasts.', gender: 'Women'
//       },
//       { 
//         title: 'Zara Knit Dress', brand: "Zara", price: 79.00, originalPrice: 110.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1515347619362-67343e808207'], 
//         sizes: ['S','M','L'], colors: ['Beige','Rust'], isFeatured: true, rating: 4.5, reviewsCount: 51,
//         description: 'Ribbed knit dress in a neutral hue with midi length.', gender: 'Women'
//       },
//       { 
//         title: 'H&M Wrap Dress', brand: "H&M", price: 39.99, originalPrice: 55.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8'], 
//         sizes: ['XS','S','M','L'], colors: ['Pink','Floral'], isFeatured: false, rating: 3.7, reviewsCount: 43,
//         description: 'Vibrant printed wrap dress with side tie fastening.', gender: 'Women'
//       },
//       { 
//         title: 'Gucci Silk Wrap', brand: "Gucci", price: 249.99, originalPrice: 380.00, category: catDress._id, 
//         images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c'], 
//         sizes: ['S','M','L'], colors: ['Purple','Black'], isFeatured: true, rating: 4.8, reviewsCount: 19,
//         description: 'Pure silk wrap gown with deep V-neckline.', gender: 'Women'
//       },
//       // === ADDITIONAL PRODUCTS TO COMPLY WITH 50+ ===
//       { 
//         title: 'Zara Linen Pants', brand: "Zara", price: 65.00, originalPrice: 95.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246'], 
//         sizes: ['S','M','L','XL'], colors: ['White','Beige'], isFeatured: false, rating: 4.3, reviewsCount: 31,
//         description: 'Breezy straight-leg linen trousers for relaxed summer vibes.', gender: 'Women'
//       },
//       { 
//         title: 'Nike Dri-FIT Jacket', brand: "Nike", price: 85.00, originalPrice: 120.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'], 
//         sizes: ['S','M','L'], colors: ['Pink','Black'], isFeatured: true, rating: 4.7, reviewsCount: 88,
//         description: 'Full-zip warm up jacket featuring Tech Knit.', gender: 'Women'
//       },
//       { 
//         title: 'Adidas Crewneck Sweater', brand: "Adidas", price: 70.00, originalPrice: 95.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b'], 
//         sizes: ['M','L','XL','XXL'], colors: ['Blue','Grey'], isFeatured: false, rating: 4.4, reviewsCount: 67,
//         description: 'Heavyweight cotton crewneck sweatshirt.', gender: 'Men'
//       },
//       { 
//         title: 'Reebok Cargo Shorts', brand: "Reebok", price: 35.00, originalPrice: 50.00, category: catPant._id, 
//         images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'], 
//         sizes: ['30','32','34','36'], colors: ['Beige','Navy'], isFeatured: false, rating: 3.9, reviewsCount: 22,
//         description: 'Relaxed fit multi-pocket cargo shorts.', gender: 'Men'
//       },
//       { 
//         title: 'Fila Crop Top Hoodie', brand: "Fila", price: 48.00, originalPrice: 65.00, category: catJacket._id, 
//         images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7'], 
//         sizes: ['XS','S','M','L'], colors: ['White','Red'], isFeatured: false, rating: 4.2, reviewsCount: 50,
//         description: 'Fleece lined cropped athletic hoodie.', gender: 'Women'
//       }
//     ];
//     await Product.insertMany(prods);
//     res.json({ success: true, message: 'Database seeded successfully with new fashion images.' });
//   } catch(err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json({ success: true, categories });
//   } catch(err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getProducts = async (req, res) => {
//   try {
//     const { q, categoryId, sort, limit = 20, isFeatured, brand, gender, rating, priceMin, priceMax } = req.query;
//     let filter = {};
//     if (q) filter.title = new RegExp(q, 'i');
//     if (categoryId) filter.category = categoryId;
//     if (isFeatured) filter.isFeatured = isFeatured === 'true';

//     // Filter by gender
//     if (gender && gender !== 'All' && gender !== 'null' && gender !== 'undefined') {
//       filter.gender = gender;
//     }

//     // Filter by brand
//     if (brand && brand !== 'All' && brand !== 'null' && brand !== 'undefined') {
//       filter.brand = new RegExp(`^${brand}$`, 'i');
//     }

//     // Filter by rating (greater than or equal to)
//     if (rating && rating !== 'null' && rating !== 'undefined') {
//       const parsedRating = parseFloat(rating);
//       if (!isNaN(parsedRating)) {
//         filter.rating = { $gte: parsedRating };
//       }
//     }

//     // Filter by price range
//     if ((priceMin && priceMin !== 'null' && priceMin !== 'undefined') || 
//         (priceMax && priceMax !== 'null' && priceMax !== 'undefined')) {
//       const pMin = priceMin ? parseFloat(priceMin) : NaN;
//       const pMax = priceMax ? parseFloat(priceMax) : NaN;

//       const priceFilter = {};
//       if (!isNaN(pMin)) priceFilter.$gte = pMin;
//       if (!isNaN(pMax)) priceFilter.$lte = pMax;

//       if (Object.keys(priceFilter).length > 0) {
//         filter.price = priceFilter;
//       }
//     }

//     let query = Product.find(filter).populate('category', 'name');
//     if (sort === 'price_asc') query = query.sort({ price: 1 });
//     if (sort === 'price_desc') query = query.sort({ price: -1 });
//     if (sort === 'newest') query = query.sort({ createdAt: -1 });

//     const products = await query.limit(parseInt(limit));
//     res.json({ success: true, products });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate('category', 'name');
//     if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
//     res.json({ success: true, product });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const addReview = async (req, res) => {
//   try {
//     const { productId, rating, comment, userName = 'Anonymous' } = req.body;
//     const userId = req.headers['x-user-id'] || 'anonymous';

//     const review = new Review({ productId, userId, rating, text: comment, userName, comment });
//     await review.save();

//     const reviews = await Review.find({ productId });
//     const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
//     await Product.findByIdAndUpdate(productId, { rating: avgRating, reviewCount: reviews.length });

//     res.json({ success: true, review });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getProductReviews = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
//     res.json({ success: true, reviews });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
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
    await Product.insertMany(prods);

    // 3. Dynamic Aggregation: Calculate actual counts of inserted items per category to keep indicators fully accurate
    const categoriesList = [catJacket, catShirt, catTShirt, catDress, catJeans, catShoes, catBlazer, catTrousers];
    for (const cat of categoriesList) {
      const count = await Product.countDocuments({ category: cat._id });
      await Category.findByIdAndUpdate(cat._id, { productCount: count });
    }

    res.json({
      success: true,
      message: `Database successfully cleared and re-seeded with ${prods.length} deep category products across Men and Women.`
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

    if (q) filter.title = new RegExp(q, 'i');
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

    let query = Product.find(filter).populate('category', 'name');
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    if (sort === 'price_desc') query = query.sort({ price: -1 });
    if (sort === 'newest') query = query.sort({ createdAt: -1 });

    const products = await query.limit(parseInt(limit));
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

export const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment, userName = 'Anonymous' } = req.body;
    const userId = req.headers['x-user-id'] || 'anonymous';

    const review = new Review({ productId, userId, rating, text: comment, userName, comment });
    await review.save();

    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating, reviewsCount: reviews.length });

    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ADMIN CONTROLLERS (Catalog Service)
// ==========================================

export const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Update category product count
    if (product.category) {
      const count = await Product.countDocuments({ category: product.category });
      await Category.findByIdAndUpdate(product.category, { productCount: count });
    }

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
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
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Recalculate product rating
    if (review.productId) {
      const reviews = await Review.find({ productId: review.productId });
      const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      await Product.findByIdAndUpdate(review.productId, { rating: avgRating, reviewsCount: reviews.length });
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};


