// src/features/checkout/screens/OrderSuccessScreen.jsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectActiveOrder } from '../../orders/store/orderSlice';
import { Check } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const OrderSuccessScreen = () => {
  const navigation = useNavigation();
  const activeOrder = useAppSelector(selectActiveOrder);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  const goToOrder = () => {
    // Reset to tabs then navigate to track order
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'App',
            state: {
              routes: [
                { name: 'Tabs' },
                { name: 'MyOrders' },
                { name: 'TrackOrder', params: { orderId: activeOrder?._id } }
              ]
            }
          }
        ],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
          <Check size={48} color={colors.white} strokeWidth={3} />
        </Animated.View>

        <Animated.View style={{ opacity, alignItems: 'center' }}>
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.sub}>Thank you for your purchase.</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewOrderBtn} onPress={goToOrder}>
          <Text style={styles.viewOrderBtnText}>View Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
  },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#333333',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing[8],
  },
  title: { ...textStyles.h2, color: colors.text, textAlign: 'center', marginBottom: spacing[2], fontWeight: '800' },
  sub: { ...textStyles.body1, color: colors.textMuted, textAlign: 'center' },

  footer: {
    padding: spacing[6], backgroundColor: '#F9F9F9',
    paddingBottom: Platform.OS === 'ios' ? spacing[10] : spacing[8]
  },
  viewOrderBtn: {
    backgroundColor: '#333333',
    height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    width: '100%',
  },
  viewOrderBtnText: { ...textStyles.body1, color: colors.white, fontWeight: '700' },
});

export default OrderSuccessScreen;
