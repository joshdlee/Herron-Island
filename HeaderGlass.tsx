import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderGlassProps {
  children: React.ReactNode;
  elasticity?: number;
  displacementScale?: number;
  glassColor?: string;
  gradientColors?: string[];
  style?: any;
}

const HeaderGlass: React.FC<HeaderGlassProps> = ({
  children,
  elasticity = 0.4,
  displacementScale = 10,
  glassColor = 'rgba(255, 255, 255, 0.1)',
  gradientColors = ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  style,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
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
      },
      onPanResponderRelease: () => {
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
        ]).start();
      },
    })
  ).current;

  const animatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { scale: scale },
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
        ]}
      />
      
      <View
        style={[
          styles.glassContainer,
          {
            backgroundColor: glassColor,
          },
        ]}
      >
        {children}
      </View>
      
      <View
        style={[
          styles.borderOverlay,
          {
            borderBottomWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
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
  glassContainer: {
    flex: 1,
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

export default HeaderGlass;