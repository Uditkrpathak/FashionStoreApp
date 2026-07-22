// src/features/profile/screens/SavedCardsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, CheckCircle2 } from 'lucide-react-native';
// Note: We use FontAwesome for brand icons if possible, or simple text fallbacks for mock.
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectUser } from '../../auth/store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const SavedCardsScreen = () => {
  const navigation = useNavigation();
  const user = useAppSelector(selectUser);
  const cards = user?.savedCards ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Credit & Debit Card</Text>

        {/* Saved Cards List */}
        {cards.length === 0 ? (
          <View style={styles.emptyCardsBox}>
            <Text style={styles.emptyCardsText}>No saved cards found. Add one below!</Text>
          </View>
        ) : (
          cards.map((card, idx) => (
            <TouchableOpacity key={card._id || idx} style={styles.cardItem} activeOpacity={0.9}>
              <View style={styles.cardIconBox}>
                <FontAwesome5 
                  name={card.brand.toLowerCase() === 'visa' ? 'cc-visa' : card.brand.toLowerCase() === 'mastercard' ? 'cc-mastercard' : 'credit-card'} 
                  size={24} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{card.brand} •••• {card.last4}</Text>
                <Text style={styles.cardExpiry}>Expires {card.expMonth.toString().padStart(2, '0')}/{card.expYear}</Text>
              </View>
              <CheckCircle2 size={24} color={colors.primary} />
            </TouchableOpacity>
          ))
        )}

        {/* Add Card Button */}
        <TouchableOpacity style={styles.addCardBtn} onPress={() => navigation.navigate('Modals', { screen: 'AddCard' })}>
          <View style={styles.addCardIconBox}>
            <Plus size={20} color={colors.primary} />
          </View>
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitleOptions}>More Payment Options</Text>

        {/* Razorpay */}
        <TouchableOpacity style={styles.paymentOption}>
          <View style={styles.cardIconBox}>
            <Text style={{ fontSize: 24 }}>⚡</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Razorpay</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[4], paddingTop: spacing[12],
    backgroundColor: colors.white
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 18, color: colors.text, fontWeight: '700' },
  title: { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  content: { padding: spacing[6], paddingBottom: 100 },
  emptyCardsBox: {
    padding: spacing[8],
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderStyle: 'dashed',
  },
  emptyCardsText: {
    ...textStyles.body2,
    color: colors.textMuted,
  },

  sectionTitle: { ...textStyles.h5, color: colors.text, fontWeight: '800', marginBottom: spacing[4] },
  sectionTitleOptions: { ...textStyles.h5, color: colors.text, fontWeight: '800', marginBottom: spacing[4], marginTop: spacing[6] },

  cardItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1, borderColor: colors.primary,
  },
  paymentOption: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  cardIconBox: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing[4],
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: { ...textStyles.body1, color: colors.text, fontWeight: '700' },

  addCardBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    padding: spacing[4],
  },
  addCardIconBox: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing[4],
  },
  addCardText: { ...textStyles.body1, color: colors.primary, fontWeight: '700' },
});

export default SavedCardsScreen;
