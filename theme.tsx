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

// Sunset Theme
const sunsetTheme = {
  ...DefaultTheme,
  dark: false,  // Assuming it's a light theme due to the light sunset colors
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#008B8B',  // Main sunset color
    onPrimary: '#4d4b48',  // A contrasting color for text on primary
    primaryContainer: '#c58e66',  // Secondary sunset color
    onPrimaryContainer: '#4d4b48',  // A contrasting color for text on primary container
    secondary: '#8fa1a5',  // A subdued sunset color
    onSecondary: '#f8a460',  // A contrasting color for text on secondary
    secondaryContainer: '#bbb7ab',  // Another secondary sunset color
    onSecondaryContainer: '#f8a460',  // A contrasting color for text on secondary container
    background: '#f8a460',  // Background color
    onBackground: '#4d4b48',  // Text color on background
    surface: '#f2bc87',  // Surface color
    onSurface: '#4d4b48',  // Text color on surface
    surfaceVariant: '#c58e66',  // Variant of the surface color
    onSurfaceVariant: '#4d4b48',  // Text color on surface variant
    outline: '#8fa1a5',  // Outline color
    error: '#B00020',  // Error color (unchanged)
    onError: '#FFFFFF',  // Text color on error (unchanged)
    errorContainer: '#B00020',  // Error container color (unchanged)
    onErrorContainer: '#FFFFFF',  // Text color on error container (unchanged)
    surfaceDisabled: '#E0E0E0',  // Disabled surface color (unchanged)
    onSurfaceDisabled: '#9E9E9E',  // Text color on disabled surface (unchanged)
    inverseOnSurface: '#FFFFFF',  // Inverse text color on surface (unchanged)
    inverseSurface: '#000000',  // Inverse surface color (unchanged)
    inversePrimary: '#8fa1a5',  // Inverse primary color
    backdrop: DefaultTheme.colors.backdrop,  // Backdrop color (unchanged)
  },
};

export { lightTheme, darkTheme, sunsetTheme };