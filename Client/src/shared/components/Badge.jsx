// src/shared/components/Badge.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const Badge = ({ count, style }) => {
  if (!count || count < 1) return null;
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position:        'absolute',
    top:             -4,
    right:           -4,
    minWidth:        18,
    height:          18,
    borderRadius:    9,
    backgroundColor: colors.badge,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 3,
  },
  text: {
    color:      colors.white,
    fontSize:   10,
    fontWeight: '700',
    lineHeight: 12,
  },
});

export default Badge;
