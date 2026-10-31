import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeSpace } from '../../context/WeSpaceContext';
import { Header } from '../../components/common/Header';
import { COLORS } from '../../constants/theme';
import {
  Heart,
  Wallet,
  Sparkles,
  Camera,
  Headphones,
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
            tabBarActiveTintColor: COLORS.HotPink,
            tabBarInactiveTintColor: '#64748B',
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '800',
              marginTop: 3,
              letterSpacing: 0.2,
            },
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#DCEBFA',
              height: Platform.OS === 'ios' ? 84 : 70,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'ios' ? 24 : 10,
              elevation: 16,
              shadowColor: '#0284C7',
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <Heart size={19} color={color} fill={focused ? COLORS.HotPink : 'none'} />
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
                  <Wallet size={19} color={color} />
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
                  <Sparkles size={19} color={color} />
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
                  <Camera size={19} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="room"
            options={{
              title: 'Lounge',
              tabBarIcon: ({ color, focused }) => (
                <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                  <Headphones size={19} color={color} />
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
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  iconWrap: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
  },
  iconWrapActive: {
    backgroundColor: '#FFE4EF',
  },
});
