import React, { useState, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [occasionReminders, setOccasionReminders] = useState(true);
    const [giftIdeas, setGiftIdeas] = useState(false);
    const [emailUpdates, setEmailUpdates] = useState(false);

    const displayName = user?.user_metadata?.full_name || 'Alex Johnson';
    const email = user?.email || 'alex.johnson@example.com';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

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

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="chevron-back" size={24} color={Colors.light.foreground} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {avatarUrl ? (
                            <Image
                                source={{ uri: avatarUrl }}
                                style={styles.avatarImage}
                                accessibilityLabel="Profile picture"
                            />
                        ) : (
                            <View style={styles.avatar}>
                                <Feather name="user" size={32} color={Colors.light.primary} />
                            </View>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.displayName}>{displayName}</Text>
                        <Text style={styles.memberLabel}>Givio member</Text>
                    </View>
                </View>

                <View style={styles.fieldSection}>
                    <EditableField
                        label="Name"
                        value={displayName}
                        onEdit={() => { }}
                    />
                    <EditableField
                        label="Email"
                        value={email}
                        onEdit={() => { }}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <MenuItem
                        icon={<Ionicons name="settings-outline" size={22} color={Colors.light.mutedForeground} />}
                        title="App settings"
                        subtitle="Preferences, appearance, and more"
                        onPress={() => { }}
                        showChevron
                    />
                    <MenuItem
                        icon={<Feather name="log-out" size={22} color={Colors.light.destructive} />}
                        title="Sign out"
                        titleColor={Colors.light.destructive}
                        subtitle="Log out of your Givio account"
                        onPress={handleSignOut}
                        loading={isLoading}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <Text style={styles.sectionSubtitle}>Stay on top of important dates</Text>

                    <ToggleItem
                        icon={<Ionicons name="notifications-outline" size={22} color={Colors.light.mutedForeground} />}
                        title="Occasion reminders"
                        subtitle="Birthdays, anniversaries, and holidays"
                        value={occasionReminders}
                        onValueChange={setOccasionReminders}
                    />
                    <ToggleItem
                        icon={<MaterialCommunityIcons name="lightbulb-on-outline" size={22} color={Colors.light.mutedForeground} />}
                        title="Gift ideas"
                        subtitle="Smart suggestions and follow-ups"
                        value={giftIdeas}
                        onValueChange={setGiftIdeas}
                    />
                    <ToggleItem
                        icon={<Ionicons name="mail-outline" size={22} color={Colors.light.mutedForeground} />}
                        title="Email updates"
                        subtitle="Occasional roundups and tips"
                        value={emailUpdates}
                        onValueChange={setEmailUpdates}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

interface EditableFieldProps {
    label: string;
    value: string;
    onEdit: () => void;
}

function EditableField({ label, value, onEdit }: EditableFieldProps) {
    return (
        <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <TouchableOpacity
                    onPress={onEdit}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${label}`}
                >
                    <Text style={styles.editableText}>Editable</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.fieldInput}>
                <Text style={styles.fieldValue}>{value}</Text>
            </View>
        </View>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    title: string;
    titleColor?: string;
    subtitle: string;
    onPress: () => void;
    showChevron?: boolean;
    loading?: boolean;
}

function MenuItem({ icon, title, titleColor, subtitle, onPress, showChevron, loading }: MenuItemProps) {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            disabled={loading}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            <View style={styles.menuIconContainer}>
                {icon}
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, titleColor && { color: titleColor }]}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            {showChevron && (
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.light.mutedForeground}
                />
            )}
        </TouchableOpacity>
    );
}

interface ToggleItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

function ToggleItem({ icon, title, subtitle, value, onValueChange }: ToggleItemProps) {
    const trackColor = useMemo(() => ({
        false: Colors.light.border,
        true: Colors.light.primary,
    }), []);

    return (
        <View style={styles.toggleItem}>
            <View style={styles.menuIconContainer}>
                {icon}
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={trackColor}
                thumbColor={Colors.light.white}
                ios_backgroundColor={Colors.light.border}
                accessibilityRole="switch"
                accessibilityLabel={title}
                accessibilityState={{ checked: value }}
            />
        </View>
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
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '600',
        color: Colors.light.foreground,
        textAlign: 'center',
        marginRight: 40, // Offset for back button
    },
    headerSpacer: {
        width: 0,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.light.primary,
    },
    avatarImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: Colors.light.primary,
    },
    profileInfo: {
        flex: 1,
    },
    displayName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.foreground,
        marginBottom: 2,
    },
    memberLabel: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
    },
    fieldSection: {
        marginTop: 8,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    fieldLabel: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
    },
    editableText: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '500',
    },
    fieldInput: {
        backgroundColor: Colors.light.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    fieldValue: {
        fontSize: 16,
        color: Colors.light.foreground,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginVertical: 20,
    },
    section: {
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.foreground,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.light.foreground,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: Colors.light.mutedForeground,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
});
