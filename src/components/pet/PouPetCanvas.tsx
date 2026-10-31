import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  G,
  Line,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import { PetState, PetType, PetAccessory } from '../../types';
import { COLORS } from '../../constants/theme';

interface PouPetCanvasProps {
  pet: PetState;
  activeParticle?: string | null;
  onPetTap?: () => void;
}

const SPECIES_PALETTE: Record<
  PetType,
  {
    topGrad: string;
    botGrad: string;
    stroke: string;
    belly: string;
    earOuter: string;
    earInner: string;
  }
> = {
  CAT: {
    topGrad: '#FFFFFF',
    botGrad: '#FFEBF3',
    stroke: '#F472B6',
    belly: '#FFF5F9',
    earOuter: '#FFFFFF',
    earInner: '#FF2D78',
  },
  DOG: {
    topGrad: '#FFFFFF',
    botGrad: '#E0F2FE',
    stroke: '#38BDF8',
    belly: '#F0F9FF',
    earOuter: '#7DD3FC',
    earInner: '#BAE6FD',
  },
  BUNNY: {
    topGrad: '#FFF0F6',
    botGrad: '#FFC2DF',
    stroke: '#FF2D78',
    belly: '#FFFFFF',
    earOuter: '#FFD1E6',
    earInner: '#FF2D78',
  },
  BIRD: {
    topGrad: '#BAE6FD',
    botGrad: '#7DD3FC',
    stroke: '#0284C7',
    belly: '#FFFFFF',
    earOuter: '#38BDF8',
    earInner: '#FF85B3',
  },
};

