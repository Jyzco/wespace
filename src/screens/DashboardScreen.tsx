import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {
  CoupleState,
  PetState,
  SnapPhoto,
  Expense,
  Memory,
  SnapImageType,
} from '../types';
import { COLORS } from '../constants/theme';
import {
  Heart,
  Camera,
  Sparkles,
  Calendar,
  Wallet,
  Smile,
  Send,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';

interface DashboardScreenProps {
  couple: CoupleState;
  pet: PetState;
  snap: SnapPhoto | null;
  expenses: Expense[];
  memories: Memory[];
  onSendHeartHug: () => void;
  onUpdateSnap: (snap: SnapPhoto) => void;
  onNavigateTab: (tabIndex: number) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  couple,
  pet,
  snap,
  expenses,
  memories,
  onSendHeartHug,
  onUpdateSnap,
  onNavigateTab,
}) => {
  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [snapNote, setSnapNote] = useState('');
  const [selectedImageType, setSelectedImageType] = useState<SnapImageType>('COZY_COFFEE');

  const partnerName =
    couple.activeUser === couple.partner1Name
      ? couple.partner2Name
      : couple.partner1Name;

  // Total spending
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Check if snap is within 24 hours
  const isSnapActive = snap && Date.now() - snap.timestamp <= 24 * 3600 * 1000;
  const hoursRemaining = snap
    ? Math.max(0, Math.floor((24 * 3600 * 1000 - (Date.now() - snap.timestamp)) / 3600000))
    : 0;

  const handlePostSnap = () => {
    const newSnap: SnapPhoto = {
      id: `snap_${Date.now()}`,
      coupleId: couple.coupleId,
      sender: couple.activeUser,
      imageType: selectedImageType,
      note: snapNote.trim() || 'Thinking of you right now 💕',
      timestamp: Date.now(),
    };
    onUpdateSnap(newSnap);
    setSnapModalOpen(false);
    setSnapNote('');
  };

  const getSnapEmoji = (type: SnapImageType) => {
    switch (type) {
      case 'SUNSET_WALK':
        return '🌅';
      case 'COZY_COFFEE':
        return '☕';
      case 'SMILE_GOOFY':
        return '🥰';
      case 'BEDTIME_STUFF':
        return '🧸';
      default:
        return '✨';
    }
  };

  const getSnapDescription = (type: SnapImageType) => {
    switch (type) {
      case 'SUNSET_WALK':
        return 'Golden Sunset Stroll';
      case 'COZY_COFFEE':
        return 'Morning Warm Brew';
      case 'SMILE_GOOFY':
        return 'Happy Goofy Smile';
      case 'BEDTIME_STUFF':
        return 'Cozy Night Pillow';
      default:
        return 'A Sweet Moment';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Days Together Counter Card */}
      <View style={styles.counterCard}>
        <View style={styles.counterHeader}>
          <Calendar size={18} color={COLORS.RoseCoral} />
          <Text style={styles.counterLabel}>Our Journey</Text>
        </View>
        <Text style={styles.counterNumber}>{couple.daysTogether}</Text>
        <Text style={styles.counterUnit}>Days of Love & Warmth</Text>
        <View style={styles.presenceRow}>
          <View style={styles.presenceDot} />
          <Text style={styles.presenceText}>
            {partnerName} was active 4m ago • Loving you always
          </Text>
        </View>
      </View>

      {/* Heart Hug Quick Trigger CTA */}
      <TouchableOpacity
        style={styles.heartHugBar}
        onPress={onSendHeartHug}
        activeOpacity={0.85}
      >
        <View style={styles.heartIconCircle}>
          <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.heartHugTitle}>Send Heart Hug to {partnerName}</Text>
          <Text style={styles.heartHugSubtitle}>
            Triggers a synchronized full-screen heartbeat overlay
          </Text>
        </View>
        <Send size={16} color={COLORS.RoseCoral} />
      </TouchableOpacity>

      {/* Live 24h Locket Snap Card */}
      <View style={styles.locketCard}>
        <View style={styles.locketHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Camera size={18} color={COLORS.RoseCoral} />
            <Text style={styles.locketTitle}>Live 24h Locket Widget</Text>
          </View>
          {isSnapActive && (
            <View style={styles.expiryBadge}>
              <Clock size={11} color="#B45309" />
              <Text style={styles.expiryText}>{hoursRemaining}h left</Text>
            </View>
          )}
        </View>

        {isSnapActive && snap ? (
          <View style={styles.snapDisplayArea}>
            <View style={styles.snapPhotoFrame}>
              <Text style={styles.snapEmoji}>{getSnapEmoji(snap.imageType)}</Text>
              <Text style={styles.snapTypeLabel}>
                {getSnapDescription(snap.imageType)}
              </Text>
            </View>
            <View style={styles.snapNoteBox}>
              <Text style={styles.handwrittenNote}>"{snap.note}"</Text>
              <Text style={styles.snapAuthor}>— From {snap.sender}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptySnap}>
            <Text style={styles.emptySnapEmoji}>💌</Text>
            <Text style={styles.emptySnapTitle}>No Active Locket Snap</Text>
            <Text style={styles.emptySnapSub}>
              Share a quick moment to stay close across the miles!
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.updateSnapButton}
          onPress={() => setSnapModalOpen(true)}
          activeOpacity={0.8}
        >
          <Camera size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.updateSnapText}>
            {isSnapActive ? 'Post New Locket Snap' : 'Post Today’s Locket Snap'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Overview Summary Grid */}
      <Text style={styles.gridSectionTitle}>Sanctuary Quick Overview</Text>
      <View style={styles.overviewGrid}>
        {/* Pet Summary Card */}
        <TouchableOpacity
          style={[styles.gridCard, { borderColor: '#FDE68A' }]}
          onPress={() => onNavigateTab(2)}
          activeOpacity={0.75}
        >
          <View style={styles.gridCardTop}>
            <Smile size={18} color="#D97706" />
            <Text style={styles.gridCardBadge}>
              {pet.isSleeping ? 'Sleeping 💤' : `${pet.happiness}% Happy`}
            </Text>
          </View>
          <Text style={styles.gridCardTitle}>{pet.petName}</Text>
          <Text style={styles.gridCardSub}>
            Hunger: {pet.hunger}% • Energy: {pet.energy}%
          </Text>
        </TouchableOpacity>

        {/* Treasury Summary Card */}
        <TouchableOpacity
          style={[styles.gridCard, { borderColor: '#BAE6FD' }]}
          onPress={() => onNavigateTab(1)}
          activeOpacity={0.75}
        >
          <View style={styles.gridCardTop}>
            <Wallet size={18} color="#0284C7" />
            <Text style={styles.gridCardBadge}>50/50 Split</Text>
          </View>
          <Text style={styles.gridCardTitle}>${totalSpent.toFixed(2)}</Text>
          <Text style={styles.gridCardSub}>
            {expenses.length} shared records this month
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Memory Highlight */}
      {memories.length > 0 && (
        <TouchableOpacity
          style={styles.recentMemoryCard}
          onPress={() => onNavigateTab(3)}
          activeOpacity={0.8}
        >
          <View style={styles.memoryTopRow}>
            <Sparkles size={16} color={COLORS.HoneyYellow} />
            <Text style={styles.memorySectionLabel}>Recent Scrapbook Memory</Text>
          </View>
          <Text style={styles.recentMemoryTitle}>{memories[0].title}</Text>
          <Text style={styles.recentMemoryCaption} numberOfLines={2}>
            "{memories[0].caption}"
          </Text>
          <Text style={styles.recentMemoryAuthor}>Shared by {memories[0].author}</Text>
        </TouchableOpacity>
      )}

      {/* Post Snap Modal */}
      <Modal
        visible={snapModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSnapModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Share Locket Snap</Text>
            <Text style={styles.modalSubheading}>
              Ephemeral 24-hour photo widget sent to {partnerName}'s home screen.
            </Text>

            <Text style={styles.pickerLabel}>Choose Moment Mood:</Text>
            <View style={styles.typeSelectorRow}>
              {(['COZY_COFFEE', 'SUNSET_WALK', 'SMILE_GOOFY', 'BEDTIME_STUFF'] as SnapImageType[]).map(
                (type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      selectedImageType === type && styles.selectedTypeOption,
                    ]}
                    onPress={() => setSelectedImageType(type)}
                  >
                    <Text style={{ fontSize: 24 }}>{getSnapEmoji(type)}</Text>
                    <Text style={styles.typeOptionText}>
                      {type === 'COZY_COFFEE'
                        ? 'Coffee'
                        : type === 'SUNSET_WALK'
                        ? 'Walk'
                        : type === 'SMILE_GOOFY'
                        ? 'Smile'
                        : 'Bedtime'}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.pickerLabel}>Handwritten Note:</Text>
            <TextInput
              style={styles.snapInput}
              placeholder="e.g. Thinking of you while drinking morning tea 💕"
              placeholderTextColor="#AAA"
              value={snapNote}
              onChangeText={setSnapNote}
              multiline
              maxLength={120}
            />

            <TouchableOpacity style={styles.postSnapSubmit} onPress={handlePostSnap}>
              <CheckCircle2 size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.postSnapSubmitText}>Send 24-Hour Snap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSnapModalOpen(false)}
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
  counterCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },
  counterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  counterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.RoseCoral,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  counterNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    lineHeight: 62,
  },
  counterUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
  presenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  presenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.RoseCoral,
    marginRight: 6,
  },
  presenceText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.RoseCoral,
  },
  heartHugBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FCE7EA',
    marginBottom: 16,
    shadowColor: COLORS.RoseCoral,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  heartIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.RoseCoral,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartHugTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  heartHugSubtitle: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
  },
  locketCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 18,
  },
  locketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  locketTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  expiryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 4,
  },
  snapDisplayArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    alignItems: 'center',
    marginBottom: 12,
  },
  snapPhotoFrame: {
    alignItems: 'center',
    marginBottom: 12,
  },
  snapEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  snapTypeLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  snapNoteBox: {
    backgroundColor: COLORS.SurfaceSubtle,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.RoseCoral,
  },
  handwrittenNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoal,
    lineHeight: 20,
  },
  snapAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.RoseCoral,
    marginTop: 6,
    textAlign: 'right',
  },
  emptySnap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptySnapEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  emptySnapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  emptySnapSub: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 20,
  },
  updateSnapButton: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateSnapText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  gridSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  gridCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridCardBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
    backgroundColor: '#F3ECE4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gridCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  gridCardSub: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
  },
  recentMemoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  memoryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  memorySectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.HoneyYellow,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  recentMemoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  recentMemoryCaption: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
  },
  recentMemoryAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.RoseCoral,
    marginTop: 6,
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
  },
  modalSubheading: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
    marginBottom: 8,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  selectedTypeOption: {
    borderColor: COLORS.RoseCoral,
    backgroundColor: COLORS.SoftRose,
  },
  typeOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
    marginTop: 4,
  },
  snapInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: COLORS.WarmCharcoal,
    height: 70,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  postSnapSubmit: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  postSnapSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
  },
});
