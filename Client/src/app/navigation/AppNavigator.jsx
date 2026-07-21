// src/app/navigation/AppNavigator.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Bottom tab navigator + modal stack.
// The tab bar shows on all tab screens but is hidden in the ModalStack.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator as createTabNav } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react-native';

import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import WishlistStack from './WishlistStack';
import CartStack from './CartStack';
import ProfileStack from './ProfileStack';
import ModalStack from './ModalStack';

import ProductDetailScreen from '../../features/products/screens/ProductDetailScreen';

import Badge from '../../shared/components/Badge';
import { colors } from '../../theme/colors';
import { spacing, layout, shadows } from '../../theme/spacing';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useGetMeQuery } from '../../features/auth/api/authApi';
import { useGetCartQuery, useGetAddressesQuery } from '../../features/cart/api/cartApi';
import FilterScreen from '../../features/search/screens/FilterScreen';
import SortScreen from '../../features/search/screens/SortScreen';

const Tab = createTabNav();
const Stack = createNativeStackNavigator();

// ── Tab icon helper with solid black icon ──────────────────────────────────────
const TabIcon = ({ IconComponent, focused, count }) => {
  const iconColor = '#1F2029';
  return (
    <View style={tabStyles.iconContainer}>
      <View
        style={[
          tabStyles.iconWrapper,
          focused && tabStyles.iconWrapperFocused,
        ]}
      >
        {IconComponent && (
          <IconComponent
            size={22}
            width={22}
            height={22}
            color={iconColor}
            stroke={iconColor}
            strokeWidth={2.4}
          />
        )}
      </View>

      {count > 0 && <Badge count={count} />}
    </View>
  );
};

// ── Bottom Tab Navigator ──────────────────────────────────────────────────────
const BottomTabs = () => {
  const cartTotalQty = useAppSelector(state => state.cart.totalQty);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 10,
          height: 72,
          backgroundColor: '#1F2029',
          borderRadius: 40,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          paddingHorizontal: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarIcon: (props) => <TabIcon IconComponent={Home} {...props} /> }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ tabBarIcon: (props) => <TabIcon IconComponent={Search} {...props} /> }}
      />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistStack}
        options={{ tabBarIcon: (props) => <TabIcon IconComponent={Heart} {...props} /> }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarIcon: (props) => <TabIcon IconComponent={ShoppingBag} count={cartTotalQty} {...props} />,
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ tabBarIcon: (props) => <TabIcon IconComponent={User} {...props} /> }}
      />
    </Tab.Navigator>
  );
};

// ── App root: Tabs + Modal stack ──────────────────────────────────────────────
const AppNavigator = () => {
  // Hydrate user profile from the server on app mount
  useGetMeQuery();
  // Hydrate cart and addresses from the server on app mount
  useGetCartQuery();
  useGetAddressesQuery();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Sort" component={SortScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Modals" component={ModalStack}
        options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
    </Stack.Navigator>
  );
};

const tabStyles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  iconWrapperFocused: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',

    marginTop: 28,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default AppNavigator;
