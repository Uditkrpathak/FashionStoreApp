// src/features/checkout/screens/AddCardScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '../../../context/ToastContext';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const AddCardScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { number: '', name: '', expiry: '', cvv: '' },
  });

  const onSubmit = (data) => {
    // In production: tokenize via Razorpay/Stripe SDK, never send raw card data to your backend
    showToast('Card saved successfully!', 'success');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
          <Text style={styles.title}>Add Card</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.content}>
          <View style={styles.cardPreview}>
            <Text style={styles.cardLabel}>💳 Credit / Debit Card</Text>
          </View>
          <Controller control={control} name="number" rules={{ required: 'Card number required', minLength: { value: 16, message: 'Enter 16-digit card number' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Card Number" placeholder="•••• •••• •••• ••••" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" maxLength={16} error={errors.number?.message} />
            )} />
          <Controller control={control} name="name" rules={{ required: 'Cardholder name required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Cardholder Name" placeholder="As on card" value={value} onChangeText={onChange} onBlur={onBlur} autoCapitalize="characters" error={errors.name?.message} />
            )} />
          <View style={styles.row}>
            <Controller control={control} name="expiry" rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Expiry" placeholder="MM/YY" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" maxLength={5} style={{ flex: 1, marginRight: spacing[3] }} />
              )} />
            <Controller control={control} name="cvv" rules={{ required: true, minLength: { value: 3, message: '' } }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="CVV" placeholder="•••" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" maxLength={4} secureTextEntry style={{ flex: 1 }} />
              )} />
          </View>
          <Text style={styles.secure}>🔒 Your card details are encrypted and secure</Text>
          <Button title="Save Card" onPress={handleSubmit(onSubmit)} style={styles.btn} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[6], paddingTop: spacing[14], backgroundColor: '#F8F8F8' 
  },
  back:   { fontSize: 24, color: colors.text, fontWeight: '700' },
  title:  { ...textStyles.h3, color: colors.text, fontWeight: '800' },
  content:{ padding: spacing[6] },
  cardPreview: { 
    backgroundColor: colors.primary, borderRadius: 20, padding: spacing[6], 
    marginBottom: spacing[8], height: 200, justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
  },
  cardLabel:   { ...textStyles.h5, color: colors.white, fontWeight: '800' },
  row:    { flexDirection: 'row' },
  secure: { ...textStyles.body2, color: colors.textMuted, textAlign: 'center', marginBottom: spacing[6], marginTop: spacing[2] },
  btn:    { backgroundColor: colors.primary, borderRadius: 30 },
});

export default AddCardScreen;
