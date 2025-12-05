import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';

interface ProgressBarProps {
    progress: number; // 0-100
    showPercentage?: boolean;
    height?: number;
    animated?: boolean;
}

export default function ProgressBar({
    progress,
    showPercentage = true,
    height = 8,
    animated = true,
}: ProgressBarProps) {
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            animatedProgress.value = withTiming(progress, {
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
        } else {
            animatedProgress.value = progress;
        }
    }, [progress, animated, animatedProgress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${animatedProgress.value}%`,
    }));

    return (
        <View style={styles.container}>
            <View style={[styles.track, { height }]}>
                <Animated.View style={[styles.fill, { height }, animatedStyle]} />
            </View>
            {showPercentage && (
                <Text style={styles.percentageText}>{Math.round(progress)}% complete</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    track: {
        backgroundColor: Colors.light.secondary,
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        backgroundColor: Colors.light.primary,
        borderRadius: 4,
    },
    percentageText: {
        fontSize: 12,
        color: Colors.light.mutedForeground,
        marginTop: 8,
        fontFamily: 'Inter_400Regular',
    },
});
