// src/app/navigation/ModalStack.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Modal stack pushed over the tab navigator.
// Tab bar is hidden during checkout and order flows.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CheckoutScreen         from '../../features/checkout/screens/CheckoutScreen';
import CheckoutAddressScreen  from '../../features/checkout/screens/CheckoutAddressScreen';
import CheckoutDeliveryScreen from '../../features/checkout/screens/CheckoutDeliveryScreen';
import CheckoutPaymentScreen  from '../../features/checkout/screens/CheckoutPaymentScreen';
import AddCardScreen          from '../../features/checkout/screens/AddCardScreen';
import OrderReviewScreen      from '../../features/checkout/screens/OrderReviewScreen';
import OrderSuccessScreen     from '../../features/checkout/screens/OrderSuccessScreen';
import MyOrdersScreen         from '../../features/orders/screens/MyOrdersScreen';
import OrderDetailScreen      from '../../features/orders/screens/OrderDetailScreen';
import TrackOrderScreen       from '../../features/orders/screens/TrackOrderScreen';
import CancelReturnScreen     from '../../features/orders/screens/CancelReturnScreen';
import EReceiptScreen         from '../../features/checkout/screens/EReceiptScreen';
import WriteReviewScreen      from '../../features/products/screens/WriteReviewScreen';
import AddEditAddressScreen   from '../../features/profile/screens/AddEditAddressScreen';

const Stack = createNativeStackNavigator();

const ModalStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      presentation: 'fullScreenModal',
    }}
  >
    {/* Checkout flow */}
    <Stack.Screen name="CheckoutMain"     component={CheckoutScreen} />
    <Stack.Screen name="CheckoutAddress"  component={CheckoutAddressScreen} />
    <Stack.Screen name="CheckoutDelivery" component={CheckoutDeliveryScreen} />
    <Stack.Screen name="CheckoutPayment"  component={CheckoutPaymentScreen} />
    <Stack.Screen name="AddCard"          component={AddCardScreen} />
    <Stack.Screen name="AddEditAddress"   component={AddEditAddressScreen} />
    <Stack.Screen name="OrderReview"      component={OrderReviewScreen} />
    <Stack.Screen name="OrderSuccess"     component={OrderSuccessScreen}
      options={{ gestureEnabled: false }} />

    {/* Order management */}
    <Stack.Screen name="MyOrders"     component={MyOrdersScreen} />
    <Stack.Screen name="OrderDetail"  component={OrderDetailScreen} />
    <Stack.Screen name="TrackOrder"   component={TrackOrderScreen} />
    <Stack.Screen name="CancelReturn" component={CancelReturnScreen} />
    <Stack.Screen name="EReceipt"     component={EReceiptScreen} />
    <Stack.Screen name="WriteReview"  component={WriteReviewScreen} />
  </Stack.Navigator>
);

export default ModalStack;
