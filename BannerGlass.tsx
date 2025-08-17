import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface BannerGlassProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  elasticity?: number;
  displacementScale?: number;
  glassColor?: string;
  gradientColors?: string[];
  style?: any;
}

const BannerGlass: React.FC<BannerGlassProps> = ({
  children,
  blurIntensity = 20,
  borderRadius = 12,
  elasticity = 0.35,
  displacementScale = 15,
  glassColor = 'rgba(255, 255, 255, 0.1)',
  gradientColors = ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  style,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        Animated.spring(scale, {
          toValue: 1.02,
          friction: 3,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);

        const rotationValue = (dx / 300) * displacementScale;
        Animated.timing(rotation, {
          toValue: rotationValue,
          duration: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 40 * (1 - elasticity),
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(rotation, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const animatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { scale: scale },
      { rotate: rotation.interpolate({
        inputRange: [-30, 30],
        outputRange: ['-2deg', '2deg'],
      })},
    ],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        style,
      ]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          { borderRadius },
        ]}
      />
      
      <BlurView
        intensity={blurIntensity}
        tint="default"
        style={[
          styles.blurContainer,
          {
            borderRadius,
            backgroundColor: glassColor,
          },
        ]}
      >
        <View style={styles.contentContainer}>
          {children}
        </View>
        
        {isDragging && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                opacity: pan.x.interpolate({
                  inputRange: [-100, 0, 100],
                  outputRange: [0.2, 0, 0.2],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        )}
      </BlurView>
      
      <View
        style={[
          styles.borderOverlay,
          {
            borderRadius,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
        ]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // No overflow hidden - allow content to determine height
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurContainer: {
    // No fixed dimensions - let content size it
  },
  contentContainer: {
    // Content determines size
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

export default BannerGlass;