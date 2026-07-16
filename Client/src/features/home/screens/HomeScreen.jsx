// src/features/home/screens/HomeScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Image, Platform, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, ChevronDown, Bell, Search, SlidersHorizontal, Shirt, Sparkles, Box, Scissors } from 'lucide-react-native';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../products/api/productApi';
import ProductCard from '../../../shared/components/ProductCard';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { toggleWishlist, selectIsWishlisted } from '../../wishlist/store/wishlistSlice';
import { setSelectedProduct } from '../../products/store/productSlice';
import { selectUser } from '../../auth/store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing, layout } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    id: '1',
    title: 'New Collection',
    subtitle: 'Discount 50% for\nthe first transaction',
    buttonText: 'Shop Now',
    image: require('../../../../assets/images/banner_collection.jpg'),
    backgroundColor: '#F1E9DE', // Earthy beige color
  },
  {
    id: '2',
    title: 'Summer Sale',
    subtitle: 'Up to 60% off on\nall summer apparel',
    buttonText: 'Explore',
    image: require('../../../../assets/images/banner_summer.jpg'),
    backgroundColor: '#EAE1DF',
  },
  {
    id: '3',
    title: 'Trending Outfits',
    subtitle: 'Unleash your style\nwith our latest picks',
    buttonText: 'View Details',
    image: require('../../../../assets/images/banner_trending.jpg'),
    backgroundColor: '#E2E6E3',
  }
];

const getCategoryIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('shirt') || lower.includes('tee')) return <Shirt size={26} color={colors.primary} />;
  if (lower.includes('dress')) return <Sparkles size={26} color={colors.primary} />;
  if (lower.includes('pant') || lower.includes('jean')) return <Scissors size={26} color={colors.primary} />;
  return <Box size={26} color={colors.primary} />;
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { data: productsData, isLoading: prodLoading, refetch } = useGetProductsQuery({ limit: 20 });
  const { data: categoriesData } = useGetCategoriesQuery();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const wishlistItems = useAppSelector(state => state.wishlist.items);

  const products = productsData?.products ?? [];
  const categories = categoriesData?.categories ?? [];

  const handleProductPress = (item) => {
    dispatch(setSelectedProduct(item));
    navigation.navigate('ProductDetail', { productId: item._id });
  };

  const isProductWishlisted = (id) => wishlistItems.some(i => i._id === id);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={prodLoading} onRefresh={refetch} />}
        contentContainerStyle={{ paddingBottom: 100 }} // Space for floating tab bar
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Location</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MapPin size={16} color={colors.primary} fill={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.tagline}>{user?.location ?? 'New York, USA'}</Text>
              <ChevronDown size={16} color={colors.text} style={{ marginLeft: 4 }} />
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('ProfileTab')}>
            <Bell size={20} color={colors.text} fill={colors.text} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('SearchTab')}
          >
            <Search size={20} color={colors.textMuted} style={{ marginRight: spacing[3] }} />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigation.navigate('SearchTab', { screen: 'Filter' })}
          >
            <SlidersHorizontal size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Banner Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const offset = e.nativeEvent.contentOffset.x;
              const index = Math.round(offset / (width - 36)); // width - 48 (width of card) + 12 (marginRight) = width - 36
              if (index !== activeBannerIndex && index >= 0 && index < BANNERS.length) {
                setActiveBannerIndex(index);
              }
            }}
            scrollEventThrottle={16}
            snapToInterval={width - 36}
            decelerationRate="fast"
            contentContainerStyle={styles.bannerScrollContent}
          >
            {BANNERS.map((banner) => (
              <View key={banner.id} style={[styles.banner, { backgroundColor: banner.backgroundColor }]}>
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSub}>{banner.subtitle}</Text>
                  <TouchableOpacity
                    style={styles.bannerBtn}
                    onPress={() => navigation.navigate('SearchTab', { screen: 'Search' })}
                  >
                    <Text style={styles.bannerBtnText}>{banner.buttonText}</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={banner.image}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activeBannerIndex && styles.dotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Category</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('ProductListing', { categoryId: cat._id, title: cat.name })}
                >
                  <View style={styles.categoryIconCircle}>
                    {getCategoryIcon(cat.name)}
                  </View>
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Flash Sale */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Flash Sale</Text>
            <View style={styles.timerRow}>
              <Text style={styles.timerText}>Closing in :</Text>
              <View style={styles.timerBox}><Text style={styles.timerNum}>02</Text></View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timerBox}><Text style={styles.timerNum}>12</Text></View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timerBox}><Text style={styles.timerNum}>56</Text></View>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['All', 'Newest', 'Popular', 'Man', 'Women'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterPillText, activeFilter === filter && styles.filterPillTextActive]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.grid}>
            {products.map((item) => (
              <View key={item._id} style={styles.gridItem}>
                <ProductCard
                  item={item}
                  onPress={handleProductPress}
                  onWishlistPress={(p) => dispatch(toggleWishlist({ productId: p._id, ...p }))}
                  isWishlisted={isProductWishlisted(item._id)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, // White background
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing[6], paddingTop: Platform.OS === 'ios' ? 60 : spacing[10],
  },
  greeting: { ...textStyles.body2, color: colors.textMuted },
  tagline: { ...textStyles.body1, color: colors.text, fontWeight: '700', marginTop: 2 },
  bellBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center'
  },
  bellDot: {
    position: 'absolute', top: 12, right: 12, width: 8, height: 8,
    borderRadius: 4, backgroundColor: colors.sale, borderWidth: 1, borderColor: colors.surfaceAlt
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing[4], height: 50,
    backgroundColor: colors.white, borderRadius: 25,
    marginRight: spacing[3],
    borderWidth: 1, borderColor: colors.border
  },
  searchPlaceholder: { ...textStyles.body2, color: colors.textMuted },
  filterBtn: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, // Brown
    alignItems: 'center', justifyContent: 'center',
  },
  carouselContainer: {
    marginBottom: spacing[6],
  },
  bannerScrollContent: {
    paddingLeft: spacing[6],
    paddingRight: spacing[6] - 12,
  },
  banner: {
    width: width - 48,
    marginRight: 12,
    padding: spacing[5],
    borderRadius: layout.cardRadiusLg,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 160,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[3],
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#624735',
  },
  bannerTextContainer: { flex: 1, paddingRight: spacing[2], justifyContent: 'center' },
  bannerTitle: { ...textStyles.h3, color: colors.text, marginBottom: spacing[1] },
  bannerSub: { ...textStyles.caption, color: colors.textMuted, marginBottom: spacing[4], lineHeight: 18 },
  bannerBtn: {
    backgroundColor: colors.primary, paddingHorizontal: spacing[4], paddingVertical: spacing[2],
    borderRadius: 20, alignSelf: 'flex-start'
  },
  bannerBtnText: { ...textStyles.label, color: colors.white },
  bannerImage: {
    width: 130,
    height: 150,
    borderRadius: layout.cardRadius,
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  section: { marginBottom: spacing[6] },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4], paddingHorizontal: spacing[6] },
  sectionTitle: { ...textStyles.h4, color: colors.text, fontWeight: '700' },
  seeAll: { ...textStyles.caption, color: colors.textMuted },
  categoryScroll: { paddingHorizontal: spacing[6], gap: spacing[5] },
  categoryItem: { alignItems: 'center' },
  categoryIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#FAF6F2', // Light beige circle
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing[2]
  },
  categoryText: { ...textStyles.caption, color: colors.text, fontWeight: '600' },
  timerRow: { flexDirection: 'row', alignItems: 'center' },
  timerText: { ...textStyles.caption, color: colors.textMuted, marginRight: spacing[2] },
  timerBox: { backgroundColor: '#F1E9DE', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  timerNum: { ...textStyles.caption, fontWeight: '700', color: colors.primary }, // Brown text
  timerColon: { ...textStyles.caption, color: colors.text, marginHorizontal: 2, fontWeight: '700' },
  filterScroll: { paddingHorizontal: spacing[6], marginBottom: spacing[5], gap: spacing[2] },
  filterPill: {
    paddingHorizontal: spacing[5], paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border,
    marginRight: spacing[2],
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterPillText: { ...textStyles.body2, color: colors.text },
  filterPillTextActive: { color: colors.white },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[4],
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // Allows 2 columns with a small gap
  },
});

export default HomeScreen;
