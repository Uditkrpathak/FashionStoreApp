// src/features/profile/screens/HelpCenterScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const FAQ_DATA = [
  { question: 'What is Fashion App?', answer: 'Fashion App is your one-stop shop for all your clothing needs, bringing the latest trends right to your doorstep.' },
  { question: 'How to use Fashion App?', answer: 'Simply browse products, add them to your cart, and checkout using your preferred payment method.' },
  { question: 'How do I cancel an order?', answer: 'You can cancel an order from the My Orders section within 24 hours of placing it.' },
  { question: 'Is Fashion App free to use?', answer: 'Yes, the app is completely free to download and browse.' },
  { question: 'How to add promo code?', answer: 'During checkout, tap on "Apply Promo Code" and enter your code to get discounts.' },
];

const HelpCenterScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('FAQ');
  const [expandedIndex, setExpandedIndex] = useState(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsRow}>
        {['FAQ', 'Contact Us'].map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'FAQ' && (
          <>
            <View style={styles.searchBox}>
              <Search size={20} color={colors.textMuted} />
              <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={colors.textMuted} />
            </View>

            {FAQ_DATA.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <View key={index} style={styles.faqCard}>
                  <TouchableOpacity style={styles.faqHeader} onPress={() => setExpandedIndex(isExpanded ? null : index)}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    {isExpanded ? <ChevronUp size={20} color={colors.text} /> : <ChevronDown size={20} color={colors.text} />}
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.faqBody}>
                      <View style={styles.divider} />
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}
        {tab === 'Contact Us' && (
          <View style={styles.contactContainer}>
            <Text style={styles.contactText}>For further assistance, please reach out to us at:</Text>
            <Text style={styles.contactEmail}>support@fashionapp.com</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[4], paddingTop: spacing[12], 
    backgroundColor: '#F8F8F8' 
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  back:    { fontSize: 18, color: colors.text, fontWeight: '700' },
  title:   { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  
  tabsRow: { 
    flexDirection: 'row', paddingHorizontal: spacing[4], paddingVertical: spacing[2],
    justifyContent: 'space-between'
  },
  tab: { 
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing[3], marginHorizontal: spacing[1],
    borderRadius: 20,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  tabActive: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary,
  },
  tabText: { ...textStyles.body2, color: colors.text, fontWeight: '600' },
  tabTextActive: { color: colors.white },
  
  content: { padding: spacing[4], paddingBottom: spacing[10] },
  
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing[4],
    marginBottom: spacing[6],
    height: 50,
  },
  searchInput: { flex: 1, marginLeft: spacing[2], ...textStyles.body1, color: colors.text },
  
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing[4],
    padding: spacing[4],
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { ...textStyles.body1, color: colors.text, fontWeight: '700', flex: 1 },
  faqBody: { marginTop: spacing[3] },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: spacing[3] },
  faqAnswer: { ...textStyles.body2, color: colors.textMuted, lineHeight: 22 },
  
  contactContainer: { alignItems: 'center', marginTop: spacing[10] },
  contactText: { ...textStyles.body1, color: colors.textMuted, textAlign: 'center', marginBottom: spacing[2] },
  contactEmail: { ...textStyles.h5, color: colors.primary, fontWeight: '700' },
});

export default HelpCenterScreen;
