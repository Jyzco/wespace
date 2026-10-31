import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
      {/* Left: Overlapping Couple Avatar Rings + Names */}
      <View style={styles.leftRow}>
        <View style={styles.avatarsOverlap}>
          <LinearGradient
            colors={['#7DD3FC', '#0284C7']}
            style={[styles.avatarBubble, { zIndex: 2 }]}
          >
            <Text style={styles.avatarInitial}>
              {couple.partner1Name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <LinearGradient
            colors={['#FF85B3', '#FF2D78']}
            style={[styles.avatarBubble, styles.avatarBubbleSecond]}
          >
            <Text style={styles.avatarInitial}>
              {couple.partner2Name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.onlineDot} />
        </View>

        <View style={{ marginLeft: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.coupleNames}>
              {couple.partner1Name}{' '}
              <Text style={{ color: COLORS.HotPink, fontSize: 13 }}>♥</Text>{' '}
              {couple.partner2Name}
            </Text>
          </View>
          <View style={styles.subRow}>
            <View style={styles.liveTinyDot} />
            <Text style={styles.roomSub}>Sanctuary #{couple.pairingCode}</Text>
          </View>
        </View>
      </View>

      {/* Right: Quick Action Pills + Switch User + Settings */}
      <View style={styles.rightRow}>
        <TouchableOpacity
          style={styles.iconCirclePink}
          onPress={() => router.push('/love-letters')}
          activeOpacity={0.75}
        >
          <Mail size={15} color={COLORS.HotPink} />
          {unreadLetters > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadLetters}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconCircleBlue}
          onPress={() => router.push('/date-jar')}
          activeOpacity={0.75}
        >
          <Sparkles size={15} color="#0284C7" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={switchUser}
          activeOpacity={0.75}
        >
          <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
          <Text style={styles.activeUserBadge}>{couple.activeUser}</Text>
          <RefreshCw
            size={10}
            color={COLORS.HotPink}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => {
            setApiKeyInput(couple.geminiApiKey || '');
            setSettingsOpen(true);
          }}
          activeOpacity={0.75}
        >
          <Settings size={15} color="#0284C7" />
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
                <HeartHandshake size={20} color={COLORS.HotPink} />
                <Text style={styles.modalTitle}>Sanctuary Settings</Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalCircle}
                onPress={() => setSettingsOpen(false)}
              >
                <X size={18} color={COLORS.WarmCharcoal} />
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={['#F0F8FF', '#FFF0F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.infoBox}
            >
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Private Room Code</Text>
                <Text style={styles.infoCode}>#{couple.pairingCode}</Text>
              </View>
              <View style={[styles.infoRow, { marginTop: 8 }]}>
                <Text style={styles.infoLabel}>Viewing As</Text>
                <Text style={styles.infoValue}>
                  {couple.activeUser} ({moodInfo.emoji} {moodInfo.label})
                </Text>
              </View>
            </LinearGradient>

            <Text style={styles.sectionLabel}>
              ✨ Gemini 3.8 Flash API Key (Optional)
            </Text>
            <Text style={styles.inputHint}>
              Powers real-time poetic scrapbook recaps, financial co-pilot date ideas, and AI love letters. Works offline with built-in romantic templates if left empty.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Paste AIzaSy... key here"
              placeholderTextColor="#94A3B8"
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.saveButtonWrap}
              onPress={handleSaveKey}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FF2D78', '#D81159']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save Sanctuary Settings</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.unpairButton}
              onPress={handleUnpair}
            >
              <LogOut
                size={14}
                color={COLORS.Danger}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.unpairText}>Unlink Couple Sanctuary</Text>
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2EEFA',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsOverlap: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  avatarBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarBubbleSecond: {
    marginLeft: -10,
    zIndex: 1,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 5,
  },
  coupleNames: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: -0.2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  liveTinyDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginRight: 4,
  },
  roomSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconCirclePink: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F6',
    borderWidth: 1,
    borderColor: '#FFC2DF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconCircleBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.HotPink,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFC2DF',
  },
  moodEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  activeUserBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.HotPink,
  },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#DCEBFA',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeModalCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 8,
  },
  infoBox: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DCEBFA',
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
    fontWeight: '700',
  },
  infoCode: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.HotPink,
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '800',
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
    marginBottom: 10,
    lineHeight: 16,
  },
  input: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    marginBottom: 16,
  },
  saveButtonWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  saveButton: {
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
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
