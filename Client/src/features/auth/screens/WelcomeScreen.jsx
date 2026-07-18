import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectIsAuthenticated } from '../store/authSlice';
import { colors }   from '../../../theme/colors';
import { spacing }  from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import Button from '../../../shared/components/Button';

const WelcomeScreen = () => {
  const navigation      = useNavigation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) return;
  }, [isAuthenticated]);

  const handleStart = () => {
    navigation.replace('SignIn');
  };

  const handleSignIn = () => {
    navigation.replace('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageLayout}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' }} 
          style={styles.leftPill} 
        />
        <View style={styles.rightCol}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.rightTopPill} 
          />
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.rightBottomCircle} 
          />
        </View>
        <Text style={styles.asterisk}>*</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>The Fashion App That{'\n'}Makes You Look Your Best</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Let's Get Started" onPress={handleStart} style={styles.btn} />
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 80,
  },
  imageLayout: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    height: 380,
    marginBottom: spacing[8],
    position: 'relative',
  },
  leftPill: {
    width: 140,
    height: 340,
    backgroundColor: '#E0E0E0',
    borderRadius: 70,
  },
  rightCol: {
    gap: 16,
  },
  rightTopPill: {
    width: 140,
    height: 180,
    backgroundColor: '#E0E0E0',
    borderRadius: 70,
  },
  rightBottomCircle: {
    width: 140,
    height: 140,
    backgroundColor: '#E0E0E0',
    borderRadius: 70,
  },
  asterisk: {
    position: 'absolute',
    left: '12%',
    bottom: 20,
    fontSize: 50,
    color: colors.text,
    fontWeight: '300',
  },
  textContainer: {
    paddingHorizontal: spacing[8],
    alignItems: 'center',
  },
  title: {
    ...textStyles.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing[4],
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    ...textStyles.body2,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing[4],
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[12],
  },
  btn: {
    marginBottom: spacing[4],
    backgroundColor: colors.primary,
    borderRadius: 30,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    ...textStyles.body2,
    color: colors.textMuted,
  },
  loginLink: {
    ...textStyles.body2,
    color: colors.text,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
