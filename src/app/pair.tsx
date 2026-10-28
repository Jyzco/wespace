import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeSpace } from '../context/WeSpaceContext';
import { CoupleState } from '../types';
import { COLORS, INITIAL_COUPLE } from '../constants/theme';
import { Heart, Sparkles, Lock, Calendar } from 'lucide-react-native';

export default function PairingScreen() {
  const { pairSuccess } = useWeSpace();

  const [partner1, setPartner1] = useState('Leo');
  const [partner2, setPartner2] = useState('Mia');
  const [code, setCode] = useState('882910');
  const [days, setDays] = useState('124');
  const [anniversary, setAnniversary] = useState('June 26, 2026');

  const handlePair = () => {
    const p1 = partner1.trim() || 'Leo';
    const p2 = partner2.trim() || 'Mia';
    const roomCode = code.trim() || '882910';
    const parsedDays = parseInt(days, 10) || 124;

    const newState: CoupleState = {
      ...INITIAL_COUPLE,
      coupleId: `ROOM_${roomCode}`,
      isPaired: true,
      partner1Name: p1,
      partner2Name: p2,
      pairingCode: roomCode,
      activeUser: p1,
      daysTogether: parsedDays,
      anniversaryDate: anniversary.trim() || 'June 26, 2026',
    };

    pairSuccess(newState);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[COLORS.SoftRose, '#FFF5F6']}
          style={styles.iconCircle}
        >
          <Heart size={42} color={COLORS.RoseCoral} fill={COLORS.RoseCoral} />
        </LinearGradient>

        <Text style={styles.brandTitle}>WeSpace</Text>
        <Text style={styles.tagline}>
          An intimate, private virtual sanctuary built exclusively for two hearts.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Sparkles size={18} color={COLORS.HoneyYellow} />
            <Text style={styles.cardTitle}>Link Your Sanctuary</Text>
          </View>

          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={partner1}
            onChangeText={setPartner1}
            placeholder="e.g. Leo"
            placeholderTextColor="#A89F98"
          />

          <Text style={styles.inputLabel}>Partner's Name</Text>
          <TextInput
            style={styles.input}
            value={partner2}
            onChangeText={setPartner2}
            placeholder="e.g. Mia"
            placeholderTextColor="#A89F98"
          />

          <Text style={styles.inputLabel}>Private Room Pairing Code</Text>
          <View style={styles.codeInputWrapper}>
            <Lock
              size={16}
              color={COLORS.WarmCharcoalMuted}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              placeholder="e.g. 882910"
              placeholderTextColor="#A89F98"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Days Together</Text>
              <TextInput
                style={styles.input}
                value={days}
                onChangeText={setDays}
                placeholder="124"
                keyboardType="numeric"
                placeholderTextColor="#A89F98"
              />
            </View>
            <View style={{ flex: 1.4 }}>
              <Text style={styles.inputLabel}>Anniversary Date</Text>
              <View style={styles.codeInputWrapper}>
                <Calendar
                  size={14}
                  color={COLORS.WarmCharcoalMuted}
                  style={{ marginRight: 6 }}
                />
                <TextInput
                  style={[styles.codeInput, { color: COLORS.WarmCharcoal, fontSize: 13 }]}
                  value={anniversary}
                  onChangeText={setAnniversary}
                  placeholder="June 26, 2026"
                  placeholderTextColor="#A89F98"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handlePair}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              Enter Our Sanctuary 💕
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          End-to-end Cozy • Procedural Tamagotchi • Gemini 3.8 AI Diary
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: 0.4,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
    paddingHorizontal: 18,
    lineHeight: 20,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.CozyCream,
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.WarmCharcoal,
    marginBottom: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  codeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  codeInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.RoseCoral,
    letterSpacing: 1,
  },
  submitButton: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  footerNote: {
    marginTop: 24,
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
});
