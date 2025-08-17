import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SimpleGlassProps {
  children: React.ReactNode;
  borderRadius?: number;
  style?: any;
  theme?: any;
}

const SimpleGlass: React.FC<SimpleGlassProps> = ({
  children,
  borderRadius = 8,
  style,
  theme,
}) => {
  const isDark = theme?.dark;
  
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={isDark 
          ? ['rgba(0,188,212,0.08)', 'rgba(0,188,212,0.02)']
          : ['rgba(0,188,212,0.06)', 'rgba(0,188,212,0.01)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          { borderRadius },
        ]}
      />
      <View style={[
        styles.border,
        { 
          borderRadius,
          borderColor: isDark ? 'rgba(0,188,212,0.2)' : 'rgba(0,188,212,0.15)',
        }
      ]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
  },
});

export default SimpleGlass;