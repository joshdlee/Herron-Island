import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface LiquidGlassProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  elasticity?: number;
  displacementScale?: number;
  saturation?: number;
  chromaticAberration?: number;
  glassColor?: string;
  gradientColors?: string[];
  style?: any;
  disableDrag?: boolean;
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  blurIntensity = 20,
  borderRadius = 20,
  elasticity = 0.35,
  displacementScale = 15,
  saturation = 1.3,
  chromaticAberration = 0.02,
  glassColor = 'rgba(255, 255, 255, 0.1)',
  gradientColors = ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  style,
  disableDrag = false,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disableDrag,
      onMoveShouldSetPanResponder: () => !disableDrag,
      onPanResponderGrant: () => {
        setIsDragging(true);
        Animated.spring(scale, {
          toValue: 1.05,
          friction: 3,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);

        const rotationValue = (dx / Dimensions.get('window').width) * displacementScale;
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
        outputRange: ['-3deg', '3deg'],
      })},
    ],
  };

  const innerScale = pan.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [0.98, 1, 0.98],
  });

  const innerRotation = pan.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['1deg', '0deg', '-1deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        style,
      ]}
      {...(disableDrag ? {} : panResponder.panHandlers)}
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
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [
                { scale: innerScale },
                { rotate: innerRotation },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>
        
        {isDragging && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                opacity: pan.x.interpolate({
                  inputRange: [-100, 0, 100],
                  outputRange: [0.3, 0, 0.3],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
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
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
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

export default LiquidGlass;