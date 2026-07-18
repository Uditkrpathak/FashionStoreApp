// src/features/auth/screens/ContinueProfileScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5000/api/v1';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
];

const ContinueProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, token } = route.params ?? {};

  const [avatar, setAvatar] = useState(user?.avatar ?? PRESET_AVATARS[0]);
  const [gender, setGender] = useState('female');
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDobChange = (text) => {
    // Only allow digits
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
    }
    if (cleaned.length > 6) {
      formatted = `${formatted}-${cleaned.slice(6, 8)}`;
    }
    setDob(formatted);
    if (dobError) setDobError('');
  };

  const validateDob = (val) => {
    if (!val) return 'Date of Birth is required';
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(val)) return 'Use YYYY-MM-DD format';
    
    const [year, month, day] = val.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return 'Enter a valid date';
    }
    
    const currentYear = new Date().getFullYear();
    if (year > currentYear) return 'Year cannot be in the future';
    if (year < 1900) return 'Enter a realistic year';
    if (currentYear - year < 13) return 'You must be at least 13 years old';
    
    return null;
  };

  const handleContinue = async () => {
    const error = validateDob(dob);
    if (error) {
      setDobError(error);
      return;
    }
    setDobError('');

    try {
      setLoading(true);
      const updatedUser = { ...user, dob, gender, avatar };
      if (token) {
        await axios.patch(
          `${BASE_URL}/auth/profile`,
          { dob, gender, avatar },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigation.navigate('LocationAccess', { user: updatedUser, token });
    } catch (err) {
      console.log('Failed to save profile:', err.message);
      // Navigate to location access fallback so user isn't stuck
      navigation.navigate('LocationAccess', { user: { ...user, dob, gender, avatar }, token });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('LocationAccess', { user, token });
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
        <Text style={styles.heading}>Complete Your Profile 👤</Text>
        <Text style={styles.sub}>
          Select your avatar, gender, and date of birth to personalize your shopping experience.
        </Text>

        {/* Selected Avatar Display */}
        <View style={styles.avatarMainContainer}>
          <Image source={{ uri: avatar }} style={styles.avatarLarge} />
        </View>

        {/* Preset Avatar Selection Grid */}
        <Text style={styles.sectionLabel}>Select Avatar</Text>
        <View style={styles.avatarGrid}>
          {PRESET_AVATARS.map((url, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setAvatar(url)}
              style={[
                styles.avatarThumbWrapper,
                avatar === url && styles.avatarThumbActive,
              ]}
            >
              <Image source={{ uri: url }} style={styles.avatarThumb} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Gender Selection */}
        <Text style={styles.sectionLabel}>Gender</Text>
        <View style={styles.genderRow}>
          {['male', 'female', 'other'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.genderBtn,
                gender === item && styles.genderBtnActive,
              ]}
              onPress={() => setGender(item)}
            >
              <Text
                style={[
                  styles.genderBtnText,
                  gender === item && styles.genderBtnTextActive,
                ]}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date of Birth Input */}
        <Input
          label="Date of Birth"
          placeholder="YYYY-MM-DD"
          value={dob}
          onChangeText={handleDobChange}
          keyboardType="numeric"
          maxLength={10}
          error={dobError}
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing[4] }} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Continue" onPress={handleContinue} style={styles.btn} />
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skip}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[6], paddingTop: spacing[16], paddingBottom: spacing[10] },
  heading: {
    ...textStyles.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing[2],
    fontWeight: '700',
  },
  sub: {
    ...textStyles.body2,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing[8],
    lineHeight: 22,
  },
  avatarMainContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  avatarLarge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  sectionLabel: {
    ...textStyles.label,
    color: colors.text,
    marginBottom: spacing[3],
    fontWeight: '600',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  avatarThumbWrapper: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  avatarThumbActive: {
    borderColor: colors.primary,
  },
  avatarThumb: {
    width: '100%',
    height: '100%',
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  genderBtn: {
    flex: 1,
    paddingVertical: spacing[3],
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  genderBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  genderBtnText: {
    ...textStyles.body2,
    fontWeight: '600',
    color: colors.text,
  },
  genderBtnTextActive: {
    color: colors.white,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
  btn: {
    width: '100%',
    marginBottom: spacing[4],
    backgroundColor: colors.primary,
    borderRadius: 30,
  },
  skip: {
    ...textStyles.label,
    color: colors.textMuted,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ContinueProfileScreen;
