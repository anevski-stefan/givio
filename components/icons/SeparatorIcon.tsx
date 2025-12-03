import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Colors from '@/constants/Colors';

interface SeparatorIconProps {
    color?: string;
    dotColor?: string;
    style?: ViewStyle;
    accessible?: boolean;
    accessibilityLabel?: string;
    dotCount?: number;
    svgSize?: number;
}

const SVG_DIMENSIONS = {
    WIDTH: 30,
    HEIGHT: 30,
    VIEWBOX: '0 0 24 24',
} as const;

const STROKE_WIDTH = 2;
const DOT_SIZE = 6;
const DOT_BORDER_RADIUS = 3;
const DOT_GAP = 5;
const CONTAINER_GAP = 10;
const DEFAULT_DOT_COUNT = 3;

export default function SeparatorIcon({
    color,
    dotColor,
    style,
    accessible = false,
    accessibilityLabel,
    dotCount = DEFAULT_DOT_COUNT,
    svgSize = SVG_DIMENSIONS.WIDTH,
}: SeparatorIconProps) {
    const sparkleColor = useMemo(() => color ?? Colors.light.accent, [color]);
    const dotsColor = useMemo(() => dotColor ?? Colors.light.separatorDots, [dotColor]);

    const dots = useMemo(
        () =>
            Array.from({ length: dotCount }, (_, index) => (
                <View
                    key={index}
                    style={[styles.dot, { backgroundColor: dotsColor }]}
                    accessible={false}
                    importantForAccessibility="no"
                />
            )),
        [dotCount, dotsColor]
    );

    return (
        <View
            style={[styles.container, style]}
            accessible={accessible}
            accessibilityRole={accessible ? 'image' : 'none'}
            accessibilityLabel={accessibilityLabel}
            importantForAccessibility={accessible ? 'yes' : 'no'}
        >
            <View style={styles.dotsContainer} accessible={false} importantForAccessibility="no">
                {dots}
            </View>

            <View style={styles.sparkleContainer} accessible={false} importantForAccessibility="no">
                <Svg
                    width={svgSize}
                    height={svgSize}
                    viewBox={SVG_DIMENSIONS.VIEWBOX}
                    fill="none"
                    accessible={false}
                >
                    <Path
                        d="M12 2C12 2 13.5 10.5 22 12C13.5 13.5 12 22 12 22C12 22 10.5 13.5 2 12C10.5 10.5 12 2 12 2Z"
                        stroke={sparkleColor}
                        strokeWidth={STROKE_WIDTH}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <Path
                        d="M19 4V8M17 6H21"
                        stroke={sparkleColor}
                        strokeWidth={STROKE_WIDTH}
                        strokeLinecap="round"
                    />
                    <Circle
                        cx="5"
                        cy="19"
                        r="1.5"
                        fill="none"
                        stroke={sparkleColor}
                        strokeWidth={STROKE_WIDTH}
                    />
                </Svg>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: CONTAINER_GAP,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: DOT_GAP,
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_BORDER_RADIUS,
    },
    sparkleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
