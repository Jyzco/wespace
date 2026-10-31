import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

interface HeartHugOverlayProps {
  visible: boolean;
  sender: string;
  onDismiss: () => void;
}

export const HeartHugOverlay: React.FC<HeartHugOverlayProps> = ({
  visible,
  sender,
  onDismiss,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {
        // Optional on web
      }

      const heartbeat = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.32,
            duration: 240,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.88,
            duration: 190,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.16,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 110,
            useNativeDriver: true,
          }),
        ])
      );
      heartbeat.start();

      const timer = setTimeout(() => {
        dismiss();
      }, 4500);

      return () => {
        heartbeat.stop();
        clearTimeout(timer);
      };
    } else {
      pulseAnim.setValue(1);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const dismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.touchArea}
        onPress={dismiss}
      >
        <Animated.View
          style={[
            styles.heartWrapper,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Svg width="170" height="170" viewBox="0 0 120 120">
            <Defs>
              <LinearGradient id="hugHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FF85B3" />
                <Stop offset="50%" stopColor="#FF2D78" />
                <Stop offset="100%" stopColor="#D81159" />
              </LinearGradient>
            </Defs>
            <Circle cx="60" cy="60" r="56" fill="#FF2D78" opacity={0.22} />
            <Circle cx="60" cy="60" r="44" fill="#38BDF8" opacity={0.18} />
            <Path
              d="M 60 100 
                 C 26 72, 10 54, 10 35 
                 C 10 18, 23 10, 39 10 
                 C 48 10, 56 15, 60 22 
                 C 64 15, 72 10, 81 10 
                 C 97 10, 110 18, 110 35 
                 C 110 54, 94 72, 60 100 Z"
              fill="url(#hugHeartGrad)"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            <Circle cx="38" cy="30" r="5" fill="#FFFFFF" opacity={0.65} />
          </Svg>
        </Animated.View>

        <View style={styles.pillTag}>
          <Text style={styles.pillTagText}>LIVE HEARTBEAT SYNC</Text>
        </View>
        <Text style={styles.title}>{sender} sent a Heart Hug! 💗</Text>
        <Text style={styles.subtitle}>
          Wrapping you in warm sky-blue & pink clouds across the distance
        </Text>
        <View style={styles.dismissPill}>
          <Text style={styles.tapToDismiss}>Tap anywhere to close ✨</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  heartWrapper: {
    marginBottom: 20,
    shadowColor: COLORS.HotPink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 24,
    elevation: 14,
  },
  pillTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderColor: '#7DD3FC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  pillTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7DD3FC',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0F2FE',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    maxWidth: 280,
  },
  dismissPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tapToDismiss: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BAE6FD',
    textAlign: 'center',
  },
});
