import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInputProps as RNTextInputProps,
    Platform,
    TextInput as RNTextInputRef,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
    label: string;
    error?: string;
    showPasswordToggle?: boolean;
    testID?: string;
}

const MINIMUM_TOUCHABLE_SIZE = 48;
const DEFAULT_BORDER_COLOR = '#e5e7eb';

export interface TextInputRef {
    focus: () => void;
    blur: () => void;
    clear: () => void;
    isFocused: () => boolean;
}

const TextInput = forwardRef<TextInputRef, TextInputProps>(
    (
        {
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
            onFocus,
            onBlur,
            testID,
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const inputRef = useRef<RNTextInputRef>(null);

        useImperativeHandle(ref, () => ({
            focus: () => inputRef.current?.focus(),
            blur: () => inputRef.current?.blur(),
            clear: () => {
                inputRef.current?.clear();
                onChangeText?.('');
            },
            isFocused: () => isFocused,
        }));

        useEffect(() => {
            if (!secureTextEntry) {
                setIsPasswordVisible(false);
            }
        }, [secureTextEntry]);

        const hasError = !!error;
        const isSecure = secureTextEntry && !isPasswordVisible;

        const borderColor = hasError
            ? Colors.light.destructive
            : isFocused
                ? Colors.light.primary
                : DEFAULT_BORDER_COLOR;

        const labelColor = hasError
            ? Colors.light.destructive
            : isFocused
                ? Colors.light.primary
                : Colors.light.foreground;

        const handleFocus = (e: any) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: any) => {
            setIsFocused(false);
            onBlur?.(e);
        };

        const togglePasswordVisibility = () => {
            setIsPasswordVisible((prev) => !prev);
        };

        const inputId = testID ? `${testID}-input` : undefined;
        const errorId = testID ? `${testID}-error` : undefined;

        return (
            <View style={styles.container} testID={testID}>
                <Text
                    style={[styles.label, { color: labelColor }]}
                    nativeID={`${testID || 'input'}-label`}
                >
                    {label}
                </Text>
                <View style={styles.inputWrapper}>
                    <RNTextInput
                        ref={inputRef}
                        style={[
                            styles.input,
                            {
                                borderColor,
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
                        accessibilityLabel={error ? `${label}. ${error}` : label}
                        accessibilityState={{ disabled: rest.editable === false }}
                        testID={inputId}
                        {...rest}
                    />
                    {showPasswordToggle && (
                        <Pressable
                            style={styles.passwordToggle}
                            onPress={togglePasswordVisibility}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={
                                isPasswordVisible ? 'Hide password' : 'Show password'
                            }
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            testID={testID ? `${testID}-password-toggle` : undefined}
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={Colors.light.mutedForeground}
                            />
                        </Pressable>
                    )}
                </View>
                {hasError && (
                    <Text
                        style={styles.error}
                        accessibilityRole="alert"
                        accessibilityLiveRegion="polite"
                        nativeID={errorId}
                        testID={errorId}
                    >
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.2,
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        minHeight: MINIMUM_TOUCHABLE_SIZE,
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
                paddingVertical: 8,
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
