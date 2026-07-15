// src/features/notifications/screens/NotifSettingsScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../../context/ToastContext';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const NotifSettingsScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [prefs, setPrefs] = useState({ orders: true, promos: true, restocks: false });

  const handleToggle = (key, name) => (val) => {
    setPrefs(p => ({ ...p, [key]: val }));
    showToast(`${name} ${val ? 'enabled' : 'disabled'}`, 'success');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Notification Settings</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Order Updates</Text>
            <Text style={styles.sub}>Shipping, delivery, and refund status</Text>
          </View>
          <Switch value={prefs.orders} onValueChange={handleToggle('orders', 'Order Updates')} trackColor={{ true: colors.primary }} />
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Promotions</Text>
            <Text style={styles.sub}>Sales, discounts, and exclusive offers</Text>
          </View>
          <Switch value={prefs.promos} onValueChange={handleToggle('promos', 'Promotions')} trackColor={{ true: colors.primary }} />
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Restocks</Text>
            <Text style={styles.sub}>When your wishlisted items are back</Text>
          </View>
          <Switch value={prefs.restocks} onValueChange={handleToggle('restocks', 'Restocks')} trackColor={{ true: colors.primary }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingTop: spacing[12], backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back:   { fontSize: 22, color: colors.text },
  title:  { ...textStyles.h5, color: colors.text },
  content:{ padding: spacing[4] },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.divider },
  label: { ...textStyles.body1, fontWeight: '600', color: colors.text, marginBottom: 2 },
  sub:   { ...textStyles.caption, color: colors.textMuted },
});

export default NotifSettingsScreen;
