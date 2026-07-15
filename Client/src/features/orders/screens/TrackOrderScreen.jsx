// src/features/orders/screens/TrackOrderScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle2, Circle, ClipboardList, Package, Truck, PackageCheck } from 'lucide-react-native';
import { useGetOrderByIdQuery, useTrackOrderQuery } from '../api/orderApi';
import { formatPrice } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const STEPS = [
  { id: 'placed', title: 'Order Placed', icon: ClipboardList },
  { id: 'confirmed', title: 'In Progress', icon: Package },
  { id: 'shipped', title: 'Shipped', icon: Truck },
  { id: 'delivered', title: 'Delivered', icon: PackageCheck },
];

const TrackOrderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params ?? {};

  const { data: trackData, isLoading: isTrackLoading } = useTrackOrderQuery(orderId, { skip: !orderId });
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(orderId, { skip: !orderId });

  const order = orderData?.order;
  const statusHistory = trackData?.statusHistory || [];
  const currentStatus = trackData?.orderStatus || 'placed';

  if (isTrackLoading || isOrderLoading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }
  if (!order) {
    return <View style={styles.center}><Text>Order not found</Text></View>;
  }

  // Assuming we show the first item for the top summary block
  const firstItem = order.items?.[0] || {};
  // Calculate delivery date logic (mock logic for demo: +7 days from creation)
  const createdAt = new Date(order.createdAt);
  const deliveryDate = new Date(createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const expectedDateStr = deliveryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const trackingId = `TRK${order._id.slice(-9).toUpperCase()}`;

  // Find index of current status to know how many steps are completed
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStatus);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Product Summary */}
        <View style={styles.productCard}>
          <View style={styles.productImagePlaceholder} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{firstItem.productTitle || 'Brown Suite'}</Text>
            <Text style={styles.productMeta}>Size : XL || Qty : {firstItem.qty}pcs</Text>
            <Text style={styles.productPrice}>{formatPrice(firstItem.priceAtAdd)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Order Details */}
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Expected Delivery Date</Text>
          <Text style={styles.detailsValue}>{expectedDateStr}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Tracking ID</Text>
          <Text style={styles.detailsValue}>{trackingId}</Text>
        </View>

        <View style={styles.divider} />

        {/* Order Status Timeline */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.timelineContainer}>
          {STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === STEPS.length - 1;
            
            // Find the history entry for timestamp
            const historyEntry = statusHistory.find(h => h.status === step.id);
            const timeStr = historyEntry 
              ? new Date(historyEntry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : (step.id === 'shipped' ? `Expected ${expectedDateStr}` : 'Pending');

            const StepIcon = step.icon;

            return (
              <View key={step.id} style={styles.stepRow}>
                {/* Left Side: Dots & Line */}
                <View style={styles.iconCol}>
                  <View style={[styles.dotWrapper, isCompleted && styles.dotWrapperActive]}>
                    <CheckCircle2 size={16} color={isCompleted ? colors.white : 'transparent'} />
                  </View>
                  {!isLast && (
                    <View style={[styles.line, isCompleted && !isCurrent ? styles.lineCompleted : styles.linePending]} />
                  )}
                </View>

                {/* Middle: Text Content */}
                <View style={styles.textCol}>
                  <Text style={[styles.stepTitle, !isCompleted && styles.textPending]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepTime}>{timeStr}</Text>
                </View>

                {/* Right Side: Specific Icon */}
                <View style={styles.rightIconCol}>
                  <StepIcon size={24} color={isCompleted ? '#333333' : '#B0B0B0'} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[6], paddingTop: spacing[12], 
    backgroundColor: '#F9F9F9' 
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  back:    { fontSize: 18, color: colors.text, fontWeight: '700' },
  title:   { ...textStyles.h4, color: colors.text, fontWeight: '700' },
  
  content: { padding: spacing[6] },

  productCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[2] },
  productImagePlaceholder: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#D9D9D9', marginRight: spacing[4] },
  productInfo: { flex: 1, justifyContent: 'center' },
  productName: { ...textStyles.h5, color: colors.text, fontWeight: '700', marginBottom: 2 },
  productMeta: { ...textStyles.caption, color: colors.textMuted, marginBottom: spacing[2] },
  productPrice: { ...textStyles.h5, color: colors.text, fontWeight: '800' },
  
  divider: { height: 1, backgroundColor: '#EAEAEA', marginVertical: spacing[6] },
  
  sectionTitle: { ...textStyles.h4, color: colors.text, fontWeight: '700', marginBottom: spacing[4] },
  
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[3] },
  detailsLabel: { ...textStyles.body1, color: colors.textMuted },
  detailsValue: { ...textStyles.body1, color: colors.text, fontWeight: '700' },

  timelineContainer: {
    paddingVertical: spacing[2],
  },
  stepRow: {
    flexDirection: 'row',
  },
  iconCol: {
    alignItems: 'center',
    width: 30,
    marginRight: spacing[4],
  },
  dotWrapper: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 2,
  },
  dotWrapperActive: {
    backgroundColor: '#333333',
  },
  line: {
    width: 3,
    flex: 1,
    minHeight: 50,
  },
  lineCompleted: { backgroundColor: '#333333' },
  linePending: { backgroundColor: '#E0E0E0' },
  
  textCol: {
    flex: 1,
    paddingBottom: spacing[6],
    justifyContent: 'flex-start',
  },
  stepTitle: { ...textStyles.body1, color: colors.text, fontWeight: '700', marginBottom: 2 },
  textPending: { color: colors.textMuted, fontWeight: '600' },
  stepTime: { ...textStyles.caption, color: colors.textMuted },

  rightIconCol: {
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
});

export default TrackOrderScreen;
