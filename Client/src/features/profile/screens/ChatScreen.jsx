import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { textStyles } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function ChatScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Support Chat</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.chatArea}>
        <View style={styles.botMessage}>
          <Text style={styles.messageText}>Hi there! 👋 How can we help you today?</Text>
        </View>
        <View style={styles.botMessage}>
          <Text style={styles.messageText}>Please note that all our agents are currently busy. We will get back to you within 24 hours.</Text>
        </View>
      </View>
      <View style={styles.inputArea}>
        <Input placeholder="Type a message..." style={{ flex: 1, marginBottom: 0 }} />
        <Button title="Send" style={{ width: 80, marginLeft: spacing[2] }} onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing[4], paddingTop: spacing[12], borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.white,
  },
  backBtn: { padding: spacing[2], marginLeft: -spacing[2] },
  backText: { fontSize: 24, color: colors.text },
  title: { ...textStyles.h5, color: colors.text },
  chatArea: { flex: 1, padding: spacing[4] },
  botMessage: {
    backgroundColor: colors.surface, padding: spacing[4], borderRadius: 12,
    borderBottomLeftRadius: 0, marginBottom: spacing[3], alignSelf: 'flex-start', maxWidth: '80%'
  },
  messageText: { ...textStyles.body2, color: colors.text },
  inputArea: {
    flexDirection: 'row', padding: spacing[4], borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: colors.white, alignItems: 'center'
  },
});
