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
import { useUpdateProfileMutation } from '../../auth/api/authApi';
import { useGetNotificationsQuery } from '../../notifications/api/notificationApi';
import MapSelectorModal from '../../../shared/components/MapSelectorModal';
import { colors } from '../../../theme/colors';
import { spacing, layout } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { 
  JacketSvgIcon, 
  ShirtSvgIcon, 
  TShirtSvgIcon, 
  DressSvgIcon, 
  JeansSvgIcon, 
  ShoesSvgIcon, 
  AccessoriesSvgIcon 
} from '../../../shared/components/FashionCategoryIcons';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    id: '1',
    title: 'New Collection',
    subtitle: 'Discount 50% for\nthe first transaction',
    buttonText: 'Shop Now',
    image: require('../../../../assets/images/banner_collection.jpg'),
    backgroundColor: '#F1E9DE', // Earthy beige color
    imageStyle: { right: -5, bottom: -5, width: 140, height: 165 },
    resizeMode: 'cover',
  },
  {
    id: '2',
    title: 'Summer Sale',
    subtitle: 'Up to 60% off on\nall summer apparel',
    buttonText: 'Explore',
    image: require('../../../../assets/images/banner_summer.jpg'),
    backgroundColor: '#EAE6E1',
    imageStyle: { right: -5, bottom: -5, width: 140, height: 165 },
    resizeMode: 'cover',
  },
  {
    id: '3',
    title: 'Trending Styles',
    subtitle: 'Discover top picks\nfor this season',
    buttonText: 'View All',
    image: require('../../../../assets/images/banner_trending.jpg'),
    backgroundColor: '#E2E6E3',
    imageStyle: { right: 0, bottom: 0, width: 145, height: 160, borderRadius: 16 },
    resizeMode: 'cover',
  }
];

