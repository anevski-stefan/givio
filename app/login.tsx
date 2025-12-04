import React, { useState, useCallback, useRef } from 'react';
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
import { supabase } from '@/lib/supabase';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

export default function LoginScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const isSubmittingRef = useRef(false);

    const validateEmail = useCallback((email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        const trimmedEmail = formData.email.trim();

        if (!trimmedEmail) {
            newErrors.email = 'Email address is required';
        } else if (!validateEmail(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.email, formData.password, validateEmail]);

    const handleLogin = useCallback(async () => {
        Keyboard.dismiss();

        if (isSubmittingRef.current || isLoading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        isSubmittingRef.current = true;
        setIsLoading(true);
        setErrors({});

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setErrors({
                        email: 'Invalid email or password',
                    });
                } else {
                    setErrors({
                        general: error.message || 'An error occurred during login',
                    });
                }
                return;
            }

            if (data?.user) {
                router.replace('/(tabs)');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setErrors({
                general: errorMessage,
            });
        } finally {
            setIsLoading(false);
            isSubmittingRef.current = false;
        }
    }, [formData.email, formData.password, validateForm, isLoading, router]);

    const handleEmailChange = useCallback((email: string) => {
        setFormData((prev) => ({ ...prev, email }));
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.email;
            delete newErrors.general;
            return newErrors;
        });
    }, []);

    const handlePasswordChange = useCallback((password: string) => {
        setFormData((prev) => ({ ...prev, password }));
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.password;
            delete newErrors.general;
            return newErrors;
        });
    }, []);

    const handleForgotPassword = useCallback(() => {
        router.push('/forgot-password' as any);
    }, [router]);

    const handleSignup = useCallback(() => {
        router.push('/signup' as any);
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
                            <Text style={styles.title}>Welcome back</Text>
                            <Text style={styles.subtitle}>
                                Sign in to your concierge
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

                            <View style={styles.inputsContainer}>
                                <TextInput
                                    label="Email address"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChangeText={handleEmailChange}
                                    error={errors.email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    editable={!isLoading}
                                />

                                <TextInput
                                    label="Password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChangeText={handlePasswordChange}
                                    error={errors.password}
                                    secureTextEntry={true}
                                    showPasswordToggle={true}
                                    autoCapitalize="none"
                                    autoComplete="password"
                                    textContentType="password"
                                    editable={!isLoading}
                                />

                                <TouchableOpacity
                                    style={styles.forgotPassword}
                                    accessible={true}
                                    accessibilityRole="link"
                                    accessibilityLabel="Forgot password"
                                    onPress={handleForgotPassword}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.forgotPasswordText}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.bottomSection}>
                                <Button
                                    title="Login"
                                    onPress={handleLogin}
                                    loading={isLoading}
                                    disabled={isLoading}
                                    style={styles.loginButton}
                                    accessibilityHint="Sign in to your account"
                                />

                                <View style={styles.signupContainer}>
                                    <Text style={styles.signupText}>
                                        No account?{' '}
                                    </Text>
                                    <TouchableOpacity
                                        accessible={true}
                                        accessibilityRole="button"
                                        accessibilityLabel="Sign up for a new account"
                                        onPress={handleSignup}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.signupLink}>
                                            Sign up
                                        </Text>
                                    </TouchableOpacity>
                                </View>
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
    },
    form: {
        minHeight: 350,
        justifyContent: 'space-between',
    },
    inputsContainer: {
        width: '100%',
    },
    bottomSection: {
        width: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
        marginTop: -8,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
        letterSpacing: 0.2,
    },
    loginButton: {
        marginBottom: 16,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        fontSize: 15,
        color: Colors.light.mutedForeground,
        letterSpacing: 0.2,
    },
    signupLink: {
        fontSize: 15,
        color: Colors.light.primary,
        fontWeight: '600',
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
        color: Colors.light.destructive || '#ef4444',
        textAlign: 'center',
        fontWeight: '500',
    },
});
