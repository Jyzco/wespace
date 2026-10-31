import {
  CoupleState,
  PetState,
  Memory,
  SnapPhoto,
  Expense,
  SavingGoal,
  DailyQuestion,
  LoveLetter,
  LoveCoupon,
  BucketItem,
  PartnerMood,
} from '../types';

export const COLORS = {
  // Light Blue Tones (Celestial Sky & Ice)
  LightBlue: '#38BDF8',
  LightBluePastel: '#BAE6FD',
  LightBlueSoft: '#E0F2FE',
  LightBlueIce: '#F4F9FF',
  PastelBlue: '#38BDF8',
  PastelBlueSoft: '#E0F2FE',
  GradientStart: '#F4F9FF',
  GradientEnd: '#EBF5FF',
  CozyCream: '#F4F9FF',

  // White & Glass Tones
  White: '#FFFFFF',
  SurfaceCard: '#FFFFFF',
  SurfaceSubtle: '#F8FBFF',

  // Hot Pink Tones (Electric Berry & Blush)
  HotPink: '#FF2D78',
  HotPinkDark: '#D81159',
  HotPinkSoft: '#FFF0F6',
  HotPinkGlow: '#FFE4EF',
  RoseCoral: '#FF2D78',
  RoseCoralDark: '#D81159',
  RoseCoralSoft: '#FFF0F6',
  SoftRose: '#FFE4EF',

  // Secondary Accents (Harmonized to Sky & Pink)
  HoneyYellow: '#38BDF8',
  HoneyYellowSoft: '#E0F2FE',
  SoftLavender: '#EC4899',
  SoftLavenderSoft: '#FCE7F3',
  SageGreen: '#0EA5E9',
  SageGreenSoft: '#E0F2FE',

  // Borders & Dividers
  BorderSubtle: '#DCEBFA',
  ShadowBeige: '#CBE2F8',
  CardBorderPink: '#FFC2DF',

  // Typography
  WarmCharcoal: '#0F172A',
  WarmCharcoalMuted: '#475569',
  WarmCharcoalLight: '#94A3B8',

  // Functional & Room
  WhatsAppTeal: '#0284C7',
  WhatsAppGreen: '#FF2D78',
  HearthDark: '#0F172A',
  HearthWarm: '#1E293B',
  Danger: '#F43F5E',
  Success: '#0EA5E9',
};

export const MOOD_META: Record<
  PartnerMood,
  { emoji: string; label: string; color: string; bg: string }
> = {
  AFFECTIONATE: {
    emoji: '🥰',
    label: 'Feeling Loving',
    color: '#FF2D78',
    bg: '#FFE4EF',
  },
  COZY: {
    emoji: '☁️',
    label: 'Cloud Cozy',
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  COFFEE: {
    emoji: '🍓',
    label: 'Strawberry Latte',
    color: '#E11D48',
    bg: '#FFE4E6',
  },
  DEEP_WORK: {
    emoji: '💎',
    label: 'Deep Focus',
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  MISSING_YOU: {
    emoji: '💗',
    label: 'Missing You',
    color: '#FF2D78',
    bg: '#FFE4EF',
  },
  SLEEPY: {
    emoji: '🌙',
    label: 'Dreamy Sleepy',
    color: '#0369A1',
    bg: '#E0F2FE',
  },
};

export const INITIAL_COUPLE: CoupleState = {
  coupleId: 'ROOM_882910',
  isPaired: true,
  partner1Name: 'Leo',
  partner2Name: 'Mia',
  pairingCode: '882910',
  activeUser: 'Leo',
  daysTogether: 124,
  anniversaryDate: '2026-06-26',
  partner1Mood: 'AFFECTIONATE',
  partner2Mood: 'MISSING_YOU',
  partner1Status: 'Listening to jazz & thinking of our next café date',
  partner2Status: 'Counting down the hours until our evening call 💕',
  partner1Battery: 88,
  partner2Battery: 94,
};

export const INITIAL_PET: PetState = {
  coupleId: 'ROOM_882910',
  petName: 'Mocha',
  petType: 'CAT',
  accessory: 'CROWN',
  level: 4,
  xp: 65,
  hunger: 82,
  happiness: 90,
  energy: 75,
  cleanliness: 92,
  health: 96,
  isSleeping: false,
  lastFedBy: 'Leo',
  lastPlayedBy: 'Mia',
  lastCleanedBy: 'Leo',
  lastHealedBy: 'Mia',
  lastUpdated: Date.now(),
};

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem_1',
    coupleId: 'ROOM_882910',
    title: 'Golden Hour Beach Picnic',
    caption: 'Watching the amber waves roll in with strawberry gelato and our favorite acoustic playlist.',
    author: 'Leo',
    imageType: 'SUMMER_BEACH',
    rotationDegrees: -2.8,
    location: 'Sunset Cove',
    isFavorite: true,
    timestamp: Date.now() - 4 * 24 * 3600 * 1000,
  },
  {
    id: 'mem_2',
    coupleId: 'ROOM_882910',
    title: 'Lavender Café & Bookshop',
    caption: 'You ordered an iced honey oat latte and underlined your favorite poems for me to read.',
    author: 'Mia',
    imageType: 'CAFE_DATE',
    rotationDegrees: 3.1,
    location: 'Botanica Roasters',
    isFavorite: true,
    timestamp: Date.now() - 2 * 24 * 3600 * 1000,
  },
  {
    id: 'mem_3',
    coupleId: 'ROOM_882910',
    title: 'Midnight Stargazing Blanket',
    caption: 'Pointing out Orion and making wishes on airplanes pretending they were shooting stars.',
    author: 'Leo',
    imageType: 'STARRY_CAMPING',
    rotationDegrees: -1.9,
    location: 'Pine Ridge Overlook',
    isFavorite: false,
    timestamp: Date.now() - 12 * 3600 * 1000,
  },
];

