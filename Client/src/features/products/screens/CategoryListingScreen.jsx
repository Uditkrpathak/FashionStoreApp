// src/features/products/screens/CategoryListingScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetCategoriesQuery } from '../api/productApi';
import { colors } from '../../../theme/colors';
import { spacing, layout, shadows } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const CATEGORY_EMOJIS = ['👗', '👔', '👠', '🧥', '👒', '💍', '🧣', '🩱'];

const CategoryListingScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data?.categories ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Categories</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductListing', { categoryId: item._id, title: item.name })}
            activeOpacity={0.85}
          >
            <Text style={styles.emoji}>{CATEGORY_EMOJIS[index % CATEGORY_EMOJIS.length]}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>{item.productCount ?? 0} items</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[4], paddingTop: spacing[12],
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  back:  { fontSize: 22, color: colors.text },
  title: { ...textStyles.h5, color: colors.text },
  list:  { padding: spacing[3], paddingBottom: 120 },
  row:   { justifyContent: 'space-between' },
  card: {
    flex: 1, margin: spacing[2], padding: spacing[5],
    backgroundColor: colors.surface, borderRadius: layout.cardRadius,
    alignItems: 'center', ...shadows.sm,
  },
  emoji: { fontSize: 40, marginBottom: spacing[3] },
  name:  { ...textStyles.body2, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: spacing[1] },
  count: { ...textStyles.caption, color: colors.textMuted },
});

export default CategoryListingScreen;
