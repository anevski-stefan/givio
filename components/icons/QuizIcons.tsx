import React from 'react';
import Svg, { Path, Circle, G, Rect } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { QuizIconType } from '@/types/quiz';

interface QuizIconProps {
    type: QuizIconType;
    size?: number;
    color?: string;
}

const iconColor = Colors.light.primary;

export function OutdoorsyIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 2L2 22h20L12 2z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <Path
                d="M12 10L8 22h8l-4-12z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.2}
            />
            <Circle cx="18" cy="5" r="2" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
    );
}

export function CozyIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.1}
            />
            <Path
                d="M9 22V12h6v10"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function BothIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 3l1.5 4.5h4.5l-3.5 2.5 1.5 4.5-4-3-4 3 1.5-4.5L6 7.5h4.5L12 3z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.2}
            />
            <Circle cx="12" cy="18" r="3" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
    );
}

export function PracticalIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M9 9l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M9 15h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

export function SentimentalIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.2}
            />
        </Svg>
    );
}

export function ExperienceIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="12" r="2" fill={color} fillOpacity={0.3} />
        </Svg>
    );
}

export function LuxuryIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 2L4 7l8 5 8-5-8-5z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.2}
            />
            <Path
                d="M4 12l8 5 8-5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4 17l8 5 8-5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function BudgetIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
            <Path
                d="M12 6v12M9 9c0-1.5 1.5-2 3-2s3 .5 3 2-1 2-3 2-3 .5-3 2 1.5 2 3 2 3-.5 3-2"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function SurpriseIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.1} />
            <Path d="M12 8V3M12 3L9 6M12 3l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3 12h18" stroke={color} strokeWidth={2} />
            <Path d="M12 8v13" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

export function WishlistIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.15}
            />
        </Svg>
    );
}

export function TechIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="2" y="3" width="20" height="14" rx="2" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M8 21h8M12 17v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function WellnessIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.1}
            />
            <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
    );
}

export function FoodIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M18 8h1a4 4 0 010 8h-1"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.1}
            />
            <Path d="M6 1v3M10 1v3M14 1v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

export function FashionIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M6.5 6.5L12 2l5.5 4.5L20 20H4l2.5-13.5z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.1}
            />
            <Path d="M9 6l3 3 3-3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function HandmadeIcon({ size = 24, color = iconColor }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 19l-7-7 1.41-1.41L12 16.17l5.59-5.59L19 12l-7 7z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.15}
            />
            <Path
                d="M7 7a5 5 0 0110 0c0 2-2 3-5 6-3-3-5-4-5-6z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={color}
                fillOpacity={0.1}
            />
        </Svg>
    );
}

export default function QuizIcon({ type, size = 24, color = iconColor }: QuizIconProps) {
    const iconMap: Record<QuizIconType, React.ReactElement> = {
        outdoorsy: <OutdoorsyIcon size={size} color={color} />,
        cozy: <CozyIcon size={size} color={color} />,
        both: <BothIcon size={size} color={color} />,
        practical: <PracticalIcon size={size} color={color} />,
        sentimental: <SentimentalIcon size={size} color={color} />,
        experience: <ExperienceIcon size={size} color={color} />,
        luxury: <LuxuryIcon size={size} color={color} />,
        budget: <BudgetIcon size={size} color={color} />,
        surprise: <SurpriseIcon size={size} color={color} />,
        wishlist: <WishlistIcon size={size} color={color} />,
        tech: <TechIcon size={size} color={color} />,
        wellness: <WellnessIcon size={size} color={color} />,
        food: <FoodIcon size={size} color={color} />,
        fashion: <FashionIcon size={size} color={color} />,
        handmade: <HandmadeIcon size={size} color={color} />,
    };

    return iconMap[type] || <BothIcon size={size} color={color} />;
}
