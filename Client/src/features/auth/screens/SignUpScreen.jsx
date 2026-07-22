// src/features/auth/screens/SignUpScreen.jsx
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation }   from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useRegisterMutation } from '../api/authApi';
import { useToast }   from '../../../context/ToastContext';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors }    from '../../../theme/colors';
import { spacing }   from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { isEmail, isPhone, isStrongPassword, required, minLength } from '../../../shared/utils/validators';

const SignUpScreen = () => {
  const navigation  = useNavigation();
  const { showToast } = useToast();
  const [register, { isLoading }] = useRegisterMutation();

  const { control, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await register({ name: data.name, email: data.email, password: data.password }).unwrap();
      if (res.devOtp) {
        Alert.alert('Development OTP', `Your verification code is: ${res.devOtp}`);
      }
      navigation.navigate('VerifyOTP', { email: data.email });
    } catch (err) {
      showToast(err?.data?.message ?? 'Registration failed.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.sub}>Fill your information below or register{'\n'}with your social account.</Text>

        <Controller control={control} name="name" rules={{ validate: required('Name') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Name" placeholder="John Doe" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
          )} />

        <Controller control={control} name="email" rules={{ validate: isEmail }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Email" placeholder="example@gmail.com" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
          )} />

        <Controller control={control} name="password" rules={{ validate: isStrongPassword }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Password" placeholder="***************" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry error={errors.password?.message} />
          )} />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity style={styles.checkbox} onPress={() => {}}>
            <Text style={styles.checkmark}>✓</Text>
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Agree with{' '}
            <TouchableOpacity onPress={() => showToast('Terms & Conditions will open in a browser', 'info')} style={{ top: 2 }}>
              <Text style={styles.linkUnderline}>Terms & Condition</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <Button title="Sign Up" onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.btn} />

        {/* Or sign up with */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or sign up with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome5 name="apple" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome5 name="google" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome5 name="facebook-f" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.linkUnderline}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content:   { padding: spacing[6], paddingTop: spacing[16], flexGrow: 1 },
  heading:   { ...textStyles.h2, color: colors.text, textAlign: 'center', marginBottom: spacing[2], fontWeight: '700' },
  sub:       { ...textStyles.body2, color: colors.textMuted, textAlign: 'center', marginBottom: spacing[10] },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  checkmark: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  checkboxText: { ...textStyles.body2, color: colors.text },
  linkUnderline: { ...textStyles.body2, color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' },
  btn:       { marginBottom: spacing[8], backgroundColor: colors.primary, borderRadius: 30 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[8],
    paddingHorizontal: spacing[4],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { ...textStyles.body2, color: colors.textMuted, paddingHorizontal: spacing[4] },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[10],
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconText: { fontSize: 24, color: colors.text },
  footer:    { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingBottom: spacing[4] },
  footerText:{ ...textStyles.body2, color: colors.textMuted },
});

export default SignUpScreen;
