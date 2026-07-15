// src/app/navigation/RootNavigator.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root navigator — checks SecureStore for a token on mount, then routes to
// AuthNavigator (no token) or AppNavigator (token found).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import { getTokens }           from '../../shared/utils/storage';
import { useAppDispatch }      from '../../shared/hooks/useAppDispatch';
import { useAppSelector }      from '../../shared/hooks/useAppSelector';
import { setUser, selectIsAuthenticated } from '../../features/auth/store/authSlice';

import AuthNavigator  from './AuthNavigator';
import AppNavigator   from './AppNavigator';
import { colors }     from '../../theme/colors';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const dispatch         = useAppDispatch();
  const isAuthenticated  = useAppSelector(selectIsAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check secure storage for existing tokens on app start
    const bootstrapAuth = async () => {
      try {
        const tokens = await getTokens();
        if (tokens?.accessToken) {
          // Token exists — keep the user authenticated
          // The Splash screen (in AuthNavigator) will also call /auth/me to hydrate user object
          dispatch(setUser({ _tokenRestored: true }));
        }
      } catch (_) {
        // Tokens cleared or corrupted — stay on auth flow
      } finally {
        setIsChecking(false);
      }
    };
    bootstrapAuth();
  }, [dispatch]);

  if (isChecking) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="App"  component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
