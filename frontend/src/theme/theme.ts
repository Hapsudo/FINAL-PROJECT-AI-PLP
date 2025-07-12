import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    // Primary Green Colors (Agricultural Theme)
    primary: '#4CAF50',
    primaryContainer: '#C8E6C9',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1B5E20',
    
    // Secondary Colors
    secondary: '#FF9800',
    secondaryContainer: '#FFE0B2',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#E65100',
    
    // Tertiary Colors
    tertiary: '#2196F3',
    tertiaryContainer: '#BBDEFB',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#0D47A1',
    
    // Surface Colors
    surface: '#FAFAFA',
    surfaceVariant: '#F5F5F5',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
    
    // Background Colors
    background: '#FFFFFF',
    onBackground: '#212121',
    
    // Error Colors
    error: '#F44336',
    errorContainer: '#FFCDD2',
    onError: '#FFFFFF',
    onErrorContainer: '#B71C1C',
    
    // Success Colors
    success: '#4CAF50',
    successContainer: '#C8E6C9',
    onSuccess: '#FFFFFF',
    onSuccessContainer: '#1B5E20',
    
    // Warning Colors
    warning: '#FF9800',
    warningContainer: '#FFE0B2',
    onWarning: '#FFFFFF',
    onWarningContainer: '#E65100',
    
    // Info Colors
    info: '#2196F3',
    infoContainer: '#BBDEFB',
    onInfo: '#FFFFFF',
    onInfoContainer: '#0D47A1',
    
    // Custom Colors for AGRIWISE AI
    soil: '#8D6E63',
    leaf: '#66BB6A',
    sky: '#81C784',
    sun: '#FFB74D',
    rain: '#64B5F6',
    earth: '#795548',
    
    // Gradient Colors
    gradientPrimary: ['#4CAF50', '#2E7D32', '#1B5E20'],
    gradientSecondary: ['#FF9800', '#F57C00', '#E65100'],
    gradientSky: ['#2196F3', '#1976D2', '#0D47A1'],
    
    // Shadow Colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    
    // Border Colors
    border: '#E0E0E0',
    borderLight: '#F5F5F5',
    borderDark: '#BDBDBD',
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

// Custom spacing and sizing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

export const shadows = {
  small: {
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
}; 