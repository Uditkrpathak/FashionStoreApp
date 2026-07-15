// src/features/products/screens/ReviewsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetReviewsQuery } from '../api/productApi';
import { timeAgo } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const ReviewsScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const { productId, title } = route.params ?? {};
  const { data, isLoading }  = useGetReviewsQuery({ productId });
  const reviews = data?.reviews ?? [];

  const renderReview = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userName?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.userName}</Text>
          <Text style={styles.date}>{timeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.stars}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WriteReview', { productId, title })}>
          <Text style={styles.write}>Write ✏️</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(i) => i._id}
        renderItem={renderReview}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header:    {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[4], paddingTop: spacing[12], borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.white,
  },
  back:   { fontSize: 22, color: colors.text },
  title:  { ...textStyles.h5, color: colors.text },
  write:  { ...textStyles.label, color: colors.primary },
  list:   { padding: spacing[4] },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing[4],
    marginBottom: spacing[3], borderWidth: 1, borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[3], gap: spacing[3] },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  name:    { ...textStyles.body2, fontWeight: '600', color: colors.text },
  date:    { ...textStyles.caption, color: colors.textMuted },
  stars:   { color: colors.gold, fontSize: 14 },
  comment: { ...textStyles.body2, color: colors.textMuted, lineHeight: 22 },
});

export default ReviewsScreen;
