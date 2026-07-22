// src/features/auth/screens/SignInScreen.jsx
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useLoginMutation } from '../api/authApi';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { loginSuccess } from '../store/authSlice';
import { useToast } from '../../../context/ToastContext';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { isEmail, isPhone, required } from '../../../shared/utils/validators';

const SignInScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.identifier, password: data.password }).unwrap();
      await dispatch(loginSuccess({
        user: res.user,
        accessToken: res.token,
        refreshToken: res.token,
      }));
    } catch (err) {
      let errorMsg = err?.data?.message ?? 'Login failed. Please try again.';
      if (errorMsg === 'Invalid credentials') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (errorMsg === 'User not found') {
        errorMsg = 'No account found with this email.';
      }
      showToast(errorMsg, 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.sub}>{"Hi! Welcome back, you've been missed"}</Text>

        <Controller
          control={control}
          name="identifier"
          rules={{
            validate: (v) => {
              if (isEmail(v) === true) {
                if (v && v.length > 40) return 'Email cannot exceed 40 characters';
                return true;
              }
              if (isPhone(v) === true) return true;
              return 'Enter a valid email or phone';
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email or Phone"
              placeholder="you@email.com or 9XXXXXXXXX"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.identifier?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ validate: required('Password') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.btn}
        />

        {/* Or sign in with */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or sign in with</Text>
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
          <Text style={styles.footerText}>{"Don't have an account? "}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: {
    padding: spacing[6],
    paddingTop: spacing[16],
    flexGrow: 1,
  },
  heading: { ...textStyles.h2, color: colors.text, textAlign: 'center', marginBottom: spacing[2], fontWeight: '700' },
  sub: { ...textStyles.body2, color: colors.textMuted, textAlign: 'center', marginBottom: spacing[10] },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing[8] },
  forgotText: { ...textStyles.label, color: colors.text, textDecorationLine: 'underline', fontWeight: '600' },
  btn: { marginBottom: spacing[8], backgroundColor: colors.primary, borderRadius: 30 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[8],
    paddingHorizontal: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    ...textStyles.body2,
    color: colors.textMuted,
    paddingHorizontal: spacing[4],
  },
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
  socialIconText: {
    fontSize: 24,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: spacing[4],
  },
  footerText: { ...textStyles.body2, color: colors.textMuted },
  link: { ...textStyles.body2, color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' },
});

export default SignInScreen;
