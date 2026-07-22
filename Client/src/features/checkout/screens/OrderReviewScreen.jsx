// src/features/checkout/screens/OrderReviewScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectCheckout, resetCheckout } from '../store/checkoutSlice';
import { selectCartItems, selectDiscountedTotal, selectCoupon, clearCart } from '../../cart/store/cartSlice';
import { setActiveOrder } from '../../orders/store/orderSlice';
import { usePlaceOrderMutation, useVerifyPaymentMutation } from '../../orders/api/orderApi';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../shared/components/Button';
import { formatPrice } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { useGetPublicSettingsQuery } from '../../profile/store/userApi';

const OrderReviewScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const checkout = useAppSelector(selectCheckout);
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectDiscountedTotal);
  const coupon = useAppSelector(selectCoupon);
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // Load public store settings
  const { data: settingsData } = useGetPublicSettingsQuery();
  const settings = settingsData?.settings || [];
  const shippingSet = settings.find(s => s.key === 'free_shipping_limit');
  const freeShippingLimit = shippingSet ? Number(shippingSet.value) : 999999;

  const isFreeShipping = total >= freeShippingLimit;
  const deliveryPrice = isFreeShipping ? 0 : (checkout.deliveryOption?.price ?? 0);
  const grandTotal = total + deliveryPrice;

  const handlePlaceOrder = async () => {
    try {
      const formattedItems = (items || [])
        .filter(Boolean)
        .map((i) => ({
          productId: i.productId,
          variantSku: i.variantSku,
          qty: i.quantity ?? 1,
          priceAtAdd: i.price ?? 0,
          title: i.title,
          image: i.image,
          color: i.color,
          size: i.size
        }));

      const res = await placeOrder({
        items: formattedItems,
        shippingAddress: checkout.selectedAddress,
        deliveryOption: checkout.deliveryOption,
        paymentMethod: checkout.paymentMethod,
        coupon,
      }).unwrap();

      const { order, razorpayOrderId } = res;

      if (razorpayOrderId) {
        const options = {
          description: 'Fashion Store Purchase',
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
          amount: String(Math.round(grandTotal * 100)),
          name: 'Fashion Store',
          order_id: razorpayOrderId,
          theme: { color: '#1A1A2E' }
        };

        RazorpayCheckout.open(options).then(async (data) => {
          // Success
          try {
            await verifyPayment({
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature
            }).unwrap();

            dispatch(setActiveOrder(order));
            dispatch(clearCart());
            dispatch(resetCheckout());
            navigation.replace('OrderSuccess');
          } catch (err) {
            showToast('Payment verification failed on server.', 'error');
          }
        }).catch((error) => {
          // Error
          Alert.alert('Payment Error', error?.message || error?.description || JSON.stringify(error));
          showToast('Payment failed', 'error');
        });
      } else {
        // COD or other
        dispatch(setActiveOrder(order));
        dispatch(clearCart());
        dispatch(resetCheckout());
        navigation.replace('OrderSuccess');
      }
    } catch (err) {
      showToast(err?.data?.message ?? 'Order failed. Try again.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Review Order</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Delivery Address">
          <Text style={styles.info}>{checkout.selectedAddress?.line1}, {checkout.selectedAddress?.city}</Text>
        </Section>
        <Section title="Delivery Method">
          <Text style={styles.info}>{checkout.deliveryOption?.label} · {formatPrice(deliveryPrice)}</Text>
        </Section>
        <Section title="Payment">
          <Text style={styles.info}>{checkout.paymentMethod?.type?.toUpperCase()}</Text>
        </Section>
        <Section title={`Items (${items.length})`}>
          {items.map((item) => (
            <View key={`${item.productId}_${item.variantSku}`} style={styles.item}>
              <Text style={styles.itemName} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemPrice}>{item.quantity} × {formatPrice(item.price)}</Text>
            </View>
          ))}
        </Section>
        <Section title="Price Summary">
          <View style={styles.priceRow}>
            <Text style={styles.label}>Items</Text>
            <Text style={styles.value}>{formatPrice(total)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>{formatPrice(deliveryPrice)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
          </View>
        </Section>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title={`Place Order · ${formatPrice(grandTotal)}`}
          onPress={handlePlaceOrder}
          loading={isLoading}
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[6], paddingTop: spacing[14], backgroundColor: '#F8F8F8'
  },
  back: { fontSize: 24, color: colors.text, fontWeight: '700' },
  title: { ...textStyles.h3, color: colors.text, fontWeight: '800' },
  content: { padding: spacing[6] },
  section: {
    backgroundColor: colors.white, borderRadius: 20, padding: spacing[5], marginBottom: spacing[4],
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  sectionTitle: { ...textStyles.body2, color: colors.textMuted, fontWeight: '700', marginBottom: spacing[3], textTransform: 'uppercase' },
  info: { ...textStyles.body1, color: colors.text, fontWeight: '600' },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[3] },
  itemName: { ...textStyles.body2, color: colors.text, flex: 1, paddingRight: spacing[4] },
  itemPrice: { ...textStyles.body2, fontWeight: '800', color: colors.text },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[3] },
  label: { ...textStyles.body2, color: colors.textMuted },
  value: { ...textStyles.body2, fontWeight: '700', color: colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: spacing[4], marginTop: spacing[2], marginBottom: 0 },
  totalLabel: { ...textStyles.body1, fontWeight: '800', color: colors.text },
  totalValue: { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  footer: {
    marginTop: 'auto',
    padding: spacing[6],
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  checkoutBtn: { backgroundColor: colors.primary, borderRadius: 30 },
});

export default OrderReviewScreen;