const getCategoryIcon = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('jacket') || lower.includes('coat') || lower.includes('blazer') || lower.includes('outerwear')) {
    return <JacketSvgIcon size={28} color="#704F38" />;
  }
  if (lower.includes('t-shirt') || lower.includes('tshirt') || lower.includes('tee')) {
    return <TShirtSvgIcon size={28} color="#704F38" />;
  }
  if (lower.includes('shirt') || lower.includes('top')) {
    return <ShirtSvgIcon size={28} color="#704F38" />;
  }
  if (lower.includes('dress') || lower.includes('gown') || lower.includes('skirt') || lower.includes('frock')) {
    return <DressSvgIcon size={28} color="#704F38" />;
  }
  if (lower.includes('pant') || lower.includes('jean') || lower.includes('trouser') || lower.includes('bottom')) {
    return <JeansSvgIcon size={28} color="#704F38" />;
  }
  if (lower.includes('shoe') || lower.includes('footwear') || lower.includes('sneaker') || lower.includes('boot')) {
    return <ShoesSvgIcon size={28} color="#704F38" />;
  }
  return <AccessoriesSvgIcon size={28} color="#704F38" />;
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { data: productsData, isLoading: prodLoading, refetch } = useGetProductsQuery({ limit: 20 });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: notifData } = useGetNotificationsQuery();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();

  const wishlistItems = useAppSelector(state => state.wishlist.items);

  const products = productsData?.products ?? [];
  const categories = categoriesData?.categories ?? [];

  const unreadNotifCount = notifData?.notifications?.filter(n => !n.isRead)?.length || 0;

  // Filter and sort products based on selected pill
  const getFilteredProducts = () => {
    let list = [...products];
    if (activeFilter === 'Man') {
      return list.filter(p => p.gender === 'Men');
    }
    if (activeFilter === 'Women') {
      return list.filter(p => p.gender === 'Women');
    }
    if (activeFilter === 'Newest') {
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (activeFilter === 'Popular') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  };

  const filteredProducts = getFilteredProducts();

  const handleProductPress = (item) => {
    dispatch(setSelectedProduct(item));
    navigation.navigate('ProductDetail', { productId: item._id });
  };

  const isProductWishlisted = (id) => wishlistItems.some(i => i._id === id);

  const handleLocationConfirm = async (data) => {
    try {
      await updateProfile({ location: data.shortAddress || data.address }).unwrap();
    } catch (err) {
      console.log('Failed to update home location:', err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={prodLoading} onRefresh={refetch} />}
        contentContainerStyle={{ paddingBottom: 100 }} // Space for floating tab bar
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMapVisible(true)} activeOpacity={0.8}>
            <Text style={styles.greeting}>Location</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MapPin size={16} width={16} height={16} color="#1F2029" fill="#1F2029" style={{ marginRight: 4 }} />
              <Text style={styles.tagline}>{user?.location ?? 'New York, USA'}</Text>
              <ChevronDown size={16} width={16} height={16} color="#1F2029" stroke="#1F2029" strokeWidth={2.2} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bellBtn} 
            onPress={() => navigation.navigate('ProfileTab', { screen: 'Notifications' })}
            activeOpacity={0.8}
          >
            <Bell size={20} width={20} height={20} color="#1F2029" stroke="#1F2029" strokeWidth={2} />
            {unreadNotifCount > 0 && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('SearchTab')}
          >
            <Search size={18} width={18} height={18} color="#797979" stroke="#797979" strokeWidth={2} style={{ marginRight: 8 }} />
            <Text style={styles.searchPlaceholder}>Search clothes, shoes...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigation.navigate('Filter')}
            activeOpacity={0.85}
          >
            <SlidersHorizontal size={20} width={20} height={20} color="#FFFFFF" stroke="#FFFFFF" strokeWidth={2.4} />
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
              const index = Math.round(offset / (width - 36));
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
                  style={[styles.bannerImage, banner.imageStyle]}
                  resizeMode={banner.resizeMode || 'cover'}
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
              <TouchableOpacity onPress={() => navigation.navigate('SearchTab', { screen: 'Search' })}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('ProductListing', { categoryId: cat._id, title: cat.name })}
                  activeOpacity={0.8}
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
            {['All', 'Man', 'Women', 'Newest', 'Popular'].map((pill) => (
              <TouchableOpacity
                key={pill}
                style={[
                  styles.filterPill,
                  activeFilter === pill && styles.filterPillActive
                ]}
                onPress={() => setActiveFilter(pill)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    activeFilter === pill && styles.filterPillTextActive
                  ]}
                >
                  {pill}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Product Grid */}
          <View style={styles.productGrid}>
            {filteredProducts.slice(0, 10).map((item) => (
              <View key={item._id} style={styles.productCol}>
                <ProductCard
                  item={item}
                  onPress={() => handleProductPress(item)}
                  onWishlistPress={() => dispatch(toggleWishlist(item))}
                  isWishlisted={isProductWishlisted(item._id)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Map Location Selector Modal */}
      <MapSelectorModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        onConfirmLocation={handleLocationConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6], paddingTop: Platform.OS === 'ios' ? 60 : spacing[10],
  },
  greeting: { ...textStyles.body2, color: colors.textMuted },
  tagline: { ...textStyles.body1, color: colors.text, fontWeight: '700', marginTop: 2 },
  bellBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center', borderBorderWidth: 1, borderColor: '#EAEAEA'
  },
  bellDot: {
    position: 'absolute', top: 11, right: 11, width: 8, height: 8,
    borderRadius: 4, backgroundColor: '#FF4D4D', borderWidth: 1.5, borderColor: '#FFFFFF'
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
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#704F38', // Brand Luxury Brown
    alignItems: 'center', justifyContent: 'center', shadowColor: '#704F38', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5
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
    height: 160,
    borderRadius: layout.cardRadius,
    padding: spacing[5],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerTextContainer: { flex: 1, zIndex: 2 },
  bannerTitle: { ...textStyles.body2, color: colors.textMuted, fontWeight: '600' },
  bannerSub: { ...textStyles.h3, color: colors.text, fontWeight: '800', marginTop: 4, marginBottom: 12 },
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
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  section: { marginBottom: spacing[6] },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4], paddingHorizontal: spacing[6] },
  sectionTitle: { ...textStyles.h4, color: colors.text, fontWeight: '700' },
  seeAll: { ...textStyles.caption, color: colors.textMuted },
  categoryScroll: { paddingHorizontal: spacing[6], gap: spacing[5] },
  categoryItem: { alignItems: 'center' },
  categoryIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#FAF5F0', // Warm luxury beige circle
    borderWidth: 1, borderColor: '#F0E8DF',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing[2]
  },
  categoryText: { ...textStyles.caption, color: colors.text, fontWeight: '600' },
  timerRow: { flexDirection: 'row', alignItems: 'center' },
  timerText: { ...textStyles.caption, color: colors.textMuted, marginRight: spacing[2] },
  timerBox: { backgroundColor: '#F1E9DE', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  timerNum: { ...textStyles.caption, fontWeight: '700', color: colors.primary },
  timerColon: { ...textStyles.caption, color: colors.text, marginHorizontal: 2, fontWeight: '700' },
  filterScroll: { paddingHorizontal: spacing[6], marginBottom: spacing[5], gap: spacing[2] },
  filterPill: {
    paddingHorizontal: spacing[5], paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.surfaceAlt,
    borderWidth: 1, borderColor: 'transparent'
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterPillText: { ...textStyles.body2, color: colors.textMuted, fontWeight: '600' },
  filterPillTextActive: { color: colors.white, fontWeight: '700' },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[6] - 6,
  },
  productCol: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: spacing[4],
  }
});

export default HomeScreen;
