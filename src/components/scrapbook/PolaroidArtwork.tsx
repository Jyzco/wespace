import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Ellipse,
  G,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from 'react-native-svg';
import { MemoryImageType, SnapImageType } from '../../types';

interface PolaroidArtworkProps {
  scene: MemoryImageType | SnapImageType;
  height?: number;
}

export const PolaroidArtwork: React.FC<PolaroidArtworkProps> = ({
  scene,
  height = 175,
}) => {
  const renderScene = () => {
    switch (scene) {
      case 'SUMMER_BEACH':
      case 'SUNSET_WALK':
        return (
          <Svg width="100%" height={height} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FF7E67" />
                <Stop offset="55%" stopColor="#FFB86F" />
                <Stop offset="100%" stopColor="#FFE8A3" />
              </LinearGradient>
              <LinearGradient id="oceanWater" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#2A9D8F" />
                <Stop offset="100%" stopColor="#1D6B75" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="300" height="180" fill="url(#sunsetSky)" />
            {/* Glowing Sun */}
            <Circle cx="150" cy="92" r="38" fill="#FFF3B0" opacity={0.45} />
            <Circle cx="150" cy="92" r="26" fill="#FFFDF0" />
            {/* Ocean horizon */}
            <Rect x="0" y="108" width="300" height="45" fill="url(#oceanWater)" />
            {/* Sun reflection shimmers */}
            <Line x1="132" y1="115" x2="168" y2="115" stroke="#FFE8A3" strokeWidth="3" strokeLinecap="round" />
            <Line x1="138" y1="123" x2="162" y2="123" stroke="#FFE8A3" strokeWidth="2.5" strokeLinecap="round" />
            <Line x1="143" y1="131" x2="157" y2="131" stroke="#FFE8A3" strokeWidth="2" strokeLinecap="round" />
            {/* Warm sandy beach */}
            <Path d="M 0 142 Q 150 130 300 148 L 300 180 L 0 180 Z" fill="#F4C98E" />
            {/* Two silhouettes holding hands */}
            <Circle cx="141" cy="134" r="6" fill="#2A2421" />
            <Path d="M 135 141 Q 141 139 147 141 L 145 162 L 137 162 Z" fill="#2A2421" />
            <Circle cx="159" cy="136" r="5.5" fill="#2A2421" />
            <Path d="M 153 143 Q 159 141 165 143 L 163 162 L 155 162 Z" fill="#2A2421" />
            {/* Small floating heart between them */}
            <Path
              d="M 150 124 C 147 121 144 119 144 116 C 144 114 146 113 148 113 C 149 113 150 114 150 115 C 150 114 151 113 152 113 C 154 113 156 114 156 116 C 156 119 153 121 150 124 Z"
              fill="#EE5D6C"
            />
          </Svg>
        );

      case 'CAFE_DATE':
      case 'COZY_COFFEE':
        return (
          <Svg width="100%" height={height} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="cafeBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#4A3427" />
                <Stop offset="100%" stopColor="#7C5841" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="300" height="180" fill="url(#cafeBg)" />
            {/* Warm Hanging Pendant Lamp */}
            <Circle cx="150" cy="42" r="46" fill="#F4B942" opacity={0.22} />
            <Line x1="150" y1="0" x2="150" y2="28" stroke="#2A2421" strokeWidth="2.5" />
            <Path d="M 132 28 Q 150 16 168 28 Z" fill="#D97706" />
            <Circle cx="150" cy="31" r="6" fill="#FFFBEB" />
            {/* Wooden Table */}
            <Rect x="0" y="126" width="300" height="54" fill="#9C6B49" />
            <Line x1="0" y1="126" x2="300" y2="126" stroke="#6B442A" strokeWidth="3" />
            {/* Two Latte Cups */}
            <G transform="translate(88, 92)">
              <Rect x="0" y="10" width="36" height="28" rx="6" fill="#FFFAF3" />
              <Path d="M 36 15 C 44 15 44 31 36 31" stroke="#FFFAF3" strokeWidth="3.5" fill="none" />
              <Ellipse cx="18" cy="38" rx="24" ry="4" fill="#EADDD0" />
              <Path d="M 12 4 Q 16 -4 12 -10" stroke="#FFF8EB" strokeWidth="2" fill="none" opacity={0.7} />
              <Path d="M 24 6 Q 28 -2 24 -8" stroke="#FFF8EB" strokeWidth="2" fill="none" opacity={0.7} />
            </G>
            <G transform="translate(172, 96)">
              <Rect x="0" y="6" width="34" height="26" rx="6" fill="#FFE4E6" />
              <Path d="M 34 11 C 41 11 41 25 34 25" stroke="#FFE4E6" strokeWidth="3.5" fill="none" />
              <Ellipse cx="17" cy="32" rx="22" ry="4" fill="#FECDD3" />
              <Path d="M 14 0 Q 18 -6 14 -12" stroke="#FFF8EB" strokeWidth="2" fill="none" opacity={0.7} />
            </G>
            {/* Open Poetry Book */}
            <Path d="M 132 132 Q 150 126 168 132 L 166 148 Q 150 144 134 148 Z" fill="#FFFDF9" />
          </Svg>
        );

      case 'PARK_PICNIC':
      case 'SMILE_GOOFY':
        return (
          <Svg width="100%" height={height} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="meadowSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#90E0EF" />
                <Stop offset="100%" stopColor="#E0F7FA" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="300" height="180" fill="url(#meadowSky)" />
            {/* Soft Fluffy Clouds */}
            <G fill="#FFFFFF" opacity={0.9}>
              <Circle cx="75" cy="44" r="16" />
              <Circle cx="92" cy="40" r="20" />
              <Circle cx="110" cy="46" r="14" />
              <Circle cx="215" cy="36" r="14" />
              <Circle cx="232" cy="34" r="18" />
            </G>
            {/* Rolling Green Hills */}
            <Path d="M 0 112 Q 95 78 210 115 L 300 105 L 300 180 L 0 180 Z" fill="#74C69D" />
            <Path d="M 0 128 Q 160 98 300 132 L 300 180 L 0 180 Z" fill="#52B788" />
            {/* Checkered Picnic Blanket */}
            <Path d="M 85 142 L 215 142 L 235 172 L 65 172 Z" fill="#EE5D6C" />
            <Path d="M 115 142 L 185 142 L 195 172 L 105 172 Z" fill="#FFFAF3" opacity={0.85} />
            {/* Picnic Basket */}
            <Rect x="132" y="122" width="36" height="24" rx="5" fill="#C68B59" stroke="#8C5830" strokeWidth="2" />
            <Path d="M 138 122 C 138 108 162 108 162 122" stroke="#8C5830" strokeWidth="2.5" fill="none" />
          </Svg>
        );

      case 'STARRY_CAMPING':
      case 'BEDTIME_STUFF':
        return (
          <Svg width="100%" height={height} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#191636" />
                <Stop offset="65%" stopColor="#2E295E" />
                <Stop offset="100%" stopColor="#4A3E7A" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="300" height="180" fill="url(#nightSky)" />
            {/* Stars */}
            <Circle cx="42" cy="28" r="2" fill="#FFF3B0" />
            <Circle cx="88" cy="48" r="1.5" fill="#FFFFFF" />
            <Circle cx="130" cy="22" r="2.2" fill="#FFF3B0" />
            <Circle cx="185" cy="36" r="1.6" fill="#FFFFFF" />
            <Circle cx="255" cy="26" r="2" fill="#FFF3B0" />
            <Circle cx="222" cy="64" r="1.5" fill="#FFFFFF" />
            <Circle cx="64" cy="76" r="1.8" fill="#FFF3B0" />
            {/* Crescent Moon */}
            <Circle cx="236" cy="44" r="18" fill="#FDE68A" />
            <Circle cx="243" cy="39" r="15" fill="#211D45" />
            {/* Mountain Silhouette */}
            <Path d="M 0 138 L 68 86 L 135 135 L 215 78 L 300 138 L 300 180 L 0 180 Z" fill="#1E1B38" />
            {/* Glowing Cozy Tent */}
            <Path d="M 110 158 L 150 106 L 190 158 Z" fill="#F4B942" stroke="#D97706" strokeWidth="2" />
            <Path d="M 136 158 L 150 125 L 164 158 Z" fill="#FFFBEB" />
          </Svg>
        );

      case 'RAINY_MOVIE':
      case 'MIRROR_SELFIE':
        return (
          <Svg width="100%" height={height} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="rainBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#334155" />
                <Stop offset="100%" stopColor="#1E293B" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="300" height="180" fill="url(#rainBg)" />
            {/* Rain streaks */}
            <G stroke="#93C5FD" strokeWidth="1.5" opacity={0.5} strokeLinecap="round">
              <Line x1="50" y1="20" x2="40" y2="42" />
              <Line x1="95" y1="35" x2="85" y2="57" />
              <Line x1="160" y1="15" x2="150" y2="37" />
              <Line x1="220" y1="40" x2="210" y2="62" />
              <Line x1="260" y1="22" x2="250" y2="44" />
              <Line x1="75" y1="85" x2="65" y2="107" />
              <Line x1="200" y1="90" x2="190" y2="112" />
            </G>
            {/* Warm Glowing Projector Screen */}
            <Rect x="75" y="42" width="150" height="90" rx="10" fill="#FFFBEB" stroke="#F4B942" strokeWidth="3" />
            <Path
              d="M 150 104 C 132 88 122 76 122 65 C 122 56 130 50 138 50 C 144 50 148 54 150 58 C 152 54 156 50 162 50 C 170 50 178 56 178 65 C 178 76 168 88 150 104 Z"
              fill="#FF1493"
            />
          </Svg>
        );

      case 'COOKING_NIGHT':
      case 'HOMEMADE_MEAL':
      default:
        return (
          <Svg width="100%" height={height} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="kitchenBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFF1F2" />
                <Stop offset="100%" stopColor="#FFE4E6" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="300" height="180" fill="url(#kitchenBg)" />
            <Circle cx="150" cy="85" r="56" fill="#FFFFFF" stroke="#FECDD3" strokeWidth="3" />
            <Circle cx="150" cy="85" r="42" fill="#FFFDF9" stroke="#FDA4AF" strokeWidth="1.5" />
            {/* Pasta / Sweet Dish Illustration */}
            <Circle cx="150" cy="85" r="26" fill="#FDE68A" />
            <Circle cx="142" cy="79" r="6" fill="#FF1493" />
            <Circle cx="158" cy="83" r="6" fill="#FF1493" />
            <Circle cx="148" cy="93" r="6" fill="#FF1493" />
            <Path d="M 145 72 Q 150 65 156 72" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
          </Svg>
        );
    }
  };

  return <View style={[styles.wrapper, { height }]}>{renderScene()}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
