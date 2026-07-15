// App.jsx — Root component
// ─────────────────────────────────────────────────────────────────────────────
// Wraps everything in:
//   Provider (Redux store)
//   → NavigationContainer
//     → ThemeProvider
//       → ToastProvider
//         → NetworkProvider
//           → RootNavigator
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/app/store/index';
import RootNavigator from './src/app/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import { NetworkProvider } from './src/context/NetworkContext';

// Deep linking config
const linking = {
  prefixes: ['fashionstore://', 'https://fashionstore.app'],
  config: {
    screens: {
      App: {
        screens: {
          Tabs: {
            screens: {
              HomeTab: {
                screens: {
                  ProductDetail: 'product/:id',
                },
              },
            },
          },
          Modals: {
            screens: {
              OrderDetail: 'order/:id',
            },
          },
        },
      },
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer linking={linking}>
              <ThemeProvider>
                <ToastProvider>
                  <NetworkProvider>
                    <StatusBar style="dark" />
                    <RootNavigator />
                  </NetworkProvider>
                </ToastProvider>
              </ThemeProvider>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