export const PouPetCanvas: React.FC<PouPetCanvasProps> = ({
  pet,
  activeParticle,
  onPetTap,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const squishAnim = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pet.isSleeping) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3400);
    return () => clearInterval(interval);
  }, [pet.isSleeping]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1350,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1350,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  useEffect(() => {
    if (activeParticle) {
      particleAnim.setValue(0);
      Animated.parallel([
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(squishAnim, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(squishAnim, {
            toValue: 0.93,
            duration: 140,
            useNativeDriver: true,
          }),
          Animated.timing(squishAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [activeParticle, particleAnim, squishAnim]);

  const handlePressPet = () => {
    Animated.sequence([
      Animated.timing(squishAnim, {
        toValue: 1.13,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(squishAnim, {
        toValue: 0.91,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(squishAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
    if (onPetTap) onPetTap();
  };

  const isSad = pet.health < 35 || pet.happiness < 35;
  const isHappy = pet.happiness > 70 && !isSad;
  const palette = SPECIES_PALETTE[pet.petType] || SPECIES_PALETTE.CAT;

  const renderSpeciesFeatures = (type: PetType) => {
    switch (type) {
      case 'CAT':
        return (
          <G id="cat-features">
            {/* Fluffy Tail */}
            <Path
              d="M 182 165 C 215 158, 222 125, 200 118 C 188 115, 192 142, 178 152"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Left Pointed Cat Ear */}
            <Path
              d="M 72 80 L 48 34 L 100 58 Z"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <Path d="M 73 73 L 56 43 L 91 59 Z" fill={palette.earInner} opacity={0.85} />
            {/* Right Pointed Cat Ear */}
            <Path
              d="M 188 80 L 212 34 L 160 58 Z"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <Path d="M 187 73 L 204 43 L 169 59 Z" fill={palette.earInner} opacity={0.85} />
          </G>
        );
      case 'DOG':
        return (
          <G id="dog-features">
            {/* Cinnamoroll Long Floppy Sky Ears */}
            <Ellipse
              cx="52"
              cy="115"
              rx="18"
              ry="42"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              transform="rotate(22 52 115)"
            />
            <Ellipse
              cx="208"
              cy="115"
              rx="18"
              ry="42"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              transform="rotate(-22 208 115)"
            />
          </G>
        );
      case 'BIRD':
        return (
          <G id="bird-features">
            {/* Cute Head Feather Tuft */}
            <Path
              d="M 124 54 C 114 26 130 18 130 14 C 136 22 148 24 136 54 Z"
              fill="#FF2D78"
              stroke="#D81159"
              strokeWidth="2"
            />
            {/* Chubby Side Wings */}
            <Ellipse
              cx="58"
              cy="136"
              rx="14"
              ry="26"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              transform="rotate(18 58 136)"
            />
            <Ellipse
              cx="202"
              cy="136"
              rx="14"
              ry="26"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              transform="rotate(-18 202 136)"
            />
          </G>
        );
      case 'BUNNY':
        return (
          <G id="bunny-features">
            <Ellipse
              cx="98"
              cy="38"
              rx="15"
              ry="36"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              transform="rotate(-8 98 38)"
            />
            <Ellipse
              cx="98"
              cy="40"
              rx="8"
              ry="25"
              fill={palette.earInner}
              opacity={0.75}
              transform="rotate(-8 98 40)"
            />
            <Ellipse
              cx="162"
              cy="38"
              rx="15"
              ry="36"
              fill={palette.earOuter}
              stroke={palette.stroke}
              strokeWidth="3"
              transform="rotate(8 162 38)"
            />
            <Ellipse
              cx="162"
              cy="40"
              rx="8"
              ry="25"
              fill={palette.earInner}
              opacity={0.75}
              transform="rotate(8 162 40)"
            />
          </G>
        );
    }
  };

  const renderSpeciesNoseAndWhiskers = (type: PetType) => {
    switch (type) {
      case 'CAT':
        return (
          <G>
            <Line x1="55" y1="122" x2="80" y2="124" stroke="#F472B6" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="53" y1="131" x2="79" y2="130" stroke="#F472B6" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="205" y1="122" x2="180" y2="124" stroke="#F472B6" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="207" y1="131" x2="181" y2="130" stroke="#F472B6" strokeWidth="2.2" strokeLinecap="round" />
            <Path d="M 125 121 L 135 121 L 130 127 Z" fill="#FF2D78" />
          </G>
        );
      case 'DOG':
        return (
          <G>
            <Ellipse cx="130" cy="124" rx="12" ry="8.5" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
            <Ellipse cx="130" cy="121.5" rx="6" ry="4.5" fill="#0F172A" />
            <Circle cx="128.5" cy="120" r="1.5" fill="#FFFFFF" />
          </G>
        );
      case 'BIRD':
        return (
          <Path
            d="M 122 119 L 138 119 L 130 130 Z"
            fill="#FF2D78"
            stroke="#D81159"
            strokeWidth="1.5"
          />
        );
      case 'BUNNY':
        return (
          <G>
            <Ellipse cx="130" cy="122" rx="5.5" ry="4" fill="#FF2D78" />
            <Line x1="64" y1="125" x2="84" y2="126" stroke="#FF85B3" strokeWidth="2" strokeLinecap="round" />
            <Line x1="196" y1="125" x2="176" y2="126" stroke="#FF85B3" strokeWidth="2" strokeLinecap="round" />
          </G>
        );
    }
  };

  const renderAccessory = (acc: PetAccessory) => {
    switch (acc) {
      case 'CROWN':
        return (
          <G id="acc-crown" transform="translate(10, 0)">
            <Polygon
              points="98,55 103,32 112,44 120,28 128,44 137,32 142,55"
              fill="#FDE047"
              stroke="#EAB308"
              strokeWidth="2.2"
            />
            <Circle cx="120" cy="45" r="3.5" fill="#FF2D78" />
            <Circle cx="108" cy="48" r="2.5" fill="#38BDF8" />
            <Circle cx="132" cy="48" r="2.5" fill="#38BDF8" />
          </G>
        );
      case 'BOW':
        return (
          <G id="acc-bow" transform="translate(10, 0)">
            <Path
              d="M 120 54 C 98 34 92 66 120 56 C 148 66 142 34 120 54 Z"
              fill="#FF2D78"
              stroke="#D81159"
              strokeWidth="2.2"
            />
            <Circle cx="120" cy="54" r="5.5" fill="#FFE4EF" stroke="#D81159" strokeWidth="2" />
          </G>
        );
      case 'GLASSES':
        return (
          <G id="acc-glasses" transform="translate(10, 0)">
            <Rect x="76" y="95" width="36" height="22" rx="10" fill="rgba(56, 189, 248, 0.25)" stroke="#FF2D78" strokeWidth="3" />
            <Rect x="128" y="95" width="36" height="22" rx="10" fill="rgba(56, 189, 248, 0.25)" stroke="#FF2D78" strokeWidth="3" />
            <Line x1="112" y1="105" x2="128" y2="105" stroke="#FF2D78" strokeWidth="3" />
            <Line x1="83" y1="100" x2="91" y2="112" stroke="#FFFFFF" strokeWidth="2.5" opacity={0.85} />
            <Line x1="135" y1="100" x2="143" y2="112" stroke="#FFFFFF" strokeWidth="2.5" opacity={0.85} />
          </G>
        );
      case 'FLOWER':
        return (
          <G id="acc-flower" transform="translate(154, 48)">
            <Circle cx="0" cy="-8" r="6.5" fill="#FF85B3" />
            <Circle cx="8" cy="0" r="6.5" fill="#FF85B3" />
            <Circle cx="0" cy="8" r="6.5" fill="#FF85B3" />
            <Circle cx="-8" cy="0" r="6.5" fill="#FF85B3" />
            <Circle cx="0" cy="0" r="5.5" fill="#FFFFFF" stroke="#FF2D78" strokeWidth="1.5" />
          </G>
        );
      case 'SCARF':
        return (
          <G id="acc-scarf" transform="translate(10, 0)">
            <Path
              d="M 70 152 Q 120 168 170 152 Q 174 166 164 169 Q 120 183 76 169 Q 66 166 70 152 Z"
              fill="#FF2D78"
              stroke="#D81159"
              strokeWidth="2.2"
            />
            <Path
              d="M 138 162 L 152 191 L 134 193 L 128 165 Z"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="2"
            />
          </G>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePressPet}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            transform: [
              { translateY: bounceAnim },
              { scaleX: squishAnim },
              {
                scaleY: squishAnim.interpolate({
                  inputRange: [0.9, 1, 1.15],
                  outputRange: [1.08, 1, 0.9],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width="260" height="220" viewBox="0 0 260 220">
          <Defs>
            <LinearGradient id="stageBackdrop" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={pet.isSleeping ? '#1E293B' : '#E0F2FE'} />
              <Stop offset="100%" stopColor={pet.isSleeping ? '#31102F' : '#FFE4EF'} />
            </LinearGradient>
            <LinearGradient id="petBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={palette.topGrad} />
              <Stop offset="100%" stopColor={palette.botGrad} />
            </LinearGradient>
            <LinearGradient id="rugGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#BAE6FD" />
              <Stop offset="50%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#FFC2DF" />
            </LinearGradient>
          </Defs>

          {/* Soft Dreamy Sanctuary Arch Backdrop */}
          <Rect
            x="22"
            y="8"
            width="216"
            height="196"
            rx="98"
            fill="url(#stageBackdrop)"
            opacity={0.75}
          />
          {/* Floating Sparkles & Clouds in Backdrop */}
          <Circle cx="52" cy="48" r="10" fill="#FFFFFF" opacity={0.65} />
          <Circle cx="65" cy="46" r="13" fill="#FFFFFF" opacity={0.65} />
          <Circle cx="206" cy="52" r="11" fill="#FFFFFF" opacity={0.65} />
          <Circle cx="44" cy="96" r="3.5" fill="#FF2D78" opacity={0.5} />
          <Circle cx="216" cy="88" r="4" fill="#38BDF8" opacity={0.6} />

          {/* Plush Cloud Floor Rug */}
          <Ellipse
            cx="130"
            cy="192"
            rx="90"
            ry="17"
            fill="url(#rugGrad)"
            stroke="#BAE6FD"
            strokeWidth="2.5"
          />
          <Ellipse cx="130" cy="191" rx="64" ry="9" fill="#FFFFFF" opacity={0.85} />

          {/* Back Species Features */}
          {renderSpeciesFeatures(pet.petType)}

          {/* Kawaii Chubby Mochi Body */}
          <Path
            d="M 130 52 
               C 168 52, 186 82, 194 118 
               C 206 156, 196 190, 130 190 
               C 64 190, 54 156, 66 118 
               C 74 82, 92 52, 130 52 Z"
            fill="url(#petBodyGrad)"
            stroke={palette.stroke}
            strokeWidth="3.5"
          />

          {/* Fluffy Belly Patch */}
          <Ellipse
            cx="130"
            cy="146"
            rx="46"
            ry="33"
            fill={palette.belly}
            opacity={0.9}
          />

          {/* Cute Stubby Paws / Feet */}
          <Ellipse
            cx="94"
            cy="187"
            rx="15"
            ry="9"
            fill="#FFFFFF"
            stroke={palette.stroke}
            strokeWidth="2.5"
          />
          <Ellipse
            cx="166"
            cy="187"
            rx="15"
            ry="9"
            fill="#FFFFFF"
            stroke={palette.stroke}
            strokeWidth="2.5"
          />
          {/* Cute Little Side Arms */}
          <Ellipse
            cx="68"
            cy="138"
            rx="11"
            ry="7.5"
            fill="#FFFFFF"
            stroke={palette.stroke}
            strokeWidth="2.5"
            transform="rotate(-25 68 138)"
          />
          <Ellipse
            cx="192"
            cy="138"
            rx="11"
            ry="7.5"
            fill="#FFFFFF"
            stroke={palette.stroke}
            strokeWidth="2.5"
            transform="rotate(25 192 138)"
          />

          {/* Airbrushed Hot-Pink Kawaii Cheeks */}
          {!pet.isSleeping && (
            <G>
              <Ellipse cx="85" cy="124" rx="11.5" ry="7" fill="#FF2D78" opacity={0.35} />
              <Ellipse cx="175" cy="124" rx="11.5" ry="7" fill="#FF2D78" opacity={0.35} />
            </G>
          )}

          {/* Expressive Anime Eyes */}
          {pet.isSleeping ? (
            <G>
              <Path
                d="M 92 106 Q 104 116 116 106"
                stroke="#0F172A"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M 144 106 Q 156 116 168 106"
                stroke="#0F172A"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />
            </G>
          ) : isBlinking ? (
            <G>
              <Line
                x1="92"
                y1="106"
                x2="116"
                y2="106"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <Line
                x1="144"
                y1="106"
                x2="168"
                y2="106"
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </G>
          ) : isSad ? (
            <G>
              <Circle cx="104" cy="107" r="10.5" fill="#0F172A" />
              <Circle cx="156" cy="107" r="10.5" fill="#0F172A" />
              <Circle cx="101" cy="104" r="3.5" fill="#FFFFFF" />
              <Circle cx="153" cy="104" r="3.5" fill="#FFFFFF" />
              <Circle cx="107" cy="111" r="2.2" fill="#38BDF8" />
              <Circle cx="159" cy="111" r="2.2" fill="#38BDF8" />
            </G>
          ) : (
            <G>
              <Circle cx="104" cy="105" r="12.5" fill="#0F172A" />
              <Circle cx="156" cy="105" r="12.5" fill="#0F172A" />
              {/* Large Specular Glint */}
              <Circle cx="108" cy="100.5" r="4.5" fill="#FFFFFF" />
              <Circle cx="160" cy="100.5" r="4.5" fill="#FFFFFF" />
              {/* Bottom Sky/Pink Eye Sparkle */}
              <Circle cx="100" cy="109.5" r="2.3" fill="#7DD3FC" />
              <Circle cx="152" cy="109.5" r="2.3" fill="#7DD3FC" />
              {isHappy && (
                <>
                  <Circle cx="105" cy="107" r="2" fill="#FF85B3" />
                  <Circle cx="157" cy="107" r="2" fill="#FF85B3" />
                </>
              )}
            </G>
          )}

          {/* Nose & Whiskers */}
          {renderSpeciesNoseAndWhiskers(pet.petType)}

          {/* Mouth */}
          {pet.isSleeping ? (
            <Path
              d="M 124 134 Q 130 138 136 134"
              stroke="#0F172A"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : isSad ? (
            <Path
              d="M 120 140 Q 130 131 140 140"
              stroke="#0F172A"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
          ) : isHappy ? (
            <Path
              d="M 118 131 Q 130 146 142 131 Z"
              stroke="#0F172A"
              strokeWidth="2.5"
              fill="#FF2D78"
              strokeLinecap="round"
            />
          ) : (
            <Path
              d="M 121 132 Q 130 138 139 132"
              stroke="#0F172A"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Soap / Dust Bubbles when cleanliness < 75 */}
          {pet.cleanliness < 75 && (
            <G>
              <Circle cx="86" cy="156" r="6" fill="#BAE6FD" opacity={0.8} />
              <Circle cx="174" cy="152" r="5" fill="#BAE6FD" opacity={0.8} />
            </G>
          )}

          {/* Wearable Accessory */}
          {renderAccessory(pet.accessory || 'NONE')}
        </Svg>
      </Animated.View>

      {/* Floating Emoji Particle */}
      {activeParticle && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.particle,
            {
              opacity: particleAnim.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  translateY: particleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, -75],
                  }),
                },
                {
                  scale: particleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.6, 1.45, 1.15],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.particleText}>{activeParticle}</Text>
        </Animated.View>
      )}

      <View style={styles.tapPill}>
        <Text style={styles.tapHint}>✨ Tap {pet.petName} for belly rubs & cuddles 💕</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  animatedWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    top: 36,
  },
  particleText: {
    fontSize: 44,
  },
  tapPill: {
    backgroundColor: '#FFF0F6',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFC2DF',
    marginTop: 2,
  },
  tapHint: {
    fontSize: 11,
    color: COLORS.HotPink,
    fontWeight: '800',
  },
});
