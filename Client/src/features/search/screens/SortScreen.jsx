// src/features/search/screens/SortScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { setSortBy, selectSortBy } from '../store/searchSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const SORT_OPTIONS = [
  { value: 'popularity',  label: 'Popularity' },
  { value: 'newest',      label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Customer Rating' },
];

const SortScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useAppDispatch();
  const current    = useAppSelector(selectSortBy);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sort By</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.close}>✕</Text></TouchableOpacity>
      </View>
      {SORT_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.option}
          onPress={() => { dispatch(setSortBy(opt.value)); navigation.goBack(); }}
        >
          <Text style={[styles.optText, current === opt.value && styles.optActive]}>{opt.label}</Text>
          {current === opt.value && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing[4], paddingTop: spacing[8], borderBottomWidth: 1, borderBottomColor: colors.border },
  title:  { ...textStyles.h5, color: colors.text },
  close:  { fontSize: 22, color: colors.textMuted },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing[5], borderBottomWidth: 1, borderBottomColor: colors.divider },
  optText:  { ...textStyles.body1, color: colors.text },
  optActive:{ color: colors.primary, fontWeight: '700' },
  check:    { color: colors.primary, fontSize: 20, fontWeight: '700' },
});

export default SortScreen;
