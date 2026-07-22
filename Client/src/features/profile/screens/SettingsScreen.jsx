// src/features/profile/screens/SettingsScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight } from 'lucide-react-native';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/ThemeContext';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(false);

  const handleToggle = (setter, name) => (val) => {
    setter(val);
    showToast(`${name} ${val ? 'enabled' : 'disabled'}`, 'success');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.menu}>

          <View style={styles.menuItem}>
            <Text style={styles.menuLabel}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={handleToggle(setNotifications, 'Push Notifications')}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.menuItem}>
            <Text style={styles.menuLabel}>Location</Text>
            <Switch
              value={location}
              onValueChange={handleToggle(setLocation, 'Location')}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Language</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuValue}>English (US)</Text>
              <ChevronRight size={20} color={colors.text} />
            </View>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Text style={styles.menuLabel}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

        </View>
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
  back: { fontSize: 18, color: '#000000', fontWeight: '700' },
  title: { ...textStyles.h4, color: colors.text, fontWeight: '800' },

  content: { paddingVertical: spacing[6], paddingBottom: 120 },
  menu: { paddingHorizontal: spacing[6] },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing[5],
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  menuLabel: { ...textStyles.body1, color: colors.text, fontWeight: '600' },
  menuValue: { ...textStyles.body2, color: colors.textMuted, marginRight: spacing[2] }
});

export default SettingsScreen;
