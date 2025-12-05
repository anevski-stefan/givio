import React, { useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import QuizIcon from '@/components/icons/QuizIcons';
import { QuizOption } from '@/types/quiz';

interface QuizOptionCardProps {
    option: QuizOption;
    isSelected: boolean;
    onSelect: (optionId: string) => void;
    index: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function QuizOptionCard({
    option,
    isSelected,
    onSelect,
    index,
}: QuizOptionCardProps) {
    const scale = useSharedValue(1);

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, [scale]);

    const handlePress = useCallback(() => {
        onSelect(option.id);
    }, [onSelect, option.id]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const cardStyle = useMemo(
        () => [
            styles.card,
            isSelected && styles.cardSelected,
            animatedStyle,
        ],
        [isSelected, animatedStyle]
    );

    const iconContainerStyle = useMemo(
        () => [
            styles.iconContainer,
            isSelected && styles.iconContainerSelected,
        ],
        [isSelected]
    );

    return (
        <AnimatedTouchableOpacity
            style={cardStyle}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.title}. ${option.subtitle}`}
            accessibilityHint="Double tap to select this option"
        >
            <View style={iconContainerStyle}>
                <QuizIcon
                    type={option.icon}
                    size={24}
                    color={isSelected ? Colors.light.primary : Colors.light.mutedForeground}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, isSelected && styles.titleSelected]}>
                    {option.title}
                </Text>
                <Text style={styles.subtitle}>{option.subtitle}</Text>
            </View>
        </AnimatedTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    cardSelected: {
        borderColor: Colors.light.primary,
        backgroundColor: Colors.light.primary + '08',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.light.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconContainerSelected: {
        backgroundColor: Colors.light.primary + '15',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.foreground,
        marginBottom: 4,
        fontFamily: 'Inter_600SemiBold',
    },
    titleSelected: {
        color: Colors.light.primary,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.light.mutedForeground,
        fontFamily: 'Inter_400Regular',
        letterSpacing: 0.1,
    },
});
