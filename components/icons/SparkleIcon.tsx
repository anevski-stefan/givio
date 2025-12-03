import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface SparkleIconProps {
    size?: number;
    color?: string;
    style?: ViewStyle;
    accessible?: boolean;
    accessibilityLabel?: string;
}

const DESIGN_RATIOS = {
    POINT_WIDTH: 0.2,
    POINT_HEIGHT: 0.2,
    CENTER_SIZE: 0.3,
    BORDER_RADIUS: 2,
    CENTER_BORDER_RADIUS: 100,
} as const;

export default function SparkleIcon({
    size = 24,
    color,
    style,
    accessible = false,
    accessibilityLabel,
}: SparkleIconProps) {
    const finalColor = useMemo(() => color ?? Colors.light.accent, [color]);

    const dimensions = useMemo(() => {
        const pointVerticalWidth = size * DESIGN_RATIOS.POINT_WIDTH;
        const pointVerticalHeight = size;
        const pointHorizontalWidth = size;
        const pointHorizontalHeight = size * DESIGN_RATIOS.POINT_HEIGHT;
        const centerSize = size * DESIGN_RATIOS.CENTER_SIZE;

        return {
            pointVerticalWidth,
            pointVerticalHeight,
            pointHorizontalWidth,
            pointHorizontalHeight,
            centerSize,
        };
    }, [size]);

    const dynamicStyles = useMemo(
        () => ({
            container: {
                width: size,
                height: size,
            },
            pointVertical: {
                width: dimensions.pointVerticalWidth,
                height: dimensions.pointVerticalHeight,
                backgroundColor: finalColor,
            },
            pointHorizontal: {
                width: dimensions.pointHorizontalWidth,
                height: dimensions.pointHorizontalHeight,
                backgroundColor: finalColor,
            },
            center: {
                width: dimensions.centerSize,
                height: dimensions.centerSize,
                backgroundColor: finalColor,
            },
        }),
        [size, dimensions, finalColor]
    );

    return (
        <View
            style={[styles.container, dynamicStyles.container, style]}
            accessible={accessible}
            accessibilityRole={accessible ? 'image' : 'none'}
            accessibilityLabel={accessibilityLabel}
            importantForAccessibility={accessible ? 'yes' : 'no'}
        >
            <View
                style={[styles.pointVertical, dynamicStyles.pointVertical]}
                accessible={false}
                importantForAccessibility="no"
            />
            <View
                style={[styles.pointHorizontal, dynamicStyles.pointHorizontal]}
                accessible={false}
                importantForAccessibility="no"
            />
            <View
                style={[styles.center, dynamicStyles.center]}
                accessible={false}
                importantForAccessibility="no"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pointVertical: {
        position: 'absolute',
        borderRadius: DESIGN_RATIOS.BORDER_RADIUS,
    },
    pointHorizontal: {
        position: 'absolute',
        borderRadius: DESIGN_RATIOS.BORDER_RADIUS,
    },
    center: {
        borderRadius: DESIGN_RATIOS.CENTER_BORDER_RADIUS,
    },
});
