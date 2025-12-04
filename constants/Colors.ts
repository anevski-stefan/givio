export interface ColorPalette {
  background: string;
  foreground: string;
  border: string;
  input: string;
  white: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  success: string;
  successForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  warning: string;
  warningForeground: string;
  card: string;
  cardForeground: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  featuresBackground: string;
  separatorDots: string;
  robotGreen: string;
  robotBody: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

const Colors = {
  background: '#fdfcf8',
  foreground: '#2d3630',
  border: '#e5e7eb',
  input: '#ffffff',
  primary: '#5c7c66',
  primaryForeground: '#ffffff',
  secondary: '#f2f4f1',
  secondaryForeground: '#7a847e',
  muted: '#f0ece9',
  mutedForeground: '#7a847e',
  success: '#bfe3c9',
  successForeground: '#274532',
  accent: '#d4b886',
  accentForeground: '#2d2a24',
  destructive: '#dc2626',
  destructiveForeground: '#ffffff',
  warning: '#f7ead9',
  warningForeground: '#6b4b2e',
  card: 'transparent',
  cardForeground: '#2a332f',
  sidebar: '#f3f1ee',
  sidebarForeground: '#46544d',
  sidebarPrimary: '#e6f0e8',
  sidebarPrimaryForeground: '#2e4b3f',
  featuresBackground: '#e8e9e6',
  separatorDots: '#d1d5db',
  white: '#ffffff',
  robotGreen: '#6b8e7f',
  robotBody: '#8ba89e',
  tint: '#5c7c66',
  tabIconDefault: '#7a847e',
  tabIconSelected: '#5c7c66',
} as const satisfies ColorPalette;

export default {
  light: Colors,
};
