import React, { useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedProps,
    withSpring,
    withTiming,
    withDelay,
    cancelAnimation,
    SharedValue,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';

const ICON_COLORS = {
    warmBeigeLight: '#fdfcf9',
    warmBeigeMedium: '#f2f1ed',
    warmBeigeDark: '#e8e4db',
    warmBeigeDarker: '#dfd9cf',
    greyBeigeLight: '#e8e9e4',
    greyBeigeMedium: '#d0d6c8',
    darkGreen: Colors.light.primary,
    goldenBrown: '#d4a967',
    lightGreen: '#9aa896',
    shadowBlack: '#000000',
    white: '#ffffff',
} as const;

const ICON_SIZE = 280;
const MAIN_CIRCLE_RATIO = 0.35;
const SHADOW_OFFSET = 4;
const SHADOW_RADIUS_OFFSET = 3;

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SuccessIconProps {
    size?: number;
    scale?: SharedValue<number>;
    checkmarkProgress?: SharedValue<number>;
}

function SuccessIcon({ size = ICON_SIZE, scale, checkmarkProgress }: SuccessIconProps) {
    const dimensions = useMemo(() => {
        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = size / 2;
        const mainCircleRadius = size * MAIN_CIRCLE_RATIO;

        return {
            centerX,
            centerY,
            outerRadius,
            mainCircleRadius,
            shadowY: centerY + SHADOW_OFFSET,
            shadowRadius: mainCircleRadius + SHADOW_RADIUS_OFFSET,
        };
    }, [size]);

    const checkmarkPath = useMemo(() => {
        const { centerX, centerY, mainCircleRadius } = dimensions;
        return `M ${centerX - mainCircleRadius * 0.3} ${centerY} 
                L ${centerX - mainCircleRadius * 0.08} ${centerY + mainCircleRadius * 0.22} 
                L ${centerX + mainCircleRadius * 0.32} ${centerY - mainCircleRadius * 0.18}`;
    }, [dimensions]);

    const pathLength = useMemo(() => {
        const { mainCircleRadius } = dimensions;
        const segment1 = Math.sqrt(
            Math.pow(mainCircleRadius * 0.22, 2) + Math.pow(mainCircleRadius * 0.22, 2)
        );
        const segment2 = Math.sqrt(
            Math.pow(mainCircleRadius * 0.4, 2) + Math.pow(mainCircleRadius * 0.4, 2)
        );
        return segment1 + segment2;
    }, [dimensions]);

    const animatedCheckmarkProps = useAnimatedProps(() => {
        if (!checkmarkProgress) {
            return {
                strokeDasharray: `${pathLength}`,
                strokeDashoffset: pathLength,
            };
        }
        const progress = checkmarkProgress.value;
        const dashoffset = pathLength * (1 - progress);
        return {
            strokeDasharray: `${pathLength}`,
            strokeDashoffset: dashoffset,
        };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        if (!scale) {
            return {};
        }
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const { centerX, centerY, outerRadius, mainCircleRadius } = dimensions;

    return (
        <Animated.View style={animatedIconStyle}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={outerRadius * 0.92}
                    fill="#d8ddd0"
                />

                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={mainCircleRadius}
                    fill={ICON_COLORS.darkGreen}
                />

                <AnimatedPath
                    d={checkmarkPath}
                    stroke={ICON_COLORS.white}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    animatedProps={animatedCheckmarkProps}
                />
            </Svg>
        </Animated.View>
    );
}

const DEFAULT_TITLE = 'All set';
const DEFAULT_DESCRIPTION = 'Your updates are saved. Givio will use this to fine-tune your gift ideas.';

export default function SuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        title?: string;
        description?: string;
        buttonText?: string;
        redirectTo?: string;
    }>();

    const title = params.title || DEFAULT_TITLE;
    const description = params.description || DEFAULT_DESCRIPTION;
    const buttonText = params.buttonText || 'Continue';
    const redirectTo = params.redirectTo || '/(tabs)';

    const iconScale = useSharedValue(0.8);
    const checkmarkProgress = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(20);
    const descriptionOpacity = useSharedValue(0);
    const descriptionTranslateY = useSharedValue(20);
    const buttonOpacity = useSharedValue(0);
    const buttonTranslateY = useSharedValue(20);

    useEffect(() => {
        iconScale.value = withSpring(1, {
            damping: 15,
            stiffness: 150,
        });

        checkmarkProgress.value = withDelay(
            300,
            withTiming(1, {
                duration: 400,
            })
        );

        titleOpacity.value = withDelay(
            500,
            withTiming(1, {
                duration: 400,
            })
        );
        titleTranslateY.value = withDelay(
            500,
            withSpring(0, {
                damping: 15,
                stiffness: 150,
            })
        );

        descriptionOpacity.value = withDelay(
            700,
            withTiming(1, {
                duration: 400,
            })
        );
        descriptionTranslateY.value = withDelay(
            700,
            withSpring(0, {
                damping: 15,
                stiffness: 150,
            })
        );

        buttonOpacity.value = withDelay(
            900,
            withTiming(1, {
                duration: 400,
            })
        );
        buttonTranslateY.value = withDelay(
            900,
            withSpring(0, {
                damping: 15,
                stiffness: 150,
            })
        );

        return () => {
            cancelAnimation(iconScale);
            cancelAnimation(checkmarkProgress);
            cancelAnimation(titleOpacity);
            cancelAnimation(titleTranslateY);
            cancelAnimation(descriptionOpacity);
            cancelAnimation(descriptionTranslateY);
            cancelAnimation(buttonOpacity);
            cancelAnimation(buttonTranslateY);
        };
    }, []);

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }],
    }));

    const animatedDescriptionStyle = useAnimatedStyle(() => ({
        opacity: descriptionOpacity.value,
        transform: [{ translateY: descriptionTranslateY.value }],
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
        transform: [{ translateY: buttonTranslateY.value }],
    }));

    const handleContinue = useCallback(() => {
        router.replace(redirectTo as Parameters<typeof router.replace>[0]);
    }, [router, redirectTo]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.illustrationContainer}>
                        <SuccessIcon
                            size={280}
                            scale={iconScale}
                            checkmarkProgress={checkmarkProgress}
                        />
                    </View>
                    <Animated.Text style={[styles.title, animatedTitleStyle]}>
                        {title}
                    </Animated.Text>
                    <Animated.Text style={[styles.description, animatedDescriptionStyle]}>
                        {description}
                    </Animated.Text>
                </View>
                <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
                    <Button
                        title={buttonText}
                        onPress={handleContinue}
                        variant="primary"
                        style={styles.continueButton}
                        textStyle={styles.continueButtonText}
                        accessibilityLabel={buttonText}
                    />
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    illustrationContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        color: Colors.light.foreground,
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        color: Colors.light.mutedForeground,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Inter_400Regular',
        paddingHorizontal: 16,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 16,
    },
    continueButton: {
        width: '100%',
        backgroundColor: Colors.light.primary,
    },
    continueButtonText: {
        color: Colors.light.white,
        fontWeight: '600',
    },
});
