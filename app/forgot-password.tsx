import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LogoIcon from '@/components/icons/LogoIcon';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

interface FormErrors {
    email?: string;
    general?: string;
}

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateEmail = useCallback((email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            newErrors.email = 'Email address is required';
        } else if (!validateEmail(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [email, validateEmail]);

    const handleResetPassword = useCallback(async () => {
        Keyboard.dismiss();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const { error } = await resetPassword(email);

            if (error) {
                setErrors({
                    general: error.message || 'Failed to send reset link',
                });
                return;
            }

            setIsSuccess(true);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setErrors({
                general: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }, [email, validateForm, resetPassword]);

    const handleEmailChange = useCallback((value: string) => {
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
        setIsSuccess(false);
    }, []);

    const handleBackToLogin = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <LogoIcon
                                size={80}
                                accessible={true}
                                accessibilityLabel="Givio logo"
                            />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.title}>Forgot password?</Text>
                            <Text style={styles.subtitle}>
                                Enter your email and we'll send{'\n'}you a secure reset link.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            {errors.general && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.generalError} accessibilityRole="alert">
                                        {errors.general}
                                    </Text>
                                </View>
                            )}

                            {isSuccess && (
                                <View style={styles.successContainer}>
                                    <Text style={styles.successText} accessibilityRole="alert">
                                        If an account exists with this email, we've sent a password reset link.{'\n\n'}
                                        <Text style={styles.successHint}>
                                            Signed up with Google? Use "Continue with Google" on the login screen instead.
                                        </Text>
                                    </Text>
                                </View>
                            )}

                            <View style={styles.inputsContainer}>
                                <TextInput
                                    label="Email address"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChangeText={handleEmailChange}
                                    error={errors.email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    editable={!isLoading}
                                />
                            </View>

                            <View style={styles.bottomSection}>
                                <Button
                                    title="Send reset link"
                                    onPress={handleResetPassword}
                                    loading={isLoading}
                                    disabled={isLoading}
                                    style={styles.resetButton}
                                    accessibilityHint="Send password reset link to your email"
                                />

                                <TouchableOpacity
                                    style={styles.backToLogin}
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityLabel="Back to login"
                                    onPress={handleBackToLogin}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.backToLoginText}>
                                        Back to login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.foreground,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.mutedForeground,
        letterSpacing: 0.2,
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        minHeight: 280,
        justifyContent: 'space-between',
    },
    inputsContainer: {
        width: '100%',
    },
    bottomSection: {
        width: '100%',
        marginTop: 24,
    },
    resetButton: {
        marginBottom: 24,
    },
    backToLogin: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    backToLoginText: {
        fontSize: 15,
        color: Colors.light.mutedForeground,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    errorContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: Colors.light.destructive + '15',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.destructive + '30',
    },
    generalError: {
        fontSize: 14,
        color: Colors.light.destructive,
        textAlign: 'center',
        fontWeight: '500',
    },
    successContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: Colors.light.success + '30',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.success,
    },
    successText: {
        fontSize: 14,
        color: Colors.light.successForeground,
        textAlign: 'center',
        fontWeight: '500',
    },
    successHint: {
        fontSize: 13,
        color: Colors.light.mutedForeground,
        fontWeight: '400',
    },
});
