// src/features/products/screens/SizeGuideScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const SIZE_GUIDE = [
  { size: 'XS', chest: '31–33"', waist: '24–26"', hips: '34–36"' },
  { size: 'S',  chest: '33–35"', waist: '26–28"', hips: '36–38"' },
  { size: 'M',  chest: '35–37"', waist: '28–30"', hips: '38–40"' },
  { size: 'L',  chest: '37–39"', waist: '30–32"', hips: '40–42"' },
  { size: 'XL', chest: '39–41"', waist: '32–34"', hips: '42–44"' },
  { size: 'XXL',chest: '41–43"', waist: '34–36"', hips: '44–46"' },
];

const SizeGuideScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Size Guide 📏</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          {['Size','Chest','Waist','Hips'].map((h) => (
            <Text key={h} style={[styles.cell, styles.head]}>{h}</Text>
          ))}
        </View>
        {SIZE_GUIDE.map((row, i) => (
          <View key={row.size} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
            <Text style={[styles.cell, styles.sizeCell]}>{row.size}</Text>
            <Text style={styles.cell}>{row.chest}</Text>
            <Text style={styles.cell}>{row.waist}</Text>
            <Text style={styles.cell}>{row.hips}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing[4], paddingTop: spacing[12],
  },
  title:   { ...textStyles.h4, color: colors.text },
  close:   { fontSize: 22, color: colors.textMuted },
  content: { padding: spacing[4] },
  row:     { flexDirection: 'row', paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowAlt:  { backgroundColor: colors.surfaceAlt },
  cell:    { flex: 1, ...textStyles.body2, color: colors.text, textAlign: 'center' },
  head:    { fontWeight: '700', color: colors.primary },
  sizeCell:{ fontWeight: '700' },
});

export default SizeGuideScreen;
