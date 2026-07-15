// src/features/auth/screens/VerifyOTPScreen.jsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVerifyOtpMutation }    from '../api/authApi';
import { useToast }    from '../../../context/ToastContext';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { loginSuccess } from '../store/authSlice';
import Button from '../../../shared/components/Button';
import { colors }    from '../../../theme/colors';
import { spacing }   from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const OTP_LENGTH = 6;

const VerifyOTPScreen = () => {
  const navigation  = useNavigation();
  const route       = useRoute();
  const dispatch    = useAppDispatch();
  const { email, flow = 'register' } = route.params ?? {};
  const { showToast } = useToast();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const inputs        = useRef([]);

  const handleChange = (text, index) => {
    const next = [...otp];
    next[index] = text.slice(-1);
    setOtp(next);
    if (text && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { showToast('Enter the complete OTP', 'warning'); return; }
    try {
      const res = await verifyOtp({ code, email }).unwrap();
      
      if (flow === 'forgot') {
        navigation.navigate('NewPassword', { email });
      } else {
        // Log them in immediately after successful verification
        if (res.token && res.user) {
          dispatch(loginSuccess({ user: res.user, accessToken: res.token, refreshToken: res.token }));
        }
        navigation.navigate('ContinueProfile');
      }
    } catch (err) {
      showToast(err?.data?.message ?? 'Invalid OTP. Try again.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Enter OTP 🔐</Text>
      <Text style={styles.sub}>
        We sent a {OTP_LENGTH}-digit code to{'\n'}
        <Text style={{ color: colors.primary }}>{email}</Text>
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => (inputs.current[i] = r)}
            style={[styles.box, digit && styles.boxFilled]}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <Button title="Verify" onPress={onSubmit} loading={isLoading} style={styles.btn} />

      <TouchableOpacity style={styles.resend}>
        <Text style={styles.resendText}>Didn't receive? <Text style={{ color: colors.primary }}>Resend</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing[6], paddingTop: spacing[14] },
  back:      { marginBottom: spacing[6] },
  backText:  { ...textStyles.label, color: colors.primary },
  heading:   { ...textStyles.h2, color: colors.text, marginBottom: spacing[2] },
  sub:       { ...textStyles.body1, color: colors.textMuted, marginBottom: spacing[8], lineHeight: 24 },
  otpRow:    { flexDirection: 'row', gap: spacing[3], marginBottom: spacing[8] },
  box: {
    flex: 1, height: 56, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface, fontSize: 24, fontWeight: '700', color: colors.text,
  },
  boxFilled: { borderColor: colors.primary },
  btn:       { marginBottom: spacing[4] },
  resend:    { alignItems: 'center' },
  resendText:{ ...textStyles.body2, color: colors.textMuted },
});

export default VerifyOTPScreen;
