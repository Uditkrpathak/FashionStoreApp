// src/features/checkout/screens/CheckoutAddressScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectSelectedAddress, setSelectedAddress } from '../store/checkoutSlice';
import { useGetAddressesQuery } from '../../cart/api/cartApi';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const CheckoutAddressScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useAppDispatch();
  const selected   = useAppSelector(selectSelectedAddress);
  const { data }   = useGetAddressesQuery();
  const addresses  = data?.addresses ?? [];

  const handleSelect = (item) => {
    dispatch(setSelectedAddress(item));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Shipping Address</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <FlatList
        data={addresses}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddEditAddress')}>
            <Text style={styles.addBtnText}>+ Add New Shipping Address</Text>
          </TouchableOpacity>
        )}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
              <View style={styles.iconWrapper}>
                <MapPin size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.label ?? 'Home'}</Text>
                <Text style={styles.addr}>{item.line1}, {item.city}, {item.pincode}</Text>
              </View>
              <View style={styles.radio}>
                {selected?._id === item._id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        )}
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
  title:  { ...textStyles.h4, color: colors.text, fontWeight: '700' },
  list:   { padding: spacing[6] },
  
  cardWrapper: { marginBottom: spacing[2] },
  card: { 
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[3],
    gap: spacing[4],
  },
  iconWrapper: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8F8F8',
    alignItems: 'center', justifyContent: 'center',
  },
  label:  { ...textStyles.body1, color: colors.text, fontWeight: '700', marginBottom: 2 },
  addr:   { ...textStyles.body2, color: colors.textMuted, lineHeight: 20 },
  
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginTop: spacing[3] },

  addBtn: { 
    marginTop: spacing[4],
    padding: spacing[4], borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CCC', 
    borderRadius: 20, alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  addBtnText: { ...textStyles.body2, color: colors.primary, fontWeight: '700' },
});

export default CheckoutAddressScreen;
