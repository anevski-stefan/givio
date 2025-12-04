import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import LogoIcon from './icons/LogoIcon';
import GuideIcon from './icons/GuideIcon';
import GiftBoxIcon from './icons/GiftBoxIcon';
import Colors from '@/constants/Colors';
import SeparatorIcon from './icons/SeparatorIcon';

// Using light theme only
const colors = Colors.light;

export default function WelcomeScreen() {
    const handleGetStarted = () => {
        console.log('Get Started pressed');
        // Navigation disabled for now
        // router.push('/(tabs)');
    };

    const handleLearnMore = () => {
        console.log('Learn more pressed');
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
        >
            <View style={styles.header}>
                <LogoIcon size={60} />
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.brandName, { color: colors.primary }]}>Givio</Text>
                    <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
                        AI GIFT CONCIERGE
                    </Text>
                </View>
            </View>

            <View style={[styles.featuresContainer, { backgroundColor: colors.featuresBackground }]}>
                <View style={styles.featuresRow}>
                    <View style={styles.featureCard}>
                        <GuideIcon size={64} />
                        <Text style={[styles.featureLabel, { color: colors.mutedForeground }]}>
                            YOUR GUIDE
                        </Text>
                    </View>

                    <View style={styles.sparkleContainer}>
                        <SeparatorIcon color={colors.accent} dotColor={colors.separatorDots} />
                    </View>

                    <View style={styles.featureCard}>
                        <GiftBoxIcon size={64} />
                        <Text style={[styles.featureLabel, { color: colors.mutedForeground }]}>
                            PERFECT GIFT
                        </Text>
                    </View>
                </View>

                <View style={styles.promptWrapper}>
                    <View style={[styles.promptTail, { borderBottomColor: colors.white }]} />
                    <View style={[styles.promptContainer, { backgroundColor: colors.white }]}>
                        <Text style={[styles.promptText, { color: colors.foreground }]}>
                            "Tell me who it's for, I'll handle the rest."
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.headlineContainer}>
                <Text style={[styles.headline, { color: colors.foreground }]}>
                    Gift giving, solved.
                </Text>
                <Text style={[styles.subheadline, { color: colors.mutedForeground }]}>
                    Expert ideas tailored to your loved ones,{'\n'}found in seconds.
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: colors.primary }]}
                onPress={handleGetStarted}
                activeOpacity={0.8}
            >
                <Text style={[styles.ctaButtonText, { color: colors.white }]}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLearnMore} activeOpacity={0.7}>
                <Text style={[styles.footerLink, { color: colors.mutedForeground }]}>
                    Learn more about how Givio works
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 60,
        alignItems: 'center',
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
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
});
