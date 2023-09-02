import { DefaultTheme } from "react-native-paper";

// Light Theme - Teal and Blue
const lightTheme = {
  ...DefaultTheme,
  dark: false,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: "#008B8B", // updated primary color (teal)
    onPrimary: "#FFFFFF",
    primaryContainer: "#008B8B",
    onPrimaryContainer: "#FFFFFF",
    secondary: "#1E90FF", // updated secondary color (blue)
    onSecondary: "#FFFFFF",
    secondaryContainer: "#1E90FF",
    onSecondaryContainer: "#FFFFFF",
    background: "#FFFFFF",
    onBackground: "#000000",
    surface: "#FFFFFF",
    onSurface: "#000000",
    surfaceVariant: "#E0E0E0",
    onSurfaceVariant: "#000000",
    outline: "#008B8B",
    error: "#B00020",
    onError: "#FFFFFF",
    errorContainer: "#B00020",
    onErrorContainer: "#FFFFFF",
    // elevation: {
    //   // ... (keep elevation colors unchanged)
    // },
    surfaceDisabled: "#E0E0E0",
    onSurfaceDisabled: "#9E9E9E",
    inverseOnSurface: "#FFFFFF",
    inverseSurface: "#000000",
    inversePrimary: "#1E90FF",
    backdrop: DefaultTheme.colors.backdrop,
  },
};

// Dark Theme - Teal and Blue
const darkTheme = {
  ...DefaultTheme,
  dark: true,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: "#008B8B", // updated primary color (teal)
    onPrimary: "#FFFFFF",
    primaryContainer: "#008B8B",
    onPrimaryContainer: "#FFFFFF",
    secondary: "#1E90FF", // updated secondary color (blue)
    onSecondary: "#FFFFFF",
    secondaryContainer: "#1E90FF",
    onSecondaryContainer: "#FFFFFF",
    background: "#1F1F1F",
    onBackground: "#FFFFFF",
    surface: "#333333",
    onSurface: "#FFFFFF",
    surfaceVariant: "#4F4F4F",
    onSurfaceVariant: "#FFFFFF",
    outline: "#008B8B",
    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#CF6679",
    onErrorContainer: "#FFFFFF",
    // elevation: {
    //   // ... (keep elevation colors unchanged)
    // },
    surfaceDisabled: "#4F4F4F",
    onSurfaceDisabled: "#9E9E9E",
    inverseOnSurface: "#FFFFFF",
    inverseSurface: "#000000",
    inversePrimary: "#1E90FF",
    backdrop: DefaultTheme.colors.backdrop,
  },
};

export { lightTheme, darkTheme };
