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
import LogoIcon from '@/components/icons/LogoIcon';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';

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
                            />

                            <TouchableOpacity
                                style={styles.forgotPassword}
                                accessible={true}
                                accessibilityRole="link"
                                accessibilityLabel="Forgot password"
                            >
                                <Text style={styles.forgotPasswordText}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

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
                                    onPress={() => {
                                        console.log('Navigate to signup');
                                    }}
                                >
                                    <Text style={styles.signupLink}>
                                        Sign up
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
        flex: 1,
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
