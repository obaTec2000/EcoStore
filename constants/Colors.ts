/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

/**
 * App color scheme
 */

const AppColors = {
  primary: {
    50: "#FFF3E0",
    100: "#FFE0B2",
    200: "#FFCC80",
    300: "#FFB74D",
    400: "#FFA726",
    500: "#F57C00", // Primary orange
    600: "#EF6C00",
    700: "#E65100",
    800: "#BF360C",
    900: "#A83200",
  },
  accent: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#F97316",
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
  },
  gray: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
  },
  success: "#10B981", // Green
  error: "#EF4444", // Red
  warning: "#F59E0B", // Amber

  // Background colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F5F5F7",
    tertiary: "#EEEEEE",
  },

  // Text colors
  text: {
    primary: "#1F2937", // Dark gray for primary text
    secondary: "#6B7280", // Medium gray for secondary text
    tertiary: "#9CA3AF", // Light gray for tertiary text
    inverse: "#FFFFFF", // White text for dark backgrounds
  },
};


export default AppColors;