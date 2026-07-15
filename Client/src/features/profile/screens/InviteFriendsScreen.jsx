import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

export default function InviteFriendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Invite Friends</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.h2,
    color: colors.text,
  },
});
