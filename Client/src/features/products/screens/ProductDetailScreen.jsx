import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react-native';
import { useGetProductByIdQuery } from '../api/productApi';
import { useAppDispatch }  from '../../../shared/hooks/useAppDispatch';
import { useAppSelector }  from '../../../shared/hooks/useAppSelector';
import { addToCart }       from '../../cart/store/cartSlice';
import { toggleWishlist, selectIsWishlisted }  from '../../wishlist/store/wishlistSlice';
import { selectSelectedVariant, setSelectedVariant } from '../store/productSlice';
import { useToast }        from '../../../context/ToastContext';
import { formatPrice } from '../../../shared/utils/formatters';
import { colors }    from '../../../theme/colors';
import { spacing, layout } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const { width, height } = Dimensions.get('window');

const COLOR_MAP = {
  Brown: '#704F38',
  Black: '#000000',
  Yellow: '#F3C63F',
  White: '#FFFFFF',
  Blue: '#2A55E5',
  Red: '#E53E3E',
  Gray: '#8E8E93',
  Grey: '#8E8E93',
  Beige: '#F5F2EF',
  Pink: '#FF8DA1',
  Olive: '#556B2F',
  Navy: '#000080',
  Purple: '#800080',
  Rust: '#B7410E',
  Khaki: '#C3B091',
};

const ProductDetailScreen = () => {
  const navigation      = useNavigation();
  const route           = useRoute();
  const dispatch        = useAppDispatch();
  const { showToast }   = useToast();
  const { productId }   = route.params ?? {};
  
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(i => i._id === productId);

  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const { data, isLoading } = useGetProductByIdQuery(productId, { skip: !productId });
  const product = data?.product;

  if (isLoading || !product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.textMuted }}>Loading...</Text>
      </View>
    );
  }

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const colorsList = product.colors && product.colors.length > 0 ? product.colors : ['Brown'];

  // Derived state: fallback to product's first size and color if not explicitly selected yet
  const activeSize  = selectedSize || sizes[0];
  const activeColor = selectedColor || colorsList[0];

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId:  product._id,
      title:      product.title,
      brand:      product.brand,
      image:      product.images?.[0] || product.image,
      price:      product.price,
      size:       activeSize,
      color:      activeColor,
      variantSku: `${product._id}-${activeSize}-${activeColor}`,
    }));
    showToast('Added to cart', 'success');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Main Image Header */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.images?.[imageIndex] || product.image }} 
            style={styles.image} 
            resizeMode="cover" 
          />
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Product Details</Text>
            
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => dispatch(toggleWishlist({ productId: product._id, ...product }))}
            >
              <Heart size={24} color={isWishlisted ? colors.sale : colors.text} fill={isWishlisted ? colors.sale : 'transparent'} />
            </TouchableOpacity>
          </View>

          {/* Thumbnails Floating Over Bottom of Image */}
          <View style={styles.thumbContainer}>
            {product.images?.slice(0, 5).map((img, i) => (
              <TouchableOpacity key={i} onPress={() => setImageIndex(i)}>
                <Image source={{ uri: img }} style={[styles.thumb, i === imageIndex && styles.thumbActive]} />
              </TouchableOpacity>
            ))}
            {product.images && product.images.length > 5 && (
              <View style={styles.moreThumbs}>
                <Text style={styles.moreThumbsText}>+{product.images.length - 5}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.info}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand || "Female's Style"}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{product.rating?.toFixed(1) || '4.5'}</Text>
            </View>
          </View>

          <Text style={styles.name}>{product.title}</Text>

          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>
            {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            <Text style={styles.readMore}> Read more</Text>
          </Text>

          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.sizesRow}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBox, activeSize === size && styles.sizeBoxActive]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeText, activeSize === size && styles.sizeTextActive]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Select Color : <Text style={styles.colorValue}>{activeColor}</Text></Text>
          <View style={styles.colorsRow}>
            {colorsList.map((color) => {
              const hex = COLOR_MAP[color] || color.toLowerCase();
              const isSelected = activeColor === color;
              const isWhite = color.toLowerCase() === 'white';
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: hex },
                    isSelected && styles.colorCircleActive,
                    isWhite && styles.colorCircleWhiteBorder,
                  ]}
                  onPress={() => setSelectedColor(color)}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <View style={[styles.colorDot, { backgroundColor: isWhite ? '#000' : '#FFF' }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceValue}>{formatPrice(product.price)}</Text>
          </View>
          
          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
            <ShoppingBag size={20} color={colors.white} style={{ marginRight: spacing[2] }} />
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F9F9F9' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageContainer: {
    width: width,
    height: height * 0.55,
    backgroundColor: '#EBE4DD', // Beige background
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerIcons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : spacing[10],
    left: spacing[6],
    right: spacing[6],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...layout.shadows?.sm
  },
  headerTitle: {
    ...textStyles.h5,
    fontWeight: '700',
    color: colors.text,
  },
  thumbContainer: {
    position: 'absolute',
    bottom: -30,
    left: spacing[6],
    flexDirection: 'row',
    gap: spacing[2],
  },
  thumb: {
    width: 50, height: 50, borderRadius: 8,
    backgroundColor: '#CCC',
    borderWidth: 2, borderColor: colors.white,
  },
  thumbActive: {
    borderColor: colors.primary,
  },
  moreThumbs: {
    width: 50, height: 50, borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  moreThumbsText: {
    color: colors.white, fontWeight: '700',
  },
  info: {
    paddingHorizontal: spacing[6],
    paddingTop: 50, // Space for the overlapping thumbnails
  },
  brandRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing[1],
  },
  brand: {
    ...textStyles.caption, color: colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  star: { color: colors.gold, fontSize: 16 }, // Gold star
  rating: { ...textStyles.body2, fontWeight: '700', color: colors.textMuted },
  name: {
    ...textStyles.h3, color: colors.text, fontWeight: '700', marginBottom: spacing[5],
  },
  sectionTitle: {
    ...textStyles.subtitle1, color: colors.text, fontWeight: '700', marginBottom: spacing[2], marginTop: spacing[4]
  },
  description: {
    ...textStyles.body2, color: colors.textMuted, lineHeight: 22,
  },
  readMore: {
    fontWeight: '700', color: colors.primary, textDecorationLine: 'underline',
  },
  sizesRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2],
  },
  sizeBox: {
    width: 44, height: 44, borderRadius: 8,
    borderWidth: 1, borderColor: '#E5E5E5',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.white,
  },
  sizeBoxActive: {
    backgroundColor: colors.primary, borderColor: colors.primary,
  },
  sizeText: {
    ...textStyles.body2, fontWeight: '600', color: colors.text,
  },
  sizeTextActive: {
    color: colors.white,
  },
  colorValue: {
    color: colors.textMuted, fontWeight: 'normal',
  },
  colorsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  colorCircleActive: {
    borderColor: colors.primary,
  },
  colorCircleWhiteBorder: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.white,
    paddingTop: spacing[4],
    paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[4],
    paddingHorizontal: spacing[6],
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10,
  },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  priceContainer: {},
  priceLabel: {
    ...textStyles.caption, color: colors.textMuted, marginBottom: 2,
  },
  priceValue: {
    ...textStyles.h4, color: colors.text, fontWeight: '800',
  },
  addBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing[8], paddingVertical: spacing[4],
    borderRadius: 30,
  },
  addBtnText: {
    ...textStyles.body1, color: colors.white, fontWeight: '600',
  },
});

export default ProductDetailScreen;
