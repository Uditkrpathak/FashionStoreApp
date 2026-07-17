// src/features/checkout/screens/EReceiptScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Share as ShareIcon, Download } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useGetOrderByIdQuery } from '../../orders/api/orderApi';
import { formatPrice } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing, shadows } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const EReceiptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params ?? {};
  const { data, isLoading } = useGetOrderByIdQuery(orderId, { skip: !orderId });
  const order = data?.order;

  const generatePDF = async () => {
    if (!order) return;
    
    // Create HTML template for E-Receipt
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; }
            .title { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .subtitle { font-size: 14px; color: #777; }
            .divider { border-bottom: 1px solid #EEE; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .label { color: #777; font-size: 14px; }
            .value { font-weight: bold; font-size: 14px; }
            .total-row { margin-top: 30px; padding-top: 20px; border-top: 2px solid #333; }
            .total-label { font-size: 18px; font-weight: bold; }
            .total-value { font-size: 24px; font-weight: bold; color: #333; }
            .item-row { display: flex; align-items: center; margin-bottom: 20px; }
            .item-details { margin-left: 20px; }
            .item-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .item-meta { font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Fashion Store</div>
            <div class="subtitle">E-Receipt</div>
          </div>
          
          <div class="divider"></div>
          
          ${order.items.map(item => `
            <div class="item-row">
              <div class="item-details">
                <div class="item-title">${item.title || 'Product Item'}</div>
                <div class="item-meta">Qty: ${item.qty} | Price: ${formatPrice(item.priceAtAdd)}</div>
              </div>
            </div>
          `).join('')}
          
          <div class="divider"></div>
          
          <div class="row">
            <div class="label">Subtotal</div>
            <div class="value">${formatPrice(order.totals?.subtotal)}</div>
          </div>
          <div class="row">
            <div class="label">Shipping</div>
            <div class="value">${formatPrice(order.totals?.shipping)}</div>
          </div>
          
          <div class="row total-row">
            <div class="total-label">Total Amount</div>
            <div class="total-value">${formatPrice(order.totals?.grandTotal)}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="row">
            <div class="label">Order ID</div>
            <div class="value">#${order._id.slice(-8).toUpperCase()}</div>
          </div>
          <div class="row">
            <div class="label">Date</div>
            <div class="value">${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="row">
            <div class="label">Payment Status</div>
            <div class="value">${order.paymentStatus.toUpperCase()}</div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>E-Receipt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.receiptCard}>
          {/* Barcode Mock */}
          <View style={styles.barcodeContainer}>
            <View style={styles.barcodeMock}>
              {[...Array(30)].map((_, i) => (
                <View key={i} style={[styles.bar, { width: (i % 4) + 1 }]} />
              ))}
            </View>
          </View>
          
          <View style={styles.separator} />

          {/* Product Info */}
          {order.items?.map((item, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productTitle}>{item.title || 'Product Item'}</Text>
                <Text style={styles.productMeta}>Qty: {item.qty}</Text>
                <Text style={styles.productQty}>{formatPrice(item.priceAtAdd)}</Text>
              </View>
            </View>
          ))}
          
          <View style={styles.separator} />

          {/* Cost Breakdown */}
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>{formatPrice(order.totals?.subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>{formatPrice(order.totals?.shipping)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.labelTotal}>Total</Text>
            <Text style={styles.valueTotal}>{formatPrice(order.totals?.grandTotal)}</Text>
          </View>

          <View style={styles.separator} />

          {/* Payment Details */}
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{new Date(order.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{order._id.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.paymentStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnFilled]} onPress={generatePDF}>
            <Download size={20} color={colors.white} />
            <Text style={styles.actionBtnTextFilled}>Download E-Receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[4], paddingTop: spacing[12], 
    backgroundColor: '#F8F8F8' 
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  back:    { fontSize: 18, color: colors.text, fontWeight: '700' },
  title:   { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  content: { padding: spacing[6] },
  
  receiptCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing[6],
    ...shadows.md, shadowOpacity: 0.05,
    marginBottom: spacing[6],
  },
  barcodeContainer: { alignItems: 'center', marginBottom: spacing[2] },
  barcodeMock: { flexDirection: 'row', height: 60, width: '100%', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 },
  bar: { backgroundColor: '#000', height: 60 },
  
  separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: spacing[4] },
  
  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[2] },
  productImage: { width: 70, height: 70, borderRadius: 16, backgroundColor: '#F0F0F0' },
  productDetails: { flex: 1, marginLeft: spacing[4] },
  productTitle: { ...textStyles.h5, color: colors.text, fontWeight: '700', marginBottom: 2 },
  productMeta: { ...textStyles.caption, color: colors.textMuted, marginBottom: 2 },
  productQty: { ...textStyles.caption, color: colors.text, fontWeight: '600' },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  label: { ...textStyles.body2, color: colors.textMuted },
  value: { ...textStyles.body2, color: colors.text, fontWeight: '700' },
  labelTotal: { ...textStyles.body1, color: colors.text, fontWeight: '600' },
  valueTotal: { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  
  statusBadge: { backgroundColor: '#333333', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 12 },
  statusText: { ...textStyles.caption, color: colors.white, fontWeight: '700', textTransform: 'capitalize' },

  actionRow: { flexDirection: 'row', gap: spacing[4] },
  actionBtnFilled: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing[4], borderRadius: 24,
    backgroundColor: '#333333', gap: spacing[2]
  },
  actionBtnTextFilled: { color: colors.white, fontWeight: '700', fontSize: 16 },
});

export default EReceiptScreen;
