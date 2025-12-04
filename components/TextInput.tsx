import React, { useState, useMemo, useCallback } from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps as RNTextInputProps,
    Platform,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
    label: string;
    error?: string;
    showPasswordToggle?: boolean;
}

const MINIMUM_TOUCHABLE_SIZE = 48;

export default function TextInput({
    label,
    error,
    showPasswordToggle = false,
    secureTextEntry,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    autoCapitalize = 'none',
    autoComplete,
    textContentType,
    ...rest
}: TextInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const hasError = !!error;
    const isSecure = secureTextEntry && !isPasswordVisible;

    const dynamicStyles = useMemo(() => {
        const borderColor = hasError
            ? Colors.light.destructive
            : isFocused
                ? Colors.light.primary
                : Colors.light.border || '#e5e7eb';

        const labelColor = hasError
            ? Colors.light.destructive
            : isFocused
                ? Colors.light.primary
                : Colors.light.foreground;

        return { borderColor, labelColor };
    }, [hasError, isFocused]);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);
    const togglePasswordVisibility = useCallback(
        () => setIsPasswordVisible((prev) => !prev),
        []
    );

    return (
        <View style={styles.container}>
            <Text
                style={[styles.label, { color: dynamicStyles.labelColor }]}
                accessibilityRole="text"
            >
                {label}
            </Text>
            <View style={styles.inputWrapper}>
                <RNTextInput
                    style={[
                        styles.input,
                        {
                            borderColor: dynamicStyles.borderColor,
                            paddingRight: showPasswordToggle ? 48 : 16,
                        },
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.light.mutedForeground}
                    secureTextEntry={isSecure}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                    accessible={true}
                    accessibilityLabel={`${label} input field`}
                    accessibilityState={{ disabled: rest.editable === false }}
                    accessibilityHint={error ? `Error: ${error}` : undefined}
                    {...rest}
                />
                {showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={togglePasswordVisibility}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={
                            isPasswordVisible ? 'Hide password' : 'Show password'
                        }
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.light.mutedForeground}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {hasError && (
                <Text
                    style={styles.error}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                >
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        height: MINIMUM_TOUCHABLE_SIZE,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: Colors.light.input,
        color: Colors.light.foreground,
        ...Platform.select({
            ios: {
                paddingVertical: 12,
            },
            android: {
                paddingVertical: 0,
            },
        }),
    },
    passwordToggle: {
        position: 'absolute',
        right: 12,
        top: 0,
        height: MINIMUM_TOUCHABLE_SIZE,
        width: MINIMUM_TOUCHABLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        fontSize: 13,
        color: Colors.light.destructive || '#ef4444',
        marginTop: 6,
        marginLeft: 4,
    },
});
