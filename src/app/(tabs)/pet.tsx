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
import { useWeSpace } from '../../context/WeSpaceContext';
import { PetType, PetAccessory } from '../../types';
import { COLORS } from '../../constants/theme';
import { PouPetCanvas } from '../../components/pet/PouPetCanvas';
import {
  Utensils,
  Gamepad2,
  Sparkles,
  HeartPulse,
  Moon,
  Sun,
  Edit2,
  Check,
  Award,
  Shirt,
} from 'lucide-react-native';

const ACCESSORIES: { id: PetAccessory; label: string; emoji: string }[] = [
  { id: 'CROWN', label: 'Crown', emoji: '👑' },
  { id: 'BOW', label: 'Silk Bow', emoji: '🎀' },
  { id: 'GLASSES', label: 'Shades', emoji: '🕶️' },
  { id: 'FLOWER', label: 'Daisy', emoji: '🌸' },
  { id: 'SCARF', label: 'Scarf', emoji: '🧣' },
  { id: 'NONE', label: 'Natural', emoji: '✨' },
];

export default function PetCompanionScreen() {
  const { couple, pet, updatePet } = useWeSpace();

  const [activeParticle, setActiveParticle] = useState<string | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [petNameInput, setPetNameInput] = useState(pet.petName);

  const triggerParticle = (emoji: string) => {
    setActiveParticle(emoji);
    setTimeout(() => setActiveParticle(null), 1000);
  };

  const handleBellyRub = () => {
    if (pet.isSleeping) {
      triggerParticle('💤');
      return;
    }
    updatePet({
      ...pet,
      happiness: Math.min(100, pet.happiness + 8),
      xp: (pet.xp || 0) + 10,
      lastPlayedBy: couple.activeUser,
      lastUpdated: Date.now(),
    });
    triggerParticle('💕');
  };

  const handleFeed = () => {
    if (pet.isSleeping) return;
    updatePet({
      ...pet,
      hunger: Math.min(100, pet.hunger + 25),
      cleanliness: Math.max(0, pet.cleanliness - 15),
      health: Math.min(100, pet.health + 5),
      xp: (pet.xp || 0) + 15,
      lastFedBy: couple.activeUser,
      lastUpdated: Date.now(),
    });
    triggerParticle('🍖');
  };

  const handlePlay = () => {
    if (pet.isSleeping) return;
    updatePet({
      ...pet,
      happiness: Math.min(100, pet.happiness + 20),
      energy: Math.max(0, pet.energy - 15),
      cleanliness: Math.max(0, pet.cleanliness - 10),
      xp: (pet.xp || 0) + 20,
      lastPlayedBy: couple.activeUser,
      lastUpdated: Date.now(),
    });
    triggerParticle('🎾');
  };

  const handleClean = () => {
    updatePet({
      ...pet,
      cleanliness: 100,
      happiness: Math.min(100, pet.happiness + 15),
      health: Math.min(100, pet.health + 10),
      xp: (pet.xp || 0) + 15,
      lastCleanedBy: couple.activeUser,
      lastUpdated: Date.now(),
    });
    triggerParticle('🧼');
  };

  const handleHeal = () => {
    updatePet({
      ...pet,
      health: 100,
      happiness: Math.min(100, pet.happiness + 10),
      xp: (pet.xp || 0) + 15,
      lastHealedBy: couple.activeUser,
      lastUpdated: Date.now(),
    });
    triggerParticle('💊');
  };

  const handleToggleSleep = () => {
    if (pet.isSleeping) {
      updatePet({
        ...pet,
        isSleeping: false,
        energy: 100,
        happiness: Math.min(100, pet.happiness + 10),
        xp: (pet.xp || 0) + 10,
        lastUpdated: Date.now(),
      });
      triggerParticle('☀️');
    } else {
      updatePet({
        ...pet,
        isSleeping: true,
        lastUpdated: Date.now(),
      });
      triggerParticle('💤');
    }
  };

  const handleSpeciesChange = (type: PetType) => {
    updatePet({ ...pet, petType: type });
  };

  const handleAccessoryChange = (accessory: PetAccessory) => {
    updatePet({ ...pet, accessory });
    triggerParticle('✨');
  };

  const handleRename = () => {
    if (!petNameInput.trim()) return;
    updatePet({ ...pet, petName: petNameInput.trim() });
    setRenameModalOpen(false);
  };

  const renderGauge = (label: string, value: number, color: string) => (
    <View style={styles.gaugeContainer} key={label}>
      <View style={styles.gaugeHeader}>
        <Text style={styles.gaugeLabel}>{label}</Text>
        <Text style={[styles.gaugeValue, { color }]}>{value}%</Text>
      </View>
      <View style={styles.gaugeTrack}>
        <View
          style={[
            styles.gaugeFill,
            { width: `${value}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. PET NURSERY STAGE CARD */}
      <View style={styles.nurseryCard}>
        {/* Top Level & Name Row */}
        <View style={styles.topRow}>
          <View style={styles.levelBadge}>
            <Award size={13} color="#B45309" />
            <Text style={styles.levelText}>
              Lv. {pet.level || 4} • {pet.xp || 65}/100 XP
            </Text>
          </View>

          <TouchableOpacity
            style={styles.renameChip}
            onPress={() => {
              setPetNameInput(pet.petName);
              setRenameModalOpen(true);
            }}
          >
            <Text style={styles.petNameTitle}>{pet.petName}</Text>
            <Edit2 size={13} color={COLORS.RoseCoral} style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>

        {/* Species Selector */}
        <View style={styles.speciesRow}>
          {(['CAT', 'DOG', 'BIRD', 'BUNNY'] as PetType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.speciesChip,
                pet.petType === type && styles.selectedSpeciesChip,
              ]}
              onPress={() => handleSpeciesChange(type)}
            >
              <Text
                style={[
                  styles.speciesText,
                  pet.petType === type && styles.selectedSpeciesText,
                ]}
              >
                {type === 'CAT'
                  ? '🐱 Cat'
                  : type === 'DOG'
                  ? '🐶 Dog'
                  : type === 'BIRD'
                  ? '🐦 Bird'
                  : '🐰 Bunny'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Procedural Pou Canvas with Tap-to-Cuddle */}
        <PouPetCanvas
          pet={pet}
          activeParticle={activeParticle}
          onPetTap={handleBellyRub}
        />

        {/* Mood Banner */}
        <View style={styles.moodBanner}>
          <Text style={styles.moodBannerText}>
            {pet.isSleeping
              ? `💤 ${pet.petName} is curled up having sweet dreams...`
              : pet.health < 35 || pet.happiness < 35
              ? `🥺 ${pet.petName} needs extra cuddles and care!`
              : pet.cleanliness < 75
              ? `🛁 ${pet.petName} got muddy playing—time for a warm bath!`
              : `✨ ${pet.petName} is purring with happiness in your sanctuary!`}
          </Text>
        </View>
      </View>

      {/* 2. WEARABLE PET BOUTIQUE */}
      <View style={styles.boutiqueCard}>
        <View style={styles.cardHeaderRow}>
          <Shirt size={16} color={COLORS.RoseCoral} />
          <Text style={styles.cardHeaderTitle}>Pet Wardrobe & Accessories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {ACCESSORIES.map((acc) => {
            const isSelected = (pet.accessory || 'NONE') === acc.id;
            return (
              <TouchableOpacity
                key={acc.id}
                style={[
                  styles.accessoryChip,
                  isSelected && styles.accessoryChipSelected,
                ]}
                onPress={() => handleAccessoryChange(acc.id)}
              >
                <Text style={{ fontSize: 18 }}>{acc.emoji}</Text>
                <Text
                  style={[
                    styles.accessoryLabel,
                    isSelected && styles.accessoryLabelSelected,
                  ]}
                >
                  {acc.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. CO-CARE INTERACTION BUTTONS */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardHeaderTitle}>Co-Parenting Care Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionBtn, pet.isSleeping && styles.disabledBtn]}
            onPress={handleFeed}
            disabled={pet.isSleeping}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFEDD5' }]}>
              <Utensils size={20} color="#EA580C" />
            </View>
            <Text style={styles.actionBtnLabel}>Feed 🍖</Text>
            <Text style={styles.actionBtnSub}>+25 Hunger</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, pet.isSleeping && styles.disabledBtn]}
            onPress={handlePlay}
            disabled={pet.isSleeping}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FCE7F3' }]}>
              <Gamepad2 size={20} color="#DB2777" />
            </View>
            <Text style={styles.actionBtnLabel}>Play 🎾</Text>
            <Text style={styles.actionBtnSub}>+20 Happy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleClean}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
              <Sparkles size={20} color="#0284C7" />
            </View>
            <Text style={styles.actionBtnLabel}>Wash 🧼</Text>
            <Text style={styles.actionBtnSub}>100% Clean</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleHeal}>
            <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <HeartPulse size={20} color="#16A34A" />
            </View>
            <Text style={styles.actionBtnLabel}>Heal 💊</Text>
            <Text style={styles.actionBtnSub}>100% Health</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              pet.isSleeping && {
                borderColor: COLORS.HoneyYellow,
                backgroundColor: '#FFFBEB',
              },
            ]}
            onPress={handleToggleSleep}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: pet.isSleeping ? '#FEF3C7' : '#EDE9FE' },
              ]}
            >
              {pet.isSleeping ? (
                <Sun size={20} color="#D97706" />
              ) : (
                <Moon size={20} color="#7C3AED" />
              )}
            </View>
            <Text style={styles.actionBtnLabel}>
              {pet.isSleeping ? 'Wake Up ☀️' : 'Sleep 💤'}
            </Text>
            <Text style={styles.actionBtnSub}>
              {pet.isSleeping ? '100% Energy' : 'Rest Mode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, pet.isSleeping && styles.disabledBtn]}
            onPress={handleBellyRub}
            disabled={pet.isSleeping}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.SoftRose }]}>
              <Text style={{ fontSize: 18 }}>🥰</Text>
            </View>
            <Text style={styles.actionBtnLabel}>Cuddle 💕</Text>
            <Text style={styles.actionBtnSub}>+10 XP</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. 5-PARAMETER VITAL GAUGES */}
      <View style={styles.gaugesCard}>
        <Text style={[styles.cardHeaderTitle, { marginBottom: 12 }]}>
          5-Parameter Vital Matrix
        </Text>
        {renderGauge('Hunger', pet.hunger, '#F97316')}
        {renderGauge('Happiness', pet.happiness, '#EC4899')}
        {renderGauge('Energy', pet.energy, COLORS.HoneyYellow)}
        {renderGauge('Cleanliness', pet.cleanliness, COLORS.PastelBlue)}
        {renderGauge('Health', pet.health, '#10B981')}
      </View>

      {/* 5. SHARED PARENTING LOG */}
      <View style={styles.historyCard}>
        <Text style={styles.historyHeading}>Co-Parenting Activity Log</Text>
        <View style={styles.historyRow}>
          <Text style={styles.historyItem}>
            🍖 Fed by <Text style={styles.boldText}>{pet.lastFedBy}</Text>
          </Text>
          <Text style={styles.historyItem}>
            🎾 Played with <Text style={styles.boldText}>{pet.lastPlayedBy}</Text>
          </Text>
        </View>
        <View style={styles.historyRow}>
          <Text style={styles.historyItem}>
            🧼 Washed by <Text style={styles.boldText}>{pet.lastCleanedBy}</Text>
          </Text>
          <Text style={styles.historyItem}>
            💊 Healed by <Text style={styles.boldText}>{pet.lastHealedBy}</Text>
          </Text>
        </View>
      </View>

      {/* RENAME MODAL */}
      <Modal
        visible={renameModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Rename Your Companion</Text>
            <TextInput
              style={styles.renameInput}
              value={petNameInput}
              onChangeText={setPetNameInput}
              placeholder="e.g. Mocha"
              placeholderTextColor="#A89F98"
            />
            <TouchableOpacity style={styles.modalSubmit} onPress={handleRename}>
              <Check size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSubmitText}>Save Name</Text>
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
  nurseryCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 26,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 14,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 5,
  },
  renameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  petNameTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  speciesChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  selectedSpeciesChip: {
    borderColor: COLORS.RoseCoral,
    backgroundColor: COLORS.SoftRose,
  },
  speciesText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  selectedSpeciesText: {
    color: COLORS.RoseCoral,
    fontWeight: '800',
  },
  moodBanner: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
  },
  moodBannerText: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  boutiqueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  accessoryChip: {
    backgroundColor: COLORS.CozyCream,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 74,
  },
  accessoryChipSelected: {
    borderColor: COLORS.RoseCoral,
    backgroundColor: COLORS.SoftRose,
  },
  accessoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
  },
  accessoryLabelSelected: {
    color: COLORS.RoseCoral,
    fontWeight: '800',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {
    width: '31%',
    backgroundColor: COLORS.CozyCream,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  actionBtnSub: {
    fontSize: 10,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
  },
  gaugesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BorderSubtle,
    marginBottom: 14,
  },
  gaugeContainer: {
    marginBottom: 10,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gaugeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  gaugeValue: {
    fontSize: 12,
    fontWeight: '900',
  },
  gaugeTrack: {
    height: 8,
    backgroundColor: '#EFEAE4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  historyCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  historyHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyItem: {
    fontSize: 12,
    color: COLORS.WarmCharcoalMuted,
  },
  boldText: {
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(42, 36, 33, 0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
    marginBottom: 12,
  },
  renameInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.WarmCharcoal,
    marginBottom: 16,
  },
  modalSubmit: {
    backgroundColor: COLORS.RoseCoral,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
