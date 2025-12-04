import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    useWindowDimensions,
    Image,
    TouchableOpacity,
    ViewToken,
    Platform,
    ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    image: any;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Never stress about gifts again',
        description: 'Let Givio handle the hard part—so you can enjoy thoughtful, perfectly timed gifts without the last-minute rush.',
        image: require('@/assets/images/onboarding-step1.png'),
    },
    {
        id: '2',
        title: 'Smart recommendations, zero guesswork',
        description: 'Tell us who you\'re shopping for, and we\'ll find unique gifts that match their style and interests perfectly.',
        image: require('@/assets/images/onboarding-step2.png'),
    },
    {
        id: '3',
        title: 'Make every occasion special',
        description: 'From birthdays to anniversaries, Givio helps you celebrate the people you care about most.',
        image: require('@/assets/images/onboarding-step3.png'),
    },
];

const VIEWABILITY_CONFIG = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
};

export default function OnboardingScreen() {
    const router = useRouter();
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const viewabilityConfigCallbackPairs = useRef([
        {
            viewabilityConfig: VIEWABILITY_CONFIG,
            onViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken[] }) => {
                if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                    const newIndex = viewableItems[0].index;
                    setCurrentIndex(newIndex);
                }
            },
        },
    ]);

    const IMAGE_WIDTH = useMemo(() => SCREEN_WIDTH * 0.85, [SCREEN_WIDTH]);
    const IMAGE_HEIGHT = useMemo(() => IMAGE_WIDTH * 0.6, [IMAGE_WIDTH]);
    const SLIDE_WIDTH = SCREEN_WIDTH;

    const handleSkip = useCallback(() => {
        router.replace('/login' as any);
    }, [router]);

    const handleGetStarted = useCallback(() => {
        router.replace('/login' as any);
    }, [router]);

    const handleNext = useCallback(() => {
        if (currentIndex < slides.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        } else {
            handleGetStarted();
        }
    }, [currentIndex, handleGetStarted]);

    const handleScrollToIndexFailed = useCallback((info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        });
    }, []);

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: SLIDE_WIDTH,
            offset: SLIDE_WIDTH * index,
            index,
        }),
        [SLIDE_WIDTH]
    );

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<OnboardingSlide>) => (
            <View style={[styles.slideContainer, { width: SLIDE_WIDTH }]}>
                <View style={[styles.imageContainer, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }]}>
                    <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="cover"
                        accessible={true}
                        accessibilityLabel={`${item.title} illustration`}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        ),
        [SLIDE_WIDTH, IMAGE_WIDTH, IMAGE_HEIGHT]
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Skip onboarding"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                bounces={false}
                decelerationRate="fast"
                style={styles.flatList}
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={handleScrollToIndexFailed}
                removeClippedSubviews={true}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={3}
            />

            <View style={styles.paginationContainer}>
                {slides.map((slide, index) => (
                    <PaginationDot
                        key={slide.id}
                        index={index}
                        currentIndex={currentIndex}
                    />
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    onPress={handleNext}
                    variant="primary"
                    iconRight={
                        currentIndex === slides.length - 1 ? (
                            <Ionicons name="arrow-forward" size={20} color={Colors.light.primaryForeground} />
                        ) : null
                    }
                    accessibilityLabel={
                        currentIndex === slides.length - 1
                            ? 'Get started with Givio'
                            : 'Next slide'
                    }
                />
            </View>
        </SafeAreaView>
    );
}

interface PaginationDotProps {
    index: number;
    currentIndex: number;
}

function PaginationDot({ index, currentIndex }: PaginationDotProps) {
    const isActive = index === currentIndex;
    const animatedIndex = useSharedValue(currentIndex);

    React.useEffect(() => {
        animatedIndex.value = withTiming(currentIndex, { duration: 300 });
    }, [currentIndex, animatedIndex]);

    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [index - 1, index, index + 1];
        const scale = interpolate(
            animatedIndex.value,
            inputRange,
            [0.8, 1, 0.8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            animatedIndex.value,
            inputRange,
            [0.4, 1, 0.4],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    return (
        <Animated.View
            style={[
                styles.dot,
                isActive && styles.activeDot,
                animatedStyle,
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Slide ${index + 1} of ${slides.length}`}
            accessibilityState={{ selected: isActive }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    skipButton: {
        position: 'absolute',
        top: 16,
        right: 20,
        zIndex: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    skipText: {
        fontSize: 16,
        color: Colors.light.foreground,
        fontWeight: '500',
    },
    flatList: {
        flex: 1,
    },
    slideContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: '30%',
    },
    imageContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: Colors.light.muted,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginTop: 48,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.foreground,
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
        lineHeight: 34,
    },
    description: {
        fontSize: 16,
        color: Colors.light.mutedForeground,
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.2,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 32,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.separatorDots,
    },
    activeDot: {
        backgroundColor: Colors.light.primary,
        width: 24,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
});
