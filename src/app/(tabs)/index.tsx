import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useWeSpace } from '../../context/WeSpaceContext';
import { COLORS, MOOD_META } from '../../constants/theme';
import { PolaroidArtwork } from '../../components/scrapbook/PolaroidArtwork';
import { geminiService } from '../../services/gemini';
import { SnapImageType, PartnerMood } from '../../types';
import {
  Heart,
  Camera,
  Sparkles,
  Calendar,
  Wallet,
  Smile,
  Clock,
  CheckCircle2,
  MessageCircleHeart,
  Mail,
  Compass,
  BatteryCharging,
  Edit3,
  RefreshCw,
} from 'lucide-react-native';

const SNAP_SCENES: { type: SnapImageType; label: string; emoji: string }[] = [
  { type: 'COZY_COFFEE', label: 'Cloud Café', emoji: '☕' },
  { type: 'SUNSET_WALK', label: 'Pink Sunset', emoji: '🌅' },
  { type: 'SMILE_GOOFY', label: 'Sakura Picnic', emoji: '🌸' },
  { type: 'BEDTIME_STUFF', label: 'Starry Night', emoji: '🌙' },
  { type: 'HOMEMADE_MEAL', label: 'Berry Sweet', emoji: '🍓' },
  { type: 'MIRROR_SELFIE', label: 'Cinema Night', emoji: '🎬' },
];

