// src/features/profile/screens/AddressesScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { useGetAddressesQuery, useDeleteAddressMutation } from '../../cart/api/cartApi';
import { useToast } from '../../../context/ToastContext';
import EmptyState from '../../../shared/components/EmptyState';
import Button     from '../../../shared/components/Button';
import { colors } from '../../../theme/colors';
import { spacing, shadows } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const AddressesScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { data } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const addresses = data?.addresses ?? [];

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id).unwrap();
      showToast('Address removed', 'success');
    } catch { showToast('Failed to remove', 'error'); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft size={24} color="#000000" /></TouchableOpacity>
        <Text style={styles.title}>My Addresses</Text>
        <View style={{ width: 32 }} />
      </View>
      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No saved addresses" subtitle="Add an address for faster checkout" actionLabel="Add Address" onAction={() => navigation.navigate('AddEditAddress')} />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(i) => i._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.label ?? 'Home'}</Text>
                <Text style={styles.addr}>{item.line1}</Text>
                <Text style={styles.addr}>{item.city}, {item.pincode}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('AddEditAddress', { address: item })}>
                  <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <View style={styles.footer}>
        <Button title="+ Add New Address" onPress={() => navigation.navigate('AddEditAddress')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingTop: spacing[12], backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back:   { fontSize: 22, color: colors.text },
  title:  { ...textStyles.h5, color: colors.text },
  list:   { padding: spacing[4] },
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: spacing[4], marginBottom: spacing[3], ...shadows.sm },
  label:  { ...textStyles.label, color: colors.text, marginBottom: 2 },
  addr:   { ...textStyles.body2, color: colors.textMuted },
  actions:{ justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: spacing[3] },
  edit:   { ...textStyles.label, color: colors.primary, marginBottom: spacing[3] },
  delete: { ...textStyles.label, color: colors.error },
  footer: { padding: spacing[4], borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
});

export default AddressesScreen;
