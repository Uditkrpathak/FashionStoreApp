// src/app/navigation/SearchStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen        from '../../features/search/screens/SearchScreen';
import SearchResultsScreen from '../../features/search/screens/SearchResultsScreen';
import FilterScreen        from '../../features/search/screens/FilterScreen';
import SortScreen          from '../../features/search/screens/SortScreen';

const Stack = createNativeStackNavigator();

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Search"        component={SearchScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    <Stack.Screen name="Filter"        component={FilterScreen}
      options={{ presentation: 'modal' }} />
    <Stack.Screen name="Sort"          component={SortScreen}
      options={{ presentation: 'modal' }} />
  </Stack.Navigator>
);

export default SearchStack;
