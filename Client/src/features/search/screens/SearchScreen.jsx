// src/features/search/screens/SearchScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector }  from '../../../shared/hooks/useAppSelector';
import { setQuery, addRecentSearch, clearRecentSearches, selectRecentSearches, resetFilters } from '../store/searchSlice';
import { useDebounce }     from '../../../shared/hooks/useDebounce';
import { colors }    from '../../../theme/colors';
import { spacing }   from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const SearchScreen = () => {
  const navigation   = useNavigation();
  const dispatch     = useAppDispatch();
  const recentSearches = useAppSelector(selectRecentSearches);
  const [input, setInput] = useState('');

  const handleSearch = () => {
    if (!input.trim()) return;
    dispatch(resetFilters()); // Reset filters on new search query
    dispatch(setQuery(input.trim()));
    dispatch(addRecentSearch(input.trim()));
    navigation.navigate('SearchResults');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search for clothing, brands..."
          placeholderTextColor={colors.placeholder}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSearch}
          autoFocus
          returnKeyType="search"
        />
        {input.length > 0 && (
          <TouchableOpacity onPress={() => setInput('')}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={() => dispatch(clearRecentSearches())}>
              <Text style={styles.clear2}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentSearches}
            keyExtractor={(i, idx) => `${i}-${idx}`}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recentItem} onPress={() => {
                setInput(item);
                dispatch(resetFilters()); // Reset filters on recent search click
                dispatch(setQuery(item));
                navigation.navigate('SearchResults');
              }}>
                <Text style={styles.clock}>🕐</Text>
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing[4], paddingTop: spacing[12] },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 16, borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: spacing[4], height: 52, gap: spacing[2], marginBottom: spacing[6],
  },
  icon:    { fontSize: 18 },
  input:   { flex: 1, ...textStyles.body1, color: colors.text },
  clear:   { ...textStyles.body1, color: colors.textMuted },
  section: { },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  sectionTitle: { ...textStyles.label, color: colors.text },
  clear2:  { ...textStyles.caption, color: colors.primary },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.divider },
  clock:     { fontSize: 16 },
  recentText:{ ...textStyles.body2, color: colors.text },
});

export default SearchScreen;
