// src/app/navigation/WishlistStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WishlistScreen      from '../../features/wishlist/screens/WishlistScreen';

const Stack = createNativeStackNavigator();

const WishlistStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Wishlist"      component={WishlistScreen} />
  </Stack.Navigator>
);

export default WishlistStack;
