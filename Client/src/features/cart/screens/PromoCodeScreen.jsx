// src/features/cart/screens/PromoCodeScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ticket, Percent, ArrowLeft } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { applyCoupon, setCouponError, selectCartTotalPrice } from '../store/cartSlice';
import { useApplyCouponRemoteMutation } from '../api/cartApi';
import { useToast } from '../../../context/ToastContext';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const COUPONS = [
  { code: 'WELCOME200', title: 'Get 50% OFF', minSpend: 200, icon: Percent },
  { code: 'CASHBACK12', title: 'Up to ₹100 cashback', minSpend: 150, icon: Ticket },
  { code: 'FEST2COST', title: 'Get 50% OFF for Combo', minSpend: 400, icon: Ticket },
];

const PromoCodeScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useAppDispatch();
  const { showToast } = useToast();
  const [code, setCode] = useState('');
  const [applyCouponRemote] = useApplyCouponRemoteMutation();
  const totalPrice = useAppSelector(selectCartTotalPrice);

  const handleApplyCode = async (couponCode) => {
    const activeCode = couponCode || code;
    if (!activeCode.trim()) { 
      showToast('Enter a coupon code', 'warning'); 
      return; 
    }
    try {
      // Enforce minimum spend criteria for manual inputs matching the predefined coupons list
      const matchedCoupon = COUPONS.find(c => c.code.toUpperCase() === activeCode.trim().toUpperCase());
      if (matchedCoupon && totalPrice < matchedCoupon.minSpend) {
        const diff = (matchedCoupon.minSpend - totalPrice).toFixed(2);
        showToast(`Add items worth ₹${diff} more to unlock this coupon`, 'warning');
        return;
      }

      const res = await applyCouponRemote({ code: activeCode.trim() }).unwrap();
      dispatch(applyCoupon(res.coupon));
      showToast(`${res.coupon.code} applied! 🎉`, 'success');
      navigation.goBack();
    } catch (err) {
      dispatch(setCouponError(err?.data?.message ?? 'Invalid coupon code'));
      showToast(err?.data?.message ?? 'Invalid coupon code', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Coupon</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Custom Input Box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter promo code"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyBtn} onPress={() => handleApplyCode()}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Best offers for you</Text>

        {/* Coupons List */}
        {COUPONS.map((coupon) => {
          const Icon = coupon.icon;
          const isUnlocked = totalPrice >= coupon.minSpend;
          const difference = coupon.minSpend - totalPrice;
          
          return (
            <View key={coupon.code} style={styles.ticketCard}>
              {/* Left cutout */}
              <View style={styles.leftCutout} />
              {/* Right cutout */}
              <View style={styles.rightCutout} />

              {/* Top content area */}
              <View style={styles.ticketTop}>
                <Text style={styles.ticketCode}>{coupon.code}</Text>
                
                <Text style={[styles.ticketRequirement, isUnlocked ? styles.unlockedText : styles.lockedText]}>
                  {isUnlocked ? 'Coupon unlocked!' : `Add items worth ₹${difference} more to unlock`}
                </Text>

                <View style={styles.badgeRow}>
                  <View style={styles.badgeIconWrapper}>
                    <Icon size={12} color="#FFF" />
                  </View>
                  <Text style={styles.badgeText}>{coupon.title}</Text>
                </View>
              </View>

              {/* Separator Line */}
              <View style={styles.separatorLine} />

              {/* Bottom button area */}
              <TouchableOpacity 
                style={[styles.ticketBottom, !isUnlocked && styles.disabledBottom]}
                onPress={() => isUnlocked && handleApplyCode(coupon.code)}
                disabled={!isUnlocked}
              >
                <Text style={[styles.bottomBtnText, !isUnlocked && styles.disabledBtnText]}>
                  {isUnlocked ? 'APPLY CODE' : 'LOCKED'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[6], paddingTop: spacing[14], 
    backgroundColor: '#F8F8F8' 
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: '#EEEEEE', alignItems: 'center', justifyContent: 'center' },
  title:  { ...textStyles.h3, color: colors.text, fontWeight: '700' },
  content:{ paddingHorizontal: spacing[6], paddingBottom: spacing[10] },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing[8],
    backgroundColor: colors.white, borderRadius: 30,
    paddingLeft: spacing[5], paddingRight: spacing[2], paddingVertical: spacing[2],
    borderWidth: 1, borderColor: '#EEEEEE'
  },
  input: {
    flex: 1, height: 50,
    ...textStyles.body1, color: colors.text, fontWeight: '600'
  },
  applyBtn: { 
    backgroundColor: colors.primary, paddingHorizontal: spacing[6], height: 46,
    borderRadius: 23, alignItems: 'center', justifyContent: 'center'
  },
  applyBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  
  sectionTitle: {
    ...textStyles.body1,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing[4],
  },

  ticketCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: spacing[4],
    position: 'relative',
    overflow: 'hidden',
  },
  ticketTop: {
    padding: spacing[4],
  },
  ticketCode: {
    ...textStyles.h4,
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ticketRequirement: {
    ...textStyles.caption,
    marginTop: 4,
    marginBottom: spacing[3],
    fontWeight: '500',
  },
  lockedText: {
    color: colors.textMuted,
  },
  unlockedText: {
    color: '#2E7D32',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  badgeText: {
    ...textStyles.body2,
    color: colors.text,
    fontWeight: '700',
  },
  separatorLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
  },
  ticketBottom: {
    backgroundColor: '#F5F5F5',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBottom: {
    backgroundColor: '#FAFAFA',
  },
  bottomBtnText: {
    ...textStyles.body2,
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  disabledBtnText: {
    color: colors.textMuted,
  },
  leftCutout: {
    position: 'absolute',
    left: -10,
    bottom: 38, // center aligned with separator line
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    zIndex: 10,
  },
  rightCutout: {
    position: 'absolute',
    right: -10,
    bottom: 38, // center aligned with separator line
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    zIndex: 10,
  },
});

export default PromoCodeScreen;
