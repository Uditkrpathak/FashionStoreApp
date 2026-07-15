// src/features/auth/screens/ContinueProfileScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const ContinueProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.heading}>Complete Your Profile</Text>
      <Text style={styles.sub}>Add your avatar, date of birth, and gender to personalize your experience. You can skip this for now.</Text>
      <Button title="Continue" onPress={() => navigation.navigate('LocationAccess')} style={styles.btn} />
      <TouchableOpacity onPress={() => navigation.navigate('LocationAccess')}>
        <Text style={styles.skip}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing[8] },
  emoji:     { fontSize: 72, marginBottom: spacing[6] },
  heading:   { ...textStyles.h3, color: colors.text, textAlign: 'center', marginBottom: spacing[3] },
  sub:       { ...textStyles.body1, color: colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: spacing[8] },
  btn:       { width: '100%', marginBottom: spacing[4] },
  skip:      { ...textStyles.label, color: colors.textMuted },
});

export default ContinueProfileScreen;
