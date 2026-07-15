// src/features/orders/screens/OrderDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetOrderByIdQuery } from '../api/orderApi';
import { formatDate, formatPrice, formatOrderStatus } from '../../../shared/utils/formatters';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const { orderId } = route.params ?? {};
  const { data, isLoading } = useGetOrderByIdQuery(orderId, { skip: !orderId });
  const order = data?.order;

  if (isLoading || !order) {
    return (
      <View style={styles.center}><Text style={{ color: colors.textMuted }}>Loading order...</Text></View>
    );
  }

  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order #{order._id?.slice(-8).toUpperCase()}</Text>
          <Text style={styles.date}>Placed on {formatDate(order.createdAt)}</Text>
          <Text style={[styles.status, { color: colors.success }]}>{formatOrderStatus(order.orderStatus)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items?.map((item, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemName}>{item.title ?? `Item ${i + 1}`}</Text>
              <Text style={styles.itemPrice}>{item.qty} × {formatPrice(item.priceAtAdd)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.row}><Text style={styles.label}>Subtotal</Text><Text style={styles.value}>{formatPrice(order.totals?.subtotal)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Shipping</Text><Text style={styles.value}>{formatPrice(order.totals?.shipping)}</Text></View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.totals?.grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.actionRow}>
          <Button title="Track Order" onPress={() => navigation.navigate('TrackOrder', { orderId })} style={{ flex: 1 }} />
          {canCancel && (
            <Button title="Cancel" variant="outline" onPress={() => navigation.navigate('CancelReturn', { orderId, type: 'cancel' })} style={{ flex: 1 }} />
          )}
        </View>
        <Button 
          title="E-Receipt" 
          variant="outline" 
          onPress={() => navigation.navigate('EReceipt', { orderId })} 
          style={{ width: '100%', marginTop: spacing[3] }} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingTop: spacing[12], backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back:   { fontSize: 22, color: colors.text },
  title:  { ...textStyles.h5, color: colors.text },
  content:{ padding: spacing[4] },
  section:{ backgroundColor: colors.surface, borderRadius: 16, padding: spacing[4], marginBottom: spacing[3] },
  sectionTitle: { ...textStyles.label, color: colors.textMuted, marginBottom: spacing[2] },
  date:   { ...textStyles.caption, color: colors.textMuted },
  status: { ...textStyles.body2, fontWeight: '700', marginTop: spacing[1] },
  item:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] },
  itemName: { ...textStyles.body2, color: colors.text, flex: 1 },
  itemPrice:{ ...textStyles.body2, fontWeight: '600', color: colors.text },
  row:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] },
  label:  { ...textStyles.body2, color: colors.textMuted },
  value:  { ...textStyles.body2, fontWeight: '600', color: colors.text },
  totalRow:  { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing[3], marginBottom: 0 },
  totalLabel:{ ...textStyles.body1, fontWeight: '700', color: colors.text },
  totalValue:{ ...textStyles.price, color: colors.primary },
  footer: { padding: spacing[4], backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  actionRow: { flexDirection: 'row', gap: spacing[3] }
});

export default OrderDetailScreen;
