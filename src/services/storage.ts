import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CoupleState,
  PetState,
  Memory,
  SnapPhoto,
  Expense,
  SavingGoal,
  BudgetLimit,
  DailyQuestion,
  LoveLetter,
  LoveCoupon,
  BucketItem,
  DiaryEntry,
  StickyNote,
} from '../types';
import {
  INITIAL_COUPLE,
  INITIAL_PET,
  INITIAL_MEMORIES,
  INITIAL_SNAP,
  INITIAL_EXPENSES,
  INITIAL_SAVINGS,
  INITIAL_DAILY_QUESTION,
  INITIAL_LETTERS,
  INITIAL_COUPONS,
  INITIAL_BUCKET_LIST,
} from '../constants/theme';

const KEYS = {
  COUPLE: '@wespace_v2_couple',
  PET: '@wespace_v2_pet',
  MEMORIES: '@wespace_v2_memories',
  DIARY_ENTRIES: '@wespace_v2_diary_entries',
  SNAP: '@wespace_v2_snap',
  EXPENSES: '@wespace_v2_expenses',
  BUDGET_LIMIT: '@wespace_v2_budget_limit',
  SAVINGS: '@wespace_v2_savings',
  DAILY_QUESTION: '@wespace_v2_daily_question',
  LETTERS: '@wespace_v2_letters',
  COUPONS: '@wespace_v2_coupons',
  BUCKET: '@wespace_v2_bucket',
  STICKY_NOTES: '@wespace_v2_sticky_notes',
};

const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: 'sn_1',
    text: 'Left warm cinnamon cookies on the kitchen counter for you! 🍪',
    sender: 'Leo',
    color: '#FEF9C3',
    time: '1h ago',
  },
  {
    id: 'sn_2',
    text: 'Spinning Chet Baker vinyl by the fireplace tonight... 🎶',
    sender: 'Mia',
    color: '#FFE4E6',
    time: '25m ago',
  },
  {
    id: 'sn_3',
    text: 'Don’t forget to drink water today my love 💧💕',
    sender: 'Leo',
    color: '#E0F2FE',
    time: '10m ago',
  },
];

export const storage = {
  async getCouple(): Promise<CoupleState> {
    try {
      const data = await AsyncStorage.getItem(KEYS.COUPLE);
      return data ? { ...INITIAL_COUPLE, ...JSON.parse(data) } : INITIAL_COUPLE;
    } catch {
      return INITIAL_COUPLE;
    }
  },

  async saveCouple(state: CoupleState): Promise<void> {
    await AsyncStorage.setItem(KEYS.COUPLE, JSON.stringify(state));
  },

  async getPet(): Promise<PetState> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PET);
      return data ? { ...INITIAL_PET, ...JSON.parse(data) } : INITIAL_PET;
    } catch {
      return INITIAL_PET;
    }
  },

  async savePet(state: PetState): Promise<void> {
    await AsyncStorage.setItem(KEYS.PET, JSON.stringify(state));
  },

  async getMemories(): Promise<Memory[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEMORIES);
      return data ? JSON.parse(data) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  },

  async saveMemories(memories: Memory[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.MEMORIES, JSON.stringify(memories));
  },

  async getDiaryEntries(): Promise<DiaryEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DIARY_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveDiaryEntries(entries: DiaryEntry[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.DIARY_ENTRIES, JSON.stringify(entries));
  },

  async getSnap(): Promise<SnapPhoto | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SNAP);
      return data ? { ...INITIAL_SNAP, ...JSON.parse(data) } : INITIAL_SNAP;
    } catch {
      return INITIAL_SNAP;
    }
  },

  async saveSnap(snap: SnapPhoto): Promise<void> {
    await AsyncStorage.setItem(KEYS.SNAP, JSON.stringify(snap));
  },

  async getExpenses(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.EXPENSES);
      return data ? JSON.parse(data) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  },

  async saveExpenses(expenses: Expense[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  },

  async getBudgetLimit(): Promise<BudgetLimit> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BUDGET_LIMIT);
      return data ? JSON.parse(data) : { coupleId: 'ROOM_882910', monthlyLimit: 1200 };
    } catch {
      return { coupleId: 'ROOM_882910', monthlyLimit: 1200 };
    }
  },

  async saveBudgetLimit(limit: BudgetLimit): Promise<void> {
    await AsyncStorage.setItem(KEYS.BUDGET_LIMIT, JSON.stringify(limit));
  },

  async getSavings(): Promise<SavingGoal[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SAVINGS);
      return data ? JSON.parse(data) : INITIAL_SAVINGS;
    } catch {
      return INITIAL_SAVINGS;
    }
  },

  async saveSavings(savings: SavingGoal[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.SAVINGS, JSON.stringify(savings));
  },

  async getDailyQuestion(): Promise<DailyQuestion> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_QUESTION);
      return data ? JSON.parse(data) : INITIAL_DAILY_QUESTION;
    } catch {
      return INITIAL_DAILY_QUESTION;
    }
  },

  async saveDailyQuestion(dq: DailyQuestion): Promise<void> {
    await AsyncStorage.setItem(KEYS.DAILY_QUESTION, JSON.stringify(dq));
  },

  async getLetters(): Promise<LoveLetter[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.LETTERS);
      return data ? JSON.parse(data) : INITIAL_LETTERS;
    } catch {
      return INITIAL_LETTERS;
    }
  },

  async saveLetters(letters: LoveLetter[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.LETTERS, JSON.stringify(letters));
  },

  async getCoupons(): Promise<LoveCoupon[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.COUPONS);
      return data ? JSON.parse(data) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  },

  async saveCoupons(coupons: LoveCoupon[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
  },

  async getBucketList(): Promise<BucketItem[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BUCKET);
      return data ? JSON.parse(data) : INITIAL_BUCKET_LIST;
    } catch {
      return INITIAL_BUCKET_LIST;
    }
  },

  async saveBucketList(items: BucketItem[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.BUCKET, JSON.stringify(items));
  },

  async getStickyNotes(): Promise<StickyNote[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.STICKY_NOTES);
      return data ? JSON.parse(data) : INITIAL_STICKY_NOTES;
    } catch {
      return INITIAL_STICKY_NOTES;
    }
  },

  async saveStickyNotes(notes: StickyNote[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.STICKY_NOTES, JSON.stringify(notes));
  },

  async resetAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};
