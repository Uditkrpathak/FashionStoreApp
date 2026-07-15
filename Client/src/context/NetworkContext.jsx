// src/context/NetworkContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { colors }    from '../theme/colors';
import { spacing }   from '../theme/spacing';
import { textStyles } from '../theme/typography';

const NetworkContext = createContext({ isOnline: true });

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const slideAnim = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
      Animated.spring(slideAnim, {
        toValue:         online ? -50 : 0,
        useNativeDriver: true,
      }).start();
    });
    return unsubscribe;
  }, [slideAnim]);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
      <Animated.View
        style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.bannerText}>No Internet Connection</Text>
      </Animated.View>
    </NetworkContext.Provider>
  );
};

const styles = StyleSheet.create({
  banner: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    backgroundColor: colors.error,
    paddingVertical: spacing[2],
    alignItems:      'center',
    zIndex:          9998,
  },
  bannerText: {
    ...textStyles.label,
    color: colors.white,
  },
});

export const useNetwork = () => useContext(NetworkContext);
