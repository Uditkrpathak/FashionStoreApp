// src/features/checkout/screens/AddCardScreen.jsx
import React from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, 
  Platform, ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '../../../context/ToastContext';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectUser } from '../../auth/store/authSlice';
import { useUpdateProfileMutation } from '../../auth/api/authApi';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const AddCardScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const user = useAppSelector(selectUser);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { number: '', name: '', expiry: '', cvv: '' },
  });

  // Watch inputs for live preview
  const cardNumber = watch('number', '');
  const cardName = watch('name', '');
  const cardExpiry = watch('expiry', '');

  const onSubmit = async (data) => {
    try {
      const cleanNum = data.number.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4);
      
      if (cleanNum.length < 16) {
        showToast('Card number must be 16 digits', 'warning');
        return;
      }
      
      const brand = cleanNum.startsWith('4') ? 'Visa' : cleanNum.startsWith('5') ? 'Mastercard' : 'Card';
      
      const parts = data.expiry.split('/');
      const expMonth = parseInt(parts[0], 10) || 12;
      const expYear = parseInt(parts[1], 10) || 29;
      
      const newCard = {
        last4,
        brand,
        expMonth,
        expYear,
        token: `tok_card_${Math.random().toString(36).substring(2, 10)}`,
      };

      const existingCards = user?.savedCards ?? [];
      
      // Avoid duplicate cards
      if (existingCards.some(c => c.last4 === last4 && c.brand === brand)) {
        showToast('Card already exists', 'warning');
        return;
      }

      await updateProfile({ savedCards: [...existingCards, newCard] }).unwrap();
      
      showToast('Card saved successfully!', 'success');
      navigation.goBack();
    } catch (err) {
      showToast('Failed to save card', 'error');
    }
  };

  const formatInputCardNumber = (text) => {
    const clean = text.replace(/\s?/g, '').replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < clean.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += clean[i];
    }
    return formatted;
  };

  const formatExpiry = (text) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  // Helper for virtual card group formatting
  const formatPreviewCardNumber = (num) => {
    const clean = num.replace(/\s?/g, '').replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += clean[i] || '•';
    }
    return formatted;
  };

  const cleanNum = cardNumber.replace(/\s+/g, '');
  const inferredBrand = cleanNum.startsWith('4') ? 'Visa' : cleanNum.startsWith('5') ? 'Mastercard' : 'Card';

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#F8F8F8' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
          <Text style={styles.title}>Add Card</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Virtual Credit Card Preview */}
          <View style={styles.cardPreview}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTypeLabel}>Credit / Debit Card</Text>
              <Text style={styles.brandText}>{inferredBrand.toUpperCase()}</Text>
            </View>

            <View style={styles.chip} />

            <Text style={styles.cardNumberText}>{formatPreviewCardNumber(cardNumber)}</Text>

            <View style={styles.cardFooter}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.cardHolderLabel}>CARDHOLDER NAME</Text>
                <Text style={styles.cardHolderValue} numberOfLines={1}>
                  {cardName.toUpperCase() || 'UDIT KUMAR PATHAK'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cardHolderLabel}>EXPIRES</Text>
                <Text style={styles.cardHolderValue}>{cardExpiry || 'MM/YY'}</Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <Controller 
            control={control} 
            name="number" 
            rules={{ required: 'Card number required', minLength: { value: 19, message: 'Enter 16-digit card number' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input 
                label="Card Number" 
                placeholder="•••• •••• •••• ••••" 
                value={value} 
                onChangeText={(text) => onChange(formatInputCardNumber(text))} 
                onBlur={onBlur} 
                keyboardType="number-pad" 
                maxLength={19} 
                error={errors.number?.message} 
              />
            )} 
          />

          <Controller 
            control={control} 
            name="name" 
            rules={{ required: 'Cardholder name required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input 
                label="Cardholder Name" 
                placeholder="As on card" 
                value={value} 
                onChangeText={onChange} 
                onBlur={onBlur} 
                autoCapitalize="characters" 
                error={errors.name?.message} 
              />
            )} 
          />

          <View style={styles.row}>
            <Controller 
              control={control} 
              name="expiry" 
              rules={{ required: 'Required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                  label="Expiry" 
                  placeholder="MM/YY" 
                  value={value} 
                  onChangeText={(text) => onChange(formatExpiry(text))} 
                  onBlur={onBlur} 
                  keyboardType="number-pad" 
                  maxLength={5} 
                  style={{ flex: 1, marginRight: spacing[3] }} 
                  error={errors.expiry?.message}
                />
              )} 
            />

            <Controller 
              control={control} 
              name="cvv" 
              rules={{ required: 'Required', minLength: { value: 3, message: 'Invalid' } }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                  label="CVV" 
                  placeholder="•••" 
                  value={value} 
                  onChangeText={onChange} 
                  onBlur={onBlur} 
                  keyboardType="number-pad" 
                  maxLength={3} 
                  secureTextEntry 
                  style={{ flex: 1 }} 
                  error={errors.cvv?.message}
                />
              )} 
            />
          </View>

          <Text style={styles.secure}>🔒 Your card details are encrypted and secure</Text>
          <Button title="Save Card" onPress={handleSubmit(onSubmit)} loading={isSaving} style={styles.btn} />
        </ScrollView>
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
  scrollContent: { padding: spacing[6], paddingBottom: 50 },
  cardPreview: { 
    backgroundColor: '#704F38', // Premium warm brown card
    borderRadius: 20, 
    padding: spacing[6], 
    marginBottom: spacing[8], 
    height: 200, 
    justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTypeLabel: {
    ...textStyles.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  brandText: {
    ...textStyles.h5,
    color: colors.white,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  chip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#E5C158',
    opacity: 0.9,
    marginVertical: spacing[1],
  },
  cardNumberText: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: colors.white,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardHolderValue: {
    ...textStyles.body2,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row:    { flexDirection: 'row' },
  secure: { ...textStyles.body2, color: colors.textMuted, textAlign: 'center', marginBottom: spacing[6], marginTop: spacing[2] },
  btn:    { backgroundColor: colors.primary, borderRadius: 30 },
});

export default AddCardScreen;
