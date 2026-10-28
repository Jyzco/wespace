import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.RoseCoral} />
        <Text style={styles.loadingTitle}>WeSpace Sanctuary</Text>
        <Text style={styles.loadingSubtitle}>Preparing your cozy corner...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
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
  root: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.CozyCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  loadingSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.WarmCharcoalMuted,
  },
});
