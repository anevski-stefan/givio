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
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import LogoIcon from '@/components/icons/LogoIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri();

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
    const { signInWithEmail, signInWithMagicLink } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

    const createSessionFromUrl = useCallback(async (url: string) => {
        const { params, errorCode } = QueryParams.getQueryParams(url);
        if (errorCode) throw new Error(errorCode);
        const { access_token, refresh_token } = params;
        if (!access_token) return null;

        const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });
        if (error) throw error;
        return data.session;
    }, []);

    const handleGoogleLogin = useCallback(async () => {
        if (isGoogleLoading || isLoading) return;

        setIsGoogleLoading(true);
        setErrors({});

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            const res = await WebBrowser.openAuthSessionAsync(
                data?.url ?? '',
                redirectTo
            );

            if (res.type === 'success') {
                const { url } = res;
                await createSessionFromUrl(url);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
            console.error('Google login error:', errorMessage);
            setErrors({ general: errorMessage });
        } finally {
            setIsGoogleLoading(false);
        }
    }, [isGoogleLoading, isLoading, createSessionFromUrl]);

    const validateEmail = useCallback((email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!validateEmail(formData.email)) {
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

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const { error } = await signInWithEmail(formData.email, formData.password);

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setErrors({ general: 'Invalid email or password' });
                } else if (error.message.includes('Email not confirmed')) {
                    setErrors({ general: 'Please verify your email address first' });
                } else {
                    setErrors({ general: error.message });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                general: 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateForm, signInWithEmail]);

    const handleMagicLink = useCallback(async () => {
        Keyboard.dismiss();

        if (!formData.email.trim()) {
            setErrors({ email: 'Email address is required' });
            return;
        }

        if (!validateEmail(formData.email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const { error } = await signInWithMagicLink(formData.email);

            if (error) {
                setErrors({ general: error.message });
            } else {
                setIsMagicLinkSent(true);
            }
        } catch (error) {
            console.error('Magic link error:', error);
            setErrors({
                general: 'Failed to send magic link. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData.email, validateEmail, signInWithMagicLink]);

    const handleEmailChange = useCallback((email: string) => {
        setFormData((prev) => ({ ...prev, email }));
        setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
        setIsMagicLinkSent(false);
    }, []);

    const handlePasswordChange = useCallback((password: string) => {
        setFormData((prev) => ({ ...prev, password }));
        setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
    }, []);

    const handleForgotPassword = useCallback(() => {
        router.push('/forgot-password' as any);
    }, [router]);

    const handleSignup = useCallback(() => {
        router.push('/signup' as any);
    }, [router]);

    const isAnyLoading = isLoading || isGoogleLoading;

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
                            {isMagicLinkSent && (
                                <View style={styles.successContainer}>
                                    <Text style={styles.successText} accessibilityRole="alert">
                                        ✅ Magic link sent! Check your email inbox.
                                    </Text>
                                </View>
                            )}

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
                                    editable={!isAnyLoading}
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
                                    editable={!isAnyLoading}
                                />

                                <View style={styles.passwordActions}>
                                    <TouchableOpacity
                                        style={styles.magicLinkButton}
                                        accessible={true}
                                        accessibilityRole="button"
                                        accessibilityLabel="Send magic link"
                                        onPress={handleMagicLink}
                                        disabled={isAnyLoading}
                                    >
                                        <Text style={styles.magicLinkText}>
                                            Send magic link
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.forgotPassword}
                                        accessible={true}
                                        accessibilityRole="link"
                                        accessibilityLabel="Forgot password"
                                        onPress={handleForgotPassword}
                                        disabled={isAnyLoading}
                                    >
                                        <Text style={styles.forgotPasswordText}>
                                            Forgot Password?
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.bottomSection}>
                                <Button
                                    title="Login"
                                    onPress={handleLogin}
                                    loading={isLoading}
                                    disabled={isAnyLoading}
                                    style={styles.loginButton}
                                    accessibilityHint="Sign in to your account"
                                />

                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>or</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.googleButton,
                                        isAnyLoading && styles.googleButtonDisabled,
                                    ]}
                                    onPress={handleGoogleLogin}
                                    disabled={isAnyLoading}
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityLabel="Continue with Google"
                                >
                                    <GoogleIcon size={20} />
                                    <Text style={styles.googleButtonText}>
                                        Continue with Google
                                    </Text>
                                </TouchableOpacity>

                                <View style={styles.signupContainer}>
                                    <Text style={styles.signupText}>
                                        No account?{' '}
                                    </Text>
                                    <TouchableOpacity
                                        accessible={true}
                                        accessibilityRole="button"
                                        accessibilityLabel="Sign up for a new account"
                                        onPress={handleSignup}
                                        disabled={isAnyLoading}
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
        paddingTop: 40,
        paddingBottom: 24,
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
        minHeight: 420,
        justifyContent: 'space-between',
    },
    inputsContainer: {
        width: '100%',
    },
    bottomSection: {
        width: '100%',
    },
    passwordActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: -8,
    },
    magicLinkButton: {
        paddingVertical: 4,
    },
    magicLinkText: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    forgotPassword: {
        paddingVertical: 4,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
        letterSpacing: 0.2,
    },
    loginButton: {
        marginBottom: 20,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.light.separatorDots,
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
        color: Colors.light.mutedForeground,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.white,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        minHeight: 48,
        marginBottom: 16,
        gap: 12,
    },
    googleButtonDisabled: {
        opacity: 0.5,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.foreground,
        letterSpacing: 0.3,
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
    successContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: Colors.light.success + '20',
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
});
