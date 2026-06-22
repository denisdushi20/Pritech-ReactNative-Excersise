/**
 * App color tokens for light and dark mode.
 */

import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    background: '#F4F6FB',
    backgroundElement: '#EEF2FF',
    backgroundSelected: '#E2E8F0',
    card: '#FFFFFF',
    border: '#E2E8F0',
    primary: '#6366F1',
    primaryText: '#FFFFFF',
    success: '#10B981',
    successSurface: '#ECFDF5',
    warning: '#F59E0B',
    warningSurface: '#FFFBEB',
    danger: '#EF4444',
    dangerSurface: '#FEF2F2',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
    card: '#1E293B',
    border: '#334155',
    primary: '#818CF8',
    primaryText: '#FFFFFF',
    success: '#34D399',
    successSurface: '#064E3B',
    warning: '#FBBF24',
    warningSurface: '#78350F',
    danger: '#F87171',
    dangerSurface: '#7F1D1D',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ThemeMode = keyof typeof Colors;
export type Theme = (typeof Colors)[ThemeMode];

export const CardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 2,
  },
  default: {},
}) ?? {};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
