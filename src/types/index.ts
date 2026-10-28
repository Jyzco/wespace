export type PetType = 'CAT' | 'DOG' | 'BIRD' | 'BUNNY';

export type PetAccessory =
  | 'NONE'
  | 'CROWN'
  | 'BOW'
  | 'GLASSES'
  | 'FLOWER'
  | 'SCARF';

export type PartnerMood =
  | 'AFFECTIONATE'
  | 'COZY'
  | 'COFFEE'
  | 'DEEP_WORK'
  | 'MISSING_YOU'
  | 'SLEEPY';

export interface CoupleState {
  coupleId: string;        // Unique room code e.g. "ROOM_882910"
  isPaired: boolean;       // True if successfully linked
  partner1Name: string;    // e.g. "Leo"
  partner2Name: string;    // e.g. "Mia"
  pairingCode: string;     // 6-digit code or custom phrase
  activeUser: string;      // Current profile viewing the app ("Leo" or "Mia")
  daysTogether: number;    // Count of days together (e.g. 124)
  anniversaryDate: string; // e.g. "2026-06-25"
  partner1Mood: PartnerMood;
  partner2Mood: PartnerMood;
  partner1Status: string;
  partner2Status: string;
  partner1Battery: number;
  partner2Battery: number;
  geminiApiKey?: string;   // Optional Gemini API Key
}

export interface PetState {
  coupleId: string;
  petName: string;         // e.g. "Mocha", "Cinnamon"
  petType: PetType;
  accessory: PetAccessory;
  level: number;
  xp: number;              // 0 - 100 per level
  hunger: number;          // 0 - 100 (100 = full)
  happiness: number;       // 0 - 100 (100 = joyful)
  energy: number;          // 0 - 100 (100 = fully rested)
  cleanliness: number;     // 0 - 100 (100 = sparkling clean; <75 shows dirt)
  health: number;          // 0 - 100 (100 = perfect health)
  isSleeping: boolean;     // If true, lights out, energy replenishes
  lastFedBy: string;       // Partner name who fed last
  lastPlayedBy: string;    // Partner name who played last
  lastCleanedBy: string;   // Partner name who washed last
  lastHealedBy: string;    // Partner name who gave medicine last
  lastUpdated: number;     // Epoch timestamp in milliseconds
}

export type MemoryImageType =
  | 'SUMMER_BEACH'
  | 'PARK_PICNIC'
  | 'CAFE_DATE'
  | 'STARRY_CAMPING'
  | 'RAINY_MOVIE'
  | 'COOKING_NIGHT';

export interface Memory {
  id: string;
  coupleId: string;
  title: string;           // e.g. "Our Sunny Beach Picnic"
  caption: string;         // Sweet description
  author: string;          // Partner name who posted
  imageType: MemoryImageType;
  rotationDegrees: number; // Dynamic physics tilt (-8.0 to +8.0 deg)
  location?: string;       // e.g. "Santa Monica Pier"
  isFavorite?: boolean;
  timestamp: number;       // Epoch ms
}

export interface DiaryEntry {
  id: string;
  content: string;
  createdAt: number;
  memoryCount: number;
}

export type SnapImageType =
  | 'SUNSET_WALK'
  | 'COZY_COFFEE'
  | 'SMILE_GOOFY'
  | 'BEDTIME_STUFF'
  | 'HOMEMADE_MEAL'
  | 'MIRROR_SELFIE';

export interface SnapPhoto {
  id: string;
  coupleId: string;
  sender: string;
  imageType: SnapImageType;
  note: string;            // Handwritten note/caption
  reactions: string[];     // Emoji reactions from partner
  timestamp: number;       // Active if (now - timestamp <= 24 * 3600 * 1000)
}

export interface BudgetLimit {
  coupleId: string;
  monthlyLimit: number;    // e.g. 1200.00
}

export type ExpenseCategory =
  | 'Food & Cafés'
  | 'Activities & Dates'
  | 'Living Space'
  | 'Travel & Adventure'
  | 'Nostalgic Gifts'
  | 'Other';

export interface Expense {
  id: string;
  coupleId: string;
  title: string;           // "Romantic Lavender Café Date"
  amount: number;          // e.g. 34.50
  category: ExpenseCategory;
  paidBy: string;          // "Partner1", "Partner2", or "Shared"
  timestamp: number;
}

export interface SavingGoal {
  id: string;
  coupleId: string;
  title: string;           // "Our Tokyo Dream Trip ✈️"
  emoji: string;
  targetAmount: number;    // 3500.00
  currentSaved: number;    // 1450.00
  timestamp: number;
}

export interface CozyEvent {
  id: string;
  coupleId: string;
  sender: string;          // "Leo"
  receiver: string;        // "Mia"
  eventType: 'HUG';        // Triggers full-screen heartbeat overlay
  timestamp: number;
  isPlayed: boolean;       // Marked true once consumed
}

export interface DailyQuestion {
  id: string;
  question: string;
  category: string;
  partner1Answer?: string;
  partner2Answer?: string;
  timestamp: number;
}

export interface LoveLetter {
  id: string;
  sender: string;
  recipient: string;
  title: string;
  body: string;
  waxColor: string;
  unlockDate?: string;     // Optional future date
  isRead: boolean;
  timestamp: number;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  emoji: string;
  fromPartner: string;
  isRedeemed: boolean;
  redeemedAt?: number;
}

export interface BucketItem {
  id: string;
  title: string;
  category: 'Travel' | 'Cozy' | 'Adventure' | 'Food' | 'Milestone';
  isCompleted: boolean;
  completedDate?: string;
}

export interface StickyNote {
  id: string;
  text: string;
  sender: string;
  color: string;
  time: string;
}
