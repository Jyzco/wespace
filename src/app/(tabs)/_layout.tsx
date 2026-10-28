import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeSpace } from '../../context/WeSpaceContext';
import { Header } from '../../components/common/Header';
import { COLORS } from '../../constants/theme';
import {
  Home,
  Wallet,
  Smile,
  BookOpen,
  Flame,
} from 'lucide-react-native';

export default function TabsLayout() {
  const { couple } = useWeSpace();

  useEffect(() => {
    if (!couple.isPaired) {
      router.replace('/pair');
    }
  }, [couple.isPaired]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <View style={styles.contentWrapper}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.RoseCoral,
            tabBarInactiveTintColor: COLORS.WarmCharcoalLight,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '800',
              marginTop: 2,
              letterSpacing: 0.2,
            },
            tabBarStyle: {
              backgroundColor: COLORS.CozyCream,
              borderTopWidth: 1,
              borderTopColor: COLORS.ShadowBeige,
              height: Platform.OS === 'ios' ? 84 : 68,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'ios' ? 24 : 10,
              elevation: 14,
              shadowColor: '#2A2421',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Sanctuary',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <Home size={20} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="treasury"
            options={{
              title: 'Treasury',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <Wallet size={20} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="pet"
            options={{
              title: 'Companion',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <Smile size={20} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="scrapbook"
            options={{
              title: 'Scrapbook',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <BookOpen size={20} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="room"
            options={{
              title: 'Living Room',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <Flame size={20} color={color} />
                </View>
              ),
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.CozyCream,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  iconWrapActive: {
    backgroundColor: COLORS.SoftRose,
  },
});
