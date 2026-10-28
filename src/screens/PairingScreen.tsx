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
import { CoupleState } from '../types';
import { COLORS } from '../constants/theme';
import { Heart, Sparkles, Lock } from 'lucide-react-native';

interface PairingScreenProps {
  onPairSuccess: (state: CoupleState) => void;
}

export const PairingScreen: React.FC<PairingScreenProps> = ({ onPairSuccess }) => {
  const [partner1, setPartner1] = useState('Leo');
  const [partner2, setPartner2] = useState('Mia');
  const [code, setCode] = useState('882910');
  const [days, setDays] = useState('124');

  const handlePair = () => {
    const p1 = partner1.trim() || 'Leo';
    const p2 = partner2.trim() || 'Mia';
    const roomCode = code.trim() || 'ROOM_123456';
    const parsedDays = parseInt(days, 10) || 100;

    const newState: CoupleState = {
      coupleId: `ROOM_${roomCode}`,
      isPaired: true,
      partner1Name: p1,
      partner2Name: p2,
      pairingCode: roomCode,
      activeUser: p1,
      daysTogether: parsedDays,
    };

    onPairSuccess(newState);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo / Badge */}
        <View style={styles.iconCircle}>
          <Heart size={44} color={COLORS.RoseCoral} fill={COLORS.RoseCoral} />
        </View>

        <Text style={styles.brandTitle}>WeSpace</Text>
        <Text style={styles.tagline}>
          An intimate, private sanctuary built exclusively for two.
        </Text>

        {/* Pairing Form Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Sparkles size={18} color={COLORS.HoneyYellow} />
            <Text style={styles.cardTitle}>Pair Your Sanctuary</Text>
          </View>

          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={partner1}
            onChangeText={setPartner1}
            placeholder="e.g. Leo"
            placeholderTextColor="#AAA"
          />

          <Text style={styles.inputLabel}>Partner's Name</Text>
          <TextInput
            style={styles.input}
            value={partner2}
            onChangeText={setPartner2}
            placeholder="e.g. Mia"
            placeholderTextColor="#AAA"
          />

          <Text style={styles.inputLabel}>Room Code (Share this with partner)</Text>
          <View style={styles.codeInputWrapper}>
            <Lock size={16} color={COLORS.WarmCharcoalMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              placeholder="e.g. 882910"
              placeholderTextColor="#AAA"
              autoCapitalize="characters"
            />
          </View>

          <Text style={styles.inputLabel}>Days Together</Text>
          <TextInput
            style={styles.input}
            value={days}
            onChangeText={setDays}
            placeholder="e.g. 124"
            keyboardType="numeric"
            placeholderTextColor="#AAA"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handlePair}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Enter Our Sanctuary 💕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          End-to-end private • Procedural Tamagotchi • Live Locket Snaps
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.SoftRose,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.RoseCoral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.CozyCream,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
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
  codeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  codeInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.RoseCoral,
    letterSpacing: 1,
  },
  submitButton: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.RoseCoral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    marginTop: 28,
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'center',
  },
});
