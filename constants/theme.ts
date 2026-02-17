/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Little Lemon Branding Colors
const primaryGreen = '#495E57';
const secondaryGreen = '#3D4C47';
const accentYellow = '#F4CE14';
const lightGray = '#EDEFEE';
const darkText = '#333333';

export const Colors = {
  light: {
    text: darkText,
    background: '#fff',
    tint: primaryGreen,
    icon: primaryGreen,
    tabIconDefault: primaryGreen,
    tabIconSelected: accentYellow,
    primary: primaryGreen,
    secondary: secondaryGreen,
    accent: accentYellow,
    lightGray: lightGray,
    darkText: darkText,
  },
  dark: {
    text: lightGray,
    background: '#1a1a1a',
    tint: accentYellow,
    icon: lightGray,
    tabIconDefault: lightGray,
    tabIconSelected: accentYellow,
    primary: primaryGreen,
    secondary: secondaryGreen,
    accent: accentYellow,
    lightGray: lightGray,
    darkText: darkText,
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
