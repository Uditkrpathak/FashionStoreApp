// src/shared/components/ProductCard.jsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors }    from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { textStyles, fontSizes }    from '../../theme/typography';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({
  item,
  product,
  onPress,
  onWishlistPress,
  isWishlisted = false,
  style,
}) => {
  const p = item || product || {};
  const imageUri = p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea';
  const title = p.title || 'Product';
  const price = p.price || 0;
  const rating = p.rating;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress?.(p)}
      activeOpacity={0.88}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Wishlist Button - Perfectly Centered Circle */}
        <Pressable
          style={[
            styles.wishlistBtn,
            isWishlisted && styles.wishlistBtnActive
          ]}
          onPress={() => onWishlistPress?.(p)}
          hitSlop={8}
        >
          <Heart 
            size={16} 
            color={isWishlisted ? '#E53935' : '#1F2029'} 
            fill={isWishlisted ? '#E53935' : 'transparent'} 
            strokeWidth={2.2}
          />
        </Pressable>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {rating ? (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{typeof rating === 'number' ? rating.toFixed(1) : rating}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.price}>{formatPrice(price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.85,
    backgroundColor: colors.surfaceAlt,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing[2.5],
    right: spacing[2.5],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center', // Centered vertically & horizontally
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  wishlistBtnActive: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFCDD2',
    borderWidth: 1,
  },
  info: {
    paddingTop: spacing[2.5],
    paddingBottom: spacing[1],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  title: {
    ...textStyles.body2,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing[1],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 12,
    color: '#FFB800',
    marginRight: 2,
  },
  rating: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontWeight: '500',
  },
  price: {
    ...textStyles.body1,
    color: colors.text,
    fontWeight: '800',
  },
});

export default ProductCard;
