export const COLORS = {
  CozyCream: '#FFFAF3',
  WarmCharcoal: '#2A2421',
  WarmCharcoalMuted: '#685D57',
  RoseCoral: '#EE5D6C',
  RoseCoralHover: '#D94958',
  SoftRose: '#FFEcef',
  HoneyYellow: '#F4B942',
  SoftLavender: '#9D74E7',
  PastelBlue: '#5EB1EF',
  ShadowBeige: '#EADDD0',
  SurfaceCard: '#FFFFFF',
  SurfaceSubtle: '#FBF8F4',
  WhatsAppTeal: '#075E54',
  WhatsAppGreen: '#25D366',
  GradientStart: '#FCFAF7',
  GradientEnd: '#F7F3EE',
  White: '#FFFFFF',
  Danger: '#EF4444',
  Success: '#10B981',
};

export const INITIAL_COUPLE: import('../types').CoupleState = {
  coupleId: 'ROOM_882910',
  isPaired: true,
  partner1Name: 'Leo',
  partner2Name: 'Mia',
  pairingCode: '882910',
  activeUser: 'Leo',
  daysTogether: 124,
};

export const INITIAL_PET: import('../types').PetState = {
  coupleId: 'ROOM_882910',
  petName: 'Mocha',
  petType: 'CAT',
  hunger: 80,
  happiness: 85,
  energy: 70,
  cleanliness: 90,
  health: 95,
  isSleeping: false,
  lastFedBy: 'Leo',
  lastPlayedBy: 'Mia',
  lastCleanedBy: 'Leo',
  lastHealedBy: 'Mia',
  lastUpdated: Date.now(),
};

export const INITIAL_MEMORIES: import('../types').Memory[] = [
  {
    id: 'mem_1',
    coupleId: 'ROOM_882910',
    title: 'Our Sunny Beach Picnic 🌊',
    caption: 'Watching the sunset with ice cream and warm ocean breeze.',
    author: 'Leo',
    imageType: 'SUMMER_BEACH',
    rotationDegrees: -3.5,
    timestamp: Date.now() - 3 * 24 * 3600 * 1000,
  },
  {
    id: 'mem_2',
    coupleId: 'ROOM_882910',
    title: 'Cozy Lavender Café Date ☕',
    caption: 'You ordered caramel macchiato and read poetry to me.',
    author: 'Mia',
    imageType: 'CAFE_DATE',
    rotationDegrees: 4.2,
    timestamp: Date.now() - 1 * 24 * 3600 * 1000,
  },
];

export const INITIAL_SNAP: import('../types').SnapPhoto = {
  id: 'snap_1',
  coupleId: 'ROOM_882910',
  sender: 'Mia',
  imageType: 'COZY_COFFEE',
  note: 'Thinking of you while drinking morning tea 💕',
  timestamp: Date.now() - 2 * 3600 * 1000, // 2 hours ago (within 24h)
};

export const INITIAL_EXPENSES: import('../types').Expense[] = [
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
    title: 'Cinema & Popcorn Night',
    amount: 28.0,
    category: 'Activities & Dates',
    paidBy: 'Mia',
    timestamp: Date.now() - 1 * 24 * 3600 * 1000,
  },
  {
    id: 'exp_3',
    coupleId: 'ROOM_882910',
    title: 'Matcha Ice Cream Crepes',
    amount: 14.0,
    category: 'Food & Cafés',
    paidBy: 'Leo',
    timestamp: Date.now() - 6 * 3600 * 1000,
  },
];

export const INITIAL_SAVINGS: import('../types').SavingGoal[] = [
  {
    id: 'goal_1',
    coupleId: 'ROOM_882910',
    title: 'Our Tokyo Dream Trip ✈️',
    targetAmount: 3500.0,
    currentSaved: 1450.0,
    timestamp: Date.now(),
  },
  {
    id: 'goal_2',
    coupleId: 'ROOM_882910',
    title: 'Cozy Living Room Projector 📽️',
    targetAmount: 400.0,
    currentSaved: 280.0,
    timestamp: Date.now(),
  },
];
