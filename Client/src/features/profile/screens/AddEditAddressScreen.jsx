import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { MapPin } from 'lucide-react-native';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { useAddAddressMutation, useUpdateAddressMutation } from '../../cart/api/cartApi';
import { useToast } from '../../../context/ToastContext';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import MapSelectorModal from '../../../shared/components/MapSelectorModal';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { required, isPincode, isPhone } from '../../../shared/utils/validators';

const AddEditAddressScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const existing   = route.params?.address;
  const isEdit     = !!existing;
  const { showToast } = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const [addAddress,    { isLoading: adding }]   = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [mapVisible, setMapVisible] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name:   existing?.name   ?? user?.name ?? '',
      label:  existing?.label  ?? 'Home',
      line1:  existing?.line1  ?? '',
      city:   existing?.city   ?? '',
      state:  existing?.state  ?? '',
      pincode:existing?.pincode ?? '',
      phone:  existing?.phone  ?? user?.phone ?? '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) await updateAddress({ id: existing._id, ...data }).unwrap();
      else        await addAddress(data).unwrap();
      showToast(isEdit ? 'Address updated' : 'Address added', 'success');
      navigation.goBack();
    } catch { showToast('Failed to save address', 'error'); }
  };

  const handleMapConfirm = (data) => {
    const details = data.addressDetails || {};
    
    // Construct line1 from available street details
    const road = details.road || '';
    const neighbourhood = details.neighbourhood || details.suburb || '';
    const village = details.village || details.town || '';
    const street = [road, neighbourhood, village].filter(Boolean).join(', ');
    
    const city = details.city || details.town || details.village || details.county || '';
    const state = details.state || '';
    const pincode = details.postcode || '';

    if (street) {
      setValue('line1', street);
    } else if (data.address) {
      // Fallback to parsed address up to first comma
      const parts = data.address.split(',');
      setValue('line1', parts[0] + (parts[1] ? ', ' + parts[1] : ''));
    }

    if (city) setValue('city', city);
    if (state) setValue('state', state);
    if (pincode) {
      const cleanPincode = pincode.replace(/\s+/g, '').substring(0, 6);
      setValue('pincode', cleanPincode);
    }
    
    showToast('Address filled from map', 'success');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
          <Text style={styles.title}>{isEdit ? 'Edit Address' : 'Add Address'}</Text>
          <View style={{ width: 32 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          <TouchableOpacity 
            style={styles.mapPickBtn} 
            onPress={() => setMapVisible(true)}
            activeOpacity={0.8}
          >
            <MapPin size={16} color={colors.primary} style={{ marginRight: spacing[2] }} />
            <Text style={styles.mapPickBtnText}>Pick Location from Map</Text>
          </TouchableOpacity>

          <Controller control={control} name="name" rules={{ validate: required('Full Name') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Full Name" placeholder="e.g. Udit Kumar Pathak" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
            )} />

          <Controller control={control} name="label"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Label (Home / Work)" value={value} onChangeText={onChange} onBlur={onBlur} />
            )} />
          <Controller control={control} name="line1" rules={{ validate: required('Address') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Street Address" placeholder="Flat/House No, Street, Area" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.line1?.message} />
            )} />
          <View style={styles.row}>
            <Controller control={control} name="city" rules={{ validate: required('City') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="City" value={value} onChangeText={onChange} onBlur={onBlur} style={{ flex: 1, marginRight: spacing[3] }} error={errors.city?.message} />
              )} />
            <Controller control={control} name="state" rules={{ validate: required('State') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="State" value={value} onChangeText={onChange} onBlur={onBlur} style={{ flex: 1 }} error={errors.state?.message} />
              )} />
          </View>
          <Controller control={control} name="pincode" rules={{ validate: isPincode }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Pincode" placeholder="6-digit pincode" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="number-pad" maxLength={6} error={errors.pincode?.message} />
            )} />
          <Controller control={control} name="phone" rules={{ validate: isPhone }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Phone (for delivery)" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="phone-pad" error={errors.phone?.message} />
            )} />
          <Button title={isEdit ? 'Update Address' : 'Save Address'} onPress={handleSubmit(onSubmit)} loading={adding || updating} style={styles.btn} />
        </ScrollView>
      </View>

      <MapSelectorModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        onConfirm={handleMapConfirm}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingTop: spacing[12], backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back:   { fontSize: 22, color: '#000000' },
  title:  { ...textStyles.h5, color: colors.text },
  content:{ padding: spacing[4], paddingBottom: 120 },
  row:    { flexDirection: 'row' },
  btn:    { marginTop: spacing[2] },
  mapPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: spacing[4],
    backgroundColor: '#FAF7F5',
  },
  mapPickBtnText: {
    ...textStyles.body2,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default AddEditAddressScreen;