export default function SanctuaryDashboardScreen() {
  const {
    couple,
    pet,
    snap,
    expenses,
    dailyQuestion,
    letters,
    coupons,
    bucketList,
    sendHeartHug,
    updateSnap,
    reactToSnap,
    updateMoodAndStatus,
    submitDailyAnswer,
    setNewDailyQuestion,
  } = useWeSpace();

  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [snapNote, setSnapNote] = useState('');
  const [selectedScene, setSelectedScene] = useState<SnapImageType>('COZY_COFFEE');

  const [moodModalOpen, setMoodModalOpen] = useState(false);
  const isP1 = couple.activeUser === couple.partner1Name;
  const [selectedMood, setSelectedMood] = useState<PartnerMood>(
    isP1 ? couple.partner1Mood : couple.partner2Mood
  );
  const [statusInput, setStatusInput] = useState(
    isP1 ? couple.partner1Status : couple.partner2Status
  );

  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const milestones = [50, 100, 150, 200, 300, 365, 500, 730, 1000];
  const nextMilestone =
    milestones.find((m) => m > couple.daysTogether) || couple.daysTogether + 50;
  const milestoneProgress = Math.min(1, couple.daysTogether / nextMilestone);

  const isSnapActive =
    snap && Date.now() - snap.timestamp <= 24 * 3600 * 1000;
  const hoursRemaining = snap
    ? Math.max(
        1,
        Math.floor((24 * 3600 * 1000 - (Date.now() - snap.timestamp)) / 3600000)
      )
    : 0;

  const handlePostSnap = () => {
    const cleanNote =
      snapNote.trim() || 'Sending you a little piece of my day 💗';
    updateSnap({
      id: `snap_${Date.now()}`,
      coupleId: couple.coupleId,
      sender: couple.activeUser,
      imageType: selectedScene,
      note: cleanNote,
      reactions: ['💗', '✨'],
      timestamp: Date.now(),
    });
    setSnapNote('');
    setSnapModalOpen(false);
  };

  const handleSaveMood = () => {
    updateMoodAndStatus(
      selectedMood,
      statusInput.trim() || 'Thinking of you 💕'
    );
    setMoodModalOpen(false);
  };

  const handleSaveAnswer = () => {
    if (!answerInput.trim()) return;
    submitDailyAnswer(answerInput.trim());
    setAnswerInput('');
    setAnswerModalOpen(false);
  };

  const handleRefreshQuestion = async () => {
    setLoadingQuestion(true);
    try {
      const nextQ = await geminiService.generateDeepQuestion(
        couple.geminiApiKey
      );
      setNewDailyQuestion(nextQ.question, nextQ.category);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const p1Mood = MOOD_META[couple.partner1Mood] || MOOD_META.AFFECTIONATE;
  const p2Mood = MOOD_META[couple.partner2Mood] || MOOD_META.MISSING_YOU;
  const availableCoupons = coupons.filter((c) => !c.isRedeemed).length;
  const completedBucket = bucketList.filter((b) => b.isCompleted).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. HERO JOURNEY & HEART HUG BANNER */}
      <LinearGradient
        colors={['#DCF0FF', '#FFFFFF', '#FFE4F0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.journeyPill}>
            <Calendar size={12} color={COLORS.HotPink} />
            <Text style={styles.journeyPillText}>DAYS IN LOVE</Text>
          </View>
          <View style={styles.milestoneBadge}>
            <Sparkles size={12} color="#0284C7" />
            <Text style={styles.milestoneBadgeText}>
              {nextMilestone - couple.daysTogether}d to Day {nextMilestone}
            </Text>
          </View>
        </View>

        <View style={styles.heroCenterRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.daysBigNumber}>{couple.daysTogether}</Text>
              <Text style={styles.daysUnit}>days</Text>
            </View>
            <Text style={styles.daysSubtitle}>
              Since {couple.anniversaryDate || 'June 26, 2026'} • Forever & counting
            </Text>
          </View>

          <TouchableOpacity
            style={styles.hugHeroButton}
            onPress={() => sendHeartHug()}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#FF2D78', '#D81159']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hugGradient}
            >
              <Heart size={17} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.hugButtonLabel}>Send Hug</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Dual-Color Milestone Progress Track */}
        <View style={styles.milestoneTrack}>
          <LinearGradient
            colors={['#38BDF8', '#FF2D78']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.milestoneFill,
              { width: `${milestoneProgress * 100}%` },
            ]}
          />
        </View>
      </LinearGradient>

      {/* 2. INTIMATE VAULT & DATE SPIN PORTALS */}
      <View style={styles.portalRow}>
        <TouchableOpacity
          style={styles.portalCardWrap}
          onPress={() => router.push('/love-letters')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#FFF0F6', '#FFFFFF']}
            style={[styles.portalCard, { borderColor: '#FFC2DF' }]}
          >
            <View style={styles.portalTopRow}>
              <LinearGradient
                colors={['#FF5C97', '#FF2D78']}
                style={styles.portalIconCircle}
              >
                <Mail size={16} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.portalPillPink}>
                <Text style={styles.portalPillTextPink}>{availableCoupons} Coupons</Text>
              </View>
            </View>
            <Text style={styles.portalTitle}>Love Letters</Text>
            <Text style={styles.portalSub}>{letters.length} sealed notes & perks</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.portalCardWrap}
          onPress={() => router.push('/date-jar')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#E8F6FF', '#FFFFFF']}
            style={[styles.portalCard, { borderColor: '#BAE6FD' }]}
          >
            <View style={styles.portalTopRow}>
              <LinearGradient
                colors={['#38BDF8', '#0284C7']}
                style={styles.portalIconCircle}
              >
                <Compass size={16} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.portalPillBlue}>
                <Text style={styles.portalPillTextBlue}>
                  {completedBucket}/{bucketList.length} Done
                </Text>
              </View>
            </View>
            <Text style={styles.portalTitle}>Date Spin Jar</Text>
            <Text style={styles.portalSub}>Random dates & bucket list</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 3. PARTNER LIVE CO-PRESENCE & MOOD CHECK-IN */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Live Co-Presence</Text>
        <TouchableOpacity
          style={styles.editMoodChip}
          onPress={() => {
            setSelectedMood(isP1 ? couple.partner1Mood : couple.partner2Mood);
            setStatusInput(
              isP1 ? couple.partner1Status : couple.partner2Status
            );
            setMoodModalOpen(true);
          }}
        >
          <Edit3 size={12} color={COLORS.HotPink} />
          <Text style={styles.editMoodChipText}>
            Update {couple.activeUser}'s Mood
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.presenceGrid}>
        {/* Partner 1 Card */}
        <View style={[styles.presenceCard, isP1 && styles.activeUserBorderBlue]}>
          <View style={[styles.cardTopAccent, { backgroundColor: '#38BDF8' }]} />
          <View style={styles.presenceCardHeader}>
            <Text style={styles.partnerCardName}>{couple.partner1Name}</Text>
            <View style={styles.batteryBadge}>
              <BatteryCharging size={11} color="#0284C7" />
              <Text style={styles.batteryText}>{couple.partner1Battery}%</Text>
            </View>
          </View>
          <View style={[styles.moodPill, { backgroundColor: p1Mood.bg }]}>
            <Text style={styles.moodPillEmoji}>{p1Mood.emoji}</Text>
            <Text style={[styles.moodPillText, { color: p1Mood.color }]}>
              {p1Mood.label}
            </Text>
          </View>
          <Text style={styles.statusThought} numberOfLines={2}>
            "{couple.partner1Status}"
          </Text>
        </View>

        {/* Partner 2 Card */}
        <View style={[styles.presenceCard, !isP1 && styles.activeUserBorderPink]}>
          <View style={[styles.cardTopAccent, { backgroundColor: '#FF2D78' }]} />
          <View style={styles.presenceCardHeader}>
            <Text style={styles.partnerCardName}>{couple.partner2Name}</Text>
            <View style={styles.batteryBadge}>
              <BatteryCharging size={11} color="#0284C7" />
              <Text style={styles.batteryText}>{couple.partner2Battery}%</Text>
            </View>
          </View>
          <View style={[styles.moodPill, { backgroundColor: p2Mood.bg }]}>
            <Text style={styles.moodPillEmoji}>{p2Mood.emoji}</Text>
            <Text style={[styles.moodPillText, { color: p2Mood.color }]}>
              {p2Mood.label}
            </Text>
          </View>
          <Text style={styles.statusThought} numberOfLines={2}>
            "{couple.partner2Status}"
          </Text>
        </View>
      </View>

      {/* 4. 24-HOUR LIVE LOCKET SNAP WIDGET */}
      <View style={styles.locketContainer}>
        <View style={styles.locketHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LinearGradient
              colors={['#FF5C97', '#FF2D78']}
              style={styles.cameraIconBox}
            >
              <Camera size={16} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={styles.locketTitle}>Live 24h Locket Widget</Text>
              <Text style={styles.locketSubtitle}>
                Instant window onto your partner’s day
              </Text>
            </View>
          </View>

          {isSnapActive && (
            <View style={styles.expiryTag}>
              <Clock size={11} color="#0284C7" />
              <Text style={styles.expiryTagText}>{hoursRemaining}h left</Text>
            </View>
          )}
        </View>

        {isSnapActive && snap ? (
          <View style={styles.locketBody}>
            <View style={styles.artworkContainer}>
              <PolaroidArtwork scene={snap.imageType} height={195} />
              <View style={styles.senderFloatingPill}>
                <Text style={styles.senderFloatingText}>
                  📸 {snap.sender}’s Locket
                </Text>
              </View>
              {snap.reactions && snap.reactions.length > 0 && (
                <View style={styles.reactionsFloatingBar}>
                  {snap.reactions.map((emoji, idx) => (
                    <Text key={idx} style={styles.reactionFloatingEmoji}>
                      {emoji}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.notePaper}>
              <Text style={styles.handwrittenNote}>"{snap.note}"</Text>
            </View>

            {/* Quick Reaction Pills */}
            <View style={styles.quickReactRow}>
              <Text style={styles.quickReactLabel}>Send reaction:</Text>
              <View style={styles.EmojiPillsRow}>
                {['💗', '🥺', '🥰', '🔥', '✨'].map((em) => (
                  <TouchableOpacity
                    key={em}
                    style={styles.emojiReactionBtn}
                    onPress={() => reactToSnap(em)}
                  >
                    <Text style={{ fontSize: 14 }}>{em}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptySnapBox}>
            <Text style={styles.emptySnapHeading}>No Active Locket Snap</Text>
            <Text style={styles.emptySnapDesc}>
              Surprise {isP1 ? couple.partner2Name : couple.partner1Name} with a snapshot right now!
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.snapActionWrap}
          onPress={() => setSnapModalOpen(true)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#38BDF8', '#0284C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.snapActionButton}
          >
            <Camera size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.snapActionButtonText}>
              {isSnapActive ? 'Update 24h Locket Snap' : 'Send a Locket Snap'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 5. DAILY COUPLE DEEP TALK QUESTION */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.questionCategoryPill}>
            <MessageCircleHeart size={13} color={COLORS.HotPink} />
            <Text style={styles.questionCategoryText}>
              {dailyQuestion.category.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleRefreshQuestion}
            disabled={loadingQuestion}
            style={styles.refreshQuestionBtn}
          >
            {loadingQuestion ? (
              <ActivityIndicator size="small" color={COLORS.HotPink} />
            ) : (
              <>
                <RefreshCw size={12} color={COLORS.HotPink} />
                <Text style={styles.refreshQuestionText}>New Prompt</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.questionTitleText}>"{dailyQuestion.question}"</Text>

        <View style={styles.answersWrapper}>
          <View style={styles.answerBubbleBlue}>
            <Text style={[styles.answerAuthor, { color: '#0284C7' }]}>
              💙 {couple.partner1Name}
            </Text>
            <Text style={styles.answerContent}>
              {dailyQuestion.partner1Answer || 'Waiting for answer... ✍️'}
            </Text>
          </View>

          <View style={styles.answerBubblePink}>
            <Text style={[styles.answerAuthor, { color: COLORS.HotPink }]}>
              💗 {couple.partner2Name}
            </Text>
            <Text style={styles.answerContent}>
              {dailyQuestion.partner2Answer || 'Waiting for answer... ✍️'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.writeAnswerBtn}
          onPress={() => {
            setAnswerInput(
              (isP1
                ? dailyQuestion.partner1Answer
                : dailyQuestion.partner2Answer) || ''
            );
            setAnswerModalOpen(true);
          }}
        >
          <Edit3 size={14} color={COLORS.HotPink} style={{ marginRight: 6 }} />
          <Text style={styles.writeAnswerText}>
            Write {couple.activeUser}’s Reflection
          </Text>
        </TouchableOpacity>
      </View>

      {/* 6. BENTO SANCTUARY OVERVIEW */}
      <View style={styles.portalRow}>
        <TouchableOpacity
          style={styles.bentoCard}
          onPress={() => router.push('/(tabs)/pet')}
          activeOpacity={0.85}
        >
          <View style={styles.bentoTop}>
            <View style={styles.bentoIconPink}>
              <Smile size={16} color={COLORS.HotPink} />
            </View>
            <Text style={styles.bentoTagPink}>Lv. {pet.level || 4}</Text>
          </View>
          <Text style={styles.bentoMain}>{pet.petName}</Text>
          <Text style={styles.bentoFooter}>
            {pet.isSleeping
              ? 'Sleeping peacefully 💤'
              : `${pet.happiness}% Joyful • ${pet.hunger}% Full`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bentoCard}
          onPress={() => router.push('/(tabs)/treasury')}
          activeOpacity={0.85}
        >
          <View style={styles.bentoTop}>
            <View style={styles.bentoIconBlue}>
              <Wallet size={16} color="#0284C7" />
            </View>
            <Text style={styles.bentoTagBlue}>50/50 Split</Text>
          </View>
          <Text style={styles.bentoMain}>${totalSpent.toFixed(2)}</Text>
          <Text style={styles.bentoFooter}>
            {expenses.length} shared expenses logged
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL 1: POST LOCKET SNAP */}
      <Modal
        visible={snapModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSnapModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeading}>Post 24-Hour Locket Snap</Text>
            <Text style={styles.modalSub}>
              Pick a scene and write a sweet note for your partner’s widget:
            </Text>

            <View style={styles.sceneGrid}>
              {SNAP_SCENES.map((item) => {
                const selected = selectedScene === item.type;
                return (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.sceneOption,
                      selected && styles.sceneOptionSelected,
                    ]}
                    onPress={() => setSelectedScene(item.type)}
                  >
                    <Text style={styles.sceneEmoji}>{item.emoji}</Text>
                    <Text
                      style={[
                        styles.sceneLabel,
                        selected && styles.sceneLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="Write a sweet note..."
              placeholderTextColor="#94A3B8"
              value={snapNote}
              onChangeText={setSnapNote}
              multiline
              maxLength={120}
            />

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handlePostSnap}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Send to Locket Widget</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setSnapModalOpen(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: MOOD & STATUS CHECK-IN */}
      <Modal
        visible={moodModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMoodModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeading}>
              {couple.activeUser}’s Live Vibe
            </Text>
            <Text style={styles.modalSub}>
              Let your partner know how you’re feeling right now:
            </Text>

            <View style={styles.sceneGrid}>
              {(Object.keys(MOOD_META) as PartnerMood[]).map((mKey) => {
                const meta = MOOD_META[mKey];
                const selected = selectedMood === mKey;
                return (
                  <TouchableOpacity
                    key={mKey}
                    style={[
                      styles.sceneOption,
                      selected && styles.sceneOptionSelected,
                    ]}
                    onPress={() => setSelectedMood(mKey)}
                  >
                    <Text style={styles.sceneEmoji}>{meta.emoji}</Text>
                    <Text
                      style={[
                        styles.sceneLabel,
                        selected && styles.sceneLabelSelected,
                      ]}
                    >
                      {meta.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="What's on your mind right now?"
              placeholderTextColor="#94A3B8"
              value={statusInput}
              onChangeText={setStatusInput}
              maxLength={90}
            />

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleSaveMood}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Update Live Presence</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setMoodModalOpen(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: DAILY QUESTION ANSWER */}
      <Modal
        visible={answerModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAnswerModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeading}>Tonight’s Deep Talk</Text>
            <Text style={[styles.modalSub, { fontStyle: 'italic' }]}>
              "{dailyQuestion.question}"
            </Text>

            <TextInput
              style={[styles.noteInput, { minHeight: 90 }]}
              placeholder={`Write ${couple.activeUser}'s reflection...`}
              placeholderTextColor="#94A3B8"
              value={answerInput}
              onChangeText={setAnswerInput}
              multiline
              maxLength={220}
            />

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleSaveAnswer}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Share My Heart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setAnswerModalOpen(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
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
    paddingBottom: 42,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    marginBottom: 14,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFC2DF',
  },
  journeyPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.HotPink,
    marginLeft: 5,
    letterSpacing: 0.8,
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  milestoneBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    marginLeft: 4,
  },
  heroCenterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  daysBigNumber: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: -1.5,
  },
  daysUnit: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.HotPink,
    marginLeft: 6,
  },
  daysSubtitle: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    fontWeight: '700',
    marginTop: 2,
  },
  hugHeroButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.HotPink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  hugGradient: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  hugButtonLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },
  milestoneTrack: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  milestoneFill: {
    height: '100%',
    borderRadius: 4,
  },
  portalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  portalCardWrap: {
    flex: 1,
    borderRadius: 22,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  portalCard: {
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
  },
  portalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  portalIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portalPillPink: {
    backgroundColor: '#FFE4EF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  portalPillTextPink: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.HotPink,
  },
  portalPillBlue: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  portalPillTextBlue: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0284C7',
  },
  portalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  portalSub: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: -0.2,
  },
  editMoodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4EF',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFC2DF',
  },
  editMoodChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.HotPink,
    marginLeft: 4,
  },
  presenceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  presenceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    paddingTop: 16,
    borderWidth: 1,
    borderColor: '#DCEBFA',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  activeUserBorderBlue: {
    borderColor: '#7DD3FC',
  },
  activeUserBorderPink: {
    borderColor: '#FF85B3',
  },
  presenceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  partnerCardName: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  batteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  batteryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    marginLeft: 2,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  moodPillEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  moodPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusThought: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  locketContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCEBFA',
    marginBottom: 18,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  locketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  locketTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  locketSubtitle: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    fontWeight: '600',
  },
  expiryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiryTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    marginLeft: 4,
  },
  locketBody: {
    backgroundColor: '#F8FBFF',
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2EEFA',
    marginBottom: 12,
  },
  artworkContainer: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
  },
  senderFloatingPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
  },
  senderFloatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  reactionsFloatingBar: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
  },
  reactionFloatingEmoji: {
    fontSize: 13,
    marginHorizontal: 2,
  },
  notePaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 3.5,
    borderLeftColor: COLORS.HotPink,
    marginBottom: 10,
  },
  handwrittenNote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoal,
    lineHeight: 19,
    fontWeight: '600',
  },
  quickReactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickReactLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.WarmCharcoalMuted,
  },
  EmojiPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  emojiReactionBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCEBFA',
  },
  emptySnapBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptySnapHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  emptySnapDesc: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  snapActionWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  snapActionButton: {
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DCEBFA',
    marginBottom: 18,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4EF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionCategoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.HotPink,
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  refreshQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshQuestionText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.HotPink,
  },
  questionTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    lineHeight: 22,
    marginBottom: 12,
  },
  answersWrapper: {
    gap: 8,
    marginBottom: 12,
  },
  answerBubbleBlue: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  answerBubblePink: {
    backgroundColor: '#FFF0F6',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFC2DF',
  },
  answerAuthor: {
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 3,
  },
  answerContent: {
    fontSize: 13,
    color: COLORS.WarmCharcoal,
    lineHeight: 18,
  },
  writeAnswerBtn: {
    backgroundColor: '#FFF0F6',
    borderRadius: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#FFC2DF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeAnswerText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.HotPink,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DCEBFA',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  bentoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bentoIconPink: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FFE4EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoIconBlue: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoTagPink: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.HotPink,
    backgroundColor: '#FFE4EF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bentoTagBlue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bentoMain: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  bentoFooter: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#DCEBFA',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
    marginBottom: 14,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sceneOption: {
    width: '31%',
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#DCEBFA',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  sceneOptionSelected: {
    borderColor: COLORS.HotPink,
    backgroundColor: '#FFF0F6',
  },
  sceneEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  sceneLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'center',
  },
  sceneLabelSelected: {
    color: COLORS.HotPink,
    fontWeight: '900',
  },
  noteInput: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    minHeight: 68,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  modalSubmitButton: {
    backgroundColor: COLORS.HotPink,
    borderRadius: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  modalCancel: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
});
