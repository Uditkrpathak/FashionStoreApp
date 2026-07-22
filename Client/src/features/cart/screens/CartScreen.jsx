// src/features/cart/screens/CartScreen.jsx
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import {
  selectCartItems, selectCartTotalPrice, selectCoupon, selectDiscountedTotal,
  removeFromCart, updateQty, removeCoupon
} from '../store/cartSlice';
import EmptyState from '../../../shared/components/EmptyState';
import { formatPrice } from '../../../shared/utils/formatters';
import { colors }    from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const CartScreen = () => {
  const navigation     = useNavigation();
  const dispatch       = useAppDispatch();
  const items          = useAppSelector(selectCartItems);
  const totalPrice     = useAppSelector(selectCartTotalPrice);
  const discountedTotal = useAppSelector(selectDiscountedTotal);
  const coupon         = useAppSelector(selectCoupon);

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={20} width={20} height={20} color="#000000" stroke="#000000" strokeWidth={2.2} />
          </TouchableOpacity>
          <Text style={styles.title}>My Cart</Text>
          <View style={{ width: 44 }} />
        </View>
        <EmptyState type="cart" actionLabel="Shop Now" onAction={() => navigation.navigate('HomeTab')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} width={20} height={20} color="#000000" stroke="#000000" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>My Cart</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 400 }}>
        {items.map((item) => {
          const key = `${item.productId}_${item.variantSku}`;
          return (
            <View key={key} style={styles.itemCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemSize}>Size : {item.size}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{formatPrice(item.price)}</Text>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => {
                      if (item.quantity === 1) dispatch(removeFromCart(key));
                      else dispatch(updateQty({ key, quantity: item.quantity - 1 }));
                    }}>
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => dispatch(updateQty({ key, quantity: item.quantity + 1 }))}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.promoContainer}>
          <TextInput 
            style={styles.promoInput} 
            placeholder={coupon ? coupon.code : "Promo Code"} 
            placeholderTextColor={coupon ? colors.primary : colors.textMuted}
            value={coupon ? `${coupon.code} Applied (${coupon.discountType === 'percentage' || coupon.type === 'percent' ? `${coupon.discountValue || coupon.discount}%` : `₹${coupon.discountValue || coupon.discount}`} OFF)` : ''}
            editable={false}
          />
          {coupon ? (
            <TouchableOpacity style={[styles.applyBtn, { backgroundColor: '#F0EBE5' }]} onPress={() => dispatch(removeCoupon())}>
              <Text style={[styles.applyBtnText, { color: colors.primary }]}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.applyBtn} onPress={() => navigation.navigate('PromoCode')}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub-Total</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>{formatPrice(25)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={styles.summaryValue}>−{formatPrice(totalPrice - discountedTotal)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total Cost</Text>
          <Text style={styles.totalValue}>{formatPrice(discountedTotal + 25)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.checkoutBtn} 
          onPress={() => navigation.navigate('Modals', { screen: 'CheckoutMain' })}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
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
  itemCard: {
    flexDirection: 'row', backgroundColor: colors.white,
    padding: spacing[3], marginHorizontal: spacing[6], marginBottom: spacing[4],
    borderRadius: 24,
  },
  imageContainer: {
    width: 90, height: 90, backgroundColor: '#F0F0F0',
    borderRadius: 16, overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  itemInfo: {
    flex: 1, paddingLeft: spacing[4], justifyContent: 'center'
  },
  itemTitle: { ...textStyles.body1, fontWeight: '600', color: colors.text, marginBottom: 2 },
  itemSize: { ...textStyles.body2, color: colors.textMuted, marginBottom: spacing[2] },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { ...textStyles.h4, fontWeight: '700', color: colors.text },
  qtyControls: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F8F8', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  qtyBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, color: colors.text, fontWeight: '500' },
  qtyText: { ...textStyles.body1, fontWeight: '600', width: 24, textAlign: 'center' },
  
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    padding: spacing[6],
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 15,
  },
  promoContainer: {
    flexDirection: 'row', backgroundColor: colors.background,
    borderRadius: 30, paddingLeft: spacing[4], paddingRight: 6,
    paddingVertical: 6, marginBottom: spacing[6],
    alignItems: 'center',
  },
  promoInput: {
    flex: 1, ...textStyles.body2, color: colors.text, height: 40,
  },
  applyBtn: {
    backgroundColor: colors.primary, borderRadius: 24,
    paddingHorizontal: spacing[5], paddingVertical: 10,
  },
  applyBtnText: { ...textStyles.body2, color: colors.white, fontWeight: '600' },
  
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[3] },
  summaryLabel: { ...textStyles.body1, color: colors.textMuted, fontWeight: '500' },
  summaryValue: { ...textStyles.body1, color: colors.text, fontWeight: '700' },
  divider: { height: 2, borderStyle: 'dashed', borderColor: '#EEEEEE', borderRadius: 1, borderWidth: 1, marginVertical: spacing[4] },
  totalLabel: { ...textStyles.body1, color: colors.textMuted, fontWeight: '600' },
  totalValue: { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  
  checkoutBtn: {
    backgroundColor: colors.primary, borderRadius: 30,
    paddingVertical: spacing[5], alignItems: 'center',
    marginTop: spacing[6],
  },
  checkoutBtnText: { ...textStyles.body1, color: colors.white, fontWeight: '700' },
});

export default CartScreen;
