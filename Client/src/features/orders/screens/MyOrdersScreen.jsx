// src/features/orders/screens/MyOrdersScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetOrdersQuery } from '../api/orderApi';
import EmptyState from '../../../shared/components/EmptyState';
import { OrderCardSkeleton } from '../../../shared/components/SkeletonLoader';
import { formatDate, formatOrderStatus } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing, shadows } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const TABS = ['Active', 'Completed', 'Cancelled'];
const STATUS_MAP = {
  Active:    ['placed', 'confirmed', 'shipped'],
  Completed: ['delivered'],
  Cancelled: ['cancelled', 'returned'],
};

const MyOrdersScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('Active');
  const { data, isLoading } = useGetOrdersQuery({ status: STATUS_MAP[tab].join(',') });
  const orders = data?.orders ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <FlatList data={[1,2,3]} keyExtractor={(i) => String(i)} renderItem={() => <OrderCardSkeleton />} contentContainerStyle={styles.list} />
      ) : orders.length === 0 ? (
        <EmptyState type="orders" actionLabel="Shop Now" onAction={() => navigation.navigate('HomeTab')} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(i) => i._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const firstItem = item.items?.[0] || {};
            const product = firstItem.product || {};
            const imageUri = product.images?.[0] || 'https://via.placeholder.com/100';
            
            return (
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}>
                <View style={styles.cardContent}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  <View style={styles.details}>
                    <Text style={styles.productName} numberOfLines={1}>{product.title || 'Product Name'}</Text>
                    <Text style={styles.metaText}>Color: {firstItem.color || 'N/A'}  |  Size: {firstItem.size || 'N/A'}</Text>
                    
                    <View style={styles.statusRow}>
                      <Text style={styles.price}>₹{item.totals?.grandTotal}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{formatOrderStatus(item.orderStatus)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardFooter}>
                  {tab === 'Active' ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('TrackOrder', { orderId: item._id })}>
                      <Text style={styles.actionBtnText}>Track Order</Text>
                    </TouchableOpacity>
                  ) : tab === 'Completed' ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('WriteReview', { productId: product._id })}>
                      <Text style={styles.actionBtnText}>Leave Review</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </TouchableOpacity>
            )
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[4], paddingTop: spacing[12], 
    backgroundColor: colors.white 
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  back:   { fontSize: 18, color: colors.text, fontWeight: '700' },
  title:  { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  tabsRow: { 
    flexDirection: 'row', paddingHorizontal: spacing[4], paddingVertical: spacing[2],
    justifyContent: 'space-between'
  },
  tab: { 
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing[3], marginHorizontal: spacing[1],
    borderRadius: 20,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  tabActive: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary,
  },
  tabText: { ...textStyles.body2, color: colors.text, fontWeight: '600' },
  tabTextActive: { color: colors.white },
  list:   { padding: spacing[4], paddingBottom: spacing[10] },
  card: { 
    backgroundColor: colors.white, borderRadius: 20, padding: spacing[4], marginBottom: spacing[4], 
    borderWidth: 1, borderColor: '#F0F0F0',
    ...shadows.sm, shadowOpacity: 0.05
  },
  cardContent: { flexDirection: 'row', marginBottom: spacing[4] },
  image: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#F0F0F0' },
  details: { flex: 1, marginLeft: spacing[3], justifyContent: 'center' },
  productName: { ...textStyles.h5, color: colors.text, fontWeight: '700', marginBottom: spacing[1] },
  metaText: { ...textStyles.caption, color: colors.textMuted, marginBottom: spacing[2] },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { ...textStyles.h5, color: colors.text, fontWeight: '800' },
  statusBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: 8 },
  statusText: { ...textStyles.caption, color: colors.text, fontWeight: '600' },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: spacing[3], alignItems: 'flex-end' },
  actionBtn: { 
    backgroundColor: colors.primary, paddingHorizontal: spacing[6], paddingVertical: spacing[2], 
    borderRadius: 20 
  },
  actionBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});

export default MyOrdersScreen;
