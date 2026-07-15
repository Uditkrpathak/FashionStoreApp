// src/app/navigation/AuthNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen           from '../../features/auth/screens/SplashScreen';
import OnboardingScreen       from '../../features/auth/screens/OnboardingScreen';
import SignInScreen           from '../../features/auth/screens/SignInScreen';
import SignUpScreen           from '../../features/auth/screens/SignUpScreen';
import VerifyOTPScreen        from '../../features/auth/screens/VerifyOTPScreen';
import ForgotPasswordScreen   from '../../features/auth/screens/ForgotPasswordScreen';
import NewPasswordScreen      from '../../features/auth/screens/NewPasswordScreen';
import ContinueProfileScreen  from '../../features/auth/screens/ContinueProfileScreen';
import LocationAccessScreen   from '../../features/auth/screens/LocationAccessScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{ headerShown: false, animation: 'fade' }}
  >
    <Stack.Screen name="Splash"          component={SplashScreen} />
    <Stack.Screen name="Onboarding"      component={OnboardingScreen} />
    <Stack.Screen name="SignIn"          component={SignInScreen} />
    <Stack.Screen name="SignUp"          component={SignUpScreen} />
    <Stack.Screen name="VerifyOTP"       component={VerifyOTPScreen} />
    <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
    <Stack.Screen name="NewPassword"     component={NewPasswordScreen} />
    <Stack.Screen name="ContinueProfile" component={ContinueProfileScreen} />
    <Stack.Screen name="LocationAccess"  component={LocationAccessScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
