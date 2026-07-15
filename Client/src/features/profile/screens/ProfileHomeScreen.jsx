import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, CreditCard, ClipboardList, Settings, HelpCircle, Lock, Users, LogOut, ChevronRight } from 'lucide-react-native';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectUser, logout } from '../../auth/store/authSlice';
import { clearUserData } from '../store/userSlice';
import { clearWishlist } from '../../wishlist/store/wishlistSlice';
import { clearCart } from '../../cart/store/cartSlice';
import { useToast } from '../../../context/ToastContext';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const MENU = [
  { icon: User, label: 'Your profile', route: 'EditProfile' },
  { icon: CreditCard, label: 'Payment Methods', route: 'SavedCards' },
  { icon: ClipboardList, label: 'My Orders', route: 'Modals', screen: 'MyOrders' },
  { icon: Settings, label: 'Settings', route: 'Settings' },
  { icon: HelpCircle, label: 'Help Center', route: 'HelpCenter' },
  { icon: Lock, label: 'Privacy Policy', route: 'PrivacyPolicy' },
  { icon: Users, label: 'Invites Friends', route: 'InviteFriends' },
  { icon: LogOut, label: 'Log out', action: 'logout' },
];

const ProfileHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { showToast } = useToast();

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clearUserData());
    dispatch(clearWishlist());
    dispatch(clearCart());
    showToast('Logged out', 'info');
  };

  const handleNav = (item) => {
    if (item.action === 'logout') {
      handleLogout();
      return;
    }
    if (item.route === 'InviteFriends') {
      showToast('Invite friends coming soon!', 'info');
      return;
    }
    if (!item.route) return;
    if (item.route === 'Modals') navigation.navigate('Modals', { screen: item.screen });
    else navigation.navigate(item.route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar section */}
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarImage, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }]}>
              <Text style={{ color: colors.white, fontSize: 32, fontWeight: 'bold' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => handleNav(item)}>
                <View style={styles.menuIconContainer}>
                  <Icon size={24} color={colors.text} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={20} color={colors.text} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    alignItems: 'center', justifyContent: 'center',
    padding: spacing[4], paddingTop: spacing[12],
    backgroundColor: colors.white,
  },
  title: { ...textStyles.h3, color: colors.text, fontWeight: '800' },
  scrollContent: {
    paddingBottom: 100, // padding for tab bar
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: spacing[6],
    marginBottom: spacing[8],
  },
  avatarImage: {
    width: 100, height: 100, borderRadius: 50,
    marginBottom: spacing[4],
  },
  name: { ...textStyles.h4, color: colors.text, fontWeight: '700' },
  menu: {
    paddingHorizontal: spacing[6],
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing[5],
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: { width: 32, marginRight: spacing[3] },
  menuLabel: { ...textStyles.body1, color: colors.text, flex: 1, fontWeight: '600' },
});

export default ProfileHomeScreen;
