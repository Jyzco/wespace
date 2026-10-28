import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  CoupleState,
  PetState,
  SnapPhoto,
  Expense,
  SavingGoal,
  BudgetLimit,
  Memory,
} from './src/types';
import { COLORS } from './src/constants/theme';
import { storage } from './src/services/storage';

// Screens & Components
import { Header } from './src/components/common/Header';
import { HeartHugOverlay } from './src/components/common/HeartHugOverlay';
import { PairingScreen } from './src/screens/PairingScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TreasuryScreen } from './src/screens/TreasuryScreen';
import { PetScreen } from './src/screens/PetScreen';
import { ScrapbookScreen } from './src/screens/ScrapbookScreen';
import { LivingRoomScreen } from './src/screens/LivingRoomScreen';

// Icons
import {
  Home,
  Wallet,
  Smile,
  BookOpen,
  Flame,
} from 'lucide-react-native';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Core App States
  const [couple, setCouple] = useState<CoupleState | null>(null);
  const [pet, setPet] = useState<PetState | null>(null);
  const [snap, setSnap] = useState<SnapPhoto | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savings, setSavings] = useState<SavingGoal[]>([]);
  const [budgetLimit, setBudgetLimit] = useState<BudgetLimit>({
    coupleId: '',
    monthlyLimit: 1200,
  });

  // Heart Hug Overlay state
  const [heartHugVisible, setHeartHugVisible] = useState(false);
  const [heartHugSender, setHeartHugSender] = useState('');

  // Initial Load from AsyncStorage
  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedCouple = await storage.getCouple();
        const loadedPet = await storage.getPet();
        const loadedSnap = await storage.getSnap();
        const loadedExpenses = await storage.getExpenses();
        const loadedSavings = await storage.getSavings();
        const loadedLimit = await storage.getBudgetLimit();

        setCouple(loadedCouple);
        setPet(loadedPet);
        setSnap(loadedSnap);
        setExpenses(loadedExpenses);
        setSavings(loadedSavings);
        setBudgetLimit(loadedLimit);
      } catch (err) {
        console.error('Error loading WeSpace data', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Handlers for switching user profile
  const handleSwitchUser = () => {
    if (!couple) return;
    const nextUser =
      couple.activeUser === couple.partner1Name
        ? couple.partner2Name
        : couple.partner1Name;
    const updated = { ...couple, activeUser: nextUser };
    setCouple(updated);
    storage.saveCouple(updated);
  };

  const handleUpdateApiKey = (key: string) => {
    if (!couple) return;
    const updated = { ...couple, geminiApiKey: key };
    setCouple(updated);
    storage.saveCouple(updated);
  };

  const handleUnpair = async () => {
    await storage.resetAll();
    const freshCouple = await storage.getCouple();
    setCouple({ ...freshCouple, isPaired: false });
  };

  const handlePairSuccess = (pairedState: CoupleState) => {
    setCouple(pairedState);
    storage.saveCouple(pairedState);
  };

  // Heart Hug Trigger
  const handleSendHeartHug = () => {
    if (!couple) return;
    setHeartHugSender(couple.activeUser);
    setHeartHugVisible(true);
  };

  // State update callbacks
  const handleUpdatePet = (updatedPet: PetState) => {
    setPet(updatedPet);
    storage.savePet(updatedPet);
  };

  const handleUpdateSnap = (updatedSnap: SnapPhoto) => {
    setSnap(updatedSnap);
    storage.saveSnap(updatedSnap);
  };

  const handleAddExpense = (expense: Expense) => {
    const updated = [expense, ...expenses];
    setExpenses(updated);
    storage.saveExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    storage.saveExpenses(updated);
  };

  const handleAddSavingGoal = (goal: SavingGoal) => {
    const updated = [...savings, goal];
    setSavings(updated);
    storage.saveSavings(updated);
  };

  const handleContributeSavings = (goalId: string, amount: number) => {
    const updated = savings.map((g) =>
      g.id === goalId
        ? { ...g, currentSaved: Math.min(g.targetAmount, g.currentSaved + amount) }
        : g
    );
    setSavings(updated);
    storage.saveSavings(updated);
  };

  const [memories, setMemories] = useState<Memory[]>([]);
  useEffect(() => {
    storage.getMemories().then(setMemories);
  }, []);

  const handleAddMemory = (memory: Memory) => {
    const updated = [memory, ...memories];
    setMemories(updated);
    storage.saveMemories(updated);
  };

  if (loading || !couple || !pet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.RoseCoral} />
        <Text style={styles.loadingText}>Opening Sanctuary...</Text>
      </View>
    );
  }

  // If not paired, show Pairing Screen
  if (!couple.isPaired) {
    return <PairingScreen onPairSuccess={handlePairSuccess} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Synchronizer Bar */}
      <Header
        couple={couple}
        onSwitchUser={handleSwitchUser}
        onUpdateApiKey={handleUpdateApiKey}
        onUnpair={handleUnpair}
      />

      {/* Main Tab Screen Area */}
      <View style={styles.screenContainer}>
        {activeTab === 0 && (
          <DashboardScreen
            couple={couple}
            pet={pet}
            snap={snap}
            expenses={expenses}
            memories={memories}
            onSendHeartHug={handleSendHeartHug}
            onUpdateSnap={handleUpdateSnap}
            onNavigateTab={setActiveTab}
          />
        )}
        {activeTab === 1 && (
          <TreasuryScreen
            couple={couple}
            expenses={expenses}
            savings={savings}
            budgetLimit={budgetLimit}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddSavingGoal={handleAddSavingGoal}
            onContributeSavings={handleContributeSavings}
          />
        )}
        {activeTab === 2 && (
          <PetScreen
            couple={couple}
            pet={pet}
            onUpdatePet={handleUpdatePet}
          />
        )}
        {activeTab === 3 && (
          <ScrapbookScreen
            couple={couple}
            memories={memories}
            onAddMemory={handleAddMemory}
          />
        )}
        {activeTab === 4 && (
          <LivingRoomScreen
            couple={couple}
            onSendHeartHug={handleSendHeartHug}
          />
        )}
      </View>

      {/* Bottom 5-Tab Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab(0)}
          activeOpacity={0.7}
        >
          <Home
            size={22}
            color={activeTab === 0 ? COLORS.RoseCoral : COLORS.WarmCharcoalMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 0 && styles.activeTabLabel,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab(1)}
          activeOpacity={0.7}
        >
          <Wallet
            size={22}
            color={activeTab === 1 ? COLORS.RoseCoral : COLORS.WarmCharcoalMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 1 && styles.activeTabLabel,
            ]}
          >
            Treasury
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab(2)}
          activeOpacity={0.7}
        >
          <Smile
            size={22}
            color={activeTab === 2 ? COLORS.RoseCoral : COLORS.WarmCharcoalMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 2 && styles.activeTabLabel,
            ]}
          >
            Pet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab(3)}
          activeOpacity={0.7}
        >
          <BookOpen
            size={22}
            color={activeTab === 3 ? COLORS.RoseCoral : COLORS.WarmCharcoalMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 3 && styles.activeTabLabel,
            ]}
          >
            Diary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab(4)}
          activeOpacity={0.7}
        >
          <Flame
            size={22}
            color={activeTab === 4 ? COLORS.RoseCoral : COLORS.WarmCharcoalMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 4 && styles.activeTabLabel,
            ]}
          >
            Living
          </Text>
        </TouchableOpacity>
      </View>

      {/* Full-Screen Synchronized Heart Hug Overlay */}
      <HeartHugOverlay
        visible={heartHugVisible}
        sender={heartHugSender}
        onDismiss={() => setHeartHugVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.CozyCream,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.WarmCharcoal,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.GradientStart,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.CozyCream,
    borderTopWidth: 1,
    borderTopColor: COLORS.ShadowBeige,
    paddingTop: 8,
    paddingBottom: 14,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.WarmCharcoalMuted,
    marginTop: 4,
  },
  activeTabLabel: {
    color: COLORS.RoseCoral,
    fontWeight: '800',
  },
});
