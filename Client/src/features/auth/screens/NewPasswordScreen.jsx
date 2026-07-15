// src/features/auth/screens/NewPasswordScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useResetPasswordMutation } from '../api/authApi';
import { useToast } from '../../../context/ToastContext';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { isStrongPassword } from '../../../shared/utils/validators';

const NewPasswordScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const { email }  = route.params ?? {};
  const { showToast } = useToast();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { control, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword({ email, password: data.password }).unwrap();
      showToast('Password reset! Please sign in.', 'success');
      navigation.replace('SignIn');
    } catch (err) {
      showToast(err?.data?.message ?? 'Reset failed.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.heading}>New Password 🔒</Text>
        <Text style={styles.sub}>Choose a strong password for your account.</Text>
        <Controller control={control} name="password" rules={{ validate: isStrongPassword }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="New Password" placeholder="Min 8 chars, uppercase + number" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry error={errors.password?.message} />
          )} />
        <Controller control={control} name="confirmPassword"
          rules={{ validate: (v) => v === getValues('password') || 'Passwords do not match' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Confirm Password" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry error={errors.confirmPassword?.message} />
          )} />
        <Button title="Reset Password" onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.btn} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing[6], paddingTop: spacing[14] },
  heading:   { ...textStyles.h2, color: colors.text, marginBottom: spacing[2] },
  sub:       { ...textStyles.body1, color: colors.textMuted, marginBottom: spacing[8] },
  btn:       { marginTop: spacing[2] },
});

export default NewPasswordScreen;
