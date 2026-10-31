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
import { useWeSpace } from '../../context/WeSpaceContext';
import { Memory, MemoryImageType } from '../../types';
import { COLORS } from '../../constants/theme';
import { geminiService } from '../../services/gemini';
import { PolaroidArtwork } from '../../components/scrapbook/PolaroidArtwork';
import {
  Sparkles,
  Plus,
  BookOpen,
  Heart,
  MapPin,
  BookmarkCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react-native';

const MEMORY_THEMES: {
  type: MemoryImageType;
  tag: string;
  emoji: string;
  tapeColor: string;
}[] = [
  {
    type: 'SUMMER_BEACH',
    tag: 'Golden Beach',
    emoji: '🏖️',
    tapeColor: '#FDE68A',
  },
  {
    type: 'CAFE_DATE',
    tag: 'Café & Books',
    emoji: '☕',
    tapeColor: '#FECDD3',
  },
  {
    type: 'PARK_PICNIC',
    tag: 'Green Meadow',
    emoji: '🧺',
    tapeColor: '#A7F3D0',
  },
  {
    type: 'STARRY_CAMPING',
    tag: 'Starry Night',
    emoji: '🌌',
    tapeColor: '#DDD6FE',
  },
  {
    type: 'RAINY_MOVIE',
    tag: 'Rainy Cinema',
    emoji: '🌧️',
    tapeColor: '#BAE6FD',
  },
  {
    type: 'COOKING_NIGHT',
    tag: 'Kitchen Date',
    emoji: '🍝',
    tapeColor: '#FBCFE8',
  },
];

export default function ScrapbookScreen() {
  const {
    couple,
    memories,
    diaryEntries,
    addMemory,
    toggleFavoriteMemory,
    deleteMemory,
    saveDiaryEntry,
  } = useWeSpace();

  const [modalOpen, setModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [aiDigest, setAiDigest] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // New Memory Form
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedType, setSelectedType] =
    useState<MemoryImageType>('CAFE_DATE');

  const handleGenerateAiDigest = async () => {
    setAiLoading(true);
    setSavedToast(false);
    const result = await geminiService.generateScrapbookDigest(
      memories,
      couple.geminiApiKey
    );
    setAiDigest(result);
    setAiLoading(false);
  };

  const handleSaveDigest = () => {
    if (!aiDigest) return;
    saveDiaryEntry(aiDigest);
    setSavedToast(true);
  };

  const handleCreateMemory = () => {
    if (!title.trim()) return;
    const randomTilt = Math.round((Math.random() * 7 - 3.5) * 10) / 10;

    const newMemory: Memory = {
      id: `mem_${Date.now()}`,
      coupleId: couple.coupleId,
      title: title.trim(),
      caption:
        caption.trim() ||
        'A quiet, golden chapter in our shared sanctuary.',
      author: couple.activeUser,
      imageType: selectedType,
      rotationDegrees: randomTilt,
      location: location.trim() || 'Our Sanctuary',
      isFavorite: false,
      timestamp: Date.now(),
    };

    addMemory(newMemory);
    setModalOpen(false);
    setTitle('');
    setCaption('');
    setLocation('');
  };

  const filteredMemories = memories.filter((m) => {
    if (filterMode === 'FAV') return Boolean(m.isFavorite);
    if (filterMode === couple.partner1Name)
      return m.author === couple.partner1Name;
    if (filterMode === couple.partner2Name)
      return m.author === couple.partner2Name;
    return true;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. AI POETIC SCRAPBOOK DIGEST */}
      <View style={styles.digestCard}>
        <View style={styles.digestHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.bookIconBox}>
              <BookOpen size={16} color={COLORS.RoseCoral} />
            </View>
            <View>
              <Text style={styles.digestTitle}>AI Poetic Scrapbook Diary</Text>
              <Text style={styles.digestSub}>
                Powered by Gemini 3.8 Flash Interactions
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.digestBtn}
            onPress={handleGenerateAiDigest}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Sparkles size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.digestBtnText}>Weave Story</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {aiDigest ? (
          <View style={styles.digestBody}>
            <Text style={styles.digestText}>{aiDigest}</Text>
            <View style={styles.digestActionsRow}>
              <TouchableOpacity
                style={styles.saveAnthologyBtn}
                onPress={handleSaveDigest}
                disabled={savedToast}
              >
                <BookmarkCheck size={13} color={COLORS.RoseCoral} />
                <Text style={styles.saveAnthologyText}>
                  {savedToast ? 'Saved to Anthology ✓' : 'Save to Anthology'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.digestPrompt}>
            Tap "Weave Story" to transform your pinned polaroids into an intimate, hand-crafted poetic journal entry.
          </Text>
        )}
      </View>

      {/* 2. HEADER & FILTER PILLS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Polaroid Memory Wall</Text>
        <TouchableOpacity
          style={styles.addPolaroidBtn}
          onPress={() => setModalOpen(true)}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addPolaroidText}>Pin Polaroid</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {[
          { key: 'ALL', label: `All (${memories.length})` },
          { key: 'FAV', label: 'Favorites ♥' },
          { key: couple.partner1Name, label: couple.partner1Name },
          { key: couple.partner2Name, label: couple.partner2Name },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterChip,
              filterMode === tab.key && styles.filterChipActive,
            ]}
            onPress={() => setFilterMode(tab.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterMode === tab.key && styles.filterChipTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. POLAROID WALL WITH WASHI TAPE & ARTWORK */}
      <View style={styles.polaroidWall}>
        {filteredMemories.map((mem) => {
          const themeMeta =
            MEMORY_THEMES.find((t) => t.type === mem.imageType) ||
            MEMORY_THEMES[0];
          const dateStr = new Date(mem.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <View
              key={mem.id}
              style={[
                styles.polaroidFrame,
                {
                  transform: [{ rotate: `${mem.rotationDegrees}deg` }],
                },
              ]}
            >
              {/* Decorative Washi Tape Strip on Top */}
              <View
                style={[
                  styles.washiTape,
                  { backgroundColor: themeMeta.tapeColor },
                ]}
              />

              {/* Custom Procedural Illustrated Artwork */}
              <View style={styles.artworkWrap}>
                <PolaroidArtwork scene={mem.imageType} height={185} />
                <View style={styles.locationBadge}>
                  <MapPin size={10} color="#FFFFFF" />
                  <Text style={styles.locationBadgeText}>
                    {mem.location || themeMeta.tag}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() => toggleFavoriteMemory(mem.id)}
                >
                  <Heart
                    size={16}
                    color={mem.isFavorite ? COLORS.RoseCoral : '#FFFFFF'}
                    fill={mem.isFavorite ? COLORS.RoseCoral : 'transparent'}
                  />
                </TouchableOpacity>
              </View>

              {/* Polaroid Handwritten Caption Area */}
              <View style={styles.captionArea}>
                <View style={styles.titleRow}>
                  <Text style={styles.polaroidTitle}>{mem.title}</Text>
                  <TouchableOpacity onPress={() => deleteMemory(mem.id)}>
                    <Trash2 size={14} color="#D0C7C0" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.polaroidCaption}>"{mem.caption}"</Text>
                <View style={styles.polaroidFooter}>
                  <View style={styles.authorPill}>
                    <Text style={styles.polaroidAuthor}>
                      Pinned by {mem.author}
                    </Text>
                  </View>
                  <Text style={styles.polaroidDate}>{dateStr}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* 4. SAVED DIARY ANTHOLOGY */}
      {diaryEntries.length > 0 && (
        <View style={styles.anthologySection}>
          <Text style={styles.sectionTitle}>Saved Poetic Anthology</Text>
          {diaryEntries.map((entry) => (
            <View key={entry.id} style={styles.anthologyCard}>
              <Text style={styles.anthologyText}>"{entry.content}"</Text>
              <Text style={styles.anthologyMeta}>
                Written from {entry.memoryCount} memories •{' '}
                {new Date(entry.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* PIN NEW POLAROID MODAL */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Pin New Polaroid Memory</Text>

            <Text style={styles.inputLabel}>Memory Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Homemade Pasta & Jazz Night"
              placeholderTextColor="#A89F98"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Location / Spot</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Botanica Roasters / Living Room"
              placeholderTextColor="#A89F98"
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.inputLabel}>Sweet Story / Caption</Text>
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
              placeholder="Write down the little details you never want to forget..."
              placeholderTextColor="#A89F98"
              multiline
              value={caption}
              onChangeText={setCaption}
            />

            <Text style={styles.inputLabel}>Choose Illustrated Backdrop</Text>
            <View style={styles.themeGrid}>
              {MEMORY_THEMES.map((th) => (
                <TouchableOpacity
                  key={th.type}
                  style={[
                    styles.themeOption,
                    selectedType === th.type && styles.selectedThemeOption,
                  ]}
                  onPress={() => setSelectedType(th.type)}
                >
                  <Text style={{ fontSize: 20 }}>{th.emoji}</Text>
                  <Text style={styles.themeOptionText}>{th.tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCreateMemory}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Pin to Scrapbook Wall</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalOpen(false)}
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
  digestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D0E7FC',
    marginBottom: 18,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  digestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.SoftRose,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  digestTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  digestSub: {
    fontSize: 10,
    color: COLORS.WarmCharcoalMuted,
    fontWeight: '600',
  },
  digestBtn: {
    backgroundColor: COLORS.HotPink,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  digestBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  digestBody: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.HotPink,
  },
  digestText: {
    fontSize: 13,
    color: COLORS.WarmCharcoal,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  digestActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  saveAnthologyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFC2DF',
    gap: 5,
  },
  saveAnthologyText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.HotPink,
  },
  digestPrompt: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  addPolaroidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.HotPink,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  addPolaroidText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  filterChipActive: {
    backgroundColor: COLORS.HotPink,
    borderColor: COLORS.HotPink,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  polaroidWall: {
    alignItems: 'center',
  },
  polaroidFrame: {
    width: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    paddingBottom: 18,
    marginBottom: 28,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D0E7FC',
    position: 'relative',
  },
  washiTape: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 86,
    height: 20,
    borderRadius: 3,
    opacity: 0.88,
    zIndex: 10,
    transform: [{ rotate: '-2deg' }],
  },
  artworkWrap: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(42, 36, 33, 0.72)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  locationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(42, 36, 33, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionArea: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  polaroidTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  polaroidCaption: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoalMuted,
    marginTop: 5,
    lineHeight: 19,
  },
  polaroidFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  authorPill: {
    backgroundColor: COLORS.SoftRose,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  polaroidAuthor: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.RoseCoral,
  },
  polaroidDate: {
    fontSize: 11,
    color: COLORS.WarmCharcoalLight,
    fontWeight: '600',
  },
  anthologySection: {
    marginTop: 8,
    gap: 10,
  },
  anthologyCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  anthologyText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoal,
    lineHeight: 20,
  },
  anthologyMeta: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoalLight,
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
    marginBottom: 6,
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
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  themeOption: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  selectedThemeOption: {
    borderColor: COLORS.RoseCoral,
    backgroundColor: COLORS.SoftRose,
  },
  themeOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
    marginTop: 4,
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
