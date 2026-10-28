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
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 380,
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
              <Stop offset="0%" stopColor="#16100C" />
              <Stop offset="100%" stopColor="#32231A" />
            </LinearGradient>
            <LinearGradient id="outerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FF7043" />
              <Stop offset="50%" stopColor="#E65100" />
              <Stop offset="100%" stopColor="#BF360C" />
            </LinearGradient>
            <LinearGradient id="innerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFDE7" />
              <Stop offset="45%" stopColor="#FFD54F" />
              <Stop offset="100%" stopColor="#FFB300" />
            </LinearGradient>
          </Defs>

          {/* Hanging Fairy Lights Garland */}
          <Path
            d="M 15 16 Q 75 34 140 16 Q 205 34 265 16"
            stroke="#8D6E63"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle cx="45" cy="24" r="3.5" fill="#FFF59D" />
          <Circle cx="95" cy="25" r="3.5" fill="#FFCC80" />
          <Circle cx="140" cy="17" r="3.5" fill="#FFF59D" />
          <Circle cx="185" cy="25" r="3.5" fill="#FFCC80" />
          <Circle cx="235" cy="24" r="3.5" fill="#FFF59D" />

          {/* Wooden Mantelpiece Shelf */}
          <Rect x="10" y="10" width="260" height="12" rx="5" fill="#6D4C41" />
          <Rect x="22" y="22" width="236" height="142" rx="10" fill="#4E342E" />
          <Rect x="34" y="32" width="212" height="124" rx="8" fill="url(#hearthGrad)" />

          {/* Brick Masonry Lines */}
          <G stroke="#271B14" strokeWidth="1.5" opacity={0.65}>
            <Path d="M 34 55 L 246 55 M 34 80 L 246 80 M 34 105 L 246 105 M 34 130 L 246 130" />
            <Path d="M 75 32 L 75 55 M 140 32 L 140 55 M 205 32 L 205 55" />
            <Path d="M 105 55 L 105 80 M 175 55 L 175 80" />
            <Path d="M 75 80 L 75 105 M 140 80 L 140 105 M 205 80 L 205 105" />
          </G>

          {/* Ambient Hearth Glow Halo */}
          <Circle cx="140" cy="118" r="56" fill="#FF8F00" opacity={0.22} />
          <Circle cx="140" cy="122" r="36" fill="#FFB300" opacity={0.3} />

          {/* Crossed Birch Logs */}
          <G id="logs">
            <Path
              d="M 70 144 L 204 130 L 212 141 L 78 154 Z"
              fill="#5D4037"
              stroke="#3E2723"
              strokeWidth="2"
            />
            <Path
              d="M 78 130 L 210 144 L 202 154 L 70 141 Z"
              fill="#4E342E"
              stroke="#271202"
              strokeWidth="2"
            />
            <Circle cx="74" cy="137" r="7" fill="#8D6E63" />
            <Circle cx="206" cy="137" r="7" fill="#8D6E63" />
          </G>

          {/* Outer Flame (Dual-layer quadratic curve) */}
          <Path
            d="M 92 142 
               Q 96 100 112 82 
               Q 125 106 140 56 
               Q 155 100 168 84 
               Q 186 108 188 142 
               Q 140 154 92 142 Z"
            fill="url(#outerFlameGrad)"
          />

          {/* Inner Bright Amber Flame */}
          <Path
            d="M 110 140 
               Q 118 112 130 90 
               Q 140 104 148 86 
               Q 162 110 170 140 
               Q 140 150 110 140 Z"
            fill="url(#innerFlameGrad)"
          />

          {/* Glowing Sparks & Embers */}
          <Circle cx="128" cy="70" r="2.8" fill="#FFE082" opacity={0.9} />
          <Circle cx="154" cy="60" r="2.2" fill="#FFCA28" opacity={0.85} />
          <Circle cx="116" cy="52" r="1.8" fill="#FFA726" opacity={0.9} />
          <Circle cx="145" cy="44" r="2.4" fill="#FFF59D" opacity={0.75} />
          <Circle cx="166" cy="76" r="2" fill="#FFCC80" opacity={0.8} />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
});
