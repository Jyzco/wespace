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
  { type: 'COZY_COFFEE', label: 'Warm Café', emoji: '☕' },
  { type: 'SUNSET_WALK', label: 'Golden Walk', emoji: '🌅' },
  { type: 'SMILE_GOOFY', label: 'Park Picnic', emoji: '🧺' },
  { type: 'BEDTIME_STUFF', label: 'Starry Night', emoji: '🌙' },
  { type: 'HOMEMADE_MEAL', label: 'Sweet Dish', emoji: '🍝' },
  { type: 'MIRROR_SELFIE', label: 'Rainy Movie', emoji: '🌧️' },
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

  // Snap Modal State
  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [snapNote, setSnapNote] = useState('');
  const [selectedScene, setSelectedScene] = useState<SnapImageType>('COZY_COFFEE');

  // Mood Check-in Modal State
  const [moodModalOpen, setMoodModalOpen] = useState(false);
  const isP1 = couple.activeUser === couple.partner1Name;
  const [selectedMood, setSelectedMood] = useState<PartnerMood>(
    isP1 ? couple.partner1Mood : couple.partner2Mood
  );
  const [statusInput, setStatusInput] = useState(
    isP1 ? couple.partner1Status : couple.partner2Status
  );

  // Daily Question Answer Modal
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const partnerName = isP1 ? couple.partner2Name : couple.partner1Name;
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Next milestone calculation (e.g., 150, 200, 365 days)
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
    updateSnap({
      id: `snap_${Date.now()}`,
      coupleId: couple.coupleId,
      sender: couple.activeUser,
      imageType: selectedScene,
      note: snapNote.trim() || 'Thinking of you right this second 💕',
      reactions: ['❤️'],
      timestamp: Date.now(),
    });
    setSnapModalOpen(false);
    setSnapNote('');
  };

  const handleSaveMood = () => {
    updateMoodAndStatus(
      selectedMood,
      statusInput.trim() || 'Thinking of you 💕'
    );
    setMoodModalOpen(false);
  };

  const handleSaveDailyAnswer = () => {
    if (!answerInput.trim()) return;
    submitDailyAnswer(answerInput.trim());
    setAnswerModalOpen(false);
    setAnswerInput('');
  };

  const handleRefreshQuestion = async () => {
    setLoadingQuestion(true);
    const nextQ = await geminiService.generateDeepQuestion(couple.geminiApiKey);
    setNewDailyQuestion(nextQ.question, nextQ.category);
    setLoadingQuestion(false);
  };

  const p1MoodInfo = MOOD_META[couple.partner1Mood] || MOOD_META.AFFECTIONATE;
  const p2MoodInfo = MOOD_META[couple.partner2Mood] || MOOD_META.MISSING_YOU;

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
        colors={['#FFF5F6', '#FFFAF3', '#FFF0E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.journeyPill}>
            <Calendar size={13} color={COLORS.RoseCoral} />
            <Text style={styles.journeyPillText}>OUR SANCTUARY JOURNEY</Text>
          </View>
          <View style={styles.milestoneBadge}>
            <Sparkles size={12} color="#D97706" />
            <Text style={styles.milestoneBadgeText}>
              {nextMilestone - couple.daysTogether}d to Day {nextMilestone}
            </Text>
          </View>
        </View>

        <View style={styles.heroCenterRow}>
          <View>
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
              colors={[COLORS.RoseCoral, COLORS.RoseCoralDark]}
              style={styles.hugGradient}
            >
              <Heart size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.hugButtonLabel}>Send Hug</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Milestone Progress Track */}
        <View style={styles.milestoneTrack}>
          <View
            style={[
              styles.milestoneFill,
              { width: `${milestoneProgress * 100}%` },
            ]}
          />
        </View>
      </LinearGradient>

      {/* 2. DUAL PARTNER LIVE PRESENCE & MOOD CHECK-IN */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Live Co-Presence & Mood</Text>
        <TouchableOpacity
          style={styles.editMoodChip}
          onPress={() => {
            setSelectedMood(isP1 ? couple.partner1Mood : couple.partner2Mood);
            setStatusInput(isP1 ? couple.partner1Status : couple.partner2Status);
            setMoodModalOpen(true);
          }}
        >
          <Edit3 size={12} color={COLORS.RoseCoral} />
          <Text style={styles.editMoodChipText}>Update My Status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.presenceGrid}>
        {/* Partner 1 Card */}
        <View style={[styles.presenceCard, isP1 && styles.activeUserBorder]}>
          <View style={styles.presenceCardHeader}>
            <Text style={styles.partnerCardName}>{couple.partner1Name}</Text>
            <View style={styles.batteryBadge}>
              <BatteryCharging size={11} color="#059669" />
              <Text style={styles.batteryText}>{couple.partner1Battery}%</Text>
            </View>
          </View>
          <View
            style={[
              styles.moodPill,
              { backgroundColor: p1MoodInfo.bg },
            ]}
          >
            <Text style={styles.moodPillEmoji}>{p1MoodInfo.emoji}</Text>
            <Text style={[styles.moodPillText, { color: p1MoodInfo.color }]}>
              {p1MoodInfo.label}
            </Text>
          </View>
          <Text style={styles.statusThought} numberOfLines={2}>
            "{couple.partner1Status}"
          </Text>
        </View>

        {/* Partner 2 Card */}
        <View style={[styles.presenceCard, !isP1 && styles.activeUserBorder]}>
          <View style={styles.presenceCardHeader}>
            <Text style={styles.partnerCardName}>{couple.partner2Name}</Text>
            <View style={styles.batteryBadge}>
              <BatteryCharging size={11} color="#059669" />
              <Text style={styles.batteryText}>{couple.partner2Battery}%</Text>
            </View>
          </View>
          <View
            style={[
              styles.moodPill,
              { backgroundColor: p2MoodInfo.bg },
            ]}
          >
            <Text style={styles.moodPillEmoji}>{p2MoodInfo.emoji}</Text>
            <Text style={[styles.moodPillText, { color: p2MoodInfo.color }]}>
              {p2MoodInfo.label}
            </Text>
          </View>
          <Text style={styles.statusThought} numberOfLines={2}>
            "{couple.partner2Status}"
          </Text>
        </View>
      </View>

      {/* 3. LIVE 24H LOCKET WIDGET WITH PROCEDURAL ARTWORK & REACTIONS */}
      <View style={styles.locketContainer}>
        <View style={styles.locketHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.cameraIconBox}>
              <Camera size={16} color={COLORS.RoseCoral} />
            </View>
            <View>
              <Text style={styles.locketTitle}>Live Locket Widget</Text>
              <Text style={styles.locketSubtitle}>
                24-hour ephemeral window to your partner
              </Text>
            </View>
          </View>
          {isSnapActive && (
            <View style={styles.expiryTag}>
              <Clock size={11} color="#B45309" />
              <Text style={styles.expiryTagText}>{hoursRemaining}h left</Text>
            </View>
          )}
        </View>

        {isSnapActive && snap ? (
          <View style={styles.locketBody}>
            <View style={styles.artworkContainer}>
              <PolaroidArtwork scene={snap.imageType} height={175} />
              <View style={styles.senderFloatingPill}>
                <Text style={styles.senderFloatingText}>
                  📸 Snapped by {snap.sender}
                </Text>
              </View>
              {snap.reactions && snap.reactions.length > 0 && (
                <View style={styles.reactionsFloatingBar}>
                  {snap.reactions.map((r, idx) => (
                    <Text key={idx} style={styles.reactionFloatingEmoji}>
                      {r}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.notePaper}>
              <Text style={styles.handwrittenNote}>"{snap.note}"</Text>
            </View>

            {/* Quick Reaction Bar */}
            <View style={styles.quickReactRow}>
              <Text style={styles.quickReactLabel}>Send reaction:</Text>
              <View style={styles.EmojiPillsRow}>
                {['❤️', '🥺', '🥰', '🔥', '☕'].map((emo) => (
                  <TouchableOpacity
                    key={emo}
                    style={styles.emojiReactionBtn}
                    onPress={() => reactToSnap(emo)}
                  >
                    <Text style={{ fontSize: 15 }}>{emo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptySnapBox}>
            <Text style={{ fontSize: 36, marginBottom: 6 }}>💌</Text>
            <Text style={styles.emptySnapHeading}>No Locket Snap Yet Today</Text>
            <Text style={styles.emptySnapDesc}>
              Surprise {partnerName} with a snapshot of your current moment!
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.snapActionButton}
          onPress={() => setSnapModalOpen(true)}
          activeOpacity={0.85}
        >
          <Camera size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.snapActionButtonText}>
            {isSnapActive ? 'Post New Locket Snap' : 'Send Today’s Locket Snap'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. DAILY DEEP TALK QUESTION CARD */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.questionCategoryPill}>
            <MessageCircleHeart size={13} color={COLORS.SoftLavender} />
            <Text style={styles.questionCategoryText}>
              {dailyQuestion.category.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.refreshQuestionBtn}
            onPress={handleRefreshQuestion}
            disabled={loadingQuestion}
          >
            {loadingQuestion ? (
              <ActivityIndicator size="small" color={COLORS.SoftLavender} />
            ) : (
              <>
                <RefreshCw size={11} color={COLORS.SoftLavender} />
                <Text style={styles.refreshQuestionText}>New AI Prompt</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.questionTitleText}>"{dailyQuestion.question}"</Text>

        {/* Partner Answers */}
        <View style={styles.answersWrapper}>
          <View style={styles.answerBubble}>
            <Text style={styles.answerAuthor}>{couple.partner1Name}</Text>
            <Text style={styles.answerContent}>
              {dailyQuestion.partner1Answer || 'Waiting for answer... ✍️'}
            </Text>
          </View>

          <View style={[styles.answerBubble, { backgroundColor: '#FFF5F7' }]}>
            <Text style={[styles.answerAuthor, { color: COLORS.RoseCoral }]}>
              {couple.partner2Name}
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
          <Edit3 size={14} color={COLORS.SoftLavender} style={{ marginRight: 6 }} />
          <Text style={styles.writeAnswerText}>
            Write {couple.activeUser}’s Reflection
          </Text>
        </TouchableOpacity>
      </View>

      {/* 5. ROMANTIC VAULT & DATE NIGHT JAR PORTALS */}
      <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
        Intimate Vault & Experiences
      </Text>
      <View style={styles.portalRow}>
        <TouchableOpacity
          style={[styles.portalCard, { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]}
          onPress={() => router.push('/love-letters')}
          activeOpacity={0.8}
        >
          <View style={[styles.portalIconCircle, { backgroundColor: COLORS.RoseCoral }]}>
            <Mail size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.portalTitle}>Love Letters & Coupons</Text>
          <Text style={styles.portalSub}>
            {letters.length} Letters • {availableCoupons} Active Coupons
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.portalCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}
          onPress={() => router.push('/date-jar')}
          activeOpacity={0.8}
        >
          <View style={[styles.portalIconCircle, { backgroundColor: '#D97706' }]}>
            <Compass size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.portalTitle}>Date Spin Jar & Bucket List</Text>
          <Text style={styles.portalSub}>
            {completedBucket}/{bucketList.length} Dreams Checked
          </Text>
        </TouchableOpacity>
      </View>

      {/* 6. BENTO SANCTUARY OVERVIEW */}
      <View style={styles.portalRow}>
        <TouchableOpacity
          style={styles.bentoCard}
          onPress={() => router.push('/(tabs)/pet')}
          activeOpacity={0.8}
        >
          <View style={styles.bentoTop}>
            <Smile size={18} color="#D97706" />
            <Text style={styles.bentoTag}>Lv. {pet.level || 4}</Text>
          </View>
          <Text style={styles.bentoMain}>{pet.petName}</Text>
          <Text style={styles.bentoFooter}>
            {pet.isSleeping ? 'Sleeping peacefully 💤' : `${pet.happiness}% Joyful • ${pet.hunger}% Full`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bentoCard}
          onPress={() => router.push('/(tabs)/treasury')}
          activeOpacity={0.8}
        >
          <View style={styles.bentoTop}>
            <Wallet size={18} color={COLORS.SageGreen} />
            <Text style={[styles.bentoTag, { color: COLORS.SageGreen, backgroundColor: COLORS.SageGreenSoft }]}>
              50/50 Split
            </Text>
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
              Appears immediately on {partnerName}’s sanctuary home screen.
            </Text>

            <Text style={styles.inputLabel}>Choose Illustrated Scene</Text>
            <View style={styles.sceneGrid}>
              {SNAP_SCENES.map((sc) => (
                <TouchableOpacity
                  key={sc.type}
                  style={[
                    styles.sceneChip,
                    selectedScene === sc.type && styles.sceneChipSelected,
                  ]}
                  onPress={() => setSelectedScene(sc.type)}
                >
                  <Text style={{ fontSize: 20 }}>{sc.emoji}</Text>
                  <Text style={styles.sceneChipLabel}>{sc.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Handwritten Note</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write something sweet for your partner..."
              placeholderTextColor="#A89F98"
              value={snapNote}
              onChangeText={setSnapNote}
              multiline
              maxLength={140}
            />

            <TouchableOpacity style={styles.primaryModalBtn} onPress={handlePostSnap}>
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryModalBtnText}>Send to {partnerName} 💕</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelModalBtn}
              onPress={() => setSnapModalOpen(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: MOOD & STATUS CHECK-IN */}
      <Modal
        visible={moodModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMoodModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeading}>
              {couple.activeUser}’s Live Check-in
            </Text>
            <Text style={styles.modalSub}>
              Let {partnerName} know your current vibe & headspace.
            </Text>

            <Text style={styles.inputLabel}>Select Current Mood</Text>
            <View style={styles.sceneGrid}>
              {(Object.keys(MOOD_META) as PartnerMood[]).map((mKey) => {
                const m = MOOD_META[mKey];
                return (
                  <TouchableOpacity
                    key={mKey}
                    style={[
                      styles.sceneChip,
                      selectedMood === mKey && styles.sceneChipSelected,
                    ]}
                    onPress={() => setSelectedMood(mKey)}
                  >
                    <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                    <Text style={styles.sceneChipLabel}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>Thought Bubble Status</Text>
            <TextInput
              style={styles.textArea}
              placeholder="What are you up to right now?"
              placeholderTextColor="#A89F98"
              value={statusInput}
              onChangeText={setStatusInput}
              multiline
              maxLength={100}
            />

            <TouchableOpacity style={styles.primaryModalBtn} onPress={handleSaveMood}>
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryModalBtnText}>Update Presence</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelModalBtn}
              onPress={() => setMoodModalOpen(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: DAILY QUESTION ANSWER */}
      <Modal
        visible={answerModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAnswerModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeading}>Daily Deep Talk</Text>
            <Text style={[styles.modalSub, { fontStyle: 'italic' }]}>
              "{dailyQuestion.question}"
            </Text>

            <TextInput
              style={[styles.textArea, { height: 95 }]}
              placeholder={`Write ${couple.activeUser}'s heartfelt answer...`}
              placeholderTextColor="#A89F98"
              value={answerInput}
              onChangeText={setAnswerInput}
              multiline
            />

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={handleSaveDailyAnswer}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.primaryModalBtnText}>Share Reflection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelModalBtn}
              onPress={() => setAnswerModalOpen(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
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
  heroCard: {
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FCE7EA',
    marginBottom: 18,
    shadowColor: COLORS.RoseCoral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  journeyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCE7EA',
  },
  journeyPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.RoseCoral,
    marginLeft: 5,
    letterSpacing: 0.8,
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  milestoneBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 4,
  },
  heroCenterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  daysBigNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    letterSpacing: -1,
  },
  daysUnit: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.RoseCoral,
    marginLeft: 6,
  },
  daysSubtitle: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  hugHeroButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.RoseCoral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  hugGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  hugButtonLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  milestoneTrack: {
    height: 6,
    backgroundColor: '#F5E1E4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  milestoneFill: {
    height: '100%',
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 3,
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
    letterSpacing: 0.2,
  },
  editMoodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  editMoodChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.RoseCoral,
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
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  activeUserBorder: {
    borderColor: '#FDA4AF',
    backgroundColor: '#FFFCFC',
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
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  batteryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
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
    fontSize: 11,
    fontWeight: '800',
  },
  statusThought: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  locketContainer: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 18,
  },
  locketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.SoftRose,
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
  },
  expiryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  expiryTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 4,
  },
  locketBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 12,
  },
  artworkContainer: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  senderFloatingPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(42, 36, 33, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  senderFloatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  reactionsFloatingBar: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  reactionFloatingEmoji: {
    fontSize: 13,
    marginHorizontal: 2,
  },
  notePaper: {
    backgroundColor: COLORS.SurfaceSubtle,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.RoseCoral,
    marginBottom: 10,
  },
  handwrittenNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoal,
    lineHeight: 20,
  },
  quickReactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickReactLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoalLight,
  },
  EmojiPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  emojiReactionBtn: {
    backgroundColor: COLORS.SurfaceSubtle,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
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
  snapActionButton: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 18,
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
    backgroundColor: COLORS.SoftLavenderSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  questionCategoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.SoftLavender,
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
    fontWeight: '700',
    color: COLORS.SoftLavender,
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
  answerBubble: {
    backgroundColor: '#F8F5FF',
    borderRadius: 14,
    padding: 12,
  },
  answerAuthor: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.SoftLavender,
    marginBottom: 3,
  },
  answerContent: {
    fontSize: 13,
    color: COLORS.WarmCharcoal,
    lineHeight: 18,
  },
  writeAnswerBtn: {
    backgroundColor: COLORS.SoftLavenderSoft,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeAnswerText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.SoftLavender,
  },
  portalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  portalCard: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
  },
  portalIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  portalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  portalSub: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 3,
    fontWeight: '600',
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  bentoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bentoTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
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
    marginTop: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(42, 36, 33, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.CozyCream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderTopWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  modalHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 8,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  sceneChip: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sceneChipSelected: {
    borderColor: COLORS.RoseCoral,
    backgroundColor: COLORS.SoftRose,
  },
  sceneChipLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
    marginTop: 4,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    height: 75,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  primaryModalBtn: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelModalBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelModalText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
});
