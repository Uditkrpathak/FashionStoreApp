// src/app/navigation/ProfileStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileHomeScreen    from '../../features/profile/screens/ProfileHomeScreen';
import EditProfileScreen    from '../../features/profile/screens/EditProfileScreen';
import AddressesScreen      from '../../features/profile/screens/AddressesScreen';
import AddEditAddressScreen from '../../features/profile/screens/AddEditAddressScreen';
import SavedCardsScreen     from '../../features/profile/screens/SavedCardsScreen';
import SettingsScreen       from '../../features/profile/screens/SettingsScreen';
import NotificationsScreen  from '../../features/notifications/screens/NotificationsScreen';
import NotifSettingsScreen  from '../../features/notifications/screens/NotifSettingsScreen';
import PrivacyPolicyScreen  from '../../features/profile/screens/PrivacyPolicyScreen';
import HelpCenterScreen     from '../../features/profile/screens/HelpCenterScreen';
import ChatSupportScreen     from '../../features/profile/screens/ChatSupportScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileHome"    component={ProfileHomeScreen} />
    <Stack.Screen name="EditProfile"    component={EditProfileScreen} />
    <Stack.Screen name="Addresses"      component={AddressesScreen} />
    <Stack.Screen name="AddEditAddress" component={AddEditAddressScreen} />
    <Stack.Screen name="SavedCards"     component={SavedCardsScreen} />
    <Stack.Screen name="Notifications"  component={NotificationsScreen} />
    <Stack.Screen name="NotifSettings"  component={NotifSettingsScreen} />
    <Stack.Screen name="Settings"       component={SettingsScreen} />
    <Stack.Screen name="PrivacyPolicy"  component={PrivacyPolicyScreen} />
    <Stack.Screen name="HelpCenter"     component={HelpCenterScreen} />
    <Stack.Screen name="ChatSupport"    component={ChatSupportScreen} />
  </Stack.Navigator>
);

export default ProfileStack;
