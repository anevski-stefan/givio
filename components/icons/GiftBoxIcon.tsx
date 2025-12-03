import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface GiftBoxIconProps {
    size?: number;
    color?: string;
    ribbonColor?: string;
    style?: ViewStyle;
}

export default function GiftBoxIcon({
    size = 80,
    color = Colors.light.accent,
    ribbonColor = Colors.light.robotGreen,
    style,
}: GiftBoxIconProps) {
    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <View style={[styles.box, { backgroundColor: color }]} />
            <View style={[styles.ribbonVertical, { backgroundColor: ribbonColor }]} />
            <View style={[styles.ribbonHorizontal, { backgroundColor: ribbonColor }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    box: {
        width: '60%',
        height: '60%',
        borderRadius: 8,
    },
    ribbonVertical: {
        position: 'absolute',
        width: '12%',
        height: '60%',
        borderRadius: 2,
    },
    ribbonHorizontal: {
        position: 'absolute',
        width: '60%',
        height: '12%',
        borderRadius: 2,
    },
});
