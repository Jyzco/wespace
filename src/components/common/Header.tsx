import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useWeSpace } from '../../context/WeSpaceContext';
import { COLORS, MOOD_META } from '../../constants/theme';
import {
  RefreshCw,
  Settings,
  HeartHandshake,
  LogOut,
  X,
  Mail,
  Sparkles,
} from 'lucide-react-native';

export const Header: React.FC = () => {
  const {
    couple,
    letters,
    switchUser,
    updateApiKey,
    unpair,
  } = useWeSpace();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(couple.geminiApiKey || '');

  const isP1 = couple.activeUser === couple.partner1Name;
  const activeMood = isP1 ? couple.partner1Mood : couple.partner2Mood;
  const moodInfo = MOOD_META[activeMood] || MOOD_META.AFFECTIONATE;
  const partnerName = isP1 ? couple.partner2Name : couple.partner1Name;

  const unreadLetters = letters.filter(
    (l) => !l.isRead && l.recipient === couple.activeUser
  ).length;

  const handleSaveKey = () => {
    updateApiKey(apiKeyInput.trim());
    setSettingsOpen(false);
  };

  const handleUnpair = async () => {
    setSettingsOpen(false);
    await unpair();
    router.replace('/pair');
  };

  return (
    <View style={styles.headerContainer}>
      {/* Left: Live Sync + Couple Names */}
      <View style={styles.leftRow}>
        <View style={styles.syncBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.syncText}>SYNC</Text>
        </View>
        <View>
          <Text style={styles.coupleNames}>
            {couple.partner1Name} <Text style={{ color: COLORS.RoseCoral }}>♥</Text>{' '}
            {couple.partner2Name}
          </Text>
          <Text style={styles.roomSub}>Sanctuary #{couple.pairingCode}</Text>
        </View>
      </View>

      {/* Right: Quick Action Pills + Switch User + Settings */}
      <View style={styles.rightRow}>
        {/* Love Letters Modal Shortcut */}
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.push('/love-letters')}
          activeOpacity={0.75}
        >
          <Mail size={16} color={COLORS.RoseCoral} />
          {unreadLetters > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadLetters}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Date Jar Modal Shortcut */}
        <TouchableOpacity
          style={[styles.iconCircle, { backgroundColor: COLORS.LightBlueSoft }]}
          onPress={() => router.push('/date-jar')}
          activeOpacity={0.75}
        >
          <Sparkles size={16} color={COLORS.WhatsAppTeal} />
        </TouchableOpacity>

        {/* Switch Profile Button */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={switchUser}
          activeOpacity={0.75}
        >
          <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
          <Text style={styles.activeUserBadge}>{couple.activeUser}</Text>
          <RefreshCw
            size={11}
            color={COLORS.RoseCoral}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => {
            setApiKeyInput(couple.geminiApiKey || '');
            setSettingsOpen(true);
          }}
          activeOpacity={0.75}
        >
          <Settings size={16} color={COLORS.WarmCharcoal} />
        </TouchableOpacity>
      </View>

      {/* Settings & Gemini API Key Modal */}
      <Modal
        visible={settingsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <HeartHandshake size={20} color={COLORS.RoseCoral} />
                <Text style={styles.modalTitle}>Sanctuary Settings</Text>
              </View>
              <TouchableOpacity onPress={() => setSettingsOpen(false)}>
                <X size={20} color={COLORS.WarmCharcoal} />
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Room Code</Text>
                <Text style={styles.infoCode}>#{couple.pairingCode}</Text>
              </View>
              <View style={[styles.infoRow, { marginTop: 6 }]}>
                <Text style={styles.infoLabel}>Active Perspective</Text>
                <Text style={styles.infoValue}>
                  {couple.activeUser} (Partner: {partnerName})
                </Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>
              Google Gemini API Key (gemini-3.8-flash)
            </Text>
            <Text style={styles.inputHint}>
              Powers real-time AI Romantic Scrapbook Digests, Financial Co-pilot, Love Letter Composer & Deep Talk Prompts via the Gemini Interactions API.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="AIzaSy..."
              placeholderTextColor="#A89F98"
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveKey}>
              <Text style={styles.saveButtonText}>Save Configuration</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.unpairButton} onPress={handleUnpair}>
              <LogOut
                size={15}
                color={COLORS.Danger}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.unpairText}>Unpair & Reset Sanctuary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.White,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BorderSubtle,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 9,
    borderWidth: 1,
    borderColor: '#C3ECD2',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.WhatsAppGreen,
    marginRight: 4,
  },
  syncText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.WhatsAppTeal,
    letterSpacing: 0.6,
  },
  coupleNames: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: 0.2,
  },
  roomSub: {
    fontSize: 10,
    color: COLORS.WarmCharcoalLight,
    fontWeight: '600',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.RoseCoralSoft,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: COLORS.RoseCoral,
    width: 15,
    height: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  moodEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  activeUserBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.RoseCoralDark,
  },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.LightBlueSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: COLORS.White,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 8,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    fontWeight: '600',
  },
  infoCode: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.RoseCoral,
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginBottom: 8,
    lineHeight: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: COLORS.RoseCoral,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  unpairButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  unpairText: {
    color: COLORS.Danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
