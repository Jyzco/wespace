import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useWeSpace } from '../context/WeSpaceContext';
import { COLORS } from '../constants/theme';
import { geminiService } from '../services/gemini';
import {
  Mail,
  Ticket,
  Plus,
  Sparkles,
  X,
  CheckCircle2,
  Heart,
} from 'lucide-react-native';

const WAX_COLORS = [
  { hex: '#FF1493', label: 'Hot Pink Wax' },
  { hex: '#0284C7', label: 'Sky Blue Wax' },
  { hex: '#38BDF8', label: 'Ice Blue Wax' },
  { hex: '#F472B6', label: 'Pastel Pink Wax' },
];

export default function LoveLettersAndCouponsModal() {
  const {
    couple,
    letters,
    coupons,
    addLoveLetter,
    markLetterRead,
    addLoveCoupon,
    redeemCoupon,
  } = useWeSpace();

  const [tab, setTab] = useState<'LETTERS' | 'COUPONS'>('LETTERS');
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);

  // Compose Letter State
  const [letterTitle, setLetterTitle] = useState('');
  const [letterBody, setLetterBody] = useState('');
  const [waxColor, setWaxColor] = useState(WAX_COLORS[0].hex);
  const [aiDrafting, setAiDrafting] = useState(false);

  // New Coupon State
  const [cpTitle, setCpTitle] = useState('');
  const [cpDesc, setCpDesc] = useState('');
  const [cpEmoji, setCpEmoji] = useState('💆‍♀️');

  const isP1 = couple.activeUser === couple.partner1Name;
  const partnerName = isP1 ? couple.partner2Name : couple.partner1Name;

  const handleAiDraft = async () => {
    setAiDrafting(true);
    const draft = await geminiService.generateLoveLetterDraft(
      couple.activeUser,
      partnerName,
      letterTitle || 'deep gratitude and everyday romance',
      couple.geminiApiKey
    );
    setLetterBody(draft);
    setAiDrafting(false);
  };

  const handleSendLetter = () => {
    if (!letterTitle.trim() || !letterBody.trim()) return;
    addLoveLetter({
      id: `let_${Date.now()}`,
      sender: couple.activeUser,
      recipient: partnerName,
      title: letterTitle.trim(),
      body: letterBody.trim(),
      waxColor,
      isRead: false,
      timestamp: Date.now(),
    });
    setLetterTitle('');
    setLetterBody('');
    setComposeModalOpen(false);
  };

  const handleCreateCoupon = () => {
    if (!cpTitle.trim()) return;
    addLoveCoupon({
      id: `cp_${Date.now()}`,
      title: cpTitle.trim(),
      description:
        cpDesc.trim() || 'Redeemable anytime with a sweet kiss and zero expiration.',
      emoji: cpEmoji,
      fromPartner: couple.activeUser,
      isRedeemed: false,
    });
    setCpTitle('');
    setCpDesc('');
    setCouponModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Modal Header */}
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Heart size={20} color={COLORS.RoseCoral} fill={COLORS.RoseCoral} />
          <Text style={styles.headerTitle}>Love Vault & Coupons</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
        >
          <X size={20} color={COLORS.WarmCharcoal} />
        </TouchableOpacity>
      </View>

      {/* Segmented Switcher */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            tab === 'LETTERS' && styles.segmentBtnActive,
          ]}
          onPress={() => setTab('LETTERS')}
        >
          <Mail
            size={15}
            color={tab === 'LETTERS' ? '#FFFFFF' : COLORS.WarmCharcoalMuted}
          />
          <Text
            style={[
              styles.segmentText,
              tab === 'LETTERS' && styles.segmentTextActive,
            ]}
          >
            Love Letters ({letters.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            tab === 'COUPONS' && styles.segmentBtnActive,
          ]}
          onPress={() => setTab('COUPONS')}
        >
          <Ticket
            size={15}
            color={tab === 'COUPONS' ? '#FFFFFF' : COLORS.WarmCharcoalMuted}
          />
          <Text
            style={[
              styles.segmentText,
              tab === 'COUPONS' && styles.segmentTextActive,
            ]}
          >
            Love Coupons ({coupons.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'LETTERS' ? (
          <>
            <TouchableOpacity
              style={styles.newActionBanner}
              onPress={() => setComposeModalOpen(true)}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.newActionText}>
                Write Wax-Sealed Letter to {partnerName}
              </Text>
            </TouchableOpacity>

            {letters.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.letterCard}
                activeOpacity={0.9}
                onPress={() => markLetterRead(item.id)}
              >
                <View style={styles.letterTopRow}>
                  <View
                    style={[
                      styles.waxSeal,
                      { backgroundColor: item.waxColor || COLORS.RoseCoral },
                    ]}
                  >
                    <Text style={styles.waxSealSymbol}>♥</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.letterTitle}>{item.title}</Text>
                    <Text style={styles.letterMeta}>
                      From {item.sender} to {item.recipient} •{' '}
                      {new Date(item.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  {!item.isRead && (
                    <View style={styles.newTag}>
                      <Text style={styles.newTagText}>NEW</Text>
                    </View>
                  )}
                </View>

                <View style={styles.parchmentBody}>
                  <Text style={styles.letterBodyText}>"{item.body}"</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.newActionBanner,
                { backgroundColor: COLORS.SoftLavender },
              ]}
              onPress={() => setCouponModalOpen(true)}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.newActionText}>
                Gift a New Love Coupon to {partnerName}
              </Text>
            </TouchableOpacity>

            {coupons.map((cp) => (
              <View
                key={cp.id}
                style={[
                  styles.couponCard,
                  cp.isRedeemed && styles.couponCardRedeemed,
                ]}
              >
                <View style={styles.couponLeft}>
                  <Text style={styles.couponEmoji}>{cp.emoji}</Text>
                </View>
                <View style={styles.couponCenter}>
                  <Text style={styles.couponTitle}>{cp.title}</Text>
                  <Text style={styles.couponDesc}>{cp.description}</Text>
                  <Text style={styles.couponFrom}>
                    Gifted with love by {cp.fromPartner}
                  </Text>
                </View>
                <View style={styles.couponRight}>
                  {cp.isRedeemed ? (
                    <View style={styles.redeemedBadge}>
                      <Text style={styles.redeemedText}>CLAIMED ✓</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.redeemBtn}
                      onPress={() => redeemCoupon(cp.id)}
                    >
                      <Text style={styles.redeemBtnText}>Redeem</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* COMPOSE LOVE LETTER MODAL */}
      <Modal
        visible={composeModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setComposeModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>
              Seal a Letter for {partnerName}
            </Text>

            <Text style={styles.inputLabel}>Wax Seal Color</Text>
            <View style={styles.waxRow}>
              {WAX_COLORS.map((w) => (
                <TouchableOpacity
                  key={w.hex}
                  style={[
                    styles.waxOption,
                    { backgroundColor: w.hex },
                    waxColor === w.hex && styles.waxOptionSelected,
                  ]}
                  onPress={() => setWaxColor(w.hex)}
                >
                  <Text style={styles.waxOptionLabel}>{w.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Envelope Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Open When You Need a Smile"
              placeholderTextColor="#A89F98"
              value={letterTitle}
              onChangeText={setLetterTitle}
            />

            <View style={styles.aiHeaderRow}>
              <Text style={styles.inputLabel}>Letter Prose</Text>
              <TouchableOpacity
                style={styles.aiDraftBtn}
                onPress={handleAiDraft}
                disabled={aiDrafting}
              >
                {aiDrafting ? (
                  <ActivityIndicator size="small" color={COLORS.RoseCoral} />
                ) : (
                  <>
                    <Sparkles size={12} color={COLORS.RoseCoral} />
                    <Text style={styles.aiDraftText}>AI Poetic Draft</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Pour your heart out here..."
              placeholderTextColor="#A89F98"
              multiline
              value={letterBody}
              onChangeText={setLetterBody}
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSendLetter}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Seal & Deliver Letter 💌</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setComposeModalOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CREATE COUPON MODAL */}
      <Modal
        visible={couponModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCouponModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Create Love Coupon</Text>

            <Text style={styles.inputLabel}>Pick Icon</Text>
            <View style={styles.waxRow}>
              {['💆‍♀️', '🥞', '🍿', '🍨', '🍕', '🧸'].map((em) => (
                <TouchableOpacity
                  key={em}
                  style={[
                    styles.emojiBox,
                    cpEmoji === em && styles.emojiBoxSelected,
                  ]}
                  onPress={() => setCpEmoji(em)}
                >
                  <Text style={{ fontSize: 20 }}>{em}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Coupon Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 20-Minute Back Rub & Cuddles"
              placeholderTextColor="#A89F98"
              value={cpTitle}
              onChangeText={setCpTitle}
            />

            <Text style={styles.inputLabel}>Details & Perks</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Valid any evening, no questions asked!"
              placeholderTextColor="#A89F98"
              value={cpDesc}
              onChangeText={setCpDesc}
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: COLORS.SoftLavender }]}
              onPress={handleCreateCoupon}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Add to Coupon Book 🎟️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setCouponModalOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.White,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BorderSubtle,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginLeft: 8,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.LightBlueSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.HotPink,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.WarmCharcoalMuted,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  newActionBanner: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  newActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  letterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 14,
  },
  letterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  waxSeal: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  waxSealSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  letterTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  letterMeta: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
  },
  newTag: {
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  newTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.RoseCoral,
  },
  parchmentBody: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  letterBodyText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoal,
    lineHeight: 20,
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  couponCardRedeemed: {
    opacity: 0.6,
    backgroundColor: '#F8F5F1',
  },
  couponLeft: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.SoftRose,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  couponEmoji: {
    fontSize: 24,
  },
  couponCenter: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  couponDesc: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  couponFrom: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.RoseCoral,
    marginTop: 4,
  },
  couponRight: {
    marginLeft: 8,
  },
  redeemBtn: {
    backgroundColor: COLORS.RoseCoral,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  redeemedBadge: {
    backgroundColor: '#E5E0D8',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  redeemedText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.WarmCharcoalMuted,
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
    marginBottom: 6,
  },
  waxRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  waxOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  waxOptionSelected: {
    borderWidth: 2.5,
    borderColor: COLORS.WarmCharcoal,
  },
  waxOptionLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  emojiBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  emojiBoxSelected: {
    borderColor: COLORS.SoftLavender,
    backgroundColor: COLORS.SoftLavenderSoft,
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
    marginBottom: 12,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  aiDraftText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.RoseCoral,
  },
  submitBtn: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
});
