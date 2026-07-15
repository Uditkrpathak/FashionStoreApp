// src/app/navigation/CartStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen      from '../../features/cart/screens/CartScreen';
import PromoCodeScreen from '../../features/cart/screens/PromoCodeScreen';

const Stack = createNativeStackNavigator();

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Cart"      component={CartScreen} />
    <Stack.Screen name="PromoCode" component={PromoCodeScreen}
      options={{ presentation: 'modal' }} />
  </Stack.Navigator>
);

export default CartStack;
