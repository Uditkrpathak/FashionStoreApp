// src/features/checkout/screens/CheckoutPaymentScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { setPaymentMethod, selectPaymentMethod } from '../store/checkoutSlice';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing, shadows } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const METHODS = [
  { id: 'razorpay', label: 'Razorpay',            icon: '⚡', sub: 'Pay via UPI, Cards, NetBanking' },
  { id: 'card',     label: 'Credit / Debit Card', icon: '💳', sub: 'Visa, Mastercard, RuPay' },
];

const CheckoutPaymentScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useAppDispatch();
  const selected   = useAppSelector(selectPaymentMethod);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Payment Method</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.content}>
        {METHODS.map((m) => (
          <TouchableOpacity key={m.id} style={[styles.card, selected?.type === m.id && styles.cardActive]}
            onPress={() => dispatch(setPaymentMethod({ type: m.id }))}>
            <Text style={styles.icon}>{m.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{m.label}</Text>
              <Text style={styles.sub}>{m.sub}</Text>
            </View>
            <View style={styles.radio}>
              {selected?.type === m.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addCard} onPress={() => navigation.navigate('AddCard')}>
          <Text style={styles.addCardText}>+ Add New Card</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Button 
          title="Review Order" 
          onPress={() => navigation.navigate('OrderReview')} 
          disabled={!selected} 
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[6], paddingTop: spacing[14], backgroundColor: '#F8F8F8' 
  },
  back: { fontSize: 24, color: colors.text, fontWeight: '700' }, 
  title: { ...textStyles.h3, color: colors.text, fontWeight: '800' },
  content: { padding: spacing[6] },
  card: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, 
    borderRadius: 20, padding: spacing[5], marginBottom: spacing[4], 
    borderWidth: 1.5, borderColor: 'transparent', gap: spacing[4],
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  cardActive: { borderColor: colors.primary },
  icon: { fontSize: 28 },
  label:{ ...textStyles.body1, fontWeight: '800', color: colors.text, marginBottom: 2 },
  sub:  { ...textStyles.body2, color: colors.textMuted },
  radio:{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary },
  addCard: { 
    padding: spacing[4], borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, 
    borderRadius: 20, alignItems: 'center', marginTop: spacing[2]
  },
  addCardText: { ...textStyles.label, color: colors.primary, fontWeight: '700' },
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

export default CheckoutPaymentScreen;
