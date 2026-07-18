// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors }  from '../theme/colors';
import { spacing } from '../theme/spacing';
import { textStyles } from '../theme/typography';

const ToastContext = createContext({ showToast: () => {} });

const DURATION = 2800;

let globalShowToast = () => {};

export const showGlobalToast = (message, type = 'info') => {
  globalShowToast(message, type);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast]   = useState(null);
  const [opacity]           = useState(() => new Animated.Value(0));
  const timerRef            = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, type });
    Animated.spring(opacity, { toValue: 1, useNativeDriver: true }).start();

    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0, duration: 300, useNativeDriver: true,
      }).start(() => setToast(null));
    }, DURATION);
  }, [opacity]);

  // Keep global reference in sync
  globalShowToast = showToast;

  const bgColor = {
    success: colors.success,
    error:   colors.error,
    warning: colors.warning,
    info:    colors.primary,
  }[toast?.type ?? 'info'];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View style={[styles.container, { opacity, backgroundColor: bgColor }]}>
          <Text style={styles.text}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position:     'absolute',
    bottom:       spacing[14],
    left:         spacing[4],
    right:        spacing[4],
    paddingVertical:   spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius:      spacing[3],
    zIndex:       9999,
    ...require('../theme/spacing').shadows.md,
  },
  text: {
    ...textStyles.body2,
    color:     colors.white,
    textAlign: 'center',
  },
});

export const useToast = () => useContext(ToastContext);
