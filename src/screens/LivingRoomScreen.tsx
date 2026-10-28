import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { CoupleState } from '../types';
import { COLORS } from '../constants/theme';
import { FireplaceCanvas } from '../components/room/FireplaceCanvas';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Heart,
  Flame,
  MessageCircleHeart,
  Sparkles,
  Check,
} from 'lucide-react-native';

interface LivingRoomScreenProps {
  couple: CoupleState;
  onSendHeartHug: () => void;
}

export const LivingRoomScreen: React.FC<LivingRoomScreenProps> = ({
  couple,
  onSendHeartHug,
}) => {
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [fireplaceWarmth, setFireplaceWarmth] = useState(3);
  const [stickyNotes, setStickyNotes] = useState<
    { id: string; text: string; sender: string; time: string }[]
  >([
    {
      id: '1',
      text: 'Left warm cookies on the kitchen counter for you! 🍪',
      sender: couple.partner1Name,
      time: '1h ago',
    },
    {
      id: '2',
      text: 'Playing jazz records by the fireplace tonight... 🎶',
      sender: couple.partner2Name,
      time: '30m ago',
    },
  ]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const partnerName =
    couple.activeUser === couple.partner1Name
      ? couple.partner2Name
      : couple.partner1Name;

  // Active call timer
  useEffect(() => {
    let timer: any;
    if (inCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [inCall]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePostSticky = () => {
    if (!newNoteText.trim()) return;
    setStickyNotes([
      {
        id: Date.now().toString(),
        text: newNoteText.trim(),
        sender: couple.activeUser,
        time: 'Just now',
      },
      ...stickyNotes,
    ]);
    setNewNoteText('');
    setNoteModalOpen(false);
  };

  const handleStokeFire = () => {
    setFireplaceWarmth((prev) => Math.min(prev + 1, 5));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* WhatsApp-style VoIP Sanctuary Voice Room */}
      <View style={styles.voipCard}>
        <View style={styles.voipHeader}>
          <View style={styles.voipIndicatorRow}>
            <View
              style={[
                styles.voipDot,
                { backgroundColor: inCall ? COLORS.WhatsAppGreen : '#9CA3AF' },
              ]}
            />
            <Text style={styles.voipStatusText}>
              {inCall ? 'VOIP CONNECTED' : 'VOICE ROOM LOBBY'}
            </Text>
          </View>
          <Text style={styles.voipRoomTitle}>Room #{couple.pairingCode}</Text>
        </View>

        <View style={styles.voipBody}>
          <View style={styles.callerAvatars}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧑‍🌾</Text>
              <Text style={styles.avatarName}>{couple.activeUser} (You)</Text>
            </View>

            <View style={styles.avatarMiddle}>
              {inCall ? (
                <View style={styles.liveAudioWaves}>
                  <Text style={styles.speakingIndicator}>🎙️ Connected</Text>
                  <Text style={styles.timerDisplay}>
                    {formatCallTime(callDuration)}
                  </Text>
                </View>
              ) : (
                <Text style={styles.callWaitingText}>Ready to talk</Text>
              )}
            </View>

            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👩‍🌾</Text>
              <Text style={styles.avatarName}>{partnerName}</Text>
            </View>
          </View>

          {/* VoIP Call Controls */}
          <View style={styles.callControlsRow}>
            {inCall ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.controlBtn,
                    isMuted && { backgroundColor: COLORS.WarmCharcoal },
                  ]}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <MicOff size={20} color="#FFFFFF" />
                  ) : (
                    <Mic size={20} color={COLORS.WarmCharcoal} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.endCallBtn]}
                  onPress={() => setInCall(false)}
                >
                  <PhoneOff size={22} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.controlBtn,
                    !isSpeaker && { backgroundColor: '#E2E8F0' },
                  ]}
                  onPress={() => setIsSpeaker(!isSpeaker)}
                >
                  {isSpeaker ? (
                    <Volume2 size={20} color={COLORS.WarmCharcoal} />
                  ) : (
                    <VolumeX size={20} color="#AAA" />
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.startCallBtn}
                onPress={() => setInCall(true)}
              >
                <Phone size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.startCallText}>
                  Start Cozy Call with {partnerName}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Animated Crackling Fireplace Hearth */}
      <View style={styles.fireplaceCard}>
        <View style={styles.fireplaceHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Flame size={18} color="#EA580C" />
            <Text style={styles.fireplaceTitle}>Cozy Fireplace Hearth</Text>
          </View>
          <TouchableOpacity
            style={styles.stokeBtn}
            onPress={handleStokeFire}
            activeOpacity={0.8}
          >
            <Sparkles size={12} color="#B45309" style={{ marginRight: 4 }} />
            <Text style={styles.stokeText}>Stoke Flames 🔥</Text>
          </TouchableOpacity>
        </View>

        {/* Procedural Canvas Fireplace */}
        <FireplaceCanvas />

        <View style={styles.warmthRow}>
          <Text style={styles.warmthLabel}>Fireplace Warmth:</Text>
          <Text style={styles.warmthLevel}>
            {'🔥'.repeat(fireplaceWarmth)}
          </Text>
        </View>
      </View>

      {/* Heart Hug Interactive Trigger */}
      <View style={styles.hugCard}>
        <View style={styles.hugHeader}>
          <Heart size={20} color={COLORS.RoseCoral} fill={COLORS.RoseCoral} />
          <Text style={styles.hugHeading}>Synchronized Heart Hug</Text>
        </View>
        <Text style={styles.hugDesc}>
          Send a sudden, full-screen heartbeat pulse overlay to {partnerName}'s screen.
        </Text>
        <TouchableOpacity
          style={styles.hugActionBtn}
          onPress={onSendHeartHug}
          activeOpacity={0.85}
        >
          <Heart size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.hugActionText}>Send Real-time Heart Hug 💕</Text>
        </TouchableOpacity>
      </View>

      {/* Living Room Sticky Notes Wall */}
      <View style={styles.stickySection}>
        <View style={styles.stickyHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MessageCircleHeart size={18} color={COLORS.WarmCharcoal} />
            <Text style={styles.stickyTitle}>Living Room Sticky Notes</Text>
          </View>
          <TouchableOpacity
            style={styles.addStickyBtn}
            onPress={() => setNoteModalOpen(true)}
          >
            <Text style={styles.addStickyText}>+ Write Note</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesGrid}>
          {stickyNotes.map((note) => (
            <View key={note.id} style={styles.stickyCard}>
              <Text style={styles.stickyNoteText}>"{note.text}"</Text>
              <View style={styles.stickyFooter}>
                <Text style={styles.stickySender}>— {note.sender}</Text>
                <Text style={styles.stickyTime}>{note.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Post Sticky Note Modal */}
      <Modal
        visible={noteModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Leave a Living Room Note</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g. Left a hot cup of tea by your desk 🍵"
              placeholderTextColor="#AAA"
              value={newNoteText}
              onChangeText={setNewNoteText}
              multiline
              maxLength={120}
            />

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handlePostSticky}
            >
              <Check size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Stick on Hearth</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setNoteModalOpen(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  voipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D1E7DD',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: COLORS.WhatsAppTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  voipHeader: {
    backgroundColor: COLORS.WhatsAppTeal,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voipIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  voipStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  voipRoomTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1FAE5',
  },
  voipBody: {
    padding: 18,
  },
  callerAvatars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 34,
    backgroundColor: COLORS.SoftRose,
    padding: 10,
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
    marginTop: 6,
  },
  avatarMiddle: {
    alignItems: 'center',
  },
  liveAudioWaves: {
    alignItems: 'center',
  },
  speakingIndicator: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WhatsAppGreen,
  },
  timerDisplay: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginTop: 2,
  },
  callWaitingText: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    fontStyle: 'italic',
  },
  callControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  endCallBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.Danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  startCallBtn: {
    backgroundColor: COLORS.WhatsAppGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
  },
  startCallText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  fireplaceCard: {
    backgroundColor: '#261C16',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  fireplaceHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fireplaceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FED7AA',
    marginLeft: 6,
  },
  stokeBtn: {
    backgroundColor: '#452A18',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stokeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDBA74',
  },
  warmthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  warmthLabel: {
    fontSize: 12,
    color: '#D4C4B7',
    marginRight: 6,
  },
  warmthLevel: {
    fontSize: 14,
  },
  hugCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCE7EA',
    marginBottom: 16,
  },
  hugHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hugHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  hugDesc: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  hugActionBtn: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hugActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stickySection: {
    marginBottom: 16,
  },
  stickyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stickyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  addStickyBtn: {
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  addStickyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.RoseCoral,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stickyCard: {
    width: '48%',
    backgroundColor: '#FEF9C3',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
    marginBottom: 10,
    shadowColor: '#854D0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stickyNoteText: {
    fontSize: 12,
    color: '#713F12',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  stickyFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stickySender: {
    fontSize: 10,
    fontWeight: '700',
    color: '#854D0E',
  },
  stickyTime: {
    fontSize: 9,
    color: '#A16207',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.CozyCream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderTopWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 14,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalSubmitButton: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
});
