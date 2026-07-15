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
  onPress,
  onWishlistPress,
  isWishlisted = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress?.(item)}
      activeOpacity={0.88}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || (item.images && item.images[0]) }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Wishlist button */}
        <Pressable
          style={styles.wishlistBtn}
          onPress={() => onWishlistPress?.(item)}
          hitSlop={8}
        >
          <Heart 
            size={16} 
            color={isWishlisted ? colors.text : colors.textMuted} 
            fill={isWishlisted ? colors.text : 'transparent'} 
          />
        </Pressable>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          {item.rating ? (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: spacing[4],
  },
  imageContainer: {
    width:  '100%',
    aspectRatio: 0.85, // To make it a bit taller than a square
    borderRadius: spacing[4],
    overflow: 'hidden',
    backgroundColor: '#E5E5E5', // Placeholder color
    marginBottom: spacing[2],
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  wishlistBtn: {
    position:        'absolute',
    top:             spacing[2],
    right:           spacing[2],
    width:           28,
    height:          28,
    borderRadius:    14,
    backgroundColor: colors.white,
    alignItems:      'center',
    justifyContent:  'center',
  },
  info: {
    paddingHorizontal: spacing[1],
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[0.5],
  },
  title: {
    ...textStyles.body2,
    color:        colors.text,
    fontWeight:   '600',
    flex: 1,
    marginRight: spacing[2],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  star:        { color: colors.gold, fontSize: fontSizes.sm },
  rating:      { ...textStyles.caption, color: colors.textMuted, fontWeight: '500' },
  price: {
    ...textStyles.subtitle2,
    color:  colors.text,
    fontWeight: '700',
  },
});

export default ProductCard;
