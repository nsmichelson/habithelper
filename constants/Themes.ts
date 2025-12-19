/**
 * Theme colors used throughout the app for daily tip cards and related components.
 */

export const THEMES = {
  green: {
    primary: '#2E7D32',
    primaryLight: '#4CAF50',
    primaryLighter: '#81C784',
    primaryLightest: '#E8F5E9',
  },
  orange: {
    primary: '#D84315',
    primaryLight: '#FF6B35',
    primaryLighter: '#FF8A65',
    primaryLightest: '#FFF3E0',
  },
  gold: {
    primary: '#F57C00',
    primaryLight: '#FFB300',
    primaryLighter: '#FFD54F',
    primaryLightest: '#FFF8E1',
  },
  pink: {
    primary: '#C2185B',
    primaryLight: '#EC407A',
    primaryLighter: '#F48FB1',
    primaryLightest: '#FCE4EC',
  },
  indigo: {
    primary: '#3949AB',
    primaryLight: '#5C6BC0',
    primaryLighter: '#7986CB',
    primaryLightest: '#E8EAF6',
  },
  turquoise: {
    primary: '#00838F',
    primaryLight: '#26C6DA',
    primaryLighter: '#4DD0E1',
    primaryLightest: '#E0F7FA',
  },
  violet: {
    primary: '#8E24AA',
    primaryLight: '#BA68C8',
    primaryLighter: '#CE93D8',
    primaryLightest: '#F3E5F5',
  },
};

export const THEME_KEYS = Object.keys(THEMES) as (keyof typeof THEMES)[];

export const NEUTRALS = {
  gray900: '#1A1A1A',
  gray700: '#4A4A4A',
  gray500: '#767676',
  gray300: '#B8B8B8',
  gray100: '#F5F5F5',
  white: '#FFFFFF',
};

export type ThemeKey = keyof typeof THEMES;
export type Theme = typeof THEMES[ThemeKey] & typeof NEUTRALS;

export function getTheme(themeKey: ThemeKey): Theme {
  return {
    ...THEMES[themeKey],
    ...NEUTRALS,
  };
}

export function getRandomThemeKey(): ThemeKey {
  return THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)];
}
