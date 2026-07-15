// src/features/wishlist/screens/WishlistScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectWishlistItems, toggleWishlist } from '../store/wishlistSlice';
import { setSelectedProduct } from '../../products/store/productSlice';
import ProductCard from '../../../shared/components/ProductCard';
import EmptyState  from '../../../shared/components/EmptyState';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const WishlistScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useAppDispatch();
  const items      = useAppSelector(selectWishlistItems);
  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = ['All', 'Jacket', 'Shirt', 'Pant', 'T-Shirt'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Wishlist</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center title */}
      </View>
      
      <View style={{ paddingBottom: spacing[4] }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterOptions.map((filter) => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterPillText, activeFilter === filter && styles.filterPillTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {items.length === 0 ? (
        <EmptyState
          type="wishlist"
          actionLabel="Shop Now"
          onAction={() => navigation.navigate('HomeTab')}
        />
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(i) => i.productId}
          renderItem={({ item }) => (
            <ProductCard
              item={{ _id: item.productId, ...item }}
              onPress={(p) => {
                dispatch(setSelectedProduct(p));
                navigation.navigate('ProductDetail', { productId: p._id });
              }}
              onWishlistPress={(p) => dispatch(toggleWishlist({ productId: p._id, ...p }))}
              isWishlisted
              style={{ flex: 1, marginHorizontal: spacing[2], marginBottom: spacing[4] }}
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
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing[6], paddingTop: Platform.OS === 'ios' ? 60 : spacing[10],
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EFEFEF'
  },
  title: { ...textStyles.h4, color: colors.text, fontWeight: '700' },
  filterScroll: { paddingHorizontal: spacing[6], gap: spacing[2] },
  filterPill: {
    paddingHorizontal: spacing[4], paddingVertical: spacing[1.5],
    borderRadius: 20, backgroundColor: colors.white,
    borderWidth: 1, borderColor: '#E5E5E5',
    marginRight: spacing[2],
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterPillText: { ...textStyles.caption, color: colors.text },
  filterPillTextActive: { color: colors.white },
  list:  { paddingHorizontal: spacing[4], paddingBottom: 100 }, // Space for tab bar
  row:   { justifyContent: 'space-between' },
});

export default WishlistScreen;
