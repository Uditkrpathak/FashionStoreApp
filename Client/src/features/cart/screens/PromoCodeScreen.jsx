// src/features/cart/screens/PromoCodeScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ticket, Percent } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { applyCoupon, setCouponError } from '../store/cartSlice';
import { useApplyCouponRemoteMutation } from '../api/cartApi';
import { useToast } from '../../../context/ToastContext';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const COUPONS = [
  { code: 'SAVE10', title: 'Special 10% Off', desc: 'Special promo only valid today', icon: Percent },
  { code: 'WELCOME20', title: 'Discount 20% Off', desc: 'Special promo only valid today', icon: Ticket },
  { code: 'FLAT50', title: 'Discount 50% Off', desc: 'Special promo only valid today', icon: Ticket },
];

const PromoCodeScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useAppDispatch();
  const { showToast } = useToast();
  const [code, setCode] = useState('');
  const [applyCouponRemote] = useApplyCouponRemoteMutation();

  const handleApply = async () => {
    if (!code.trim()) { showToast('Enter a coupon code', 'warning'); return; }
    try {
      const res = await applyCouponRemote({ code: code.trim() }).unwrap();
      dispatch(applyCoupon(res.data.coupon));
      showToast(`${res.data.coupon.code} applied! 🎉`, 'success');
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
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Apply Promo Code</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Input box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter promo code"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Coupons List */}
        {COUPONS.map((coupon, index) => {
          const Icon = coupon.icon;
          return (
            <View key={index} style={styles.ticketContainer}>
              {/* Left Ticket Part */}
              <View style={styles.ticketLeft}>
                <View style={styles.iconCircle}>
                  <Icon size={24} color={colors.primary} />
                </View>
                <View style={styles.ticketDetails}>
                  <Text style={styles.ticketTitle}>{coupon.title}</Text>
                  <Text style={styles.ticketDesc}>{coupon.desc}</Text>
                </View>
              </View>
              
              {/* Dashed Line separator */}
              <View style={styles.dashedLineContainer}>
                {/* Top cutout */}
                <View style={[styles.cutout, styles.cutoutTop]} />
                <View style={styles.dashedLine} />
                {/* Bottom cutout */}
                <View style={[styles.cutout, styles.cutoutBottom]} />
              </View>

              {/* Right Ticket Part */}
              <TouchableOpacity 
                style={styles.ticketRight}
                onPress={() => setCode(coupon.code)}
              >
                <Text style={styles.useText}>Use</Text>
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
    padding: spacing[4], paddingTop: spacing[12], 
    backgroundColor: '#F8F8F8' 
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  back:   { fontSize: 18, color: colors.text, fontWeight: '700' },
  title:  { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  content:{ padding: spacing[4] },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing[8],
    backgroundColor: colors.white, borderRadius: 30,
    paddingLeft: spacing[5], paddingRight: spacing[2], paddingVertical: spacing[2],
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
  
  ticketContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing[4],
    overflow: 'hidden',
  },
  ticketLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing[4]
  },
  ticketDetails: {
    flex: 1,
  },
  ticketTitle: { ...textStyles.h5, color: colors.text, fontWeight: '800', marginBottom: spacing[1] },
  ticketDesc: { ...textStyles.caption, color: colors.textMuted },
  
  dashedLineContainer: {
    width: 20, // space for cutouts and line
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedLine: {
    width: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    position: 'absolute',
  },
  cutout: {
    width: 20, height: 20,
    borderRadius: 10,
    backgroundColor: '#F8F8F8', // matches screen bg
    position: 'absolute',
  },
  cutoutTop: { top: -10 },
  cutoutBottom: { bottom: -10 },
  
  ticketRight: {
    paddingHorizontal: spacing[6],
    justifyContent: 'center',
    alignItems: 'center',
  },
  useText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  }
});

export default PromoCodeScreen;
