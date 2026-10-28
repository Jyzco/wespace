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
import { PetState, PetType, CoupleState } from '../types';
import { COLORS } from '../constants/theme';
import { PouPetCanvas } from '../components/pet/PouPetCanvas';
import {
  Utensils,
  Gamepad2,
  Sparkles,
  HeartPulse,
  Moon,
  Sun,
  Edit2,
  Check,
} from 'lucide-react-native';

interface PetScreenProps {
  couple: CoupleState;
  pet: PetState;
  onUpdatePet: (pet: PetState) => void;
}

export const PetScreen: React.FC<PetScreenProps> = ({
  couple,
  pet,
  onUpdatePet,
}) => {
  const [activeParticle, setActiveParticle] = useState<string | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [petNameInput, setPetNameInput] = useState(pet.petName);

  const triggerParticle = (emoji: string) => {
    setActiveParticle(emoji);
    setTimeout(() => setActiveParticle(null), 1000);
  };

  // 4.2 Actions from blueprint
  const handleFeed = () => {
    if (pet.isSleeping) return;
    const updated: PetState = {
      ...pet,
      hunger: Math.min(100, pet.hunger + 25),
      cleanliness: Math.max(0, pet.cleanliness - 15),
      health: Math.min(100, pet.health + 5),
      lastFedBy: couple.activeUser,
      lastUpdated: Date.now(),
    };
    onUpdatePet(updated);
    triggerParticle('🍖');
  };

  const handlePlay = () => {
    if (pet.isSleeping) return;
    const updated: PetState = {
      ...pet,
      happiness: Math.min(100, pet.happiness + 20),
      energy: Math.max(0, pet.energy - 15),
      cleanliness: Math.max(0, pet.cleanliness - 10),
      lastPlayedBy: couple.activeUser,
      lastUpdated: Date.now(),
    };
    onUpdatePet(updated);
    triggerParticle('🎾');
  };

  const handleClean = () => {
    const updated: PetState = {
      ...pet,
      cleanliness: 100,
      happiness: Math.min(100, pet.happiness + 15),
      health: Math.min(100, pet.health + 10),
      lastCleanedBy: couple.activeUser,
      lastUpdated: Date.now(),
    };
    onUpdatePet(updated);
    triggerParticle('🧼');
  };

  const handleHeal = () => {
    const updated: PetState = {
      ...pet,
      health: 100,
      happiness: Math.min(100, pet.happiness + 10),
      lastHealedBy: couple.activeUser,
      lastUpdated: Date.now(),
    };
    onUpdatePet(updated);
    triggerParticle('💊');
  };

  const handleToggleSleep = () => {
    if (pet.isSleeping) {
      // Waking up
      const updated: PetState = {
        ...pet,
        isSleeping: false,
        energy: 100,
        happiness: Math.min(100, pet.happiness + 10),
        lastUpdated: Date.now(),
      };
      onUpdatePet(updated);
      triggerParticle('☀️');
    } else {
      // Going to sleep
      const updated: PetState = {
        ...pet,
        isSleeping: true,
        lastUpdated: Date.now(),
      };
      onUpdatePet(updated);
      triggerParticle('💤');
    }
  };

  const handleSpeciesChange = (type: PetType) => {
    onUpdatePet({
      ...pet,
      petType: type,
    });
  };

  const handleRename = () => {
    if (!petNameInput.trim()) return;
    onUpdatePet({
      ...pet,
      petName: petNameInput.trim(),
    });
    setRenameModalOpen(false);
  };

  const renderGauge = (label: string, value: number, color: string) => (
    <View style={styles.gaugeContainer} key={label}>
      <View style={styles.gaugeHeader}>
        <Text style={styles.gaugeLabel}>{label}</Text>
        <Text style={[styles.gaugeValue, { color }]}>{value}%</Text>
      </View>
      <View style={styles.gaugeTrack}>
        <View style={[styles.gaugeFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Pet Header Card */}
      <View style={styles.petHeaderCard}>
        <View style={styles.titleRow}>
          <Text style={styles.petName}>{pet.petName}</Text>
          <TouchableOpacity
            style={styles.renameButton}
            onPress={() => setRenameModalOpen(true)}
          >
            <Edit2 size={14} color={COLORS.RoseCoral} />
          </TouchableOpacity>
        </View>

        {/* Pet Type Switcher */}
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

        {/* Procedural Pou Canvas */}
        <PouPetCanvas pet={pet} activeParticle={activeParticle} />

        {/* Sleeping / Mood Status */}
        <Text style={styles.statusMood}>
          {pet.isSleeping
            ? '💤 Mocha is having sweet dreams...'
            : pet.health < 35 || pet.happiness < 35
            ? '🥺 Feeling a bit down, needs some love!'
            : pet.cleanliness < 75
            ? '🛁 A bit messy from playing outside!'
            : '✨ Joyful and cozy in your sanctuary!'}
        </Text>
      </View>

      {/* 5-Parameter Tamagotchi Gauges */}
      <View style={styles.gaugesCard}>
        <Text style={styles.gaugesHeading}>Vital Energy & Well-being</Text>
        {renderGauge('Hunger', pet.hunger, '#F97316')}
        {renderGauge('Happiness', pet.happiness, '#EC4899')}
        {renderGauge('Energy', pet.energy, COLORS.HoneyYellow)}
        {renderGauge('Cleanliness', pet.cleanliness, COLORS.PastelBlue)}
        {renderGauge('Health', pet.health, '#10B981')}
      </View>

      {/* Interaction Action Controls */}
      <View style={styles.actionsCard}>
        <Text style={styles.actionsHeading}>Co-Care Actions</Text>
        <View style={styles.actionGrid}>
          {/* Feed */}
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

          {/* Play */}
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

          {/* Wash */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleClean}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
              <Sparkles size={20} color="#0284C7" />
            </View>
            <Text style={styles.actionBtnLabel}>Wash 🧼</Text>
            <Text style={styles.actionBtnSub}>Clean 100%</Text>
          </TouchableOpacity>

          {/* Heal */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleHeal}>
            <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <HeartPulse size={20} color="#16A34A" />
            </View>
            <Text style={styles.actionBtnLabel}>Heal 💊</Text>
            <Text style={styles.actionBtnSub}>Health 100%</Text>
          </TouchableOpacity>

          {/* Sleep Toggle */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              pet.isSleeping && { borderColor: COLORS.HoneyYellow },
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
              {pet.isSleeping ? 'Restore' : 'Rest'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Co-parenting Care History */}
      <View style={styles.historyCard}>
        <Text style={styles.historyHeading}>Shared Parenting Moments</Text>
        <View style={styles.historyRow}>
          <Text style={styles.historyItem}>🍖 Last fed by: <Text style={{ fontWeight: '700' }}>{pet.lastFedBy}</Text></Text>
          <Text style={styles.historyItem}>🎾 Last played by: <Text style={{ fontWeight: '700' }}>{pet.lastPlayedBy}</Text></Text>
        </View>
        <View style={styles.historyRow}>
          <Text style={styles.historyItem}>🧼 Last washed by: <Text style={{ fontWeight: '700' }}>{pet.lastCleanedBy}</Text></Text>
          <Text style={styles.historyItem}>💊 Last healed by: <Text style={{ fontWeight: '700' }}>{pet.lastHealedBy}</Text></Text>
        </View>
      </View>

      {/* Rename Modal */}
      <Modal
        visible={renameModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Rename Companion</Text>
            <TextInput
              style={styles.renameInput}
              value={petNameInput}
              onChangeText={setPetNameInput}
              placeholder="e.g. Mocha"
              placeholderTextColor="#AAA"
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
  petHeaderCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  petName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.WarmCharcoal,
  },
  renameButton: {
    marginLeft: 8,
    padding: 4,
  },
  speciesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  speciesChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 3,
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
  },
  statusMood: {
    fontSize: 13,
    color: COLORS.WarmCharcoalMuted,
    fontStyle: 'italic',
    marginTop: 6,
  },
  gaugesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 14,
  },
  gaugesHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 12,
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
    fontWeight: '800',
  },
  gaugeTrack: {
    height: 7,
    backgroundColor: '#EFEAE4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    marginBottom: 14,
  },
  actionsHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.WarmCharcoal,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '31%',
    backgroundColor: COLORS.CozyCream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  actionBtnSub: {
    fontSize: 9,
    color: COLORS.WarmCharcoalMuted,
    marginTop: 2,
  },
  historyCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  historyHeading: {
    fontSize: 12,
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
    fontSize: 11,
    color: COLORS.WarmCharcoalMuted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.CozyCream,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.ShadowBeige,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
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
    fontWeight: '700',
  },
});
