import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import {
  CoupleState,
  PetState,
  SnapPhoto,
  Expense,
  SavingGoal,
  BudgetLimit,
  Memory,
  DiaryEntry,
  DailyQuestion,
  LoveLetter,
  LoveCoupon,
  BucketItem,
  StickyNote,
  PartnerMood,
} from '../types';
import {
  INITIAL_COUPLE,
  INITIAL_PET,
  INITIAL_DAILY_QUESTION,
} from '../constants/theme';
import { storage } from '../services/storage';

interface WeSpaceContextValue {
  loading: boolean;
  couple: CoupleState;
  pet: PetState;
  snap: SnapPhoto | null;
  expenses: Expense[];
  savings: SavingGoal[];
  budgetLimit: BudgetLimit;
  memories: Memory[];
  diaryEntries: DiaryEntry[];
  dailyQuestion: DailyQuestion;
  letters: LoveLetter[];
  coupons: LoveCoupon[];
  bucketList: BucketItem[];
  stickyNotes: StickyNote[];
  heartHugVisible: boolean;
  heartHugSender: string;

  // Actions
  switchUser: () => void;
  updateMoodAndStatus: (mood: PartnerMood, statusText: string) => void;
  updateApiKey: (key: string) => void;
  unpair: () => Promise<void>;
  pairSuccess: (state: CoupleState) => void;
  sendHeartHug: (customSender?: string) => void;
  dismissHeartHug: () => void;

  // Pet
  updatePet: (pet: PetState) => void;

  // Snap
  updateSnap: (snap: SnapPhoto) => void;
  reactToSnap: (emoji: string) => void;

  // Treasury
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  settleAllExpenses: () => void;
  updateBudgetLimit: (newLimit: number) => void;
  addSavingGoal: (goal: SavingGoal) => void;
  contributeSavings: (goalId: string, amount: number) => void;

  // Scrapbook
  addMemory: (memory: Memory) => void;
  toggleFavoriteMemory: (id: string) => void;
  deleteMemory: (id: string) => void;
  saveDiaryEntry: (content: string) => void;

  // Daily Question
  submitDailyAnswer: (answer: string) => void;
  setNewDailyQuestion: (question: string, category: string) => void;

  // Letters & Coupons & Bucket List & Sticky Notes
  addLoveLetter: (letter: LoveLetter) => void;
  markLetterRead: (id: string) => void;
  addLoveCoupon: (coupon: LoveCoupon) => void;
  redeemCoupon: (id: string) => void;
  addBucketItem: (item: BucketItem) => void;
  toggleBucketItem: (id: string) => void;
  addStickyNote: (note: StickyNote) => void;
  deleteStickyNote: (id: string) => void;
}

const WeSpaceContext = createContext<WeSpaceContextValue | undefined>(undefined);

