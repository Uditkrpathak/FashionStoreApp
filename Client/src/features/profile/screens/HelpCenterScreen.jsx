// src/features/profile/screens/HelpCenterScreen.jsx
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const CATEGORIES = ['All', 'Services', 'General', 'Account', 'Payment'];

const FAQ_DATA = [
  { 
    category: 'Services',
    question: "Can I track my order's delivery status?", 
    answer: "Yes, you can track your order in real-time. Navigate to 'My Orders' in your profile, select your order, and tap 'Track Order' to see current delivery updates." 
  },
  { 
    category: 'Services',
    question: "Is there a return policy?", 
    answer: "Yes, we offer a 30-day return policy for all unworn and undamaged items. You can initiate a return from the 'Order Detail' screen." 
  },
  { 
    category: 'General',
    question: "Can I save my favorite items for later?", 
    answer: "Absolutely! Tap the heart icon on any product card or detail screen to add it to your personal Wishlist." 
  },
  { 
    category: 'General',
    question: "Can I share products with my friends?", 
    answer: "Yes, you can share items using the share button located on the top right of the Product Details screen." 
  },
  { 
    category: 'Account',
    question: "How do I contact customer support?", 
    answer: "You can contact support via our Live Chat, WhatsApp, or email. Switch to the 'Contact Us' tab to select your preferred method." 
  },
  { 
    category: 'Payment',
    question: "What payment methods are accepted?", 
    answer: "We accept all major credit/debit cards, net banking, UPI, and wallets processed securely via Razorpay." 
  },
  { 
    category: 'Services',
    question: "How to add review?", 
    answer: "Once your order is delivered, navigate to 'My Orders', select the order, and tap 'Write Review' to share your feedback." 
  },
];

const CONTACT_METHODS = [
  { 
    id: 'customer_service',
    label: 'Customer Service',
    icon: 'headset', 
    type: 'chat',
    detail: 'Chat with our support representative for instant assistance.',
    buttonText: 'Start Live Chat'
  },
  { 
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'whatsapp',
    type: 'text',
    detail: '(480) 555-0103'
  },
  { 
    id: 'website',
    label: 'Website',
    icon: 'globe',
    type: 'text',
    detail: 'www.fashionstore.app'
  },
  { 
    id: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
    type: 'text',
    detail: 'facebook.com/fashionstore.app'
  },
  { 
    id: 'twitter',
    label: 'Twitter',
    icon: 'twitter',
    type: 'text',
    detail: 'twitter.com/fashionstore_app'
  },
  { 
    id: 'instagram',
    label: 'Instagram',
    icon: 'instagram',
    type: 'text',
    detail: 'instagram.com/fashionstore.app'
  },
];

const HelpCenterScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('FAQ');
  const [expandedFAQ, setExpandedFAQ] = useState(0); // first open by default
  const [expandedContact, setExpandedContact] = useState(1); // second open by default (WhatsApp)
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#F8F8F8' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tab Selection */}
        <View style={styles.tabsRow}>
          {['FAQ', 'Contact Us'].map((t) => (
            <TouchableOpacity 
              key={t} 
              style={[styles.tab, tab === t && styles.tabActive]} 
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Body */}
        {tab === 'FAQ' ? (
          <View style={{ flex: 1 }}>
            {/* Search Input */}
            <View style={styles.searchBox}>
              <Search size={20} color={colors.textMuted} />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search" 
                placeholderTextColor={colors.textMuted} 
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Horizontal Categories */}
            <View style={{ height: 50, marginBottom: spacing[3] }}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScrollView}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* FAQs List */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {filteredFAQs.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No FAQs match your search.</Text>
                </View>
              ) : (
                filteredFAQs.map((item, index) => {
                  const isExpanded = expandedFAQ === index;
                  return (
                    <View key={index} style={styles.faqCard}>
                      <TouchableOpacity 
                        style={styles.faqHeader} 
                        onPress={() => setExpandedFAQ(isExpanded ? null : index)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.faqQuestion}>{item.question}</Text>
                        {isExpanded ? <ChevronUp size={18} color={colors.text} /> : <ChevronDown size={18} color={colors.text} />}
                      </TouchableOpacity>
                      {isExpanded && (
                        <View style={styles.faqBody}>
                          <View style={styles.divider} />
                          <Text style={styles.faqAnswer}>{item.answer}</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {CONTACT_METHODS.map((item, index) => {
              const isExpanded = expandedContact === index;
              return (
                <View key={item.id} style={styles.contactCard}>
                  <TouchableOpacity 
                    style={styles.contactHeader} 
                    onPress={() => setExpandedContact(isExpanded ? null : index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.contactIconBox}>
                      <FontAwesome5 name={item.icon} size={18} color="#704F38" />
                    </View>
                    <Text style={styles.contactLabel}>{item.label}</Text>
                    {isExpanded ? <ChevronUp size={18} color={colors.text} /> : <ChevronDown size={18} color={colors.text} />}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.contactDetailsBox}>
                      {item.type === 'chat' ? (
                        <View>
                          <Text style={styles.contactDescText}>{item.detail}</Text>
                          <TouchableOpacity 
                            style={styles.chatStartBtn}
                            onPress={() => navigation.navigate('ChatSupport')}
                            activeOpacity={0.8}
                          >
                            <MessageSquare size={16} color={colors.white} />
                            <Text style={styles.chatStartBtnText}>{item.buttonText}</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.contactDetailRow}>
                          <View style={styles.bulletDot} />
                          <Text style={styles.contactDetailText}>{item.detail}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: spacing[4], paddingTop: spacing[12], paddingBottom: spacing[4],
    backgroundColor: '#F8F8F8' 
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyStyle: 'center', justifyContent: 'center' },
  back:    { fontSize: 18, color: colors.text, fontWeight: '700' },
  title:   { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  
  tabsRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EDEDED',
    backgroundColor: '#F8F8F8',
    marginBottom: spacing[2],
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: spacing[4],
  },
  tabActive: { 
    borderBottomWidth: 2,
    borderBottomColor: '#704F38',
  },
  tabText: { ...textStyles.body1, color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: '#704F38', fontWeight: '800' },
  
  scrollContent: { paddingHorizontal: spacing[4], paddingBottom: spacing[10] },
  
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    height: 50,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  searchInput: { flex: 1, marginLeft: spacing[2], ...textStyles.body1, color: colors.text },
  
  categoryScrollView: {
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: 20,
    backgroundColor: '#ECECEC',
    marginRight: spacing[2.5],
    height: 36,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#704F38',
  },
  categoryChipText: {
    ...textStyles.body2,
    color: colors.text,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing[3],
    padding: spacing[4],
    borderWidth: 1, borderColor: '#ECECEC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { ...textStyles.body1, color: colors.text, fontWeight: '700', flex: 1 },
  faqBody: { marginTop: spacing[3] },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginBottom: spacing[3] },
  faqAnswer: { ...textStyles.body2, color: colors.textMuted, lineHeight: 22 },
  
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[10],
  },
  emptyText: {
    ...textStyles.body2,
    color: colors.textMuted,
  },
  
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: spacing[3],
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDFBF9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
    borderWidth: 1,
    borderColor: '#F0EBE5',
  },
  contactLabel: {
    ...textStyles.body1,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  contactDetailsBox: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: spacing[3],
  },
  contactDescText: {
    ...textStyles.body2,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing[2],
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#704F38',
    marginRight: spacing[2.5],
  },
  contactDetailText: {
    ...textStyles.body2,
    color: colors.text,
    fontWeight: '700',
  },
  chatStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#704F38',
    borderRadius: 20,
    paddingVertical: spacing[3],
    marginTop: spacing[2],
  },
  chatStartBtnText: {
    ...textStyles.body2,
    color: colors.white,
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default HelpCenterScreen;
