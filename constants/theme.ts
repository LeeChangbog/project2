/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// 사주 팔자에 어울리는 전통적인 색상
const tintColorLight = '#C9A961'; // 골드
const tintColorDark = '#D4AF37'; // 더 밝은 골드

export const Colors = {
  light: {
    text: '#5C4033', // 갈색 텍스트
    background: '#FAF5F0', // 크림 베이지 배경
    tint: tintColorLight,
    icon: '#8B6F47',
    tabIconDefault: '#B8A082',
    tabIconSelected: tintColorLight,
    // 추가 색상
    accent: '#A0522D', // 다크 레드/갈색
    cardBackground: '#FFF8F0', // 카드 배경
    border: '#D4C4B0', // 테두리
    shadow: '#E8D5C4', // 그림자
  },
  dark: {
    text: '#F5E6D3', // 크림 텍스트
    background: '#2C2416', // 어두운 갈색 배경
    tint: tintColorDark,
    icon: '#C9A961',
    tabIconDefault: '#8B7355',
    tabIconSelected: tintColorDark,
    // 추가 색상
    accent: '#CD853F', // 밝은 갈색
    cardBackground: '#3D2F1F', // 카드 배경
    border: '#5C4A37', // 테두리
    shadow: '#1A1611', // 그림자
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
