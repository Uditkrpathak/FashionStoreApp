// src/shared/components/Input.jsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors }    from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { textStyles, fontSizes } from '../../theme/typography';

/**
 * Controlled Input with label, error, and password toggle.
 * Designed to work with React Hook Form via Controller.
 */
const Input = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry = false,
  keyboardType    = 'default',
  autoCapitalize  = 'sentences',
  error,
  leftIcon,
  rightIcon,
  editable = true,
  multiline = false,
  numberOfLines,
  style,
  inputStyle,
  maxLength,
  returnKeyType,
  onSubmitEditing,
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          isFocused && styles.focused,
          !!error   && styles.errorBorder,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon  && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.multiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onBlur={() => { setIsFocused(false); onBlur?.(); }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setIsSecure((s) => !s)}
          >
            <Text style={styles.eyeText}>{isSecure ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:      { marginBottom: spacing[4] },
  label: {
    ...textStyles.label,
    color:         colors.text,
    marginBottom:  spacing[1.5],
  },
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    height:         layout.inputHeight,
    borderWidth:    1.5,
    borderColor:    colors.border,
    borderRadius:   layout.cardRadiusSm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[4],
  },
  focused: {
    borderColor: colors.primary,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.7,
  },
  input: {
    flex:       1,
    ...textStyles.body1,
    color:      colors.text,
    paddingVertical: 0,
  },
  inputWithLeftIcon:  { marginLeft:  spacing[2] },
  inputWithRightIcon: { marginRight: spacing[2] },
  multiline: {
    height:      undefined,
    paddingTop:  spacing[3],
    textAlignVertical: 'top',
  },
  leftIcon:   { marginRight: spacing[2] },
  rightIcon:  { marginLeft:  spacing[2] },
  eyeText:    { fontSize: fontSizes.md },
  error: {
    ...textStyles.caption,
    color:      colors.error,
    marginTop:  spacing[1],
  },
});

export default Input;
