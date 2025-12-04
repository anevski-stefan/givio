import React, { useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import LogoIcon from './icons/LogoIcon';
import GuideIcon from './icons/GuideIcon';
import GiftBoxIcon from './icons/GiftBoxIcon';
import Colors from '@/constants/Colors';
import SeparatorIcon from './icons/SeparatorIcon';
import { useRouter } from 'expo-router';

const colors = Colors.light;

export default function WelcomeScreen() {
    const router = useRouter();

    const handleGetStarted = useCallback(() => {
        router.push('/onboarding' as any);
    }, [router]);

    const handleLearnMore = useCallback(() => {
        router.push('/learn-more' as any);
    }, [router]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <LogoIcon size={60} />
                    <View style={styles.headerTextContainer}>
                        <Text
                            style={[styles.brandName, { color: colors.primary }]}
                            accessible={true}
                            accessibilityRole="text"
                        >
                            Givio
                        </Text>
                        <Text
                            style={[styles.tagline, { color: colors.mutedForeground }]}
                            accessible={true}
                            accessibilityRole="text"
                        >
                            AI GIFT CONCIERGE
                        </Text>
                    </View>
                </View>

                <View style={[styles.featuresContainer, { backgroundColor: colors.featuresBackground }]}>
                    <View style={styles.featuresRow}>
                        <View style={styles.featureCard} accessible={true} accessibilityRole="text">
                            <GuideIcon size={64} />
                            <Text style={[styles.featureLabel, { color: colors.mutedForeground }]}>
                                YOUR GUIDE
                            </Text>
                        </View>

                        <View style={styles.sparkleContainer} accessible={false} importantForAccessibility="no-hide-descendants">
                            <SeparatorIcon color={colors.accent} dotColor={colors.separatorDots} />
                        </View>

                        <View style={styles.featureCard} accessible={true} accessibilityRole="text">
                            <GiftBoxIcon size={64} />
                            <Text style={[styles.featureLabel, { color: colors.mutedForeground }]}>
                                PERFECT GIFT
                            </Text>
                        </View>
                    </View>

                    <View style={styles.promptWrapper}>
                        <View style={[styles.promptTail, { borderBottomColor: colors.white }]} />
                        <View style={[styles.promptContainer, { backgroundColor: colors.white }]}>
                            <Text
                                style={[styles.promptText, { color: colors.foreground }]}
                                accessible={true}
                                accessibilityRole="text"
                            >
                                "Tell me who it's for, I'll handle the rest."
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.headlineContainer}>
                    <Text
                        style={[styles.headline, { color: colors.foreground }]}
                        accessible={true}
                        accessibilityRole="header"
                    >
                        Gift giving, solved.
                    </Text>
                    <Text
                        style={[styles.subheadline, { color: colors.mutedForeground }]}
                        accessible={true}
                        accessibilityRole="text"
                    >
                        Expert ideas tailored to your loved ones,{'\n'}found in seconds.
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.ctaButton,
                        { backgroundColor: colors.primary },
                        pressed && styles.ctaButtonPressed,
                    ]}
                    onPress={handleGetStarted}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Get started with Givio"
                    accessibilityHint="Navigates to the onboarding screen"
                >
                    <Text style={[styles.ctaButtonText, { color: colors.white }]}>Get Started</Text>
                </Pressable>

                <Pressable
                    onPress={handleLearnMore}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Learn more about how Givio works"
                    accessibilityHint="Opens information about Givio"
                >
                    {({ pressed }) => (
                        <Text
                            style={[
                                styles.footerLink,
                                { color: colors.mutedForeground },
                                pressed && styles.footerLinkPressed,
                            ]}
                        >
                            Learn more about how Givio works
                        </Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 60,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        gap: 16,
    },
    headerTextContainer: {
        alignItems: 'flex-start',
    },
    brandName: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        letterSpacing: -1,
        lineHeight: 32,
    },
    tagline: {
        fontSize: 11,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 2,
        marginTop: 4,
    },
    featuresContainer: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 24,
    },
    featureCard: {
        alignItems: 'center',
        gap: 12,
    },
    featureLabel: {
        fontSize: 11,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 1,
    },
    sparkleContainer: {
        marginTop: -20,
    },
    promptWrapper: {
        position: 'relative',
        alignItems: 'center',
        width: '100%',
    },
    promptTail: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        marginBottom: -1,
        zIndex: 1,
        alignSelf: 'flex-start',
        marginLeft: 40,
    },
    promptContainer: {
        width: '100%',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    promptText: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 24,
    },
    headlineContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    headline: {
        fontSize: 36,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -1,
    },
    subheadline: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 24,
    },
    ctaButton: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    ctaButtonPressed: {
        opacity: 0.8,
    },
    ctaButtonText: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 0.5,
    },
    footerLink: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
    },
    footerLinkPressed: {
        opacity: 0.7,
    },
});