export const INITIAL_SNAP: SnapPhoto = {
  id: 'snap_1',
  coupleId: 'ROOM_882910',
  sender: 'Mia',
  imageType: 'COZY_COFFEE',
  note: 'Saved the warmest corner seat for you. Miss your laugh already 💕',
  reactions: ['❤️', '🥺', '☕'],
  timestamp: Date.now() - 2 * 3600 * 1000,
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    coupleId: 'ROOM_882910',
    title: 'Romantic Lavender Café Date',
    amount: 34.5,
    category: 'Food & Cafés',
    paidBy: 'Leo',
    timestamp: Date.now() - 2 * 24 * 3600 * 1000,
  },
  {
    id: 'exp_2',
    coupleId: 'ROOM_882910',
    title: 'Indie Cinema & Truffle Popcorn',
    amount: 28.0,
    category: 'Activities & Dates',
    paidBy: 'Mia',
    timestamp: Date.now() - 1 * 24 * 3600 * 1000,
  },
  {
    id: 'exp_3',
    coupleId: 'ROOM_882910',
    title: 'Matcha Mille Crepe Cake',
    amount: 18.5,
    category: 'Food & Cafés',
    paidBy: 'Leo',
    timestamp: Date.now() - 6 * 3600 * 1000,
  },
  {
    id: 'exp_4',
    coupleId: 'ROOM_882910',
    title: 'Warm String Fairy Lights',
    amount: 22.0,
    category: 'Living Space',
    paidBy: 'Mia',
    timestamp: Date.now() - 3 * 3600 * 1000,
  },
];

export const INITIAL_SAVINGS: SavingGoal[] = [
  {
    id: 'goal_1',
    coupleId: 'ROOM_882910',
    title: 'Autumn Kyoto Getaway',
    emoji: '🍁',
    targetAmount: 3500.0,
    currentSaved: 1650.0,
    timestamp: Date.now(),
  },
  {
    id: 'goal_2',
    coupleId: 'ROOM_882910',
    title: 'Cozy Home Cinema Projector',
    emoji: '📽️',
    targetAmount: 450.0,
    currentSaved: 325.0,
    timestamp: Date.now(),
  },
  {
    id: 'goal_3',
    coupleId: 'ROOM_882910',
    title: 'Anniversary Omakase Dinner',
    emoji: '🍣',
    targetAmount: 240.0,
    currentSaved: 180.0,
    timestamp: Date.now(),
  },
];

export const INITIAL_DAILY_QUESTION: DailyQuestion = {
  id: 'dq_1',
  question: 'What is a small, ordinary moment from this past month when you felt most loved by me?',
  category: 'Intimacy & Gratitude',
  partner1Answer: 'When you tucked a warm blanket around my shoulders while I was working late and didn’t say a word.',
  partner2Answer: 'When you remembered my exact iced latte order and brought it over in the pouring rain.',
  timestamp: Date.now(),
};

