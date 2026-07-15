// src/features/orders/screens/CancelReturnScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useCancelOrderMutation, useReturnOrderMutation } from '../api/orderApi';
import { useToast } from '../../../context/ToastContext';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const CANCEL_REASONS = ['Changed my mind', 'Wrong item ordered', 'Found better price', 'Delivery too slow', 'Other'];

const CancelReturnScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const { orderId, type = 'cancel' } = route.params ?? {};
  const { showToast } = useToast();
  const [cancelOrder,  { isLoading: cancelling }] = useCancelOrderMutation();
  const [returnOrder,  { isLoading: returning  }] = useReturnOrderMutation();
  const [reason, setReason] = React.useState('');

  const handleSubmit = async () => {
    if (!reason) { showToast('Select a reason', 'warning'); return; }
    try {
      if (type === 'cancel') await cancelOrder({ id: orderId, reason }).unwrap();
      else                   await returnOrder({ id: orderId, reason }).unwrap();
      showToast(type === 'cancel' ? 'Order cancelled' : 'Return initiated', 'success');
      navigation.goBack();
    } catch {
      showToast('Request failed. Try again.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>{type === 'cancel' ? 'Cancel Order' : 'Return / Refund'}</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Select Reason</Text>
        {CANCEL_REASONS.map((r) => (
          <TouchableOpacity key={r} style={[styles.option, reason === r && styles.optionActive]} onPress={() => setReason(r)}>
            <View style={styles.radio}>{reason === r && <View style={styles.radioDot} />}</View>
            <Text style={[styles.optionText, reason === r && styles.optionTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
        <Button
          title={type === 'cancel' ? 'Cancel Order' : 'Submit Return'}
          variant="danger"
          onPress={handleSubmit}
          loading={cancelling || returning}
          style={styles.btn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingTop: spacing[12], backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back:   { fontSize: 22, color: colors.text },
  title:  { ...textStyles.h5, color: colors.text },
  content:{ padding: spacing[4] },
  label:  { ...textStyles.label, color: colors.text, marginBottom: spacing[3] },
  option: { flexDirection: 'row', alignItems: 'center', padding: spacing[4], borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, marginBottom: spacing[2], gap: spacing[3] },
  optionActive: { borderColor: colors.primary },
  optionText:   { ...textStyles.body2, color: colors.text },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
  radio:    { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  btn:    { marginTop: spacing[6] },
});

export default CancelReturnScreen;