export const WeSpaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [couple, setCouple] = useState<CoupleState>(INITIAL_COUPLE);
  const [pet, setPet] = useState<PetState>(INITIAL_PET);
  const [snap, setSnap] = useState<SnapPhoto | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savings, setSavings] = useState<SavingGoal[]>([]);
  const [budgetLimit, setBudgetLimit] = useState<BudgetLimit>({
    coupleId: 'ROOM_882910',
    monthlyLimit: 1200,
  });
  const [memories, setMemories] = useState<Memory[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestion>(
    INITIAL_DAILY_QUESTION
  );
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [coupons, setCoupons] = useState<LoveCoupon[]>([]);
  const [bucketList, setBucketList] = useState<BucketItem[]>([]);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);

  const [heartHugVisible, setHeartHugVisible] = useState(false);
  const [heartHugSender, setHeartHugSender] = useState('');

  useEffect(() => {
    async function loadAll() {
      try {
        const [
          c,
          p,
          s,
          e,
          sav,
          lim,
          mem,
          diary,
          dq,
          letList,
          cpList,
          bkList,
          snList,
        ] = await Promise.all([
          storage.getCouple(),
          storage.getPet(),
          storage.getSnap(),
          storage.getExpenses(),
          storage.getSavings(),
          storage.getBudgetLimit(),
          storage.getMemories(),
          storage.getDiaryEntries(),
          storage.getDailyQuestion(),
          storage.getLetters(),
          storage.getCoupons(),
          storage.getBucketList(),
          storage.getStickyNotes(),
        ]);

        setCouple(c);
        setPet(p);
        setSnap(s);
        setExpenses(e);
        setSavings(sav);
        setBudgetLimit(lim);
        setMemories(mem);
        setDiaryEntries(diary);
        setDailyQuestion(dq);
        setLetters(letList);
        setCoupons(cpList);
        setBucketList(bkList);
        setStickyNotes(snList);
      } catch (err) {
        console.error('Failed loading WeSpace context', err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore on unsupported platforms
    }
  };

  const switchUser = () => {
    triggerHaptic();
    const nextUser =
      couple.activeUser === couple.partner1Name
        ? couple.partner2Name
        : couple.partner1Name;
    const updated = { ...couple, activeUser: nextUser };
    setCouple(updated);
    storage.saveCouple(updated);
  };

  const updateMoodAndStatus = (mood: PartnerMood, statusText: string) => {
    triggerHaptic();
    const isP1 = couple.activeUser === couple.partner1Name;
    const updated: CoupleState = isP1
      ? { ...couple, partner1Mood: mood, partner1Status: statusText }
      : { ...couple, partner2Mood: mood, partner2Status: statusText };
    setCouple(updated);
    storage.saveCouple(updated);
  };

  const updateApiKey = (key: string) => {
    const updated = { ...couple, geminiApiKey: key };
    setCouple(updated);
    storage.saveCouple(updated);
  };

  const unpair = async () => {
    await storage.resetAll();
    const fresh = await storage.getCouple();
    setCouple({ ...fresh, isPaired: false });
  };

  const pairSuccess = (state: CoupleState) => {
    triggerHaptic();
    setCouple(state);
    storage.saveCouple(state);
  };

  const sendHeartHug = (customSender?: string) => {
    setHeartHugSender(customSender || couple.activeUser);
    setHeartHugVisible(true);
  };

  const dismissHeartHug = () => {
    setHeartHugVisible(false);
  };

  const updatePet = (updatedPet: PetState) => {
    triggerHaptic();
    // Calculate XP level up if xp >= 100
    let nextLevel = updatedPet.level || 1;
    let nextXp = updatedPet.xp || 0;
    if (nextXp >= 100) {
      nextLevel += Math.floor(nextXp / 100);
      nextXp = nextXp % 100;
    }
    const finalPet = { ...updatedPet, level: nextLevel, xp: nextXp };
    setPet(finalPet);
    storage.savePet(finalPet);
  };

  const updateSnap = (updatedSnap: SnapPhoto) => {
    triggerHaptic();
    setSnap(updatedSnap);
    storage.saveSnap(updatedSnap);
  };

  const reactToSnap = (emoji: string) => {
    if (!snap) return;
    triggerHaptic();
    const nextReactions = [...(snap.reactions || []), emoji].slice(-6);
    const updated = { ...snap, reactions: nextReactions };
    setSnap(updated);
    storage.saveSnap(updated);
  };

  const addExpense = (expense: Expense) => {
    triggerHaptic();
    const updated = [expense, ...expenses];
    setExpenses(updated);
    storage.saveExpenses(updated);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    storage.saveExpenses(updated);
  };

  const settleAllExpenses = () => {
    triggerHaptic();
    // Equalize by marking existing personal expenses as "Shared"
    const updated = expenses.map((e) => ({ ...e, paidBy: 'Shared' }));
    setExpenses(updated);
    storage.saveExpenses(updated);
  };

  const updateBudgetLimit = (newLimit: number) => {
    const updated = { ...budgetLimit, monthlyLimit: newLimit };
    setBudgetLimit(updated);
    storage.saveBudgetLimit(updated);
  };

  const addSavingGoal = (goal: SavingGoal) => {
    triggerHaptic();
    const updated = [...savings, goal];
    setSavings(updated);
    storage.saveSavings(updated);
  };

  const contributeSavings = (goalId: string, amount: number) => {
    triggerHaptic();
    const updated = savings.map((g) =>
      g.id === goalId
        ? { ...g, currentSaved: Math.min(g.targetAmount, g.currentSaved + amount) }
        : g
    );
    setSavings(updated);
    storage.saveSavings(updated);
  };

  const addMemory = (memory: Memory) => {
    triggerHaptic();
    const updated = [memory, ...memories];
    setMemories(updated);
    storage.saveMemories(updated);
  };

  const toggleFavoriteMemory = (id: string) => {
    triggerHaptic();
    const updated = memories.map((m) =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    );
    setMemories(updated);
    storage.saveMemories(updated);
  };

  const deleteMemory = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    storage.saveMemories(updated);
  };

  const saveDiaryEntry = (content: string) => {
    triggerHaptic();
    const entry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      content,
      createdAt: Date.now(),
      memoryCount: memories.length,
    };
    const updated = [entry, ...diaryEntries];
    setDiaryEntries(updated);
    storage.saveDiaryEntries(updated);
  };

  const submitDailyAnswer = (answer: string) => {
    triggerHaptic();
    const isP1 = couple.activeUser === couple.partner1Name;
    const updated: DailyQuestion = isP1
      ? { ...dailyQuestion, partner1Answer: answer }
      : { ...dailyQuestion, partner2Answer: answer };
    setDailyQuestion(updated);
    storage.saveDailyQuestion(updated);
  };

  const setNewDailyQuestion = (question: string, category: string) => {
    triggerHaptic();
    const updated: DailyQuestion = {
      id: `dq_${Date.now()}`,
      question,
      category,
      timestamp: Date.now(),
    };
    setDailyQuestion(updated);
    storage.saveDailyQuestion(updated);
  };

  const addLoveLetter = (letter: LoveLetter) => {
    triggerHaptic();
    const updated = [letter, ...letters];
    setLetters(updated);
    storage.saveLetters(updated);
  };

  const markLetterRead = (id: string) => {
    const updated = letters.map((l) =>
      l.id === id ? { ...l, isRead: true } : l
    );
    setLetters(updated);
    storage.saveLetters(updated);
  };

  const addLoveCoupon = (coupon: LoveCoupon) => {
    triggerHaptic();
    const updated = [coupon, ...coupons];
    setCoupons(updated);
    storage.saveCoupons(updated);
  };

  const redeemCoupon = (id: string) => {
    triggerHaptic();
    const updated = coupons.map((c) =>
      c.id === id ? { ...c, isRedeemed: true, redeemedAt: Date.now() } : c
    );
    setCoupons(updated);
    storage.saveCoupons(updated);
  };

  const addBucketItem = (item: BucketItem) => {
    triggerHaptic();
    const updated = [item, ...bucketList];
    setBucketList(updated);
    storage.saveBucketList(updated);
  };

  const toggleBucketItem = (id: string) => {
    triggerHaptic();
    const updated = bucketList.map((b) =>
      b.id === id
        ? {
            ...b,
            isCompleted: !b.isCompleted,
            completedDate: !b.isCompleted
              ? new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : undefined,
          }
        : b
    );
    setBucketList(updated);
    storage.saveBucketList(updated);
  };

  const addStickyNote = (note: StickyNote) => {
    triggerHaptic();
    const updated = [note, ...stickyNotes];
    setStickyNotes(updated);
    storage.saveStickyNotes(updated);
  };

  const deleteStickyNote = (id: string) => {
    const updated = stickyNotes.filter((n) => n.id !== id);
    setStickyNotes(updated);
    storage.saveStickyNotes(updated);
  };

  return (
    <WeSpaceContext.Provider
      value={{
        loading,
        couple,
        pet,
        snap,
        expenses,
        savings,
        budgetLimit,
        memories,
        diaryEntries,
        dailyQuestion,
        letters,
        coupons,
        bucketList,
        stickyNotes,
        heartHugVisible,
        heartHugSender,
        switchUser,
        updateMoodAndStatus,
        updateApiKey,
        unpair,
        pairSuccess,
        sendHeartHug,
        dismissHeartHug,
        updatePet,
        updateSnap,
        reactToSnap,
        addExpense,
        deleteExpense,
        settleAllExpenses,
        updateBudgetLimit,
        addSavingGoal,
        contributeSavings,
        addMemory,
        toggleFavoriteMemory,
        deleteMemory,
        saveDiaryEntry,
        submitDailyAnswer,
        setNewDailyQuestion,
        addLoveLetter,
        markLetterRead,
        addLoveCoupon,
        redeemCoupon,
        addBucketItem,
        toggleBucketItem,
        addStickyNote,
        deleteStickyNote,
      }}
    >
      {children}
    </WeSpaceContext.Provider>
  );
};

export const useWeSpace = () => {
  const ctx = useContext(WeSpaceContext);
  if (!ctx) {
    throw new Error('useWeSpace must be used inside WeSpaceProvider');
  }
  return ctx;
};
