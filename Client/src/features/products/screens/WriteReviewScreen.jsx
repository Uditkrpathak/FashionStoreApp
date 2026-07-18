// src/features/products/screens/WriteReviewScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera } from 'lucide-react-native';
import { useAddReviewMutation, useGetProductByIdQuery } from '../api/productApi';
import { useToast } from '../../../context/ToastContext';
import { formatPrice } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const StarIcon = ({ filled, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.star, filled && styles.starFilled]}>★</Text>
  </TouchableOpacity>
);

const WriteReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params ?? {};
  const { showToast } = useToast();

  const { data: productData, isLoading: isProductLoading } = useGetProductByIdQuery(productId, { skip: !productId });
  const product = productData?.product;

  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const onSubmit = async () => {
    if (rating === 0) {
      showToast('Please select a star rating', 'warning');
      return;
    }
    if (!comment.trim()) {
      showToast('Please add a detailed review', 'warning');
      return;
    }
    try {
      await addReview({ productId, rating, comment: comment.trim() }).unwrap();
      showToast('Review submitted! Thank you 🙏', 'success');
      navigation.goBack();
    } catch {
      showToast('Failed to submit review.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leave Review</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isProductLoading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} color={colors.primary} />
        ) : product ? (
          <View style={styles.productCard}>
            {product.images?.[0] ? (
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            ) : (
              <View style={styles.productImagePlaceholder} />
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.title}</Text>
              <Text style={styles.productMeta}>Size : XL || Qty : 1pcs</Text>
              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                <TouchableOpacity style={styles.reorderBtn}>
                  <Text style={styles.reorderText}>Re-Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>How is your order?</Text>
          <Text style={styles.ratingSubtitle}>Your overall rating</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <StarIcon key={n} filled={n <= rating} onPress={() => setRating(n)} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Add detailed review</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter here"
            placeholderTextColor={colors.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.addPhotoBtn}>
            <Camera size={20} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={styles.addPhotoText}>add photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitBtnText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[6], paddingTop: spacing[12], backgroundColor: '#F9F9F9',
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 18, color: colors.text, fontWeight: '700' },
  title: { ...textStyles.h4, color: colors.text, fontWeight: '700' },

  content: { padding: spacing[6], paddingBottom: spacing[10] },

  productCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[6] },
  productImagePlaceholder: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#D9D9D9', marginRight: spacing[4] },
  productImage: { width: 80, height: 80, borderRadius: 12, marginRight: spacing[4], backgroundColor: '#F0F0F0' },
  productInfo: { flex: 1 },
  productName: { ...textStyles.h5, color: colors.text, fontWeight: '700', marginBottom: 2 },
  productMeta: { ...textStyles.caption, color: colors.textMuted, marginBottom: spacing[2] },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { ...textStyles.h5, color: colors.text, fontWeight: '800' },
  reorderBtn: { backgroundColor: '#333333', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  reorderText: { color: colors.white, fontSize: 12, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#EAEAEA', marginVertical: spacing[4] },

  ratingSection: { alignItems: 'center', marginVertical: spacing[4] },
  ratingTitle: { ...textStyles.h3, color: colors.text, fontWeight: '800', marginBottom: spacing[2] },
  ratingSubtitle: { ...textStyles.body2, color: colors.textMuted, marginBottom: spacing[4] },
  stars: { flexDirection: 'row', gap: spacing[2] },
  star: { fontSize: 48, color: '#E0E0E0' },
  starFilled: { color: '#333333' },

  reviewSection: { marginTop: spacing[2] },
  sectionTitle: { ...textStyles.h5, color: colors.text, fontWeight: '700', marginBottom: spacing[4] },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, padding: spacing[4],
    height: 120, ...textStyles.body1,
    marginBottom: spacing[4],
  },
  addPhotoBtn: { flexDirection: 'row', alignItems: 'center' },
  addPhotoText: { ...textStyles.body1, color: colors.text, fontWeight: '600' },

  footer: {
    flexDirection: 'row', gap: spacing[4],
    padding: spacing[6], backgroundColor: '#F9F9F9',
    paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[6]
  },
  cancelBtn: {
    flex: 1, backgroundColor: '#EAEAEA',
    height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center'
  },
  cancelBtnText: { ...textStyles.body1, color: colors.text, fontWeight: '700' },
  submitBtn: {
    flex: 1, backgroundColor: '#333333',
    height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center'
  },
  submitBtnText: { ...textStyles.body1, color: colors.white, fontWeight: '700' },
});

export default WriteReviewScreen;
