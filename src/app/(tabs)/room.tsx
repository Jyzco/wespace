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
import { LinearGradient } from 'expo-linear-gradient';
import { useWeSpace } from '../../context/WeSpaceContext';
import { COLORS } from '../../constants/theme';
import { FireplaceCanvas } from '../../components/room/FireplaceCanvas';
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
  Music,
  CloudRain,
  Disc,
  Trash2,
  Radio,
} from 'lucide-react-native';

const STICKY_COLORS = [
  { hex: '#FFF0F6', border: '#FF85B3', label: 'Blush Pink' },
  { hex: '#E0F2FE', border: '#38BDF8', label: 'Sky Blue' },
  { hex: '#FFE4EF', border: '#FF2D78', label: 'Hot Pink' },
  { hex: '#F0F9FF', border: '#7DD3FC', label: 'Ice Cloud' },
  { hex: '#FFFFFF', border: '#BAE6FD', label: 'Pure White' },
];

export default function LivingRoomScreen() {
  const {
    couple,
    stickyNotes,
    sendHeartHug,
    addStickyNote,
    deleteStickyNote,
  } = useWeSpace();

  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [fireplaceWarmth, setFireplaceWarmth] = useState(3);

  // Ambient Soundscape Mixer Channels (0 = Off, 1 = Soft, 2 = Medium, 3 = Lush)
  const [soundMixer, setSoundMixer] = useState({
    hearth: 3,
    rain: 2,
    vinyl: 2,
    crickets: 0,
  });

  // Sticky Note Modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedNoteColor, setSelectedNoteColor] = useState(STICKY_COLORS[0].hex);

  const isP1 = couple.activeUser === couple.partner1Name;
  const partnerName = isP1 ? couple.partner2Name : couple.partner1Name;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (inCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inCall]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const cycleChannel = (channel: keyof typeof soundMixer) => {
    setSoundMixer((prev) => ({
      ...prev,
      [channel]: (prev[channel] + 1) % 4,
    }));
  };

  const handlePostSticky = () => {
    if (!newNoteText.trim()) return;
    addStickyNote({
      id: `sn_${Date.now()}`,
      text: newNoteText.trim(),
      sender: couple.activeUser,
      color: selectedNoteColor,
      time: 'Just now',
    });
    setNewNoteText('');
    setNoteModalOpen(false);
  };

  const handleSimulatePartnerNote = () => {
    const sweetNotes = [
      `Just left a warm mug of chamomile tea for you on the table 🍵💕`,
      `Can't wait to fall asleep on call together tonight 🌙`,
      `You looked so cute the last time we laughed together 🥰`,
    ];
    const randomMsg = sweetNotes[Math.floor(Math.random() * sweetNotes.length)];
    addStickyNote({
      id: `sn_${Date.now()}`,
      text: randomMsg,
      sender: partnerName,
      color: '#FFE4E6',
      time: 'Just now',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. WHATSAPP-STYLE VOIP VOICE SANCTUARY */}
      <View style={styles.voipCard}>
        <LinearGradient
          colors={['#38BDF8', '#0284C7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.voipHeader}
        >
          <View style={styles.voipIndicatorRow}>
            <View
              style={[
                styles.voipDot,
                { backgroundColor: inCall ? '#4ADE80' : '#E0F2FE' },
              ]}
            />
            <Text style={styles.voipStatusText}>
              {inCall ? 'LIVE CO-PRESENCE VOICE CALL' : 'VOICE SANCTUARY LOBBY'}
            </Text>
          </View>
          <Text style={styles.voipRoomTitle}>#{couple.pairingCode}</Text>
        </LinearGradient>

        <View style={styles.voipBody}>
          <View style={styles.callerAvatars}>
            {/* Active User Avatar */}
            <View style={styles.avatarBlock}>
              <View
                style={[
                  styles.avatarRing,
                  inCall && !isMuted && styles.speakingRing,
                ]}
              >
                <Text style={styles.avatarEmoji}>🧑‍🎨</Text>
              </View>
              <Text style={styles.avatarName}>{couple.activeUser} (You)</Text>
              <Text style={styles.avatarMicStatus}>
                {inCall ? (isMuted ? 'Muted 🔇' : 'Speaking 🎙️') : 'Ready'}
              </Text>
            </View>

            {/* Center Call Timer / Waveform */}
            <View style={styles.avatarMiddle}>
              {inCall ? (
                <View style={styles.liveCallBadge}>
                  <Text style={styles.connectedTag}>ENCRYPTED AUDIO</Text>
                  <Text style={styles.timerDisplay}>
                    {formatCallTime(callDuration)}
                  </Text>
                  <Text style={styles.waveBars}>ılılılılılı</Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22 }}>💞</Text>
                  <Text style={styles.callWaitingText}>Tap below to connect</Text>
                </View>
              )}
            </View>

            {/* Partner Avatar */}
            <View style={styles.avatarBlock}>
              <View
                style={[
                  styles.avatarRing,
                  { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
                  inCall && styles.speakingRing,
                ]}
              >
                <Text style={styles.avatarEmoji}>👩‍🎨</Text>
              </View>
              <Text style={styles.avatarName}>{partnerName}</Text>
              <Text style={styles.avatarMicStatus}>
                {inCall ? 'Listening 🎧' : 'In Sanctuary'}
              </Text>
            </View>
          </View>

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
                  style={styles.endCallBtn}
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
                    <VolumeX size={20} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.startCallBtnWrap}
                onPress={() => setInCall(true)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#FF2D78', '#D81159']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startCallBtn}
                >
                  <Phone size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.startCallText}>
                    Join Cozy Voice Room with {partnerName}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 2. ANIMATED ROSE-QUARTZ & SKY HEARTH */}
      <LinearGradient
        colors={['#E0F2FE', '#FFFFFF', '#FFF0F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fireplaceCard}
      >
        <View style={styles.fireplaceHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Flame size={18} color={COLORS.HotPink} />
            <Text style={styles.fireplaceTitle}>Rose-Quartz Sanctuary Hearth</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity
              style={styles.stokeBtn}
              onPress={() =>
                setFireplaceWarmth((prev) => Math.max(1, prev - 1))
              }
            >
              <Text style={styles.stokeText}>Dim 🌙</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stokeBtn, { backgroundColor: COLORS.HotPink }]}
              onPress={() =>
                setFireplaceWarmth((prev) => Math.min(5, prev + 1))
              }
            >
              <Sparkles size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={[styles.stokeText, { color: '#FFFFFF' }]}>
                Stoke 💖
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FireplaceCanvas warmthLevel={fireplaceWarmth} />

        <View style={styles.warmthRow}>
          <Text style={styles.warmthLabel}>Hearth Glow Level:</Text>
          <Text style={styles.warmthLevel}>
            {'💖'.repeat(fireplaceWarmth)}
          </Text>
        </View>
      </LinearGradient>

      {/* 3. AMBIENT SOUNDSCAPE MIXER */}
      <View style={styles.mixerCard}>
        <View style={styles.mixerHeader}>
          <Disc size={17} color={COLORS.HotPink} />
          <Text style={styles.mixerTitle}>Ambient Soundscape Mixer</Text>
          <Text style={styles.mixerHint}>Tap to adjust level</Text>
        </View>

        <View style={styles.mixerGrid}>
          {[
            {
              key: 'hearth' as const,
              label: 'Rose Hearth Logs',
              icon: <Flame size={16} color={COLORS.HotPink} />,
              color: COLORS.HotPink,
            },
            {
              key: 'rain' as const,
              label: 'Crystal Rain',
              icon: <CloudRain size={16} color="#0284C7" />,
              color: '#0284C7',
            },
            {
              key: 'vinyl' as const,
              label: 'Dreamy Lo-Fi Vinyl',
              icon: <Music size={16} color="#EC4899" />,
              color: '#EC4899',
            },
            {
              key: 'crickets' as const,
              label: 'Starlight Breeze',
              icon: <Radio size={16} color="#38BDF8" />,
              color: '#38BDF8',
            },
          ].map((item) => {
            const lvl = soundMixer[item.key];
            const levelLabels = ['Muted', 'Soft 30%', 'Warm 65%', 'Lush 100%'];
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.mixerTile,
                  lvl > 0 && {
                    borderColor: item.color,
                    backgroundColor: '#FFFFFF',
                  },
                ]}
                onPress={() => cycleChannel(item.key)}
                activeOpacity={0.75}
              >
                <View style={styles.mixerTileTop}>
                  {item.icon}
                  <View style={styles.levelDots}>
                    {[1, 2, 3].map((dot) => (
                      <View
                        key={dot}
                        style={[
                          styles.levelBar,
                          {
                            backgroundColor:
                              lvl >= dot ? item.color : '#E0F2FE',
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.mixerTileTitle}>{item.label}</Text>
                <Text
                  style={[
                    styles.mixerTileStatus,
                    lvl > 0 && { color: item.color, fontWeight: '800' },
                  ]}
                >
                  {levelLabels[lvl]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4. REMOTE PARTNER SIMULATION & HEART HUG DECK */}
      <View style={styles.simCard}>
        <View style={styles.simHeader}>
          <Heart size={17} color={COLORS.RoseCoral} fill={COLORS.RoseCoral} />
          <Text style={styles.simTitle}>
            Real-Time Co-Presence & Partner Simulator
          </Text>
        </View>
        <Text style={styles.simDesc}>
          Trigger a synchronized full-screen heartbeat hug or simulate incoming affection from {partnerName}.
        </Text>

        <View style={styles.simButtonsRow}>
          <TouchableOpacity
            style={styles.hugPrimaryBtn}
            onPress={() => sendHeartHug(couple.activeUser)}
          >
            <Heart size={15} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.hugPrimaryText}>Send Heart Hug</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simSecondaryBtn}
            onPress={() => sendHeartHug(partnerName)}
          >
            <Text style={styles.simSecondaryText}>
              Simulate Hug from {partnerName} 💕
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.simNoteBtn}
          onPress={handleSimulatePartnerNote}
        >
          <Sparkles size={13} color={COLORS.SoftLavender} />
          <Text style={styles.simNoteBtnText}>
            Simulate {partnerName} Leaving a Sweet Sticky Note
          </Text>
        </TouchableOpacity>
      </View>

      {/* 5. LIVING ROOM STICKY NOTES WALL */}
      <View style={styles.stickySection}>
        <View style={styles.stickyHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MessageCircleHeart size={18} color={COLORS.WarmCharcoal} />
            <Text style={styles.stickyTitle}>Mantelpiece Sticky Notes</Text>
          </View>
          <TouchableOpacity
            style={styles.addStickyBtn}
            onPress={() => setNoteModalOpen(true)}
          >
            <Text style={styles.addStickyText}>+ Leave Note</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesGrid}>
          {stickyNotes.map((note) => (
            <View
              key={note.id}
              style={[
                styles.stickyCard,
                { backgroundColor: note.color === '#FEF9C3' ? '#FFF0F6' : note.color || '#FFF0F6' },
              ]}
            >
              <View style={styles.stickyTopBar}>
                <Text style={styles.stickySender}>From {note.sender}</Text>
                <TouchableOpacity onPress={() => deleteStickyNote(note.id)}>
                  <Trash2 size={12} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              <Text style={styles.stickyNoteText}>"{note.text}"</Text>
              <Text style={styles.stickyTime}>{note.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* WRITE STICKY NOTE MODAL */}
      <Modal
        visible={noteModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Stick a Note on the Hearth</Text>

            <Text style={styles.inputLabel}>Note Paper Color</Text>
            <View style={styles.colorRow}>
              {STICKY_COLORS.map((c) => (
                <TouchableOpacity
                  key={c.hex}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c.hex, borderColor: c.border },
                    selectedNoteColor === c.hex && styles.colorSwatchActive,
                  ]}
                  onPress={() => setSelectedNoteColor(c.hex)}
                >
                  <Text style={styles.colorSwatchLabel}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Your Message</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g. Left warm brownies in the oven for you! 🍫"
              placeholderTextColor="#A89F98"
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
              <Text style={styles.modalSubmitText}>Pin Sticky Note</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  voipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  voipHeader: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 11,
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
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.7,
  },
  voipRoomTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#BAE6FD',
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
  avatarBlock: {
    alignItems: 'center',
    width: 90,
  },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.SoftRose,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFC2DF',
  },
  speakingRing: {
    borderColor: COLORS.WhatsAppGreen,
    borderWidth: 3,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginTop: 6,
  },
  avatarMicStatus: {
    fontSize: 10,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 1,
  },
  avatarMiddle: {
    alignItems: 'center',
    flex: 1,
  },
  liveCallBadge: {
    alignItems: 'center',
  },
  connectedTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.WhatsAppGreen,
    letterSpacing: 0.6,
  },
  timerDisplay: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginVertical: 2,
  },
  waveBars: {
    fontSize: 12,
    color: COLORS.WhatsAppGreen,
    fontWeight: '900',
    letterSpacing: 2,
  },
  callWaitingText: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
  },
  callControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#D0E7FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  endCallBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.Danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  startCallBtnWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.HotPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  startCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 16,
    width: '100%',
  },
  startCallText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  fireplaceCard: {
    borderRadius: 26,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  fireplaceHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fireplaceTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  stokeBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  stokeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  warmthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  warmthLabel: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    marginRight: 6,
    fontWeight: '700',
  },
  warmthLevel: {
    fontSize: 14,
  },
  mixerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 16,
  },
  mixerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mixerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
    flex: 1,
  },
  mixerHint: {
    fontSize: 10,
    color: COLORS.WarmCharcoalLight,
    fontWeight: '600',
  },
  mixerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  mixerTile: {
    width: '48.5%',
    backgroundColor: COLORS.SurfaceSubtle,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  mixerTileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelDots: {
    flexDirection: 'row',
    gap: 3,
  },
  levelBar: {
    width: 10,
    height: 5,
    borderRadius: 2.5,
  },
  mixerTileTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  mixerTileStatus: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
  },
  simCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFC2DF',
    marginBottom: 16,
    shadowColor: COLORS.HotPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  simTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  simDesc: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    lineHeight: 17,
    marginBottom: 12,
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  hugPrimaryBtn: {
    flex: 1,
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  hugPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  simSecondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.SoftRose,
    borderRadius: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  simSecondaryText: {
    color: COLORS.RoseCoralDark,
    fontSize: 11,
    fontWeight: '800',
  },
  simNoteBtn: {
    backgroundColor: COLORS.SoftLavenderSoft,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  simNoteBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.SoftLavender,
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
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  addStickyBtn: {
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addStickyText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.RoseCoral,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stickyCard: {
    width: '48.5%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  stickyTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stickySender: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  stickyNoteText: {
    fontSize: 12,
    color: COLORS.WarmCharcoal,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  stickyTime: {
    fontSize: 9,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 8,
    textAlign: 'right',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(42, 36, 33, 0.55)',
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
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 6,
  },
  colorSwatch: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  colorSwatchActive: {
    borderWidth: 2.5,
    borderColor: COLORS.WarmCharcoal,
  },
  colorSwatchLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
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
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
});
