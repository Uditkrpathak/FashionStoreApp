// src/features/search/screens/SearchResultsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { selectQuery, selectActiveFilters, selectSortBy } from '../store/searchSlice';
import { useSearchProductsQuery } from '../../products/api/productApi';
import { toggleWishlist, selectWishlistItems } from '../../wishlist/store/wishlistSlice';
import { setSelectedProduct }     from '../../products/store/productSlice';
import ProductCard from '../../../shared/components/ProductCard';
import EmptyState  from '../../../shared/components/EmptyState';
import { colors }    from '../../../theme/colors';
import { spacing }   from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { SlidersHorizontal } from 'lucide-react-native';

const SearchResultsScreen = () => {
  const navigation    = useNavigation();
  const dispatch      = useAppDispatch();
  const query         = useAppSelector(selectQuery);
  const activeFilters = useAppSelector(selectActiveFilters);
  const sortBy        = useAppSelector(selectSortBy);
  const wishlistItems = useAppSelector(selectWishlistItems);

  const { data, isLoading } = useSearchProductsQuery({ q: query, ...activeFilters, sort: sortBy });
  const products = data?.products ?? [];

  const isProductWishlisted = (id) => wishlistItems.some(i => i.productId === id);

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
        <Text style={styles.title}>{`"${query}"`}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Filter')} style={styles.filterBtn}>
          <SlidersHorizontal size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.sortBar}>
        <Text style={styles.count}>{products.length} results</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sort')}>
          <Text style={styles.sortBtn}>Sort ↕</Text>
        </TouchableOpacity>
      </View>
      {products.length === 0 && !isLoading ? (
        <EmptyState type="search" subtitle={`No results for "${query}"`} />
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
  back:       { fontSize: 22, color: colors.text },
  title:      { ...textStyles.body2, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'center' },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing[4], paddingVertical: spacing[3],
    backgroundColor: colors.surfaceAlt,
  },
  count:   { ...textStyles.caption, color: colors.textMuted },
  sortBtn: { ...textStyles.label, color: colors.primary },
  list:    { padding: spacing[2] },
  row:     { justifyContent: 'space-between' },
});

export default SearchResultsScreen;
