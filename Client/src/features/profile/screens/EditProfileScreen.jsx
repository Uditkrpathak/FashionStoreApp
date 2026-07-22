// src/features/profile/screens/EditProfileScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Trash2, Image as ImageIcon, X, Plus } from 'lucide-react-native';
import { useUpdateProfileMutation } from '../../auth/api/authApi';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectUser }    from '../../auth/store/authSlice';
import { useToast }      from '../../../context/ToastContext';
import Input  from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { getInitials } from '../../../shared/utils/formatters';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
];

const EditProfileScreen = () => {
  const navigation    = useNavigation();
  const user          = useAppSelector(selectUser);
  const { showToast } = useToast();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  
  const [avatar, setAvatar] = useState(user?.avatar ?? null);
  const [showImageModal, setShowImageModal] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { 
      name: user?.name ?? '', 
      email: user?.email ?? '', 
      phone: user?.phone ?? '',
      gender: user?.gender ?? ''
    },
  });

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Camera roll permissions required', 'warning');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setShowImageModal(false);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast('Camera permissions required', 'warning');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setShowImageModal(false);
    }
  };

  const handleSelectPreset = (url) => {
    setAvatar(url);
    setShowImageModal(false);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    setShowImageModal(false);
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile({ ...data, avatar }).unwrap();
      showToast('Profile updated!', 'success');
      navigation.goBack();
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>←</Text></TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Avatar Area */}
          <View style={styles.avatarWrap}>
            <TouchableOpacity style={styles.avatarTouch} onPress={() => setShowImageModal(true)}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{getInitials(user?.name ?? 'U')}</Text>
                </View>
              )}
              <View style={styles.cameraIconBadge}>
                <Camera size={16} color={colors.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.changeLabel}>Change Profile Photo</Text>
          </View>

          {/* Form */}
          <Controller control={control} name="name" rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Full Name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
            )} />
          <Controller control={control} name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Email" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" editable={false} />
            )} />
          <Controller control={control} name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Phone" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="phone-pad" />
            )} />

          <Text style={styles.fieldLabel}>Gender</Text>
          <Controller 
            control={control} 
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View style={styles.genderRow}>
                {['male', 'female', 'other'].map((g) => (
                  <TouchableOpacity 
                    key={g} 
                    style={[styles.genderChip, value === g && styles.genderChipActive]}
                    onPress={() => onChange(g)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.genderChipText, value === g && styles.genderChipTextActive]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )} 
          />

          <Button title="Save Changes" onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.btn} />
        </ScrollView>

        {/* Action Sheet Modal */}
        <Modal visible={showImageModal} transparent={true} animationType="slide" onRequestClose={() => setShowImageModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Profile Photo</Text>
                <TouchableOpacity onPress={() => setShowImageModal(false)}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Native Picking Options */}
              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.optionBtn} onPress={handlePickImage}>
                  <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
                    <ImageIcon size={24} color="#1E88E5" />
                  </View>
                  <Text style={styles.optionText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionBtn} onPress={handleTakePhoto}>
                  <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                    <Camera size={24} color="#43A047" />
                  </View>
                  <Text style={styles.optionText}>Camera</Text>
                </TouchableOpacity>

                {avatar && (
                  <TouchableOpacity style={styles.optionBtn} onPress={handleRemovePhoto}>
                    <View style={[styles.optionIcon, { backgroundColor: '#FFEBEE' }]}>
                      <Trash2 size={24} color="#E53935" />
                    </View>
                    <Text style={styles.optionText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Preset Avatars Selection */}
              <View style={styles.presetSection}>
                <Text style={styles.presetTitle}>Or Choose a Preset Avatar</Text>
                <View style={styles.presetGrid}>
                  {PRESET_AVATARS.map((url, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelectPreset(url)} style={styles.presetAvatarWrapper}>
                      <Image source={{ uri: url }} style={styles.presetAvatar} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingTop: spacing[12], backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  back:   { fontSize: 22, color: colors.text },
  title:  { ...textStyles.h5, color: colors.text, fontWeight: '700' },
  content:{ padding: spacing[4], paddingBottom: 100 },
  avatarWrap: { alignItems: 'center', marginBottom: spacing[6], marginTop: spacing[2] },
  avatarTouch: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 36, fontWeight: '700' },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.background },
  changeLabel: { ...textStyles.caption, color: colors.primary, fontWeight: '700', marginTop: spacing[3] },
  btn:    { marginTop: spacing[4] },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: spacing[6], paddingBottom: Platform.OS === 'ios' ? spacing[10] : spacing[6] },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[6] },
  modalTitle: { ...textStyles.body1, fontWeight: '700', color: colors.text },
  optionsRow: { flexDirection: 'row', justifyContent: 'flex-start', gap: spacing[8], marginBottom: spacing[6], paddingHorizontal: spacing[2] },
  optionBtn: { alignItems: 'center' },
  optionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[2] },
  optionText: { ...textStyles.caption, color: colors.textMuted, fontWeight: '600' },
  
  presetSection: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: spacing[5] },
  presetTitle: { ...textStyles.caption, color: colors.text, fontWeight: '700', marginBottom: spacing[4] },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], justifyContent: 'space-between' },
  presetAvatarWrapper: { width: '30%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F0F0F0' },
  presetAvatar: { width: '100%', height: '100%' },

  fieldLabel: {
    ...textStyles.caption,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing[2],
    marginTop: spacing[3],
    paddingLeft: spacing[1],
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
    paddingHorizontal: spacing[1],
  },
  genderChip: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  genderChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '12',
  },
  genderChipText: {
    ...textStyles.body2,
    color: colors.textMuted,
    fontWeight: '600',
  },
  genderChipTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});

export default EditProfileScreen;
