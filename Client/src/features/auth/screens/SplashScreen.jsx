import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getOnboardingSeen } from '../../../shared/utils/storage';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Background concentric circles */}
      <View style={styles.topRightCircle1} />
      <View style={styles.topRightCircle2} />
      <View style={styles.bottomLeftCircle1} />
      <View style={styles.bottomLeftCircle2} />

      {/* Logo container */}
      <View style={styles.logoRow}>
        <View style={styles.brownCircle}>
          <Text style={styles.logoLetter}>f</Text>
        </View>
        <Text style={styles.logoText}>
          fashion<Text style={styles.logoDot}>.</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Background decorative circles
  topRightCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  topRightCircle2: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  bottomLeftCircle1: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  bottomLeftCircle2: {
    position: 'absolute',
    bottom: -140,
    left: -140,
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brownCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#624735', // Premium warm brown color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#624735',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 34,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? -4 : -6,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#1A1A1A',
  },
  logoDot: {
    color: '#624735', // Match the brown theme dot
  },
});

export default SplashScreen;
