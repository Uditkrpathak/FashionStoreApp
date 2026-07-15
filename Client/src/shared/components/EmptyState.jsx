import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingCart, Heart, PackageOpen, Search, WifiOff, FileQuestion } from 'lucide-react-native';
import Button from './Button';
import { colors }    from '../../theme/colors';
import { spacing }   from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

const PRESETS = {
  cart:     { icon: ShoppingCart, title: 'Your cart is empty',     subtitle: 'Add items to get started' },
  wishlist: { icon: Heart,        title: 'Nothing saved yet',      subtitle: 'Tap the heart on any product to save it' },
  orders:   { icon: PackageOpen,  title: 'No orders yet',          subtitle: "You haven't placed any orders" },
  search:   { icon: Search,       title: 'No results found',       subtitle: 'Try a different search term' },
  network:  { icon: WifiOff,      title: 'No internet connection', subtitle: 'Check your connection and retry' },
  generic:  { icon: FileQuestion, title: 'Nothing here',           subtitle: 'Check back later' },
};

const EmptyState = ({
  type     = 'generic',
  title,
  subtitle,
  icon: CustomIcon,
  actionLabel,
  onAction,
  style,
}) => {
  const preset = PRESETS[type] ?? PRESETS.generic;
  const IconComponent = CustomIcon ?? preset.icon;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <IconComponent size={48} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>{title ?? preset.title}</Text>
      <Text style={styles.subtitle}>{subtitle ?? preset.subtitle}</Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="sm"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
    paddingVertical:   spacing[10],
  },
  iconContainer: {
    marginBottom: spacing[4],
  },
  title: {
    ...textStyles.h4,
    color:        colors.text,
    textAlign:    'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    ...textStyles.body2,
    color:     colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: spacing[6],
    minWidth:  140,
  },
});

export default EmptyState;
