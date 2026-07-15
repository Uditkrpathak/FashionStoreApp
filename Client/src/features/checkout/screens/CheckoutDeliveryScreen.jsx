// src/features/checkout/screens/CheckoutDeliveryScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Package, Truck, Zap } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectDeliveryOption, setDeliveryOption } from '../store/checkoutSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const DELIVERY_OPTIONS = [
  { id: 'economy', label: 'Economy', estimated: '25 August 2023', price: 10, icon: Package },
  { id: 'regular', label: 'Regular', estimated: '24 August 2023', price: 15, icon: Truck },
  { id: 'cargo', label: 'Cargo', estimated: '22 August 2023', price: 25, icon: Zap },
];

const CheckoutDeliveryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectDeliveryOption);

  const handleSelect = (item) => {
    // Exclude the non-serializable 'icon' component before storing in Redux
    const { icon, ...serializableItem } = item;
    dispatch(setDeliveryOption(serializableItem));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Shipping</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={DELIVERY_OPTIONS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View style={styles.cardWrapper}>
              <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
                <View style={styles.iconWrapper}>
                  <Icon size={24} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.desc}>Estimated Arrival {item.estimated}</Text>
                </View>
                <View style={styles.radio}>
                  {selected?.id === item.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[6], paddingTop: spacing[14],
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  title: { ...textStyles.h4, color: colors.text, fontWeight: '700' },
  list: { padding: spacing[6] },

  cardWrapper: { marginBottom: spacing[2] },
  card: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[3],
    gap: spacing[4],
  },
  iconWrapper: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8F8F8',
    alignItems: 'center', justifyContent: 'center',
  },
  label: { ...textStyles.body1, color: colors.text, fontWeight: '700', marginBottom: 2 },
  desc: { ...textStyles.body2, color: colors.textMuted, lineHeight: 20 },

  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginTop: spacing[3] },
});

export default CheckoutDeliveryScreen;
