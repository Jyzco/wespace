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

export const PouPetCanvas: React.FC<PouPetCanvasProps> = ({
  pet,
  activeParticle,
  onPetTap,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const squishAnim = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  // Dynamic blinking loop every ~3.5s
  useEffect(() => {
    if (pet.isSleeping) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3500);
    return () => clearInterval(interval);
  }, [pet.isSleeping]);

  // Gentle breathing / idle float animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -7,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  // Particle animation when action triggered
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
            toValue: 1.09,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(squishAnim, {
            toValue: 0.94,
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
        toValue: 1.12,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.timing(squishAnim, {
        toValue: 0.92,
        duration: 130,
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

  const renderSpeciesFeatures = (type: PetType) => {
    switch (type) {
      case 'CAT':
        return (
          <G id="cat-features">
            {/* Pointed ears */}
            <Path d="M 68 78 L 46 34 L 92 58 Z" fill="#A67649" stroke="#6E4726" strokeWidth="2.5" />
            <Path d="M 69 72 L 54 42 L 85 59 Z" fill="#F9B4C2" />
            <Path d="M 172 78 L 194 34 L 148 58 Z" fill="#A67649" stroke="#6E4726" strokeWidth="2.5" />
            <Path d="M 171 72 L 186 42 L 155 59 Z" fill="#F9B4C2" />
          </G>
        );
      case 'DOG':
        return (
          <G id="dog-features">
            {/* Flappy rounded ears */}
            <Ellipse
              cx="56"
              cy="102"
              rx="16"
              ry="35"
              fill="#7E5129"
              stroke="#5A381B"
              strokeWidth="2.5"
              transform="rotate(-18 56 102)"
            />
            <Ellipse
              cx="184"
              cy="102"
              rx="16"
              ry="35"
              fill="#7E5129"
              stroke="#5A381B"
              strokeWidth="2.5"
              transform="rotate(18 184 102)"
            />
          </G>
        );
      case 'BIRD':
        return (
          <G id="bird-features">
            {/* Golden tuft */}
            <Path
              d="M 114 50 C 106 24 120 18 120 14 C 125 22 136 22 126 50 Z"
              fill="#F4B942"
              stroke="#B47B15"
              strokeWidth="2"
            />
            {/* Side mini wings */}
            <Ellipse
              cx="54"
              cy="134"
              rx="12"
              ry="22"
              fill="#B38354"
              stroke="#7A5430"
              strokeWidth="2.5"
              transform="rotate(-22 54 134)"
            />
            <Ellipse
              cx="186"
              cy="134"
              rx="12"
              ry="22"
              fill="#B38354"
              stroke="#7A5430"
              strokeWidth="2.5"
              transform="rotate(22 186 134)"
            />
          </G>
        );
      case 'BUNNY':
        return (
          <G id="bunny-features">
            {/* Tall vertical bunny ears */}
            <Ellipse
              cx="88"
              cy="38"
              rx="13"
              ry="32"
              fill="#C99E70"
              stroke="#7A5430"
              strokeWidth="2.5"
              transform="rotate(-6 88 38)"
            />
            <Ellipse
              cx="88"
              cy="39"
              rx="7.5"
              ry="23"
              fill="#F9B4C2"
              transform="rotate(-6 88 39)"
            />
            <Ellipse
              cx="152"
              cy="38"
              rx="13"
              ry="32"
              fill="#C99E70"
              stroke="#7A5430"
              strokeWidth="2.5"
              transform="rotate(6 152 38)"
            />
            <Ellipse
              cx="152"
              cy="39"
              rx="7.5"
              ry="23"
              fill="#F9B4C2"
              transform="rotate(6 152 39)"
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
            <Line x1="48" y1="122" x2="82" y2="123" stroke="#5A381B" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="46" y1="130" x2="81" y2="128" stroke="#5A381B" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="50" y1="138" x2="82" y2="133" stroke="#5A381B" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="192" y1="122" x2="158" y2="123" stroke="#5A381B" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="194" y1="130" x2="159" y2="128" stroke="#5A381B" strokeWidth="2.2" strokeLinecap="round" />
            <Line x1="190" y1="138" x2="158" y2="133" stroke="#5A381B" strokeWidth="2.2" strokeLinecap="round" />
            <Path d="M 114 120 L 126 120 L 120 127 Z" fill="#EE5D6C" />
          </G>
        );
      case 'DOG':
        return (
          <G>
            <Ellipse cx="120" cy="124" rx="13" ry="9" fill="#EAD6C0" />
            <Ellipse cx="120" cy="121" rx="8" ry="5.5" fill="#2A2421" />
            <Circle cx="118" cy="119.5" r="1.8" fill="#FFFFFF" />
          </G>
        );
      case 'BIRD':
        return (
          <Path
            d="M 112 118 L 128 118 L 120 130 Z"
            fill="#FF8C00"
            stroke="#C25E00"
            strokeWidth="1.5"
          />
        );
      case 'BUNNY':
        return (
          <G>
            <Ellipse cx="120" cy="122" rx="5.5" ry="4" fill="#EE5D6C" />
            <Line x1="60" y1="124" x2="84" y2="125" stroke="#6E4726" strokeWidth="1.8" strokeLinecap="round" />
            <Line x1="180" y1="124" x2="156" y2="125" stroke="#6E4726" strokeWidth="1.8" strokeLinecap="round" />
          </G>
        );
    }
  };

  const renderAccessory = (acc: PetAccessory) => {
    switch (acc) {
      case 'CROWN':
        return (
          <G id="acc-crown">
            <Polygon
              points="98,55 103,34 112,45 120,30 128,45 137,34 142,55"
              fill="#FFD54F"
              stroke="#B47B15"
              strokeWidth="2"
            />
            <Circle cx="120" cy="46" r="3" fill="#EE5D6C" />
            <Circle cx="108" cy="49" r="2" fill="#5EB1EF" />
            <Circle cx="132" cy="49" r="2" fill="#5EB1EF" />
          </G>
        );
      case 'BOW':
        return (
          <G id="acc-bow">
            <Path
              d="M 120 54 C 102 38 96 64 120 56 C 144 64 138 38 120 54 Z"
              fill="#EE5D6C"
              stroke="#B83242"
              strokeWidth="2"
            />
            <Circle cx="120" cy="54" r="5" fill="#FF8DA1" stroke="#B83242" strokeWidth="1.5" />
          </G>
        );
      case 'GLASSES':
        return (
          <G id="acc-glasses">
            <Rect x="78" y="96" width="34" height="20" rx="6" fill="#1E293B" stroke="#F4B942" strokeWidth="2.5" />
            <Rect x="128" y="96" width="34" height="20" rx="6" fill="#1E293B" stroke="#F4B942" strokeWidth="2.5" />
            <Line x1="112" y1="104" x2="128" y2="104" stroke="#F4B942" strokeWidth="2.5" />
            <Line x1="84" y1="101" x2="92" y2="111" stroke="#FFFFFF" strokeWidth="2" opacity={0.6} />
            <Line x1="134" y1="101" x2="142" y2="111" stroke="#FFFFFF" strokeWidth="2" opacity={0.6} />
          </G>
        );
      case 'FLOWER':
        return (
          <G id="acc-flower" transform="translate(142, 46)">
            <Circle cx="0" cy="-7" r="6" fill="#FF8DA1" />
            <Circle cx="7" cy="0" r="6" fill="#FF8DA1" />
            <Circle cx="0" cy="7" r="6" fill="#FF8DA1" />
            <Circle cx="-7" cy="0" r="6" fill="#FF8DA1" />
            <Circle cx="0" cy="0" r="5" fill="#FFD54F" />
          </G>
        );
      case 'SCARF':
        return (
          <G id="acc-scarf">
            <Path
              d="M 72 152 Q 120 168 168 152 Q 172 165 164 168 Q 120 182 76 168 Q 68 165 72 152 Z"
              fill="#EE5D6C"
              stroke="#B83242"
              strokeWidth="2"
            />
            <Path
              d="M 140 162 L 154 190 L 136 192 L 130 165 Z"
              fill="#D14353"
              stroke="#B83242"
              strokeWidth="1.8"
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
        <Svg width="240" height="215" viewBox="0 0 240 215">
          <Defs>
            <LinearGradient id="petBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={pet.isSleeping ? '#D8C3B0' : '#D9AE82'}
              />
              <Stop
                offset="100%"
                stopColor={pet.isSleeping ? '#B59B84' : '#B58150'}
              />
            </LinearGradient>
            <LinearGradient id="rugGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFE4E6" />
              <Stop offset="50%" stopColor="#FECDD3" />
              <Stop offset="100%" stopColor="#FFE4E6" />
            </LinearGradient>
          </Defs>

          {/* Cozy Nursery Floor Rug */}
          <Ellipse
            cx="120"
            cy="192"
            rx="84"
            ry="16"
            fill="url(#rugGrad)"
            stroke="#FDA4AF"
            strokeWidth="2"
          />
          <Ellipse cx="120" cy="190" rx="60" ry="9" fill="#FFF1F2" opacity={0.7} />

          {/* Back Species Features */}
          {renderSpeciesFeatures(pet.petType)}

          {/* Pou Potato-Bean Body (Cubic Beziers) */}
          <Path
            d="M 120 52 
               C 158 52, 174 82, 184 116 
               C 196 154, 188 190, 120 190 
               C 52 190, 44 154, 56 116 
               C 66 82, 82 52, 120 52 Z"
            fill="url(#petBodyGrad)"
            stroke="#6E4726"
            strokeWidth="3.5"
          />

          {/* Soft Cream Belly Patch */}
          <Ellipse
            cx="120"
            cy="144"
            rx="46"
            ry="34"
            fill={pet.isSleeping ? '#EFE6DD' : '#F4DFC8'}
            opacity={0.78}
          />

          {/* Rosy Cheeks */}
          {!pet.isSleeping && (
            <G>
              <Ellipse cx="78" cy="126" rx="10" ry="6.5" fill="#F472B6" opacity={0.55} />
              <Ellipse cx="162" cy="126" rx="10" ry="6.5" fill="#F472B6" opacity={0.55} />
            </G>
          )}

          {/* Eyes */}
          {pet.isSleeping ? (
            <G>
              <Path
                d="M 84 106 Q 95 116 106 106"
                stroke="#2A2421"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />
              <Path
                d="M 134 106 Q 145 116 156 106"
                stroke="#2A2421"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />
            </G>
          ) : isBlinking ? (
            <G>
              <Line
                x1="84"
                y1="106"
                x2="106"
                y2="106"
                stroke="#2A2421"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <Line
                x1="134"
                y1="106"
                x2="156"
                y2="106"
                stroke="#2A2421"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </G>
          ) : isSad ? (
            <G>
              <Circle cx="95" cy="107" r="9.5" fill="#2A2421" />
              <Circle cx="145" cy="107" r="9.5" fill="#2A2421" />
              <Circle cx="92" cy="104" r="2.8" fill="#FFFFFF" />
              <Circle cx="142" cy="104" r="2.8" fill="#FFFFFF" />
              <Path d="M 82 95 L 106 99" stroke="#5A381B" strokeWidth="2.8" strokeLinecap="round" />
              <Path d="M 158 95 L 134 99" stroke="#5A381B" strokeWidth="2.8" strokeLinecap="round" />
            </G>
          ) : (
            <G>
              <Circle cx="95" cy="105" r="11.5" fill="#2A2421" />
              <Circle cx="145" cy="105" r="11.5" fill="#2A2421" />
              <Circle cx="98.5" cy="101" r="4" fill="#FFFFFF" />
              <Circle cx="148.5" cy="101" r="4" fill="#FFFFFF" />
              {isHappy && (
                <>
                  <Circle cx="91.5" cy="109" r="2" fill="#FFFFFF" />
                  <Circle cx="141.5" cy="109" r="2" fill="#FFFFFF" />
                </>
              )}
            </G>
          )}

          {/* Nose & Whiskers */}
          {renderSpeciesNoseAndWhiskers(pet.petType)}

          {/* Mouth */}
          {pet.isSleeping ? (
            <Path
              d="M 113 135 Q 120 139 127 135"
              stroke="#4A3B32"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : isSad ? (
            <Path
              d="M 110 142 Q 120 132 130 142"
              stroke="#4A3B32"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          ) : isHappy ? (
            <Path
              d="M 106 132 Q 120 148 134 132 Z"
              stroke="#4A3B32"
              strokeWidth="2.8"
              fill="#EE5D6C"
              strokeLinecap="round"
            />
          ) : (
            <Path
              d="M 110 134 Q 120 141 130 134"
              stroke="#4A3B32"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Dirt Splotches when cleanliness < 75 */}
          {pet.cleanliness < 75 && (
            <G>
              <Path
                d="M 78 158 C 72 154 64 160 69 165 C 74 170 84 165 78 158 Z"
                fill="#6B4E31"
                opacity={0.82}
              />
              <Circle cx="65" cy="150" r="3.5" fill="#6B4E31" opacity={0.75} />
              <Path
                d="M 158 154 C 165 150 172 157 167 162 C 162 167 153 160 158 154 Z"
                fill="#6B4E31"
                opacity={0.82}
              />
            </G>
          )}

          {pet.cleanliness < 45 && (
            <G>
              <Circle cx="102" cy="74" r="4.5" fill="#5A3E24" opacity={0.82} />
              <Circle cx="142" cy="78" r="4" fill="#5A3E24" opacity={0.82} />
              <Path d="M 114 166 C 110 161 128 159 124 168 Z" fill="#5A3E24" opacity={0.85} />
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

      <Text style={styles.tapHint}>Tap {pet.petName} for belly rubs 💕</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  animatedWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    top: 40,
  },
  particleText: {
    fontSize: 42,
  },
  tapHint: {
    fontSize: 11,
    color: COLORS.WarmCharcoalLight,
    fontWeight: '600',
    marginTop: -4,
  },
});
