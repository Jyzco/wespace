import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { CoupleState } from '../../types';
import { COLORS } from '../../constants/theme';
import { RefreshCw, Key, HeartHandshake, LogOut, X } from 'lucide-react-native';

interface HeaderProps {
  couple: CoupleState;
  onSwitchUser: () => void;
  onUpdateApiKey: (key: string) => void;
  onUnpair: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  couple,
  onSwitchUser,
  onUpdateApiKey,
  onUnpair,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(couple.geminiApiKey || '');

  const partnerName = couple.activeUser === couple.partner1Name ? couple.partner2Name : couple.partner1Name;

  const handleSaveKey = () => {
    onUpdateApiKey(apiKeyInput.trim());
    setSettingsOpen(false);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftRow}>
        <View style={styles.syncIndicator}>
          <View style={styles.greenDot} />
          <Text style={styles.syncText}>Live</Text>
        </View>
        <Text style={styles.coupleNames}>
          {couple.partner1Name} & {couple.partner2Name}
        </Text>
      </View>

      <View style={styles.rightRow}>
        {/* Switch Profile Button */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={onSwitchUser}
          activeOpacity={0.7}
        >
          <Text style={styles.activeUserBadge}>
            👤 {couple.activeUser}
          </Text>
          <RefreshCw size={13} color={COLORS.WarmCharcoalMuted} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setSettingsOpen(true)}
          activeOpacity={0.7}
        >
          <Key size={17} color={COLORS.WarmCharcoal} />
        </TouchableOpacity>
      </View>

      {/* Settings / API Key Modal */}
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
                <Text style={styles.modalTitle}>WeSpace Sanctuary</Text>
              </View>
              <TouchableOpacity onPress={() => setSettingsOpen(false)}>
                <X size={20} color={COLORS.WarmCharcoal} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Room Pairing Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{couple.pairingCode}</Text>
              <Text style={styles.codeHint}>Share with your partner</Text>
            </View>

            <Text style={styles.sectionLabel}>Active Profile</Text>
            <Text style={styles.detailText}>
              Currently browsing as <Text style={{ fontWeight: '700' }}>{couple.activeUser}</Text> (Partner: {partnerName})
            </Text>

            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Google Gemini API Key (Optional)</Text>
            <Text style={styles.inputHint}>
              Enables real-time AI Romantic Scrapbook Digest and Treasury Co-pilot advice. Leave blank for built-in cozy digests.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="AIzaSy..."
              placeholderTextColor="#999"
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveKey}>
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.unpairButton} onPress={onUnpair}>
              <LogOut size={16} color={COLORS.Danger} style={{ marginRight: 6 }} />
              <Text style={styles.unpairText}>Unpair / Reset Space</Text>
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
    paddingTop: 48,
    paddingBottom: 10,
    backgroundColor: COLORS.CozyCream,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ShadowBeige,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF8EE',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C7EDCE',
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#25D366',
    marginRight: 4,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#075E54',
  },
  coupleNames: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    letterSpacing: 0.2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F8D8DC',
  },
  activeUserBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.RoseCoral,
  },
  iconButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#F3ECE4',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.CozyCream,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.WarmCharcoalMuted,
  },
  codeBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.RoseCoral,
    letterSpacing: 2,
  },
  codeHint: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
  },
  inputHint: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginBottom: 6,
    lineHeight: 15,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: COLORS.RoseCoral,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
    fontWeight: '600',
  },
});
