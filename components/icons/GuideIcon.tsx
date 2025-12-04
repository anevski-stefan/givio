import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface GuideIconProps {
    size?: number;
    headColor?: string;
    eyeColor?: string;
    bodyColor?: string;
    detailColor?: string;
    enableBlinking?: boolean;
    blinkInterval?: number;
    style?: ViewStyle;
}

export default function GuideIcon({
    size = 80,
    headColor = Colors.light.robotGreen,
    eyeColor = Colors.light.white,
    bodyColor = Colors.light.robotBody,
    detailColor = Colors.light.robotGreen,
    enableBlinking = true,
    blinkInterval = 3000,
    style,
}: GuideIconProps) {
    const blinkAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!enableBlinking) return;

        const blink = () => {
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0.1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        const interval = setInterval(blink, blinkInterval);
        return () => clearInterval(interval);
    }, [blinkAnim, enableBlinking, blinkInterval]);

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <View style={[styles.head, { backgroundColor: headColor }]}>
                <View style={styles.eyesContainer}>
                    <Animated.View
                        style={[
                            styles.eye,
                            { backgroundColor: eyeColor, transform: [{ scaleY: blinkAnim }] }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.eye,
                            { backgroundColor: eyeColor, transform: [{ scaleY: blinkAnim }] }
                        ]}
                    />
                </View>
                <View style={[styles.antenna, { backgroundColor: headColor }]} />
            </View>
            <View style={[styles.body, { backgroundColor: bodyColor }]}>
                <View style={[styles.bodyDetail, { backgroundColor: detailColor }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    head: {
        width: '60%',
        height: '45%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    antenna: {
        position: 'absolute',
        top: -8,
        width: 3,
        height: 10,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    eyesContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    eye: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    body: {
        width: '50%',
        height: '40%',
        borderRadius: 8,
        marginTop: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyDetail: {
        width: '60%',
        height: 3,
        borderRadius: 2,
    },
});
