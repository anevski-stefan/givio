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

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri();

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export default function LoginScreen() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const isSubmittingRef = useRef(false);

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
                router.replace('/(tabs)');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
            setErrors({ general: errorMessage });
        } finally {
            setIsGoogleLoading(false);
        }
    }, [isGoogleLoading, isLoading, createSessionFromUrl, router]);

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

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Login successful', formData);
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                email: 'Invalid email or password',
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateForm]);

    const handleEmailChange = useCallback((email: string) => {
        setFormData((prev) => ({ ...prev, email }));
        setErrors((prev) => ({ ...prev, email: undefined }));
    }, []);

    const handlePasswordChange = useCallback((password: string) => {
        setFormData((prev) => ({ ...prev, password }));
        setErrors((prev) => ({ ...prev, password: undefined }));
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
                            />

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
                                        accessibilityRole="link"
                                        accessibilityLabel="Forgot password"
                                        onPress={handleForgotPassword}
                                        disabled={isAnyLoading}
                                    >
                                        <Text style={styles.signupLink}>
                                            Sign up
                                        </Text>
                                    </TouchableOpacity>
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
});
