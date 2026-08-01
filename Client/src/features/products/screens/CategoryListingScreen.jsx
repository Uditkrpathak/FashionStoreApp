// src/features/products/screens/CategoryListingScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useGetCategoriesQuery } from '../api/productApi';
import { colors } from '../../../theme/colors';
import { spacing, layout, shadows } from '../../../theme/spacing';
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

const getCategoryIcon = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('jacket') || lower.includes('coat') || lower.includes('blazer') || lower.includes('outerwear')) {
    return <JacketSvgIcon size={36} color="#704F38" />;
  }
  if (lower.includes('t-shirt') || lower.includes('tshirt') || lower.includes('tee')) {
    return <TShirtSvgIcon size={36} color="#704F38" />;
  }
  if (lower.includes('shirt') || lower.includes('top')) {
    return <ShirtSvgIcon size={36} color="#704F38" />;
  }
  if (lower.includes('dress') || lower.includes('gown') || lower.includes('skirt') || lower.includes('frock')) {
    return <DressSvgIcon size={36} color="#704F38" />;
  }
  if (lower.includes('pant') || lower.includes('jean') || lower.includes('trouser') || lower.includes('bottom')) {
    return <JeansSvgIcon size={36} color="#704F38" />;
  }
  if (lower.includes('shoe') || lower.includes('footwear') || lower.includes('sneaker') || lower.includes('boot')) {
    return <ShoesSvgIcon size={36} color="#704F38" />;
  }
  return <AccessoriesSvgIcon size={36} color="#704F38" />;
};

const CategoryListingScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.categories ?? data?.data?.categories ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#1F2029" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>All Categories</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductListing', { categoryId: item._id, title: item.name })}
            activeOpacity={0.88}
          >
            <View style={styles.iconCircle}>
              {getCategoryIcon(item.name)}
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>{item.productCount ?? 0} items</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingTop: spacing[12], paddingBottom: spacing[4],
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAEAEA', alignItems: 'center', justifyContent: 'center' },
  title: { ...textStyles.h5, color: colors.text, fontWeight: '800' },
  list: { padding: spacing[4], paddingBottom: 120 },
  row: { justifyContent: 'space-between' },
  card: {
    flex: 1, margin: spacing[2], padding: spacing[5],
    backgroundColor: '#FAF5F0', borderRadius: layout.cardRadius,
    borderWidth: 1, borderColor: '#F0E8DF',
    alignItems: 'center', ...shadows.sm,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing[3], shadowColor: '#704F38', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2
  },
  name: { ...textStyles.body2, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: spacing[1] },
  count: { ...textStyles.caption, color: colors.textMuted, fontWeight: '600' },
});

export default CategoryListingScreen;
