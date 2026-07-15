// src/features/auth/screens/ForgotPasswordScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useForgotPasswordMutation } from '../api/authApi';
import { useToast } from '../../../context/ToastContext';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { isEmail } from '../../../shared/utils/validators';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      showToast('OTP sent to your email', 'success');
      navigation.navigate('VerifyOTP', { email: data.email, flow: 'forgot' });
    } catch (err) {
      showToast(err?.data?.message ?? 'Failed to send OTP.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Forgot Password? 🔑</Text>
        <Text style={styles.sub}>Enter your email and we'll send you an OTP to reset your password.</Text>
        <Controller control={control} name="email" rules={{ validate: isEmail }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Email Address" placeholder="you@email.com" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
          )} />
        <Button title="Send OTP" onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.btn} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing[6], paddingTop: spacing[14] },
  back:      { marginBottom: spacing[6] },
  backText:  { ...textStyles.label, color: colors.primary },
  heading:   { ...textStyles.h2, color: colors.text, marginBottom: spacing[2] },
  sub:       { ...textStyles.body1, color: colors.textMuted, marginBottom: spacing[8], lineHeight: 24 },
  btn:       { marginTop: spacing[2] },
});

export default ForgotPasswordScreen;
