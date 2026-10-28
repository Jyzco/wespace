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
import { CoupleState, Memory, MemoryImageType } from '../types';
import { COLORS } from '../constants/theme';
import { geminiService } from '../services/gemini';
import {
  Sparkles,
  Plus,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react-native';

interface ScrapbookScreenProps {
  couple: CoupleState;
  memories: Memory[];
  onAddMemory: (memory: Memory) => void;
}

export const ScrapbookScreen: React.FC<ScrapbookScreenProps> = ({
  couple,
  memories,
  onAddMemory,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [aiDigest, setAiDigest] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // New Memory Form
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedType, setSelectedType] = useState<MemoryImageType>('CAFE_DATE');

  const handleGenerateAiDigest = async () => {
    setAiLoading(true);
    const result = await geminiService.generateScrapbookDigest(
      memories,
      couple.geminiApiKey
    );
    setAiDigest(result);
    setAiLoading(false);
  };

  const handleCreateMemory = () => {
    if (!title.trim()) return;

    // Physics tilt (-8.0 to +8.0 deg)
    const randomTilt = Math.round((Math.random() * 14 - 7) * 10) / 10;

    const newMemory: Memory = {
      id: `mem_${Date.now()}`,
      coupleId: couple.coupleId,
      title: title.trim(),
      caption: caption.trim() || 'A cherished, tender memory with you.',
      author: couple.activeUser,
      imageType: selectedType,
      rotationDegrees: randomTilt,
      timestamp: Date.now(),
    };

    onAddMemory(newMemory);
    setModalOpen(false);
    setTitle('');
    setCaption('');
  };

  const getMemoryVisual = (type: MemoryImageType) => {
    switch (type) {
      case 'SUMMER_BEACH':
        return {
          emoji: '🏖️',
          bg: '#E0F2FE',
          accent: '#0284C7',
          tag: 'Summer Seaside',
        };
      case 'PARK_PICNIC':
        return {
          emoji: '🧺',
          bg: '#DCFCE7',
          accent: '#16A34A',
          tag: 'Green Meadow',
        };
      case 'CAFE_DATE':
        return {
          emoji: '☕',
          bg: '#FEF3C7',
          accent: '#B45309',
          tag: 'Café & Books',
        };
      case 'STARRY_CAMPING':
        return {
          emoji: '🌌',
          bg: '#EDE9FE',
          accent: '#7C3AED',
          tag: 'Starry Night',
        };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* AI Romantic Digest Section */}
      <View style={styles.digestCard}>
        <View style={styles.digestHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BookOpen size={18} color={COLORS.RoseCoral} />
            <Text style={styles.digestTitle}>AI Romantic Diary Digest</Text>
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
                <Text style={styles.digestBtnText}>Write Recap</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {aiDigest ? (
          <View style={styles.digestBody}>
            <Text style={styles.digestText}>{aiDigest}</Text>
          </View>
        ) : (
          <Text style={styles.digestPrompt}>
            Tap "Write Recap" to synthesize your recent memories into a poetic, intimate journal entry written in warm, nostalgic prose.
          </Text>
        )}
      </View>

      {/* Memory Wall Header & Add Button */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Polaroid Memory Wall</Text>
        <TouchableOpacity
          style={styles.addPolaroidBtn}
          onPress={() => setModalOpen(true)}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addPolaroidText}>Pin Memory</Text>
        </TouchableOpacity>
      </View>

      {/* Polaroid Grid with Physics Tilts */}
      <View style={styles.polaroidWall}>
        {memories.map((mem) => {
          const visual = getMemoryVisual(mem.imageType);
          const dateStr = new Date(mem.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
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
              {/* Photo Area */}
              <View style={[styles.photoArea, { backgroundColor: visual.bg }]}>
                <Text style={styles.photoEmoji}>{visual.emoji}</Text>
                <View style={styles.photoTag}>
                  <Text style={[styles.photoTagText, { color: visual.accent }]}>
                    {visual.tag}
                  </Text>
                </View>
              </View>

              {/* Polaroid Bottom Note Area */}
              <View style={styles.captionArea}>
                <Text style={styles.polaroidTitle}>{mem.title}</Text>
                <Text style={styles.polaroidCaption}>"{mem.caption}"</Text>
                <View style={styles.polaroidFooter}>
                  <Text style={styles.polaroidAuthor}>By {mem.author}</Text>
                  <Text style={styles.polaroidDate}>{dateStr}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Add Memory Modal */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Pin New Polaroid</Text>

            <Text style={styles.inputLabel}>Memory Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Cooking Pasta Together 🍝"
              placeholderTextColor="#AAA"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Sweet Caption</Text>
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
              placeholder="e.g. Floured aprons, jazz music, and laughing when the sauce splashed."
              placeholderTextColor="#AAA"
              multiline
              value={caption}
              onChangeText={setCaption}
            />

            <Text style={styles.inputLabel}>Select Theme Style:</Text>
            <View style={styles.typeRow}>
              {(['CAFE_DATE', 'SUMMER_BEACH', 'PARK_PICNIC', 'STARRY_CAMPING'] as MemoryImageType[]).map(
                (type) => {
                  const vis = getMemoryVisual(type);
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.themeOption,
                        selectedType === type && styles.selectedThemeOption,
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text style={{ fontSize: 22 }}>{vis.emoji}</Text>
                      <Text style={styles.themeOptionText}>{vis.tag}</Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleCreateMemory}
            >
              <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Pin to Memory Wall</Text>
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
  digestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FCE7EA',
    marginBottom: 20,
    shadowColor: COLORS.RoseCoral,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  digestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  digestTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginLeft: 6,
  },
  digestBtn: {
    backgroundColor: COLORS.RoseCoral,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  digestBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  digestBody: {
    backgroundColor: '#FFF9F9',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.RoseCoral,
  },
  digestText: {
    fontSize: 13,
    color: COLORS.WarmCharcoal,
    lineHeight: 20,
    fontStyle: 'italic',
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
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  addPolaroidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.RoseCoral,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addPolaroidText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  polaroidWall: {
    alignItems: 'center',
  },
  polaroidFrame: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    paddingBottom: 16,
    marginBottom: 24,
    shadowColor: '#2A2421',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ECE7E1',
  },
  photoArea: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photoEmoji: {
    fontSize: 64,
  },
  photoTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  photoTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  captionArea: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  polaroidTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  polaroidCaption: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  polaroidFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  polaroidAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.RoseCoral,
  },
  polaroidDate: {
    fontSize: 11,
    color: '#AAA',
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 14,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  themeOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  selectedThemeOption: {
    borderColor: COLORS.RoseCoral,
    backgroundColor: COLORS.SoftRose,
  },
  themeOptionText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
    marginTop: 4,
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
