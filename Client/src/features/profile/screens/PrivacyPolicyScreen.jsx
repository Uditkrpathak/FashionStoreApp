// src/features/profile/screens/PrivacyPolicyScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Types of Data We Collect</Text>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </Text>
        <Text style={styles.paragraph}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Your Personal Data</Text>
        <Text style={styles.paragraph}>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
        </Text>

        <Text style={styles.sectionTitle}>3. Disclosure of Your Personal Data</Text>
        <Text style={styles.paragraph}>
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
        </Text>
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
  back:    { fontSize: 18, color: '#000000', fontWeight: '700' },
  title:   { ...textStyles.h4, color: colors.text, fontWeight: '800' },
  
  content: { padding: spacing[6], paddingBottom: 120 },
  sectionTitle: { ...textStyles.h5, color: colors.text, fontWeight: '700', marginTop: spacing[4], marginBottom: spacing[3] },
  paragraph: { ...textStyles.body2, color: colors.textMuted, lineHeight: 22, marginBottom: spacing[4] },
});

export default PrivacyPolicyScreen;
