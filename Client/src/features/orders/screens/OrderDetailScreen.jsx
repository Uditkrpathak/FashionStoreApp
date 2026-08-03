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

const getPaymentMethodText = (pm) => {
  if (!pm) return 'Cash on Delivery (COD)';
  if (typeof pm === 'string') {
    const lower = pm.toLowerCase();
    if (lower === 'cod') return 'Cash on Delivery (COD)';
    if (lower === 'razorpay') return 'Online Payment (Razorpay)';
    return pm;
  }
  if (pm.label) return pm.label;
  if (pm.name) return pm.name;
  if (pm.type === 'cod') return 'Cash on Delivery (COD)';
  if (pm.type === 'razorpay') return 'Online Payment (Razorpay)';
  return pm.type || 'Cash on Delivery (COD)';
};

const getPaymentStatusText = (status, pm) => {
  if (status === 'completed' || status === 'paid') return 'Paid / Completed';
  const isCod = !pm || (typeof pm === 'string' && pm.toLowerCase() === 'cod') || pm.type === 'cod' || pm.id === 'cod' || pm === 'COD';
  if (isCod) return 'Pending (Collect on Delivery)';
  return 'Pending';
};

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
  const canTrack = !['cancelled', 'returned'].includes(order.orderStatus);
  const isPaid = order.paymentStatus === 'completed' || order.paymentStatus === 'paid';

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
          <Text style={[styles.status, { color: order.orderStatus === 'cancelled' || order.returnRequest?.status === 'rejected' ? '#DC2626' : order.orderStatus === 'return_requested' ? '#D97706' : colors.success }]}>
            {formatOrderStatus(order.orderStatus, order.returnRequest)}
          </Text>
        </View>

        {/* Return & Refund Decision Card */}
        {(order.returnRequest?.status === 'pending' || order.orderStatus === 'return_requested') && (
          <View style={[styles.returnCard, { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' }]}>
            <View style={styles.returnCardHeader}>
              <Text style={[styles.returnCardTitle, { color: '#C2410C' }]}>📦 Return Request Pending Review</Text>
            </View>
            <Text style={styles.returnCardReason}>Reason: "{order.returnRequest?.reason || 'Return requested'}"</Text>
            <Text style={styles.returnCardNote}>
              Your return request has been received and is under review by store management.
            </Text>
          </View>
        )}

        {order.returnRequest?.status === 'rejected' && (
          <View style={[styles.returnCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
            <View style={styles.returnCardHeader}>
              <Text style={[styles.returnCardTitle, { color: '#B91C1C' }]}>❌ Return Rejected</Text>
            </View>
            <Text style={[styles.returnCardNote, { color: '#7F1D1D', fontWeight: '700', fontSize: 13, marginTop: 2 }]}>
              Return Rejected
            </Text>
            {order.returnRequest?.reason ? (
              <Text style={styles.returnCardReason}>Your Request Reason: "{order.returnRequest.reason}"</Text>
            ) : null}
            {order.returnRequest?.adminNotes ? (
              <Text style={[styles.returnCardNote, { color: '#7F1D1D', marginTop: 4 }]}>
                Admin Note: {order.returnRequest.adminNotes}
              </Text>
            ) : null}
          </View>
        )}

        {(order.returnRequest?.status === 'approved' || order.orderStatus === 'returned') && (
          <View style={[styles.returnCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <View style={styles.returnCardHeader}>
              <Text style={[styles.returnCardTitle, { color: '#047857' }]}>✅ Return Completed</Text>
            </View>
            <Text style={[styles.returnCardNote, { color: '#065F46', fontWeight: '700', fontSize: 13, marginTop: 2 }]}>
              Amount will credit in your bank in 3-4 working days
            </Text>
            {order.returnRequest?.reason ? (
              <Text style={styles.returnCardReason}>Reason: "{order.returnRequest.reason}"</Text>
            ) : null}
            <Text style={[styles.returnCardNote, { color: '#065F46', fontWeight: '600', marginTop: 4 }]}>
              Resolution: {order.returnRequest?.returnType === 'replacement' ? 'Replacement Order Created' : 'Refund Issued'}
              {order.creditNoteId ? ` (Credit Note: ${order.creditNoteId})` : ''}
            </Text>
            {order.returnRequest?.adminNotes ? (
              <Text style={[styles.returnCardNote, { color: '#065F46', marginTop: 4 }]}>
                Admin Note: {order.returnRequest.adminNotes}
              </Text>
            ) : null}
          </View>
        )}
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
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{getPaymentMethodText(order.paymentMethod)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status</Text>
            <Text style={[styles.value, { color: isPaid ? colors.success : '#D97706', fontWeight: '700' }]}>
              {getPaymentStatusText(order.paymentStatus, order.paymentMethod)}
            </Text>
          </View>
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
          {canTrack && (
            <Button title="Track Order" onPress={() => navigation.navigate('TrackOrder', { orderId })} style={{ flex: 1 }} />
          )}
          {canCancel && (
            <Button title="Cancel" variant="outline" onPress={() => navigation.navigate('CancelReturn', { orderId, type: 'cancel' })} style={{ flex: 1 }} />
          )}
          {order.orderStatus === 'delivered' && (
            <Button title="Return Item" variant="outline" onPress={() => navigation.navigate('CancelReturn', { orderId, type: 'return' })} style={{ flex: 1 }} />
          )}
          {order.orderStatus === 'delivered' && order.items?.[0]?.productId && (
            <Button 
              title="Leave Review" 
              onPress={() => navigation.navigate('WriteReview', { 
                productId: order.items[0].productId,
                productSnapshot: {
                  title: order.items[0].title,
                  image: order.items[0].image,
                  price: order.items[0].priceAtAdd ?? order.items[0].price,
                }
              })} 
              style={{ flex: 1 }} 
            />
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
  returnCard: { borderRadius: 16, borderPadding: spacing[4], padding: spacing[4], marginBottom: spacing[3], borderWidth: 1 },
  returnCardHeader: { marginBottom: spacing[1] },
  returnCardTitle: { fontSize: 13, fontWeight: '800' },
  returnCardReason: { fontSize: 12, fontWeight: '600', color: colors.text, marginTop: spacing[1] },
  returnCardNote: { fontSize: 12, color: colors.textMuted, marginTop: spacing[1] },
  footer: { padding: spacing[4], backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  actionRow: { flexDirection: 'row', gap: spacing[3] }
});

export default OrderDetailScreen;
