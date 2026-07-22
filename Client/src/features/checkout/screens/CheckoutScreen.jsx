// src/features/checkout/screens/CheckoutScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Package } from 'lucide-react-native';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectSelectedAddress, selectDeliveryOption } from '../store/checkoutSlice';
import { selectCartItems } from '../../cart/store/cartSlice';
import { formatPrice } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const address  = useAppSelector(selectSelectedAddress);
  const delivery = useAppSelector(selectDeliveryOption);
  const items    = useAppSelector(selectCartItems);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#000000" stroke="#000000" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Shipping Address Section */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <MapPin size={24} color={colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{address ? (address.label || 'Home') : 'No Address Selected'}</Text>
            {address ? (
              <Text style={styles.cardDesc}>{address.line1}, {address.city}</Text>
            ) : (
              <Text style={styles.cardDesc}>Please select a delivery address</Text>
            )}
          </View>
          <TouchableOpacity style={styles.changeBtn} onPress={() => navigation.navigate('CheckoutAddress')}>
            <Text style={styles.changeBtnText}>CHANGE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Choose Shipping Type Section */}
        <Text style={styles.sectionTitle}>Choose Shipping Type</Text>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Package size={24} color={colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{delivery ? delivery.label : 'Select Shipping'}</Text>
            {delivery && <Text style={styles.cardDesc}>Estimated Arrival {delivery.estimated}</Text>}
          </View>
          <TouchableOpacity style={styles.changeBtn} onPress={() => navigation.navigate('CheckoutDelivery')}>
            <Text style={styles.changeBtnText}>CHANGE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Order List Section */}
        <Text style={styles.sectionTitle}>Order List</Text>
        <View style={styles.orderList}>
          {items.map((item) => {
            const key = `${item.productId}_${item.variantSku}`;
            return (
              <View key={key} style={styles.orderItem}>
                <View style={styles.orderImageContainer}>
                   <Image source={{ uri: item.image }} style={styles.orderImage} />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.orderVariant}>Size : {item.size}</Text>
                  <Text style={styles.orderPrice}>{formatPrice(item.price)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Sheet Button */}
      <View style={styles.bottomSheet}>
        <TouchableOpacity 
          style={[styles.checkoutBtn, (!address || !delivery) && { opacity: 0.5 }]} 
          disabled={!address || !delivery}
          onPress={() => navigation.navigate('CheckoutPayment')}
        >
          <Text style={styles.checkoutBtnText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing[6], paddingTop: spacing[14],
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  title:  { ...textStyles.h3, color: colors.text, fontWeight: '700' },
  content: { padding: spacing[6], paddingBottom: 100 },
  
  sectionTitle: { ...textStyles.h5, fontWeight: '700', color: colors.text, marginBottom: spacing[4] },
  
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[6] },
  iconWrapper: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8F8F8',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing[4],
  },
  cardInfo: { flex: 1 },
  cardTitle: { ...textStyles.body1, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardDesc: { ...textStyles.body2, color: colors.textMuted },
  changeBtn: { 
    backgroundColor: '#F8F8F8', borderRadius: 20, 
    paddingHorizontal: spacing[3], paddingVertical: 6,
  },
  changeBtnText: { ...textStyles.label, fontWeight: '700', color: colors.primary },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: spacing[2], marginBottom: spacing[6] },

  orderList: { gap: spacing[4] },
  orderItem: { flexDirection: 'row', alignItems: 'center' },
  orderImageContainer: {
    width: 70, height: 70, backgroundColor: '#F8F8F8', borderRadius: 12, overflow: 'hidden', marginRight: spacing[4]
  },
  orderImage: { width: '100%', height: '100%' },
  orderInfo: { flex: 1 },
  orderTitle: { ...textStyles.body1, fontWeight: '600', color: colors.text, marginBottom: 2 },
  orderVariant: { ...textStyles.body2, color: colors.textMuted, marginBottom: 4 },
  orderPrice: { ...textStyles.body1, fontWeight: '800', color: colors.text },
  
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: spacing[6],
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 15,
  },
  checkoutBtn: {
    backgroundColor: colors.primary, borderRadius: 30,
    paddingVertical: spacing[5], alignItems: 'center',
  },
  checkoutBtnText: { ...textStyles.body1, color: colors.white, fontWeight: '700' },
});

export default CheckoutScreen;
