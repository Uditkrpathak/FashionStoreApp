// src/features/search/screens/FilterScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { setFilters, setSortBy, selectActiveFilters, selectSortBy } from '../store/searchSlice';

const BRANDS = ['All', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Fila'];
const GENDERS = ['All', 'Men', 'Women'];
const SORT_OPTIONS = ['Most Recent', 'Popular', 'Price High', 'Price Low'];

const PRICE_POINTS = ['2', '7', '22', '50', '100', '150+'];

const RATINGS = [
  { label: '4.5 and above', min: 4.5, max: 5.0 },
  { label: '4.0 - 4.5', min: 4.0, max: 4.5 },
  { label: '3.5 - 4.0', min: 3.5, max: 4.0 },
  { label: '3.0 - 3.5', min: 3.0, max: 3.5 },
  { label: '2.5 - 3.0', min: 2.5, max: 3.0 },
];

const FilterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const activeFilters = useAppSelector(selectActiveFilters);
  const sortBy = useAppSelector(selectSortBy);

  // Helper to map sort values
  const getSortLabel = (val) => {
    if (val === 'newest') return 'Most Recent';
    if (val === 'price_desc') return 'Price High';
    if (val === 'price_asc') return 'Price Low';
    return 'Popular';
  };

  // State matching selections
  const [selectedBrand, setSelectedBrand] = useState(activeFilters.brand || 'All');
  const [selectedGender, setSelectedGender] = useState(activeFilters.gender || 'All');
  const [selectedSort, setSelectedSort] = useState(getSortLabel(sortBy));
  const [selectedRating, setSelectedRating] = useState(activeFilters.ratingText || 'All');

  const [priceMinIdx, setPriceMinIdx] = useState(activeFilters.priceMinIdx ?? 1);
  const [priceMaxIdx, setPriceMaxIdx] = useState(activeFilters.priceMaxIdx ?? 4);

  const apply = () => {
    // Map sort
    let sortVal = 'popularity';
    if (selectedSort === 'Most Recent') sortVal = 'newest';
    if (selectedSort === 'Price High') sortVal = 'price_desc';
    if (selectedSort === 'Price Low') sortVal = 'price_asc';

    // Map rating
    let ratingMin = null;
    if (selectedRating === '4.5 and above') ratingMin = 4.5;
    else if (selectedRating === '4.0 - 4.5') ratingMin = 4.0;
    else if (selectedRating === '3.5 - 4.0') ratingMin = 3.5;
    else if (selectedRating === '3.0 - 3.5') ratingMin = 3.0;
    else if (selectedRating === '2.5 - 3.0') ratingMin = 2.5;

    const minVal = parseInt(PRICE_POINTS[priceMinIdx]);
    const maxVal = PRICE_POINTS[priceMaxIdx] === '150+' ? undefined : parseInt(PRICE_POINTS[priceMaxIdx]);

    dispatch(setFilters({
      brand: selectedBrand === 'All' ? undefined : selectedBrand,
      gender: selectedGender === 'All' ? undefined : selectedGender,
      rating: ratingMin || undefined,
      ratingText: selectedRating,
      priceMin: minVal,
      priceMax: maxVal,
      priceMinIdx: priceMinIdx,
      priceMaxIdx: priceMaxIdx,
    }));
    dispatch(setSortBy(sortVal));

    navigation.goBack();
  };

  const reset = () => {
    setSelectedBrand('All');
    setSelectedGender('All');
    setSelectedSort('Popular');
    setSelectedRating('All');
    setPriceMinIdx(0);
    setPriceMaxIdx(5);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Filter</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Brands Section */}
        <Text style={styles.sectionTitle}>Brands</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow} style={styles.outerScrollRow}>
          {BRANDS.map(brand => {
            const isActive = selectedBrand === brand;
            return (
              <TouchableOpacity
                key={brand}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setSelectedBrand(brand)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {brand}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Gender Section */}
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.pillsRow}>
          {GENDERS.map(gender => {
            const isActive = selectedGender === gender;
            return (
              <TouchableOpacity
                key={gender}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setSelectedGender(gender)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sort By Section */}
        <Text style={styles.sectionTitle}>Sort by</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow} style={styles.outerScrollRow}>
          {SORT_OPTIONS.map(opt => {
            const isActive = selectedSort === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setSelectedSort(opt)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Pricing Range Section */}
        <Text style={styles.sectionTitle}>Pricing Range</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            {/* The active range highlight */}
            <View style={[styles.sliderFill, { left: `${(priceMinIdx / 5) * 100}%`, right: `${100 - (priceMaxIdx / 5) * 100}%` }]} />
          </View>
          {/* Thumb 1 */}
          <View style={[styles.sliderThumb, { left: `${(priceMinIdx / 5) * 100}%` }]} />
          {/* Thumb 2 */}
          <View style={[styles.sliderThumb, { left: `${(priceMaxIdx / 5) * 100}%` }]} />
          
          <View style={styles.pricePoints}>
            {PRICE_POINTS.map((pt, idx) => {
              const isHighlight = idx >= priceMinIdx && idx <= priceMaxIdx;
              const handlePricePress = () => {
                if (idx < priceMinIdx) {
                  setPriceMinIdx(idx);
                } else if (idx > priceMaxIdx) {
                  setPriceMaxIdx(idx);
                } else {
                  if (idx - priceMinIdx < priceMaxIdx - idx) {
                    setPriceMinIdx(idx);
                  } else {
                    setPriceMaxIdx(idx);
                  }
                }
              };
              return (
                <TouchableOpacity key={pt} onPress={handlePricePress}>
                  <Text style={[styles.pricePointText, isHighlight && styles.pricePointTextHighlight]}>
                    {pt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reviews Section */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        <View style={styles.reviewsList}>
          {RATINGS.map(r => {
            const isSelected = selectedRating === r.label;
            return (
              <TouchableOpacity
                key={r.label}
                style={styles.ratingRow}
                onPress={() => setSelectedRating(r.label)}
              >
                {/* 5 Stars display */}
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map(starIdx => (
                    <Star
                      key={starIdx}
                      size={18}
                      color={colors.gold}
                      fill={colors.gold}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                  <Text style={styles.ratingLabel}>{r.label}</Text>
                </View>

                {/* Radio Button */}
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Text style={styles.resetBtnText}>Reset Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={apply}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingBottom: spacing[4], paddingTop: spacing[12],
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: '#F2F2F2'
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: '#EDEDED',
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white
  },
  back: { fontSize: 20, color: colors.text, fontWeight: '700' },
  title: { ...textStyles.h5, color: colors.text, fontWeight: '700', flex: 1, textAlign: 'center' },

  content: { padding: spacing[5], paddingBottom: spacing[10] },

  sectionTitle: { ...textStyles.body1, color: colors.text, fontWeight: '700', marginBottom: spacing[3], marginTop: spacing[4] },

  outerScrollRow: { marginHorizontal: -spacing[5], paddingHorizontal: spacing[5] },
  scrollRow: { flexDirection: 'row', gap: spacing[2], paddingBottom: spacing[2] },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },

  pill: {
    paddingHorizontal: spacing[5], paddingVertical: spacing[3],
    borderRadius: 25, backgroundColor: '#F2F2F2',
  },
  pillActive: { backgroundColor: colors.primary },
  pillText: { ...textStyles.body2, color: '#262626', fontWeight: '500' },
  pillTextActive: { color: colors.white, fontWeight: '600' },

  // Custom Slider
  sliderContainer: { marginVertical: spacing[5], paddingHorizontal: spacing[2], position: 'relative' },
  sliderTrack: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, width: '100%', position: 'relative' },
  sliderFill: { position: 'absolute', height: 4, backgroundColor: colors.primary, borderRadius: 2, left: '16.66%', right: '33.33%' },
  sliderThumb: {
    position: 'absolute', top: -8, marginLeft: -10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2
  },
  pricePoints: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing[4] },
  pricePointText: { ...textStyles.caption, color: colors.textMuted, fontWeight: '500' },
  pricePointTextHighlight: { color: colors.text, fontWeight: '700' },

  // Reviews List
  reviewsList: { gap: spacing[3] },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing[1] },
  starsContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingLabel: { ...textStyles.body2, color: colors.text, fontWeight: '500', marginLeft: spacing[3] },
  radioCircle: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: '#D3D3D3',
    alignItems: 'center', justifyContent: 'center'
  },
  radioCircleSelected: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },

  // Footer buttons matching mockup
  footer: {
    flexDirection: 'row', gap: spacing[3],
    paddingHorizontal: spacing[5], paddingVertical: spacing[4],
    borderTopWidth: 1, borderTopColor: '#F5F5F5', backgroundColor: colors.white
  },
  resetBtn: {
    flex: 1, height: 50, borderRadius: 25,
    backgroundColor: '#F5F2EF', alignItems: 'center', justifyContent: 'center'
  },
  resetBtnText: { ...textStyles.body2, color: colors.primary, fontWeight: '700' },
  applyBtn: {
    flex: 1, height: 50, borderRadius: 25,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'
  },
  applyBtnText: { ...textStyles.body2, color: colors.white, fontWeight: '700' }
});

export default FilterScreen;
