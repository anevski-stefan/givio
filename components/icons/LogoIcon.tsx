import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface LogoIconProps {
    size?: number;
    style?: ViewStyle;
    primaryColor?: string;
    accentColor?: string;
    boxColor?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
}

const DESIGN_RATIOS = {
    BOX_WIDTH: 0.5,
    BOX_HEIGHT: 0.45,
    LID_HEIGHT: 0.12,
    LID_WIDTH: 0.58,
    RIBBON_WIDTH: 0.12,
    CONTAINER_BORDER_RADIUS: 0.22,
    BOX_BORDER_RADIUS: 0.1,
    LID_BORDER_RADIUS: 0.06,
    MARGIN_TOP: 0.1,
    LID_OFFSET: -2,
} as const;

const SHADOW_STYLES = {
    LID_RIBBON: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    LID_OVERLAY: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
    },
} as const;

export default function LogoIcon({
    size = 80,
    style,
    primaryColor,
    accentColor,
    boxColor,
    accessible = true,
    accessibilityLabel = 'Givio logo',
}: LogoIconProps) {
    const finalPrimaryColor = primaryColor ?? Colors.light.primary;
    const finalAccentColor = accentColor ?? Colors.light.accent;
    const finalBoxColor = boxColor ?? Colors.light.white;

    const dimensions = useMemo(() => {
        const boxWidth = size * DESIGN_RATIOS.BOX_WIDTH;
        const boxHeight = size * DESIGN_RATIOS.BOX_HEIGHT;
        const lidHeight = size * DESIGN_RATIOS.LID_HEIGHT;
        const lidWidth = size * DESIGN_RATIOS.LID_WIDTH;
        const ribbonWidth = size * DESIGN_RATIOS.RIBBON_WIDTH;
        const containerBorderRadius = size * DESIGN_RATIOS.CONTAINER_BORDER_RADIUS;
        const boxBorderRadius = size * DESIGN_RATIOS.BOX_BORDER_RADIUS;
        const lidBorderRadius = size * DESIGN_RATIOS.LID_BORDER_RADIUS;
        const marginTop = size * DESIGN_RATIOS.MARGIN_TOP;

        return {
            boxWidth,
            boxHeight,
            lidHeight,
            lidWidth,
            ribbonWidth,
            containerBorderRadius,
            boxBorderRadius,
            lidBorderRadius,
            marginTop,
            ribbonVerticalLeft: (boxWidth - ribbonWidth) / 2,
            ribbonHorizontalTop: (boxHeight - ribbonWidth) / 2,
            boxMarginTop: lidHeight + DESIGN_RATIOS.LID_OFFSET,
        };
    }, [size]);

    const dynamicStyles = useMemo(
        () => ({
            container: {
                width: size,
                height: size,
                backgroundColor: finalPrimaryColor,
                borderRadius: dimensions.containerBorderRadius,
            },
            boxContainer: {
                marginTop: dimensions.marginTop,
            },
            box: {
                width: dimensions.boxWidth,
                height: dimensions.boxHeight,
                backgroundColor: finalBoxColor,
                borderBottomLeftRadius: dimensions.boxBorderRadius,
                borderBottomRightRadius: dimensions.boxBorderRadius,
                marginTop: dimensions.boxMarginTop,
            },
            ribbonVertical: {
                left: dimensions.ribbonVerticalLeft,
                width: dimensions.ribbonWidth,
                backgroundColor: finalAccentColor,
            },
            ribbonHorizontal: {
                top: dimensions.ribbonHorizontalTop,
                width: dimensions.boxWidth,
                height: dimensions.ribbonWidth,
                backgroundColor: finalAccentColor,
            },
            lid: {
                width: dimensions.lidWidth,
                height: dimensions.lidHeight,
                backgroundColor: finalBoxColor,
                borderRadius: dimensions.lidBorderRadius,
            },
            lidRibbon: {
                width: dimensions.ribbonWidth,
                backgroundColor: finalAccentColor,
            },
        }),
        [size, dimensions, finalPrimaryColor, finalAccentColor, finalBoxColor]
    );

    return (
        <View
            style={[styles.container, dynamicStyles.container, style]}
            accessible={accessible}
            accessibilityRole="image"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint="Givio application logo"
        >
            <View style={[styles.boxContainer, dynamicStyles.boxContainer]}>
                <View style={[styles.box, dynamicStyles.box]}>
                    <View style={[styles.ribbonVertical, dynamicStyles.ribbonVertical]} />
                    <View style={[styles.ribbonHorizontal, dynamicStyles.ribbonHorizontal]} />
                </View>

                <View style={[styles.lid, dynamicStyles.lid, SHADOW_STYLES.LID_RIBBON]}>
                    <View style={[styles.lidRibbon, dynamicStyles.lidRibbon]} />
                </View>

                <View style={[styles.lid, dynamicStyles.lid, SHADOW_STYLES.LID_OVERLAY]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    box: {
        overflow: 'hidden',
    },
    ribbonVertical: {
        position: 'absolute',
        height: '100%',
    },
    ribbonHorizontal: {
        position: 'absolute',
    },
    lid: {
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lidRibbon: {
        height: '100%',
    },
});
