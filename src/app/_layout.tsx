import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { WeSpaceProvider, useWeSpace } from '../context/WeSpaceContext';
import { HeartHugOverlay } from '../components/common/HeartHugOverlay';
import { COLORS } from '../constants/theme';

function RootNavigator() {
  const {
    loading,
    heartHugVisible,
    heartHugSender,
    dismissHeartHug,
  } = useWeSpace();
  const { width, height } = useWindowDimensions();
  const isDesktop = width > 520;

  if (loading) {
    return (
      <LinearGradient
        colors={['#E0F2FE', '#FFFFFF', '#FFE4EF']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={COLORS.HotPink} />
        <Text style={styles.loadingTitle}>WeSpace Sanctuary</Text>
        <Text style={styles.loadingSubtitle}>Preparing your private sky & blush world...</Text>
      </LinearGradient>
    );
  }

  const appContent = (
    <View style={[styles.appViewport, isDesktop && styles.desktopPhoneFrame]}>
      <StatusBar style="dark" />
      {isDesktop && (
        <View style={styles.dynamicIslandBar}>
          <View style={styles.dynamicIslandPill} />
        </View>
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pair"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="love-letters"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="date-jar"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>

      <HeartHugOverlay
        visible={heartHugVisible}
        sender={heartHugSender}
        onDismiss={dismissHeartHug}
      />
    </View>
  );

  if (isDesktop) {
    return (
      <LinearGradient
        colors={['#D8EEFE', '#F4F9FF', '#FFE4F0', '#E0F2FE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.desktopStage, { minHeight: height }]}
      >
        {/* Decorative Ambient Studio Orbs */}
        <View style={styles.orbBlue} pointerEvents="none" />
        <View style={styles.orbPink} pointerEvents="none" />
        {appContent}
      </LinearGradient>
    );
  }

  return appContent;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WeSpaceProvider>
        <RootNavigator />
      </WeSpaceProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  desktopStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  orbBlue: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#7DD3FC',
    opacity: 0.28,
  },
  orbPink: {
    position: 'absolute',
    bottom: -90,
    right: -80,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: '#FF85B3',
    opacity: 0.25,
  },
  appViewport: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.GradientStart,
    overflow: 'hidden',
  },
  desktopPhoneFrame: {
    maxWidth: 434,
    maxHeight: 890,
    borderRadius: 44,
    borderWidth: 8,
    borderColor: '#FFFFFF',
    backgroundColor: COLORS.GradientStart,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 24,
  },
  dynamicIslandBar: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
  },
  dynamicIslandPill: {
    width: 96,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: -0.4,
  },
  loadingSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.WarmCharcoalMuted,
    fontWeight: '600',
  },
});
