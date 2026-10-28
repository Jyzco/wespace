import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  G,
  Line,
} from 'react-native-svg';
import { PetState, PetType } from '../../types';
import { COLORS } from '../../constants/theme';

interface PouPetCanvasProps {
  pet: PetState;
  activeParticle?: string | null;
}

export const PouPetCanvas: React.FC<PouPetCanvasProps> = ({ pet, activeParticle }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  // Blinking loop every ~3.5s
  useEffect(() => {
    if (pet.isSleeping) return;

    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3500);

    return () => clearInterval(interval);
  }, [pet.isSleeping]);

  // Gentle breathing / idle bounce animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  // Particle animation when action triggered
  useEffect(() => {
    if (activeParticle) {
      particleAnim.setValue(0);
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }).start();
    }
  }, [activeParticle, particleAnim]);

  // Expressions logic based on blueprint
  const isSad = pet.health < 35 || pet.happiness < 35;
  const isHappy = pet.happiness > 70 && !isSad;

  // Potato body color (warm caramel mocha)
  const bodyColor = pet.isSleeping ? '#D8C6B6' : '#C49A6C';
  const bellyColor = pet.isSleeping ? '#E8DDD2' : '#DEC19C';

  // Render Ears / Head features by species
  const renderSpeciesFeatures = (type: PetType) => {
    switch (type) {
      case 'CAT':
        return (
          <G id="cat-ears">
            {/* Left ear */}
            <Path d="M 45 65 L 25 25 L 68 45 Z" fill="#A8794E" />
            <Path d="M 45 60 L 32 32 L 62 47 Z" fill="#F8B4C0" />
            {/* Right ear */}
            <Path d="M 135 65 L 155 25 L 112 45 Z" fill="#A8794E" />
            <Path d="M 135 60 L 148 32 L 118 47 Z" fill="#F8B4C0" />
            {/* Whiskers */}
            <Line x1="30" y1="108" x2="65" y2="108" stroke="#5D3A1A" strokeWidth="2" />
            <Line x1="32" y1="115" x2="65" y2="112" stroke="#5D3A1A" strokeWidth="2" />
            <Line x1="30" y1="122" x2="65" y2="116" stroke="#5D3A1A" strokeWidth="2" />
            <Line x1="170" y1="108" x2="135" y2="108" stroke="#5D3A1A" strokeWidth="2" />
            <Line x1="168" y1="115" x2="135" y2="112" stroke="#5D3A1A" strokeWidth="2" />
            <Line x1="170" y1="122" x2="135" y2="116" stroke="#5D3A1A" strokeWidth="2" />
            {/* Nose */}
            <Path d="M 95 106 L 105 106 L 100 112 Z" fill="#EE5D6C" />
          </G>
        );

      case 'DOG':
        return (
          <G id="dog-ears">
            {/* Left flappy ear */}
            <Ellipse cx="38" cy="85" rx="14" ry="32" fill="#8B5A2B" transform="rotate(-15 38 85)" />
            {/* Right flappy ear */}
            <Ellipse cx="162" cy="85" rx="14" ry="32" fill="#8B5A2B" transform="rotate(15 162 85)" />
            {/* Dark snout oval */}
            <Ellipse cx="100" cy="110" rx="9" ry="6" fill="#2A2421" />
          </G>
        );

      case 'BIRD':
        return (
          <G id="bird-tuft-and-beak">
            {/* Golden top tuft */}
            <Path d="M 95 38 C 90 18 100 14 100 12 C 102 18 112 18 105 38 Z" fill="#F4B942" />
            {/* Mini wings */}
            <Ellipse cx="38" cy="120" rx="10" ry="18" fill="#B38656" transform="rotate(-20 38 120)" />
            <Ellipse cx="162" cy="120" rx="10" ry="18" fill="#B38656" transform="rotate(20 162 120)" />
            {/* Triangular orange beak */}
            <Path d="M 93 105 L 107 105 L 100 116 Z" fill="#FF8C00" />
          </G>
        );

      case 'BUNNY':
        return (
          <G id="bunny-ears">
            {/* Tall vertical rounded ears */}
            <Ellipse cx="68" cy="28" rx="12" ry="26" fill="#C49A6C" />
            <Ellipse cx="68" cy="28" rx="7" ry="20" fill="#F8B4C0" />
            <Ellipse cx="132" cy="28" rx="12" ry="26" fill="#C49A6C" />
            <Ellipse cx="132" cy="28" rx="7" ry="20" fill="#F8B4C0" />
            {/* Soft pink nose circle */}
            <Circle cx="100" cy="108" r="4.5" fill="#EE5D6C" />
          </G>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            transform: [{ translateY: bounceAnim }],
          },
        ]}
      >
        <Svg width="200" height="190" viewBox="0 0 200 190">
          {/* Species specific back layer (ears, tufts) */}
          {renderSpeciesFeatures(pet.petType)}

          {/* Distinctive Pou-like potato-bean body shape (narrower top, flared round bottom) */}
          <Path
            d="M 100 42 
               C 135 42, 150 70, 160 100 
               C 172 135, 165 170, 100 170 
               C 35 170, 28 135, 40 100 
               C 50 70, 65 42, 100 42 Z"
            fill={bodyColor}
            stroke="#8C6642"
            strokeWidth="3.5"
          />

          {/* Soft lighter belly patch */}
          <Ellipse cx="100" cy="125" rx="42" ry="32" fill={bellyColor} opacity={0.65} />

          {/* Cheek blush */}
          {!pet.isSleeping && (
            <G id="blush">
              <Circle cx="62" cy="115" r="7.5" fill="#F8B4C0" opacity={0.6} />
              <Circle cx="138" cy="115" r="7.5" fill="#F8B4C0" opacity={0.6} />
            </G>
          )}

          {/* Eyes rendering */}
          {pet.isSleeping ? (
            // Sleeping eyes: curved arcs
            <G id="sleeping-eyes">
              <Path d="M 68 94 Q 78 104 88 94" stroke="#2A2421" strokeWidth="3" fill="none" strokeLinecap="round" />
              <Path d="M 112 94 Q 122 104 132 94" stroke="#2A2421" strokeWidth="3" fill="none" strokeLinecap="round" />
            </G>
          ) : isBlinking ? (
            // Blinking eyes: flat slit
            <G id="blinking-eyes">
              <Line x1="68" y1="94" x2="88" y2="94" stroke="#2A2421" strokeWidth="3.5" strokeLinecap="round" />
              <Line x1="112" y1="94" x2="132" y2="94" stroke="#2A2421" strokeWidth="3.5" strokeLinecap="round" />
            </G>
          ) : isSad ? (
            // Sad drooped eyes
            <G id="sad-eyes">
              <Circle cx="78" cy="94" r="8" fill="#2A2421" />
              <Circle cx="122" cy="94" r="8" fill="#2A2421" />
              <Path d="M 66 84 L 88 88" stroke="#5D3A1A" strokeWidth="2.5" strokeLinecap="round" />
              <Path d="M 134 84 L 112 88" stroke="#5D3A1A" strokeWidth="2.5" strokeLinecap="round" />
            </G>
          ) : (
            // Open, lively eyes
            <G id="happy-eyes">
              <Circle cx="78" cy="92" r="10.5" fill="#2A2421" />
              <Circle cx="122" cy="92" r="10.5" fill="#2A2421" />
              {/* Specular glints */}
              <Circle cx="81" cy="89" r="3.5" fill="#FFFFFF" />
              <Circle cx="125" cy="89" r="3.5" fill="#FFFFFF" />
              {isHappy && (
                <>
                  <Circle cx="76" cy="95" r="1.8" fill="#FFFFFF" />
                  <Circle cx="120" cy="95" r="1.8" fill="#FFFFFF" />
                </>
              )}
            </G>
          )}

          {/* Mouth rendering */}
          {pet.isSleeping ? (
            <Path d="M 94 122 Q 100 126 106 122" stroke="#4A3B32" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          ) : isSad ? (
            // Downturned sad mouth
            <Path d="M 92 128 Q 100 120 108 128" stroke="#4A3B32" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : isHappy ? (
            // Wide happy smile
            <Path d="M 88 120 Q 100 134 112 120" stroke="#4A3B32" strokeWidth="3" fill="#EE5D6C" strokeLinecap="round" />
          ) : (
            // Calm neutral gentle smile
            <Path d="M 92 122 Q 100 128 108 122" stroke="#4A3B32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {/* Dirt / Mud Splotches when cleanliness < 75 */}
          {pet.cleanliness < 75 && (
            <G id="dirt-splotches">
              <Path d="M 64 142 C 60 139 52 144 56 148 C 60 152 70 148 64 142 Z" fill="#6B4E31" opacity={0.8} />
              <Circle cx="50" cy="135" r="3" fill="#6B4E31" opacity={0.7} />
              <Path d="M 136 138 C 142 135 148 141 144 146 C 140 150 132 144 136 138 Z" fill="#6B4E31" opacity={0.8} />
            </G>
          )}

          {/* Extra dirt when cleanliness < 45 */}
          {pet.cleanliness < 45 && (
            <G id="extra-dirt">
              <Circle cx="84" cy="62" r="4" fill="#5A3E24" opacity={0.8} />
              <Circle cx="120" cy="66" r="3.5" fill="#5A3E24" opacity={0.8} />
              <Path d="M 96 148 C 92 144 108 142 104 150 Z" fill="#5A3E24" opacity={0.8} />
            </G>
          )}
        </Svg>
      </Animated.View>

      {/* Floating Emoji Particles */}
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
                    outputRange: [20, -70],
                  }),
                },
                {
                  scale: particleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.6, 1.4, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.particleText}>{activeParticle}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 195,
    marginVertical: 4,
  },
  animatedWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    top: 50,
  },
  particleText: {
    fontSize: 40,
  },
});
