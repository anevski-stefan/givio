import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
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
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    testID?: string;
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
    iconLeft,
    iconRight,
    testID,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const handlePress = () => {
        if (!isDisabled && onPress) {
            onPress();
        }
    };

    const buttonStyle = [
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'ghost' && styles.ghostButton,
        isDisabled && styles.disabledButton,
        style,
    ];

    const textStyles = [
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'ghost' && styles.ghostText,
        textStyle,
    ];

    const spinnerColor =
        variant === 'primary'
            ? Colors.light.primaryForeground
            : Colors.light.primary;

    return (
        <Pressable
            style={({ pressed }) => [
                ...buttonStyle,
                pressed && !isDisabled && styles.pressed,
            ]}
            onPress={handlePress}
            disabled={isDisabled}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || title}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            testID={testID}
        >
            {loading ? (
                <ActivityIndicator color={spinnerColor} />
            ) : (
                <View style={styles.contentContainer}>
                    {iconLeft && <View style={styles.iconLeftContainer}>{iconLeft}</View>}
                    <Text style={textStyles}>{title}</Text>
                    {iconRight && <View style={styles.iconRightContainer}>{iconRight}</View>}
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: MINIMUM_TOUCHABLE_SIZE,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    pressed: {
        opacity: 0.8,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    iconLeftContainer: {
        marginRight: 4,
    },
    iconRightContainer: {
        marginLeft: 4,
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
});