export const INITIAL_LETTERS: LoveLetter[] = [
  {
    id: 'let_1',
    sender: 'Mia',
    recipient: 'Leo',
    title: 'For When You Have a Long Day',
    body: 'My dearest Leo, whenever the world feels too loud or heavy, close your eyes and remember that you always have a quiet harbor right here with me. I am endlessly proud of the gentle, thoughtful person you are.',
    waxColor: '#FF1493',
    isRead: true,
    timestamp: Date.now() - 5 * 24 * 3600 * 1000,
  },
  {
    id: 'let_2',
    sender: 'Leo',
    recipient: 'Mia',
    title: '100 Days & Counting',
    body: 'Every morning since we met has felt a little brighter. Thank you for turning the simplest grocery runs and rainy evenings into my favorite memories.',
    waxColor: '#0284C7',
    isRead: false,
    timestamp: Date.now() - 1 * 24 * 3600 * 1000,
  },
];

export const INITIAL_COUPONS: LoveCoupon[] = [
  {
    id: 'cp_1',
    title: '20-Minute Shoulder & Back Massage',
    description: 'Redeemable anytime after a long workday. Includes calming music & warm oil.',
    emoji: '💆‍♀️',
    fromPartner: 'Leo',
    isRedeemed: false,
  },
  {
    id: 'cp_2',
    title: 'Homemade Breakfast in Bed',
    description: 'Pancakes, fresh berries, and warm coffee brought straight to your pillow.',
    emoji: '🥞',
    fromPartner: 'Mia',
    isRedeemed: false,
  },
  {
    id: 'cp_3',
    title: 'Undisputed Movie Night Veto Power',
    description: 'Holder gets 100% authority over tonight’s film & snack selection.',
    emoji: '🍿',
    fromPartner: 'Leo',
    isRedeemed: false,
  },
  {
    id: 'cp_4',
    title: 'Late Night Ice Cream Run',
    description: 'Valid even at 11:30 PM in pajamas. Two scoops minimum.',
    emoji: '🍨',
    fromPartner: 'Mia',
    isRedeemed: true,
    redeemedAt: Date.now() - 86400000,
  },
];

export const INITIAL_BUCKET_LIST: BucketItem[] = [
  {
    id: 'bk_1',
    title: 'Build a living room blanket fort & watch a trilogy',
    category: 'Cozy',
    isCompleted: true,
    completedDate: 'Oct 14',
  },
  {
    id: 'bk_2',
    title: 'Cook handmade fresh pasta from scratch together',
    category: 'Food',
    isCompleted: true,
    completedDate: 'Oct 21',
  },
  {
    id: 'bk_3',
    title: 'Watch the sunrise from a mountain overlook with thermoses',
    category: 'Adventure',
    isCompleted: false,
  },
  {
    id: 'bk_4',
    title: 'Take a pottery wheel class and paint each other’s mugs',
    category: 'Cozy',
    isCompleted: false,
  },
  {
    id: 'bk_5',
    title: 'Stroll under autumn maple leaves in Kyoto',
    category: 'Travel',
    isCompleted: false,
  },
];

export const DATE_JAR_IDEAS = [
  {
    title: 'Candlelit Cushion-Fort Picnic',
    budget: 'FREE',
    duration: '2 hrs',
    emoji: '⛺',
    description: 'Drape bedsheets over chairs, string up warm fairy lights, bring pillows and finger foods, and play acoustic vinyl tracks.',
  },
  {
    title: 'Portrait Sketching Challenge',
    budget: 'FREE',
    duration: '45 mins',
    emoji: '🎨',
    description: 'Sit across from each other with paper and pens—try drawing each other without looking down at the page until the 3-minute timer rings!',
  },
  {
    title: 'Bookstore Blind-Date Pick',
    budget: 'COZY',
    duration: '1.5 hrs',
    emoji: '📚',
    description: 'Head to a local bookshop, split up for 15 minutes, and pick out one book or magazine you think the other person will adore.',
  },
  {
    title: 'Midnight Rooftop Stargazing & Cocoa',
    budget: 'FREE',
    duration: '1 hr',
    emoji: '🌌',
    description: 'Brew peppermint hot chocolate in a thermos, bring two thick blankets outside, and share your top 3 childhood memories.',
  },
  {
    title: '3-Course Grocery Store Challenge',
    budget: 'COZY',
    duration: '2 hrs',
    emoji: '🛒',
    description: 'Each partner gets $10 and 10 minutes to secretly pick an appetizer, drink, or dessert for a surprise tasting menu at home.',
  },
  {
    title: 'Botanical Conservatory & Film Camera Walk',
    budget: 'ADVENTURE',
    duration: '3 hrs',
    emoji: '🌿',
    description: 'Wander through a greenhouse or arboretum taking candid disposable-style photos of each other among the ferns.',
  },
];
