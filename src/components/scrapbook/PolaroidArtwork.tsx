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
  height = 195,
}) => {
  const renderScene = () => {
    switch (scene) {
      case 'SUMMER_BEACH':
      case 'SUNSET_WALK':
        return (
          <Svg width="100%" height={height} viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="cottonCandySky" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#7DD3FC" />
                <Stop offset="48%" stopColor="#F9A8D4" />
                <Stop offset="100%" stopColor="#FFE4EF" />
              </LinearGradient>
              <LinearGradient id="crystalOcean" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#38BDF8" />
                <Stop offset="100%" stopColor="#0284C7" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="340" height="200" fill="url(#cottonCandySky)" />
            {/* Dreamy Bokeh Orbs & Clouds */}
            <Circle cx="65" cy="42" r="24" fill="#FFFFFF" opacity={0.35} />
            <Circle cx="280" cy="36" r="18" fill="#FFFFFF" opacity={0.4} />
            {/* Glowing Pastel Sun */}
            <Circle cx="170" cy="96" r="46" fill="#FFF0F6" opacity={0.45} />
            <Circle cx="170" cy="96" r="32" fill="#FFFFFF" opacity={0.95} />
            {/* Soft Fluffy Horizon Clouds */}
            <G fill="#FFFFFF" opacity={0.85}>
              <Circle cx="52" cy="96" r="16" />
              <Circle cx="72" cy="92" r="22" />
              <Circle cx="94" cy="98" r="15" />
              <Circle cx="255" cy="94" r="18" />
              <Circle cx="278" cy="90" r="22" />
              <Circle cx="300" cy="96" r="15" />
            </G>
            {/* Crystal Turquoise Ocean */}
            <Rect x="0" y="116" width="340" height="52" fill="url(#crystalOcean)" />
            {/* Shimmering Pink & White Water Reflections */}
            <Line x1="142" y1="124" x2="198" y2="124" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity={0.9} />
            <Line x1="150" y1="132" x2="190" y2="132" stroke="#FFE4EF" strokeWidth="2.5" strokeLinecap="round" opacity={0.85} />
            <Line x1="158" y1="140" x2="182" y2="140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
            {/* Pearl White & Blush Sand */}
            <Path d="M 0 156 Q 170 140 340 160 L 340 200 L 0 200 Z" fill="#FFF5F9" />
            <Path d="M 0 156 Q 170 140 340 160" stroke="#FFFFFF" strokeWidth="3" fill="none" />
            {/* Cute Couple Silhouettes */}
            <Circle cx="158" cy="144" r="7.5" fill="#0F172A" />
            <Path d="M 149 153 Q 158 149 167 153 L 165 178 L 151 178 Z" fill="#0284C7" />
            <Circle cx="182" cy="146" r="7" fill="#0F172A" />
            <Path d="M 174 155 Q 182 151 190 155 L 188 178 L 176 178 Z" fill="#FF2D78" />
            {/* Glowing Floating Heart */}
            <Circle cx="170" cy="128" r="11" fill="#FF2D78" opacity={0.25} />
            <Path
              d="M 170 134 C 165 129 161 126 161 122 C 161 119 163.5 117 166 117 C 168 117 169.2 118 170 119.5 C 170.8 118 172 117 174 117 C 176.5 117 179 119 179 122 C 179 126 175 129 170 134 Z"
              fill="#FF2D78"
            />
          </Svg>
        );

      case 'CAFE_DATE':
      case 'COZY_COFFEE':
        return (
          <Svg width="100%" height={height} viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="cloudCafeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#E0F2FE" />
                <Stop offset="55%" stopColor="#F0F8FF" />
                <Stop offset="100%" stopColor="#FFE4EF" />
              </LinearGradient>
              <LinearGradient id="windowSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#7DD3FC" />
                <Stop offset="100%" stopColor="#E0F2FE" />
              </LinearGradient>
            </Defs>
            {/* Pastel Sky & Blush Interior Wall */}
            <Rect x="0" y="0" width="340" height="200" fill="url(#cloudCafeBg)" />
            {/* Arched Parisian Café Window */}
            <Path
              d="M 85 135 L 85 58 A 85 52 0 0 1 255 58 L 255 135 Z"
              fill="url(#windowSky)"
              stroke="#FFFFFF"
              strokeWidth="6"
            />
            {/* Clouds Inside Window */}
            <G fill="#FFFFFF" opacity={0.9}>
              <Circle cx="135" cy="72" r="18" />
              <Circle cx="158" cy="68" r="24" />
              <Circle cx="182" cy="74" r="16" />
              <Circle cx="215" cy="54" r="14" />
            </G>
            {/* Window Panes */}
            <Line x1="170" y1="12" x2="170" y2="135" stroke="#FFFFFF" strokeWidth="4" />
            <Line x1="85" y1="88" x2="255" y2="88" stroke="#FFFFFF" strokeWidth="4" />
            {/* Hanging Rose-Gold Heart Lamp */}
            <Line x1="170" y1="0" x2="170" y2="28" stroke="#FF85B3" strokeWidth="2.5" />
            <Circle cx="170" cy="34" r="16" fill="#FFF0F6" opacity={0.7} />
            <Circle cx="170" cy="34" r="8" fill="#FF2D78" />
            {/* Crisp White & Ice-Blue Marble Café Table */}
            <Rect x="0" y="132" width="340" height="68" fill="#FFFFFF" />
            <Line x1="0" y1="132" x2="340" y2="132" stroke="#BAE6FD" strokeWidth="4" />
            {/* Left Cup: Sky Cloud Iced Latte */}
            <G transform="translate(88, 94)">
              <Ellipse cx="24" cy="48" rx="30" ry="6" fill="#E0F2FE" />
              <Rect x="4" y="12" width="40" height="34" rx="10" fill="#BAE6FD" stroke="#FFFFFF" strokeWidth="3" />
              <Path d="M 44 18 C 54 18 54 36 44 36" stroke="#38BDF8" strokeWidth="4" fill="none" />
              {/* Whipped cream top */}
              <Ellipse cx="24" cy="12" rx="18" ry="6" fill="#FFFFFF" />
              {/* Cute Pink Straw */}
              <Line x1="28" y1="8" x2="36" y2="-8" stroke="#FF2D78" strokeWidth="4" strokeLinecap="round" />
            </G>
            {/* Right Cup: Strawberry Rose Latte */}
            <G transform="translate(204, 96)">
              <Ellipse cx="24" cy="46" rx="30" ry="6" fill="#FFE4EF" />
              <Rect x="4" y="10" width="40" height="34" rx="10" fill="#FF85B3" stroke="#FFFFFF" strokeWidth="3" />
              <Path d="M 44 16 C 54 16 54 34 44 34" stroke="#FF2D78" strokeWidth="4" fill="none" />
              <Ellipse cx="24" cy="10" rx="18" ry="6" fill="#FFF0F6" />
              {/* Heart Latte Art */}
              <Circle cx="24" cy="26" r="6" fill="#FFFFFF" opacity={0.9} />
            </G>
            {/* Floating Love Sparkles Between Cups */}
            <Path
              d="M 170 112 C 163 105 157 100 157 94 C 157 89 161 86 165 86 C 167.5 86 169 87.5 170 89.5 C 171 87.5 172.5 86 175 86 C 179 86 183 89 183 94 C 183 100 177 105 170 112 Z"
              fill="#FF2D78"
            />
            <Circle cx="148" cy="82" r="3" fill="#38BDF8" />
            <Circle cx="192" cy="84" r="3.5" fill="#FF2D78" />
          </Svg>
        );

      case 'PARK_PICNIC':
      case 'SMILE_GOOFY':
        return (
          <Svg width="100%" height={height} viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="sakuraSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#BAE6FD" />
                <Stop offset="100%" stopColor="#FFF0F6" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="340" height="200" fill="url(#sakuraSky)" />
            {/* Fluffy Clouds */}
            <G fill="#FFFFFF" opacity={0.95}>
              <Circle cx="78" cy="44" r="18" />
              <Circle cx="100" cy="38" r="24" />
              <Circle cx="122" cy="46" r="16" />
              <Circle cx="240" cy="38" r="16" />
              <Circle cx="262" cy="34" r="22" />
              <Circle cx="284" cy="42" r="15" />
            </G>
            {/* Dreamy Pastel Blue & Blush Hills */}
            <Path d="M 0 118 Q 110 82 230 120 L 340 106 L 340 200 L 0 200 Z" fill="#7DD3FC" opacity={0.65} />
            <Path d="M 0 132 Q 180 102 340 136 L 340 200 L 0 200 Z" fill="#38BDF8" opacity={0.5} />
            {/* Crisp White & Hot-Pink Gingham Picnic Blanket */}
            <Path d="M 75 144 L 265 144 L 290 184 L 50 184 Z" fill="#FFFFFF" stroke="#FFC2DF" strokeWidth="2.5" />
            <Path d="M 115 144 L 225 144 L 240 184 L 100 184 Z" fill="#FFE4EF" />
            <Path d="M 150 144 L 190 144 L 196 184 L 144 184 Z" fill="#FF2D78" opacity={0.85} />
            {/* Cute White & Pink Strawberry Cake */}
            <Rect x="148" y="118" width="44" height="28" rx="8" fill="#FFFFFF" stroke="#FF85B3" strokeWidth="2.5" />
            <Path d="M 148 128 Q 170 135 192 128" stroke="#FF2D78" strokeWidth="3" fill="none" />
            <Circle cx="170" cy="114" r="6" fill="#FF2D78" />
            {/* Floating Sakura Petals */}
            <Circle cx="64" cy="84" r="4" fill="#FF85B3" />
            <Circle cx="195" cy="72" r="3.5" fill="#FF2D78" />
            <Circle cx="275" cy="88" r="4.5" fill="#FF85B3" />
          </Svg>
        );

      case 'STARRY_CAMPING':
      case 'BEDTIME_STUFF':
        return (
          <Svg width="100%" height={height} viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="celestialNight" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#0F172A" />
                <Stop offset="55%" stopColor="#1E3A8A" />
                <Stop offset="100%" stopColor="#831843" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="340" height="200" fill="url(#celestialNight)" />
            {/* Twinkling Stars & Shooting Star */}
            <Circle cx="48" cy="30" r="2.2" fill="#FFFFFF" />
            <Circle cx="96" cy="52" r="1.8" fill="#7DD3FC" />
            <Circle cx="145" cy="24" r="2.5" fill="#FF85B3" />
            <Circle cx="205" cy="38" r="1.8" fill="#FFFFFF" />
            <Circle cx="290" cy="28" r="2.2" fill="#7DD3FC" />
            <Line x1="65" y1="22" x2="105" y2="42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
            {/* Glowing Pearl Crescent Moon */}
            <Circle cx="266" cy="48" r="26" fill="#E0F2FE" opacity={0.2} />
            <Circle cx="266" cy="48" r="18" fill="#FFFFFF" />
            <Circle cx="274" cy="43" r="15" fill="#172B63" />
            {/* Blue Velvet Mountain Silhouette */}
            <Path d="M 0 148 L 80 92 L 155 142 L 245 84 L 340 148 L 340 200 L 0 200 Z" fill="#0F172A" opacity={0.75} />
            {/* Glowing Hot-Pink & White Glamping Tent */}
            <Circle cx="170" cy="148" r="48" fill="#FF2D78" opacity={0.22} />
            <Path d="M 124 168 L 170 108 L 216 168 Z" fill="#FFFFFF" stroke="#FF85B3" strokeWidth="3" />
            <Path d="M 152 168 L 170 128 L 188 168 Z" fill="#FF2D78" />
          </Svg>
        );

      case 'RAINY_MOVIE':
      case 'MIRROR_SELFIE':
        return (
          <Svg width="100%" height={height} viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="cinemaBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#E0F2FE" />
                <Stop offset="100%" stopColor="#FCE7F3" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="340" height="200" fill="url(#cinemaBg)" />
            {/* Soft Sky Rain Streaks */}
            <G stroke="#38BDF8" strokeWidth="2" opacity={0.45} strokeLinecap="round">
              <Line x1="45" y1="20" x2="33" y2="46" />
              <Line x1="88" y1="35" x2="76" y2="61" />
              <Line x1="265" y1="24" x2="253" y2="50" />
              <Line x1="305" y1="45" x2="293" y2="71" />
            </G>
            {/* Floating White Cinema Screen with Hot-Pink Frame */}
            <Rect x="82" y="34" width="176" height="106" rx="18" fill="#FFFFFF" stroke="#FF85B3" strokeWidth="4" />
            <Circle cx="170" cy="87" r="34" fill="#FFF0F6" />
            <Path
              d="M 170 108 C 152 92 142 80 142 69 C 142 60 150 54 158 54 C 164 54 168 58 170 62 C 172 58 176 54 182 54 C 190 54 198 60 198 69 C 198 80 188 92 170 108 Z"
              fill="#FF2D78"
            />
            {/* Cozy Cloud Sofa Silhouette at Bottom */}
            <Rect x="96" y="152" width="148" height="48" rx="22" fill="#38BDF8" opacity={0.35} />
          </Svg>
        );

      case 'COOKING_NIGHT':
      case 'HOMEMADE_MEAL':
      default:
        return (
          <Svg width="100%" height={height} viewBox="0 0 340 200" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <LinearGradient id="patisserieBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#E0F2FE" />
                <Stop offset="50%" stopColor="#FFFFFF" />
                <Stop offset="100%" stopColor="#FFE4EF" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="340" height="200" fill="url(#patisserieBg)" />
            {/* Decorative Polka Dots */}
            <Circle cx="52" cy="44" r="8" fill="#BAE6FD" opacity={0.6} />
            <Circle cx="288" cy="52" r="10" fill="#FFC2DF" opacity={0.6} />
            <Circle cx="64" cy="148" r="12" fill="#FFC2DF" opacity={0.5} />
            <Circle cx="278" cy="144" r="9" fill="#BAE6FD" opacity={0.6} />
            {/* Porcelain Plate */}
            <Circle cx="170" cy="100" r="64" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="4" />
            <Circle cx="170" cy="100" r="48" fill="#F8FBFF" stroke="#E0F2FE" strokeWidth="2" />
            {/* Fluffy Pink & White Strawberry Soufflé Pancakes */}
            <Circle cx="170" cy="100" r="30" fill="#FFE4EF" stroke="#FF85B3" strokeWidth="2.5" />
            <Circle cx="170" cy="96" r="16" fill="#FFFFFF" />
            {/* Fresh Hot-Pink Berries */}
            <Circle cx="162" cy="92" r="6.5" fill="#FF2D78" />
            <Circle cx="178" cy="94" r="6.5" fill="#FF2D78" />
            <Circle cx="170" cy="104" r="6.5" fill="#FF2D78" />
          </Svg>
        );
    }
  };

  return <View style={[styles.wrapper, { height }]}>{renderScene()}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
});
