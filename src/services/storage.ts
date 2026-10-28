import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CoupleState,
  PetState,
  Memory,
  SnapPhoto,
  Expense,
  SavingGoal,
  BudgetLimit,
} from '../types';
import {
  INITIAL_COUPLE,
  INITIAL_PET,
  INITIAL_MEMORIES,
  INITIAL_SNAP,
  INITIAL_EXPENSES,
  INITIAL_SAVINGS,
} from '../constants/theme';

const KEYS = {
  COUPLE: '@wespace_couple',
  PET: '@wespace_pet',
  MEMORIES: '@wespace_memories',
  SNAP: '@wespace_snap',
  EXPENSES: '@wespace_expenses',
  BUDGET_LIMIT: '@wespace_budget_limit',
  SAVINGS: '@wespace_savings',
};

export const storage = {
  async getCouple(): Promise<CoupleState> {
    try {
      const data = await AsyncStorage.getItem(KEYS.COUPLE);
      return data ? JSON.parse(data) : INITIAL_COUPLE;
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
      return data ? JSON.parse(data) : INITIAL_PET;
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

  async getSnap(): Promise<SnapPhoto | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SNAP);
      return data ? JSON.parse(data) : INITIAL_SNAP;
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

  async resetAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};
