import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

export const FireplaceCanvas: React.FC = () => {
  const flameAnim1 = useRef(new Animated.Value(0)).current;
  const flameAnim2 = useRef(new Animated.Value(0)).current;
  const emberAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Oscillating flames at ~400ms
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim2, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim2, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating embers
    Animated.loop(
      Animated.timing(emberAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [flameAnim1, flameAnim2, emberAnim]);

  return (
    <View style={styles.container}>
      <Svg width="260" height="170" viewBox="0 0 260 170">
        <Defs>
          {/* Fireplace inner brick shading */}
          <LinearGradient id="hearthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E1612" />
            <Stop offset="100%" stopColor="#38291F" />
          </LinearGradient>
          {/* Outer Flame Gradient */}
          <LinearGradient id="outerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FF5722" />
            <Stop offset="50%" stopColor="#E65100" />
            <Stop offset="100%" stopColor="#BF360C" />
          </LinearGradient>
          {/* Inner Flame Gradient */}
          <LinearGradient id="innerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFF9C4" />
            <Stop offset="40%" stopColor="#FFD54F" />
            <Stop offset="100%" stopColor="#FFB300" />
          </LinearGradient>
        </Defs>

        {/* Mantel & Backing Wall */}
        <Rect x="15" y="10" width="230" height="150" rx="12" fill="#423024" />
        <Rect x="25" y="20" width="210" height="130" rx="8" fill="url(#hearthGrad)" />

        {/* Brick Patterns */}
        <G stroke="#2B1F17" strokeWidth="1.5" opacity={0.6}>
          {/* Horizontal lines */}
          <Path d="M 25 45 L 235 45 M 25 70 L 235 70 M 25 95 L 235 95 M 25 120 L 235 120" />
          {/* Vertical brick lines */}
          <Path d="M 60 20 L 60 45 M 120 20 L 120 45 M 180 20 L 180 45" />
          <Path d="M 90 45 L 90 70 M 150 45 L 150 70 M 210 45 L 210 70" />
          <Path d="M 60 70 L 60 95 M 120 70 L 120 95 M 180 70 L 180 95" />
          <Path d="M 90 95 L 90 120 M 150 95 L 150 120 M 210 95 L 210 120" />
        </G>

        {/* Arch Rim */}
        <Path
          d="M 45 145 L 45 70 C 45 35 215 35 215 70 L 215 145"
          fill="none"
          stroke="#5C4033"
          strokeWidth="6"
        />

        {/* Firewood Logs */}
        <G id="logs">
          <Path d="M 60 138 L 190 125 L 200 135 L 70 148 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />
          <Path d="M 70 125 L 195 138 L 185 148 L 60 135 Z" fill="#4E342E" stroke="#271202" strokeWidth="2" />
          <Circle cx="65" cy="132" r="7" fill="#795548" />
          <Circle cx="195" cy="132" r="7" fill="#795548" />
        </G>

        {/* Glow Halo */}
        <Circle cx="130" cy="115" r="48" fill="#FF8F00" opacity={0.25} />

        {/* Outer Flame (Dual-layer quadratic curves) */}
        <Path
          d="M 85 136 
             Q 90 100 105 85 
             Q 115 105 130 65 
             Q 145 100 155 88 
             Q 175 110 175 136 
             Q 130 148 85 136 Z"
          fill="url(#outerFlameGrad)"
        />

        {/* Inner Bright Amber Core */}
        <Path
          d="M 102 135 
             Q 110 110 122 92 
             Q 130 105 138 88 
             Q 150 110 158 135 
             Q 130 144 102 135 Z"
          fill="url(#innerFlameGrad)"
        />

        {/* Little Floating Embers */}
        <Circle cx="120" cy="72" r="2.5" fill="#FFE082" opacity={0.8} />
        <Circle cx="142" cy="62" r="1.8" fill="#FFCA28" opacity={0.7} />
        <Circle cx="110" cy="55" r="1.5" fill="#FFA726" opacity={0.9} />
        <Circle cx="135" cy="46" r="2" fill="#FFE082" opacity={0.6} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});
