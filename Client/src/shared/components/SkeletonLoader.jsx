// src/shared/components/SkeletonLoader.jsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

/**
 * Animated shimmer skeleton.
 * @param {{ width, height, borderRadius, style }} props
 */
const SkeletonLoader = ({ width, height = 20, borderRadius = 8, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange:  [0, 1],
    outputRange: [0.4, 0.9],
  });

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

/** Skeleton for a product card */
export const ProductCardSkeleton = () => (
  <View style={skeletonStyles.card}>
    <SkeletonLoader width="100%" height={160} borderRadius={12} />
    <View style={{ padding: 12 }}>
      <SkeletonLoader width="50%"  height={12} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonLoader width="80%"  height={14} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonLoader width="40%"  height={16} borderRadius={4} />
    </View>
  </View>
);

/** Skeleton for an order card */
export const OrderCardSkeleton = () => (
  <View style={skeletonStyles.orderCard}>
    <SkeletonLoader width={64} height={64} borderRadius={12} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <SkeletonLoader width="70%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="50%" height={12} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="30%" height={12} borderRadius={4} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  base: { backgroundColor: colors.accent },
});

const skeletonStyles = StyleSheet.create({
  card: {
    width:           160,
    backgroundColor: colors.surface,
    borderRadius:    16,
    overflow:        'hidden',
    marginRight:     12,
  },
  orderCard: {
    flexDirection:   'row',
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         16,
    marginBottom:    12,
    alignItems:      'center',
  },
});

export default SkeletonLoader;
