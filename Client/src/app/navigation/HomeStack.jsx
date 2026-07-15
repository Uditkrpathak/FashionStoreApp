// src/app/navigation/HomeStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen           from '../../features/home/screens/HomeScreen';
import CategoryListingScreen from '../../features/products/screens/CategoryListingScreen';
import ProductListingScreen from '../../features/products/screens/ProductListingScreen';
import ImageGalleryScreen   from '../../features/products/screens/ImageGalleryScreen';
import SizeGuideScreen      from '../../features/products/screens/SizeGuideScreen';
import ReviewsScreen        from '../../features/products/screens/ReviewsScreen';
import WriteReviewScreen    from '../../features/products/screens/WriteReviewScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home"             component={HomeScreen} />
    <Stack.Screen name="CategoryListing"  component={CategoryListingScreen} />
    <Stack.Screen name="ProductListing"   component={ProductListingScreen} />
    <Stack.Screen name="ImageGallery"     component={ImageGalleryScreen}
      options={{ animation: 'fade', presentation: 'transparentModal' }} />
    <Stack.Screen name="SizeGuide"        component={SizeGuideScreen}
      options={{ presentation: 'containedTransparentModal' }} />
    <Stack.Screen name="Reviews"          component={ReviewsScreen} />
    <Stack.Screen name="WriteReview"      component={WriteReviewScreen} />
  </Stack.Navigator>
);

export default HomeStack;
