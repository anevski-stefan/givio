import React, { useMemo } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

const MINIMUM_TOUCHABLE_SIZE = 48;

export default function Button({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
    accessibilityLabel,
    accessibilityHint,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const buttonStyle = useMemo(
        () => [
            styles.button,
            variant === 'primary' && styles.primaryButton,
            variant === 'secondary' && styles.secondaryButton,
            variant === 'ghost' && styles.ghostButton,
            isDisabled && styles.disabledButton,
            style,
        ],
        [variant, isDisabled, style]
    );

    const textStyles = useMemo(
        () => [
            styles.text,
            variant === 'primary' && styles.primaryText,
            variant === 'secondary' && styles.secondaryText,
            variant === 'ghost' && styles.ghostText,
            isDisabled && styles.disabledText,
            textStyle,
        ],
        [variant, isDisabled, textStyle]
    );

    const spinnerColor = useMemo(
        () =>
            variant === 'primary'
                ? Colors.light.primaryForeground
                : Colors.light.primary,
        [variant]
    );

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={isDisabled}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || title}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={spinnerColor} />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: MINIMUM_TOUCHABLE_SIZE,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    primaryButton: {
        backgroundColor: Colors.light.primary,
    },
    secondaryButton: {
        backgroundColor: Colors.light.secondary,
        borderWidth: 1,
        borderColor: Colors.light.border || '#e5e7eb',
    },
    ghostButton: {
        backgroundColor: 'transparent',
    },
    disabledButton: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    primaryText: {
        color: Colors.light.primaryForeground,
    },
    secondaryText: {
        color: Colors.light.secondaryForeground,
    },
    ghostText: {
        color: Colors.light.primary,
    },
    disabledText: {
    },
});
