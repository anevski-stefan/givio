import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface StepBadgeProps {
    currentStep: number;
    totalSteps: number;
}

export default function StepBadge({ currentStep, totalSteps }: StepBadgeProps) {
    return (
        <View style={styles.badge}>
            <Text style={styles.text}>
                Step {currentStep} of {totalSteps}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.light.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.mutedForeground,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 0.2,
    },
});
