import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const displayName = user?.user_metadata?.full_name || 'User';
    const email = user?.email || '';
    const createdAt = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        })
        : '';

    const handleSignOut = useCallback(async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            const { error } = await signOut();
                            if (error) {
                                Alert.alert('Error', 'Failed to sign out. Please try again.');
                            }
                        } catch (error) {
                            console.error('Sign out error:', error);
                            Alert.alert('Error', 'An unexpected error occurred.');
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }, [signOut]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {displayName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.displayName}>{displayName}</Text>
                    <Text style={styles.email}>{email}</Text>
                    {createdAt && (
                        <Text style={styles.memberSince}>Member since {createdAt}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <MenuItem
                        icon="user"
                        title="Edit Profile"
                        subtitle="Update your personal information"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="bell"
                        title="Notifications"
                        subtitle="Manage notification preferences"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="lock"
                        title="Privacy & Security"
                        subtitle="Password and data settings"
                        onPress={() => { }}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>

                    <MenuItem
                        icon="question-circle"
                        title="Help Center"
                        subtitle="Get answers to common questions"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="envelope"
                        title="Contact Us"
                        subtitle="Send us feedback or report issues"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="info-circle"
                        title="About Givio"
                        subtitle="Version 1.0.0"
                        onPress={() => { }}
                    />
                </View>

                <View style={styles.signOutSection}>
                    <Button
                        title="Sign Out"
                        onPress={handleSignOut}
                        loading={isLoading}
                        disabled={isLoading}
                        variant="destructive"
                        style={styles.signOutButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

interface MenuItemProps {
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    title: string;
    subtitle: string;
    onPress: () => void;
}

function MenuItem({ icon, title, subtitle, onPress }: MenuItemProps) {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            <View style={styles.menuIconContainer}>
                <FontAwesome name={icon} size={20} color={Colors.light.mutedForeground} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <FontAwesome
                name="chevron-right"
                size={14}
                color={Colors.light.mutedForeground}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.foreground,
        letterSpacing: -0.5,
    },
    profileCard: {
        backgroundColor: Colors.light.white,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.light.primaryForeground,
    },
    displayName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.light.foreground,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
        marginBottom: 8,
    },
    memberSince: {
        fontSize: 12,
        color: Colors.light.mutedForeground,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.mutedForeground,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.light.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.foreground,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: Colors.light.mutedForeground,
    },
    signOutSection: {
        marginTop: 8,
    },
    signOutButton: {
        backgroundColor: Colors.light.destructive + '10',
        borderWidth: 1,
        borderColor: Colors.light.destructive + '30',
    },
});
