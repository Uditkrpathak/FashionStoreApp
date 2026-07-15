// src/shared/components/Button.jsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors }    from '../../theme/colors';
import { spacing, layout, shadows } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

/**
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} variant
 * @param {'md'|'sm'|'lg'} size
 */
const Button = ({
  title,
  onPress,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <View style={styles.row}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius:   30, // Pill shaped
    alignItems:     'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  iconLeft:  { marginRight: spacing[2] },
  iconRight: { marginLeft:  spacing[2] },

  // ── Variants ────────────────────────────────────────────────────────────────
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth:     1.5,
    borderColor:     colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.disabled,
    shadowOpacity:   0,
    elevation:       0,
  },

  // ── Text variants ────────────────────────────────────────────────────────────
  text:           { ...textStyles.button },
  text_primary:   { color: colors.white },
  text_secondary: { color: colors.text  },
  text_outline:   { color: colors.primary },
  text_ghost:     { color: colors.primary },
  text_danger:    { color: colors.white },

  // ── Sizes ────────────────────────────────────────────────────────────────────
  size_lg: { height: layout.buttonHeight + 8,  paddingHorizontal: spacing[8] },
  size_md: { height: layout.buttonHeight,       paddingHorizontal: spacing[6] },
  size_sm: { height: layout.buttonHeightSm,     paddingHorizontal: spacing[4] },

  textSize_lg: { fontSize: 18 },
  textSize_md: { fontSize: 16 },
  textSize_sm: { fontSize: 14 },
});

export default Button;
