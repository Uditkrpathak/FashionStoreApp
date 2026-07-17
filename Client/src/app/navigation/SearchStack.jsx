// src/app/navigation/SearchStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen        from '../../features/search/screens/SearchScreen';
import SearchResultsScreen from '../../features/search/screens/SearchResultsScreen';

const Stack = createNativeStackNavigator();

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Search"        component={SearchScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
  </Stack.Navigator>
);

export default SearchStack;
