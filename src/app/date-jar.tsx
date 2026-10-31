import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Path, Circle, G } from 'react-native-svg';
import { useWeSpace } from '../context/WeSpaceContext';
import { COLORS, DATE_JAR_IDEAS } from '../constants/theme';
import {
  Sparkles,
  X,
  Plus,
  CheckCircle2,
  Circle as CircleIcon,
  Compass,
  Clock,
} from 'lucide-react-native';

export default function DateJarAndBucketModal() {
  const { bucketList, addBucketItem, toggleBucketItem } = useWeSpace();

  const [selectedBudget, setSelectedBudget] = useState<string>('ALL');
  const [drawnIdea, setDrawnIdea] = useState(DATE_JAR_IDEAS[0]);
  const [newBucketTitle, setNewBucketTitle] = useState('');
  const [newBucketCat, setNewBucketCat] = useState<
    'Cozy' | 'Travel' | 'Adventure' | 'Food'
  >('Cozy');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleShakeJar = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 12,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -12,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const pool =
        selectedBudget === 'ALL'
          ? DATE_JAR_IDEAS
          : DATE_JAR_IDEAS.filter((d) => d.budget === selectedBudget);
      const list = pool.length > 0 ? pool : DATE_JAR_IDEAS;
      const picked = list[Math.floor(Math.random() * list.length)];
      setDrawnIdea(picked);
    });
  };

  const handleAddBucket = () => {
    if (!newBucketTitle.trim()) return;
    addBucketItem({
      id: `bk_${Date.now()}`,
      title: newBucketTitle.trim(),
      category: newBucketCat,
      isCompleted: false,
    });
    setNewBucketTitle('');
  };

  const completedCount = bucketList.filter((b) => b.isCompleted).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Compass size={20} color={COLORS.HotPink} />
          <Text style={styles.headerTitle}>Date Spin Jar & Bucket List</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
        >
          <X size={20} color={COLORS.WarmCharcoal} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. INTERACTIVE DATE NIGHT JAR */}
        <LinearGradient
          colors={['#E0F2FE', '#FFFFFF', '#FFF0F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.jarCard}
        >
          <Text style={styles.jarCardTitle}>The Romantic Date Jar</Text>
          <Text style={styles.jarCardSub}>
            Filter by vibe and shake the crystal wish jar to pull tonight’s adventure!
          </Text>

          {/* Budget Filter Pills */}
          <View style={styles.budgetRow}>
            {['ALL', 'FREE', 'COZY', 'ADVENTURE'].map((b) => (
              <TouchableOpacity
                key={b}
                style={[
                  styles.budgetChip,
                  selectedBudget === b && styles.budgetChipActive,
                ]}
                onPress={() => setSelectedBudget(b)}
              >
                <Text
                  style={[
                    styles.budgetChipText,
                    selectedBudget === b && styles.budgetChipTextActive,
                  ]}
                >
                  {b === 'ALL'
                    ? 'All Vibes'
                    : b === 'FREE'
                    ? 'Free 🌸'
                    : b === 'COZY'
                    ? 'Cozy $ ☕'
                    : 'Adventure ✨'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Animated Crystal Sky & Hot-Pink Wish Jar */}
          <Animated.View
            style={{
              transform: [{ translateX: shakeAnim }],
              marginVertical: 10,
            }}
          >
            <Svg width="130" height="145" viewBox="0 0 130 145">
              {/* Soft Aura Halo */}
              <Circle cx="65" cy="78" r="56" fill="#E0F2FE" opacity="0.6" />
              <Circle cx="65" cy="78" r="44" fill="#FFF0F6" opacity="0.7" />

              {/* Frosted Rose-Pink Cap & Ribbon */}
              <Rect x="41" y="10" width="48" height="14" rx="5" fill="#FF85B3" />
              <Rect x="37" y="20" width="56" height="9" rx="4" fill="#FF2D78" />
              {/* Cute Silk Bow on Neck */}
              <Path d="M 55 25 C 45 18 45 32 55 25 Z" fill="#FFB3D1" />
              <Path d="M 75 25 C 85 18 85 32 75 25 Z" fill="#FFB3D1" />
              <Circle cx="65" cy="25" r="4" fill="#FFFFFF" />

              {/* Crystal Sky-Blue Glass Body */}
              <Path
                d="M 40 29 L 90 29 Q 104 39 104 57 L 104 116 Q 104 132 87 132 L 43 132 Q 26 132 26 116 L 26 57 Q 26 39 40 29 Z"
                fill="#F0F9FF"
                stroke="#38BDF8"
                strokeWidth="3"
              />
              {/* Glass Specular Reflection */}
              <Path
                d="M 34 52 L 34 110"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Folded Love Capsules & Stars Inside */}
              <G>
                <Rect
                  x="38"
                  y="94"
                  width="24"
                  height="14"
                  rx="7"
                  fill="#FF2D78"
                  transform="rotate(-12 38 94)"
                />
                <Rect
                  x="64"
                  y="98"
                  width="24"
                  height="14"
                  rx="7"
                  fill="#38BDF8"
                  transform="rotate(15 64 98)"
                />
                <Rect
                  x="46"
                  y="74"
                  width="24"
                  height="14"
                  rx="7"
                  fill="#FF85B3"
                  transform="rotate(6 46 74)"
                />
                <Rect
                  x="68"
                  y="78"
                  width="22"
                  height="14"
                  rx="7"
                  fill="#7DD3FC"
                  transform="rotate(-18 68 78)"
                />
                {/* Floating Heart in Center */}
                <Path
                  d="M 65 62 C 65 62 54 54 54 48 C 54 44 58 42 62 44 C 64 45 65 47 65 47 C 65 47 66 45 68 44 C 72 42 76 44 76 48 C 76 54 65 62 65 62 Z"
                  fill="#FF2D78"
                />
              </G>
            </Svg>
          </Animated.View>

          {/* Drawn Date Card */}
          <View style={styles.drawnTicket}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketEmoji}>{drawnIdea.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.ticketTitle}>{drawnIdea.title}</Text>
                <View style={styles.ticketBadgesRow}>
                  <View style={styles.ticketTag}>
                    <Text style={styles.ticketTagText}>{drawnIdea.budget}</Text>
                  </View>
                  <View style={styles.ticketDuration}>
                    <Clock size={10} color={COLORS.WarmCharcoalMuted} />
                    <Text style={styles.ticketDurationText}>
                      {drawnIdea.duration}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.ticketDesc}>{drawnIdea.description}</Text>
          </View>

          <TouchableOpacity
            style={styles.shakeBtn}
            onPress={handleShakeJar}
            activeOpacity={0.85}
          >
            <Sparkles size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.shakeBtnText}>Shake the Date Jar ✨</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* 2. SHARED COUPLE BUCKET LIST */}
        <View style={styles.bucketSection}>
          <View style={styles.bucketHeader}>
            <Text style={styles.bucketTitle}>Our Shared Bucket List</Text>
            <Text style={styles.bucketProgress}>
              {completedCount}/{bucketList.length} Completed
            </Text>
          </View>

          {/* Add New Bucket Item */}
          <View style={styles.addBucketBox}>
            <TextInput
              style={styles.bucketInput}
              placeholder="Add a new couple dream or milestone..."
              placeholderTextColor="#A89F98"
              value={newBucketTitle}
              onChangeText={setNewBucketTitle}
            />
            <TouchableOpacity
              style={styles.addBucketBtn}
              onPress={handleAddBucket}
            >
              <Plus size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.catSelectorRow}>
            {(['Cozy', 'Food', 'Adventure', 'Travel'] as const).map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.catMiniChip,
                  newBucketCat === c && styles.catMiniChipActive,
                ]}
                onPress={() => setNewBucketCat(c)}
              >
                <Text
                  style={[
                    styles.catMiniText,
                    newBucketCat === c && styles.catMiniTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {bucketList.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.bucketItemCard,
                item.isCompleted && styles.bucketItemCompleted,
              ]}
              onPress={() => toggleBucketItem(item.id)}
              activeOpacity={0.8}
            >
              {item.isCompleted ? (
                <CheckCircle2 size={20} color={COLORS.SageGreen} />
              ) : (
                <CircleIcon size={20} color="#CBD5E1" />
              )}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.bucketItemText,
                    item.isCompleted && styles.bucketItemTextStrike,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.bucketItemCat}>
                  {item.category}
                  {item.completedDate ? ` • Done ${item.completedDate}` : ''}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  jarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E7FC',
    marginBottom: 20,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  jarCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  jarCardSub: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  budgetChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  budgetChipActive: {
    backgroundColor: COLORS.HotPink,
    borderColor: COLORS.HotPink,
  },
  budgetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
  budgetChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  drawnTicket: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 14,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketEmoji: {
    fontSize: 32,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  ticketBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  ticketTag: {
    backgroundColor: '#FFF0F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFC2DF',
  },
  ticketTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.HotPink,
  },
  ticketDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ticketDurationText: {
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
    fontWeight: '600',
  },
  ticketDesc: {
    fontSize: 13,
    color: COLORS.WarmCharcoalMuted,
    lineHeight: 19,
  },
  shakeBtn: {
    width: '100%',
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shakeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  bucketSection: {
    marginBottom: 20,
  },
  bucketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bucketTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  bucketProgress: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.SageGreen,
  },
  addBucketBox: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  bucketInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.WarmCharcoal,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  addBucketBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.WarmCharcoal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  catMiniChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  catMiniChipActive: {
    backgroundColor: COLORS.SoftRose,
    borderColor: COLORS.RoseCoral,
  },
  catMiniText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
  },
  catMiniTextActive: {
    color: COLORS.RoseCoral,
    fontWeight: '800',
  },
  bucketItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 8,
  },
  bucketItemCompleted: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  bucketItemText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  bucketItemTextStrike: {
    textDecorationLine: 'line-through',
    color: COLORS.WarmCharcoalLight,
  },
  bucketItemCat: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
  },
});
