import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';

interface HeartHugOverlayProps {
  visible: boolean;
  sender: string;
  onDismiss: () => void;
}

const { width, height } = Dimensions.get('window');

export const HeartHugOverlay: React.FC<HeartHugOverlayProps> = ({
  visible,
  sender,
  onDismiss,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Trigger soft haptic
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {
        // Haptics optional on web/simulator
      }

      // Heartbeat pulse loop (700ms)
      const heartbeat = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.35,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.85,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      );
      heartbeat.start();

      // Auto dismiss after 4.5 seconds
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
        activeOpacity={0.9}
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
          <Svg width="150" height="150" viewBox="0 0 100 100">
            <Path
              d="M 50 88 
                 C 20 62, 5 45, 5 28 
                 C 5 12, 17 5, 32 5 
                 C 40 5, 47 10, 50 16 
                 C 53 10, 60 5, 68 5 
                 C 83 5, 95 12, 95 28 
                 C 95 45, 80 62, 50 88 Z"
              fill={COLORS.RoseCoral}
            />
          </Svg>
        </Animated.View>

        <Text style={styles.title}>{sender} sent you a Heart Hug! 💕</Text>
        <Text style={styles.subtitle}>Feeling your warmth across the screen</Text>
        <Text style={styles.tapToDismiss}>Tap anywhere to close</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(42, 36, 33, 0.92)', // #2A2421 at 92% opacity
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heartWrapper: {
    marginBottom: 28,
    shadowColor: COLORS.RoseCoral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#FFEcef',
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: 32,
  },
  tapToDismiss: {
    fontSize: 13,
    color: '#A09893',
    textAlign: 'center',
  },
});
