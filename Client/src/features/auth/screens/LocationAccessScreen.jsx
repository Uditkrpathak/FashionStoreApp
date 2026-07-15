// src/features/auth/screens/LocationAccessScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { loginSuccess }   from '../store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const LocationAccessScreen = () => {
  const navigation = useNavigation();
  const dispatch   = useAppDispatch();

  const handleAllow = async () => {
    // TODO: Request location permission via expo-location
  };

  const handleSkip = () => {
    // Navigate past or handle appropriately
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MapPin size={40} color={colors.white} fill={colors.primary} />
      </View>
      
      <Text style={styles.heading}>What is Your Location?</Text>
      <Text style={styles.sub}>
        We need to know your location in order to suggest nearby services.
      </Text>
      
      <TouchableOpacity style={styles.btnPrimary} onPress={handleAllow}>
        <Text style={styles.btnPrimaryText}>Allow Location Access</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.btnSecondary} onPress={handleSkip}>
        <Text style={styles.btnSecondaryText}>Enter Location Manually</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, backgroundColor: colors.background, 
    alignItems: 'center', justifyContent: 'center', 
    padding: spacing[8] 
  },
  iconCircle: {
    width: 140, height: 140, borderRadius: 70, 
    backgroundColor: colors.surfaceAlt, // '#EDEDED'
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing[10]
  },
  heading: { 
    ...textStyles.h3, color: colors.text, 
    textAlign: 'center', marginBottom: spacing[4],
    fontWeight: '700'
  },
  sub: { 
    ...textStyles.body1, color: colors.textMuted, 
    textAlign: 'center', lineHeight: 22, 
    marginBottom: spacing[12], paddingHorizontal: spacing[4]
  },
  btnPrimary: { 
    width: '100%', backgroundColor: colors.primary, 
    borderRadius: 30, paddingVertical: spacing[4],
    alignItems: 'center', marginBottom: spacing[5]
  },
  btnPrimaryText: {
    ...textStyles.body1, color: colors.white, fontWeight: '700'
  },
  btnSecondary: {
    width: '100%', paddingVertical: spacing[4], alignItems: 'center'
  },
  btnSecondaryText: {
    ...textStyles.body1, color: colors.primary, fontWeight: '700'
  }
});

export default LocationAccessScreen;
