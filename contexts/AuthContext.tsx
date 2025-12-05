import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isInitialized: boolean;
}

interface AuthContextValue extends AuthState {
    signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
    signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
        isInitialized: false,
    });

    useEffect(() => {
        if (!isSupabaseConfigured) {
            console.warn('Supabase not configured. Auth features disabled.');
            setState({
                user: null,
                session: null,
                isLoading: false,
                isInitialized: true,
            });
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setState({
                user: session?.user ?? null,
                session,
                isLoading: false,
                isInitialized: true,
            });
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setState((prev) => ({
                    ...prev,
                    user: session?.user ?? null,
                    session,
                    isLoading: false,
                }));
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithEmail = useCallback(
        async (email: string, password: string): Promise<{ error: AuthError | null }> => {
            if (!isSupabaseConfigured) {
                return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
            }

            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            return { error };
        },
        []
    );

    const signUpWithEmail = useCallback(
        async (
            email: string,
            password: string,
            fullName?: string
        ): Promise<{ error: AuthError | null }> => {
            if (!isSupabaseConfigured) {
                return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
            }

            const { error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: fullName
                    ? {
                        data: {
                            full_name: fullName.trim(),
                        },
                    }
                    : undefined,
            });

            return { error };
        },
        []
    );

    const signInWithMagicLink = useCallback(
        async (email: string): Promise<{ error: AuthError | null }> => {
            if (!isSupabaseConfigured) {
                return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
            }

            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    shouldCreateUser: true,
                },
            });

            return { error };
        },
        []
    );

    const resetPassword = useCallback(
        async (email: string): Promise<{ error: AuthError | null }> => {
            if (!isSupabaseConfigured) {
                return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
            }

            const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

            return { error };
        },
        []
    );

    const updatePassword = useCallback(
        async (newPassword: string): Promise<{ error: AuthError | null }> => {
            if (!isSupabaseConfigured) {
                return { error: { message: 'Supabase not configured', name: 'ConfigError' } as AuthError };
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            return { error };
        },
        []
    );

    const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
        if (!isSupabaseConfigured) {
            return { error: null };
        }

        const { error } = await supabase.auth.signOut();
        return { error };
    }, []);

    const refreshSession = useCallback(async (): Promise<void> => {
        if (!isSupabaseConfigured) return;

        const { data: { session } } = await supabase.auth.refreshSession();
        setState((prev) => ({
            ...prev,
            user: session?.user ?? null,
            session,
        }));
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            ...state,
            signInWithEmail,
            signUpWithEmail,
            signInWithMagicLink,
            resetPassword,
            updatePassword,
            signOut,
            refreshSession,
        }),
        [
            state,
            signInWithEmail,
            signUpWithEmail,
            signInWithMagicLink,
            resetPassword,
            updatePassword,
            signOut,
            refreshSession,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export function useIsAuthenticated(): boolean {
    const { user, isInitialized } = useAuth();
    return isInitialized && user !== null;
}

export default AuthProvider;
