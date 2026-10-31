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

interface FireplaceCanvasProps {
  warmthLevel?: number;
}

export const FireplaceCanvas: React.FC<FireplaceCanvasProps> = ({
  warmthLevel = 3,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 420,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const flameScale = 0.85 + warmthLevel * 0.06;

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ scaleY: pulseAnim }, { scaleX: flameScale }],
        }}
      >
        <Svg width="280" height="175" viewBox="0 0 280 175">
          <Defs>
            <LinearGradient id="hearthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#0F172A" />
              <Stop offset="100%" stopColor="#2A1230" />
            </LinearGradient>
            <LinearGradient id="outerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FF85B3" />
              <Stop offset="50%" stopColor="#FF2D78" />
              <Stop offset="100%" stopColor="#D81159" />
            </LinearGradient>
            <LinearGradient id="innerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="55%" stopColor="#E0F2FE" />
              <Stop offset="100%" stopColor="#7DD3FC" />
            </LinearGradient>
          </Defs>

          {/* Hanging Sky & Hot-Pink Fairy Lights Garland */}
          <Path
            d="M 15 16 Q 75 34 140 16 Q 205 34 265 16"
            stroke="#BAE6FD"
            strokeWidth="2"
            fill="none"
          />
          <Circle cx="45" cy="24" r="4" fill="#FF2D78" />
          <Circle cx="95" cy="25" r="4" fill="#38BDF8" />
          <Circle cx="140" cy="17" r="4.5" fill="#FFFFFF" />
          <Circle cx="185" cy="25" r="4" fill="#38BDF8" />
          <Circle cx="235" cy="24" r="4" fill="#FF2D78" />

          {/* Crisp White & Ice-Blue Nordic Marble Mantelpiece */}
          <Rect x="10" y="10" width="260" height="12" rx="6" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
          <Rect x="22" y="22" width="236" height="142" rx="16" fill="#F0F8FF" stroke="#BAE6FD" strokeWidth="2" />
          <Rect x="34" y="32" width="212" height="124" rx="12" fill="url(#hearthGrad)" />

          {/* Subtle Celestial Grid Lines Inside Hearth */}
          <G stroke="#334155" strokeWidth="1" opacity={0.45}>
            <Path d="M 34 60 L 246 60 M 34 90 L 246 90 M 34 120 L 246 120" />
            <Path d="M 85 32 L 85 60 M 140 32 L 140 60 M 195 32 L 195 60" />
            <Path d="M 110 60 L 110 90 M 170 60 L 170 90" />
          </G>

          {/* Ambient Rose-Quartz & Sky Glow Halo */}
          <Circle cx="140" cy="116" r="58" fill="#FF2D78" opacity={0.26} />
          <Circle cx="140" cy="122" r="36" fill="#38BDF8" opacity={0.28} />

          {/* Pastel Crystal Birch Logs */}
          <G id="logs">
            <Path
              d="M 70 144 L 204 130 L 212 141 L 78 154 Z"
              fill="#CBD5E1"
              stroke="#64748B"
              strokeWidth="2"
            />
            <Path
              d="M 78 130 L 210 144 L 202 154 L 70 141 Z"
              fill="#E2E8F0"
              stroke="#64748B"
              strokeWidth="2"
            />
            <Circle cx="74" cy="137" r="7" fill="#FF85B3" />
            <Circle cx="206" cy="137" r="7" fill="#7DD3FC" />
          </G>

          {/* Outer Hot-Pink Rose-Quartz Flame */}
          <Path
            d="M 92 142 
               Q 96 100 112 82 
               Q 125 106 140 54 
               Q 155 100 168 84 
               Q 186 108 188 142 
               Q 140 154 92 142 Z"
            fill="url(#outerFlameGrad)"
          />

          {/* Inner Celestial Ice-Blue & White Flame */}
          <Path
            d="M 110 140 
               Q 118 112 130 90 
               Q 140 104 148 86 
               Q 162 110 170 140 
               Q 140 150 110 140 Z"
            fill="url(#innerFlameGrad)"
          />

          {/* Glowing Sparks & Floating Heart Embers */}
          <Circle cx="126" cy="68" r="3" fill="#FF85B3" opacity={0.95} />
          <Circle cx="156" cy="58" r="2.5" fill="#7DD3FC" opacity={0.9} />
          <Circle cx="116" cy="52" r="2" fill="#FFFFFF" opacity={0.9} />
          <Circle cx="145" cy="42" r="2.8" fill="#FF2D78" opacity={0.85} />
          <Circle cx="166" cy="76" r="2.2" fill="#E0F2FE" opacity={0.85} />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
});
