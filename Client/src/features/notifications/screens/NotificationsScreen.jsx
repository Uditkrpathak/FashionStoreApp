import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Truck, Tag, Star, Wallet, Bell, ArrowLeft, CheckCheck } from 'lucide-react-native';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../api/notificationApi';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const getIconForType = (type) => {
  switch (type) {
    case 'order': return Truck;
    case 'promo': return Tag;
    case 'review': return Star;
    case 'payment': return Wallet;
    default: return Bell;
  }
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

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

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.log('Failed to mark all as read', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#1F2029" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{unreadCount} NEW</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color="#704F38" size="large" />
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Bell size={32} color="#704F38" />
          </View>
          <Text style={styles.emptyTitle}>No Notifications Yet</Text>
          <Text style={styles.emptySub}>We'll notify you about your order updates & exclusive promo offers here.</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
                  <Text style={styles.markReadText}>Mark all as read</Text>
                </TouchableOpacity>
              </View>
              {item.data.map((notif) => {
                const Icon = getIconForType(notif.type);
                const hours = Math.floor((new Date() - new Date(notif.createdAt)) / 3600000);
                const timeStr = hours < 1 ? 'Just now' : hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
                
                return (
                  <TouchableOpacity 
                    key={notif._id} 
                    style={[styles.card, !notif.isRead && styles.unreadCard]}
                    onPress={() => markAsRead(notif._id)}
                    activeOpacity={0.88}
                  >
                    <View style={[styles.iconContainer, !notif.isRead && styles.unreadIconContainer]}>
                      <Icon size={22} color="#704F38" strokeWidth={2} />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{notif.title}</Text>
                      <Text style={styles.cardDesc}>{notif.message}</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: spacing[5], paddingTop: spacing[12], paddingBottom: spacing[4],
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAEAEA', alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 18, fontWeight: '800', color: '#1F2029', tracking: -0.3 },
  pill:    { backgroundColor: '#704F38', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillText:{ color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  
  list: { paddingHorizontal: spacing[5], paddingTop: spacing[5], paddingBottom: 120 },
  section: { marginBottom: spacing[6] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3.5] },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#797979', letterSpacing: 1.2 },
  markReadText: { fontSize: 13, fontWeight: '700', color: '#704F38' },
  
  card: {
    flexDirection: 'row', alignItems: 'flex-start', padding: spacing[4], backgroundColor: '#FFFFFF',
    borderRadius: 16, marginBottom: spacing[3], borderWidth: 1, borderColor: '#F0F0F0',
  },
  unreadCard: { backgroundColor: '#FDFBF9', borderColor: '#EFEAE6' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F7F4F0', alignItems: 'center', justifyContent: 'center', marginRight: spacing[3.5] },
  unreadIconContainer: { backgroundColor: '#F2ECE6' },
  cardContent: { flex: 1, marginRight: spacing[2] },
  cardTitle: { fontSize: 15, color: '#1F2029', fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#797979', lineHeight: 18, fontWeight: '400' },
  timeText: { fontSize: 11, color: '#9E9E9E', fontWeight: '600', marginTop: 2 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContainer: 'center', padding: spacing[8], marginTop: 80 },
  emptyIconBg: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#F7F4F0', alignItems: 'center', justifyContainer: 'center', marginBottom: spacing[4] },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1F2029', marginBottom: spacing[2] },
  emptySub: { fontSize: 13, color: '#797979', textAlign: 'center', lineHeight: 20 },
});

export default NotificationsScreen;
