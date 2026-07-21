// src/features/products/screens/ProductListingScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetProductsQuery } from '../api/productApi';
import ProductCard from '../../../shared/components/ProductCard';
import { ProductCardSkeleton } from '../../../shared/components/SkeletonLoader';
import EmptyState from '../../../shared/components/EmptyState';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { toggleWishlist, selectWishlistItems } from '../../wishlist/store/wishlistSlice';
import { setSelectedProduct } from '../store/productSlice';
import { selectActiveFilters, selectSortBy, resetFilters } from '../../search/store/searchSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { SlidersHorizontal } from 'lucide-react-native';

const ProductListingScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const dispatch   = useAppDispatch();
  const { categoryId, title = 'Products' } = route.params ?? {};

  // Retrieve active filters and sorting options from Redux state
  const activeFilters = useAppSelector(selectActiveFilters);
  const sortBy        = useAppSelector(selectSortBy);
  const wishlistItems = useAppSelector(selectWishlistItems);

  const isProductWishlisted = (id) => wishlistItems.some(i => i.productId === id);

  // Reset active filters when entering a new category list
  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const { data, isLoading } = useGetProductsQuery({ categoryId, ...activeFilters, sort: sortBy, limit: 20 });
  const products = data?.products ?? [];

  const handlePress = (item) => {
    dispatch(setSelectedProduct(item));
    navigation.navigate('ProductDetail', { productId: item._id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Filter')} style={styles.filterBtn}>
          <SlidersHorizontal size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <FlatList
          data={[1,2,3,4,5,6]}
          numColumns={2}
          keyExtractor={(i) => String(i)}
          renderItem={() => <ProductCardSkeleton />}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
        />
      ) : products.length === 0 ? (
        <EmptyState type="search" />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(i) => i._id}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={handlePress}
              onWishlistPress={(p) => dispatch(toggleWishlist({ productId: p._id, ...p }))}
              isWishlisted={isProductWishlisted(item._id)}
              style={{ flex: 1, margin: spacing[2] }}
            />
          )}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[4], paddingTop: spacing[12], backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  back:   { fontSize: 22, color: colors.text },
  title:  { ...textStyles.h5, color: colors.text },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list:   { padding: spacing[2], paddingBottom: 120 },
  row:    { justifyContent: 'space-between' },
});

export default ProductListingScreen;
