// src/features/auth/screens/LocationAccessScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { loginSuccess }   from '../store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5000/api/v1';

const LocationAccessScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const dispatch   = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { user, token } = route.params ?? {};

  const handleAllow = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to fetch your position. Please select a location manually.',
          [{ text: 'OK', onPress: () => handleSkip() }]
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      let addressString = 'New York, USA';
      if (geo && geo.length > 0) {
        const place = geo[0];
        const city = place.city || place.subregion || place.district;
        const country = place.country || place.isoCountryCode;
        addressString = city && country ? `${city}, ${country}` : city || country || 'New York, USA';
      }

      // Save user location to backend database
      if (token && user) {
        try {
          await axios.patch(
            `${BASE_URL}/auth/profile`,
            { location: addressString },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.log('Failed to save location to backend:', err.message);
        }
      }

      // Complete authentication
      const updatedUser = user ? { ...user, location: addressString } : null;
      dispatch(loginSuccess({ user: updatedUser, accessToken: token, refreshToken: token }));

    } catch (error) {
      console.log('Location retrieval error:', error);
      Alert.alert('Error', 'Failed to retrieve location. Please choose a city manually.', [
        { text: 'OK', onPress: () => handleSkip() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Enter Location Manually',
      'Select a default city to continue:',
      [
        { text: 'New York, USA', onPress: () => saveManualLocation('New York, USA') },
        { text: 'Paris, France', onPress: () => saveManualLocation('Paris, France') },
        { text: 'Tokyo, Japan', onPress: () => saveManualLocation('Tokyo, Japan') },
      ],
      { cancelable: true }
    );
  };

  const saveManualLocation = async (manualLoc) => {
    try {
      setLoading(true);
      if (token && user) {
        try {
          await axios.patch(
            `${BASE_URL}/auth/profile`,
            { location: manualLoc },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.log('Failed to save manual location to backend:', err.message);
        }
      }

      const updatedUser = user ? { ...user, location: manualLoc } : null;
      dispatch(loginSuccess({ user: updatedUser, accessToken: token, refreshToken: token }));
    } finally {
      setLoading(false);
    }
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

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing[4] }} />
      ) : (
        <>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleAllow}>
            <Text style={styles.btnPrimaryText}>Allow Location Access</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnSecondary} onPress={handleSkip}>
            <Text style={styles.btnSecondaryText}>Enter Location Manually</Text>
          </TouchableOpacity>
        </>
      )}
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
    backgroundColor: colors.surfaceAlt,
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
