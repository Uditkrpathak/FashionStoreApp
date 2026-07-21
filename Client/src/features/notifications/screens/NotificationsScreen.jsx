// src/features/notifications/screens/NotificationsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Truck, Percent, Star, Wallet, Bell, ArrowLeft } from 'lucide-react-native';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../api/notificationApi';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const getIconForType = (type) => {
  switch (type) {
    case 'order': return Truck;
    case 'promo': return Percent;
    case 'review': return Star;
    case 'payment': return Wallet;
    default: return Bell;
  }
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const notifications = data?.notifications || [];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const grouped = notifications.reduce((acc, curr) => {
    const date = new Date(curr.createdAt);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    const groupName = isToday ? 'TODAY' : 'YESTERDAY';
    
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(curr);
    return acc;
  }, {});

  const sections = Object.keys(grouped).map(key => ({ title: key, data: grouped[key] }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} width={20} height={20} color="#1F2029" stroke="#1F2029" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{unreadCount} NEW</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 50 }} color="#1F2029" />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <TouchableOpacity>
                  <Text style={styles.markReadText}>Mark all as read</Text>
                </TouchableOpacity>
              </View>
              {item.data.map((notif) => {
                const Icon = getIconForType(notif.type);
                const hours = Math.floor((new Date() - new Date(notif.createdAt)) / 3600000);
                const timeStr = hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
                return (
                  <TouchableOpacity 
                    key={notif._id} 
                    style={[styles.card, !notif.isRead && styles.unreadCard]}
                    onPress={() => markAsRead(notif._id)}
                  >
                    <View style={styles.iconContainer}>
                      <Icon size={24} width={24} height={24} color="#1F2029" stroke="#1F2029" strokeWidth={2.2} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{notif.title}</Text>
                      <Text style={styles.cardDesc} numberOfLines={3}>{notif.message}</Text>
                    </View>
                    <Text style={styles.timeText}>{timeStr}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: spacing[6], paddingTop: spacing[12], 
    backgroundColor: '#F9F9F9'
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  title:   { ...textStyles.h4, color: '#1F2029', fontWeight: '700' },
  pill:    { backgroundColor: '#1F2029', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillText:{ color: colors.white, fontSize: 12, fontWeight: '700' },
  
  list: { padding: spacing[6], paddingBottom: spacing[10] },
  section: { marginBottom: spacing[6] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] },
  sectionTitle: { ...textStyles.label, color: colors.textMuted, letterSpacing: 1 },
  markReadText: { ...textStyles.body2, color: '#1F2029', fontWeight: '600' },
  
  card: {
    flexDirection: 'row', alignItems: 'center', padding: spacing[4], backgroundColor: colors.white,
    borderRadius: 16, marginBottom: spacing[3], borderWidth: 1, borderColor: '#F0F0F0',
  },
  unreadCard: { backgroundColor: '#FDFBF9', borderColor: '#D4C4B7' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', marginRight: spacing[4] },
  cardContent: { flex: 1, marginRight: spacing[2] },
  cardTitle: { ...textStyles.body1, color: '#1F2029', fontWeight: '700', marginBottom: 2 },
  cardDesc: { ...textStyles.caption, color: colors.textMuted },
  timeText: { ...textStyles.caption, color: colors.textMuted, fontSize: 11 },
});

export default NotificationsScreen;
