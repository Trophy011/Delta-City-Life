import { CoinPackage, FurnitureItem, JobDefinition, VehicleItem, DeltaLocation, PhoneMessage, Friend, ChatMessage } from '../types';

export const FLUTTERWAVE_PAY_URL = 'https://flutterwave.com/pay/72uojjjxgq6t';
export const WELCOME_BONUS_NAIRA = 1000000;

export const ADMIN_EMAIL = 'godswilluzoma517@gmail.com';
export const ADMIN_PASSWORD = 'smart446688';
export const ADMIN_UNLIMITED_BALANCE = 999999999999; // ₦999 Billion

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pack_1m',
    nairaAmount: 1000000,
    usdPrice: 10,
    label: '1 Million Naira',
    badge: 'Starter Pack',
    bonusText: 'Instant ₦1,000,000 Cash Credit'
  },
  {
    id: 'pack_5m',
    nairaAmount: 5000000,
    usdPrice: 50,
    label: '5 Million Naira',
    badge: 'Popular',
    bonusText: 'Instant ₦5,000,000 Cash Credit'
  },
  {
    id: 'pack_10m',
    nairaAmount: 10000000,
    usdPrice: 75,
    label: '10 Million Naira',
    badge: 'Best Value • 25% Off',
    bonusText: 'Instant ₦10,000,000 High-Roller Credit'
  }
];

export const DELTA_LOCATIONS: DeltaLocation[] = [
  {
    id: 'loc_home',
    name: 'Your House (Warri Villa)',
    area: 'Warri',
    category: 'residence',
    description: 'Your 2-storey private duplex compound with driveway, balcony, and customizable rooms.',
    icon: 'Home',
    x: -100,
    z: 70,
    cabFare: 0,
    hasInterior: true,
    tagline: 'Home Sweet Home'
  },
  {
    id: 'loc_club',
    name: 'Club Empire Warri',
    area: 'Warri',
    category: 'club',
    description: 'Premier nightlife hub! Pulsing Afrobeats bass, dance floor, and cash money dropped on the floor.',
    icon: 'Music',
    x: 50,
    z: 60,
    cabFare: 2200,
    hasInterior: true,
    tagline: 'Afrobeats & VIP Money Rain'
  },
  {
    id: 'loc_refinery',
    name: 'Warri Petrochemical & Refinery (WRPC)',
    area: 'Warri',
    category: 'refinery',
    description: 'Massive petroleum refinery with storage tanks, pipeline distribution network, and high-paying engineering gigs.',
    icon: 'Fuel',
    x: -70,
    z: -80,
    cabFare: 3500,
    hasInterior: false,
    tagline: 'High Salary Oil & Gas Shifts'
  },
  {
    id: 'loc_mall',
    name: 'Delta Mall & Shoprite (Effurun)',
    area: 'Effurun',
    category: 'mall',
    description: 'Bustling modern shopping center, cinema, tech stores, and food courts at Effurun roundabout.',
    icon: 'ShoppingBag',
    x: 70,
    z: -10,
    cabFare: 1800,
    hasInterior: true,
    tagline: 'Shopping, Dining & Tech Hub'
  },
  {
    id: 'loc_airport',
    name: 'Osubi Executive Airport & Runway',
    area: 'Warri',
    category: 'airport',
    description: 'Warri executive tarmac with runway, private jet hangars, and flight test zones.',
    icon: 'Plane',
    x: 130,
    z: -70,
    cabFare: 4500,
    hasInterior: false,
    tagline: 'Private Jet Takeoff & Hangar'
  },
  {
    id: 'loc_palace',
    name: 'Olu of Warri Palace (Aghofen)',
    area: 'Warri',
    category: 'palace',
    description: 'Majestic royal palace of the Olu of Warri, showcasing Itsekiri cultural royalty and bronze monuments.',
    icon: 'Crown',
    x: -30,
    z: 90,
    cabFare: 2500,
    hasInterior: false,
    tagline: 'Historic Royal Heritage'
  },
  {
    id: 'loc_effurun_roundabout',
    name: 'Effurun Roundabout & PTI Market',
    area: 'Effurun',
    category: 'landmark',
    description: 'The heartbeat junction connecting Warri, Sapele, and Asaba. Street vendors, keke terminals, and vibrant city life.',
    icon: 'Navigation',
    x: 10,
    z: -35,
    cabFare: 1500,
    hasInterior: false,
    tagline: 'Commercial Transit Junction'
  },
  {
    id: 'loc_asaba_waterfront',
    name: 'Asaba Waterfront & River Niger Bridge',
    area: 'Asaba',
    category: 'landmark',
    description: 'Delta State capital avenue overlooking the majestic River Niger, government ministries, and cyber tech parks.',
    icon: 'Compass',
    x: 160,
    z: 80,
    cabFare: 6500,
    hasInterior: false,
    tagline: 'State Capital & River Views'
  },
  {
    id: 'loc_abraka_ethiope',
    name: 'River Ethiope Oasis (Abraka)',
    area: 'Abraka',
    category: 'landmark',
    description: 'Famous natural spring river with crystal clear freshwater, bamboo canopies, and serene relaxation.',
    icon: 'Waves',
    x: -80,
    z: 140,
    cabFare: 5000,
    hasInterior: false,
    tagline: 'Crystal Clear Eco-Resort'
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f_blakchase',
    username: 'blakchase',
    handle: '@blakchase',
    avatarColor: '#2563eb',
    status: 'Cruising around Warri street',
    isOnline: true,
  },
  {
    id: 'f_amane',
    username: 'Amane',
    handle: '@Amane',
    avatarColor: '#059669',
    status: 'Furnishing villa upstairs',
    isOnline: true,
  },
  {
    id: 'f_shally',
    username: 'Shally Drip',
    handle: '@ShallyDrip',
    avatarColor: '#db2777',
    status: 'Picking cash at Club Empire',
    isOnline: true,
  },
  {
    id: 'f_djw_emmy',
    username: 'DJ W Emmy',
    handle: '@djw_emmy',
    avatarColor: '#d97706',
    status: 'DJing Afrobeats at Club Empire',
    isOnline: true,
  },
  {
    id: 'f_godly',
    username: 'Godly Roddy',
    handle: '@godlyroddy',
    avatarColor: '#7c3aed',
    status: 'Working Oil shift at WRPC',
    isOnline: false,
  },
  {
    id: 'f_sweetaza',
    username: 'Sweet Aza',
    handle: '@sweetaza',
    avatarColor: '#e11d48',
    status: 'Shopping at Delta Mall',
    isOnline: true,
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat_1',
    sender: 'blakchase',
    handle: '@blakchase',
    avatarColor: '#2563eb',
    text: 'Warri no dey carry last! Anyone coming to Club Empire tonight?',
    timestamp: '5:18 PM',
  },
  {
    id: 'chat_2',
    sender: 'Amane',
    handle: '@Amane',
    avatarColor: '#059669',
    text: 'Just finished installing split AC and royal gold sofa in my duplex villa! Looks clean 🔥',
    timestamp: '5:19 PM',
  },
  {
    id: 'chat_3',
    sender: 'DJ W Emmy',
    handle: '@djw_emmy',
    avatarColor: '#d97706',
    text: 'Floor is flooded with Naira bundles right now at the VIP booth, come collect!',
    timestamp: '5:20 PM',
  },
  {
    id: 'chat_4',
    sender: 'Shally Drip',
    handle: '@ShallyDrip',
    avatarColor: '#db2777',
    text: 'Cruising through Effurun roundabout in the black G-Wagon 🚀',
    timestamp: '5:21 PM',
  },
];

export const FURNITURE_CATALOG: FurnitureItem[] = [
  {
    id: 'plastic_chair',
    name: 'Plastic Chair',
    category: 'comfort',
    price: 500,
    gridSize: '1x1',
    rating: 2,
    comfortBoost: 5,
    prestigeBoost: 2,
    description: 'Standard white Nigerian party plastic chair. Essential low-cost seating.',
    color: '#f8fafc',
    modelType: 'plastic_chair'
  },
  {
    id: 'standing_fan',
    name: 'Standing Fan',
    category: 'comfort',
    price: 2200,
    gridSize: '1x1',
    rating: 3,
    comfortBoost: 12,
    prestigeBoost: 5,
    description: '3-speed oscillating floor fan to beat the Warri afternoon heat.',
    color: '#0284c7',
    modelType: 'standing_fan'
  },
  {
    id: 'dining_table',
    name: 'Dining Table',
    category: 'kitchen',
    price: 6600,
    gridSize: '2x2',
    rating: 3,
    comfortBoost: 18,
    prestigeBoost: 12,
    description: 'Solid wooden 4-seater dining table for family dinners and jollof rice.',
    color: '#78350f',
    modelType: 'dining_table'
  },
  {
    id: 'lounge_armchair',
    name: 'Lounge Armchair',
    category: 'comfort',
    price: 8500,
    gridSize: '1x1',
    rating: 3,
    comfortBoost: 20,
    prestigeBoost: 15,
    description: 'Cozy cushioned single seater armchair for living room reading.',
    color: '#047857',
    modelType: 'armchair'
  },
  {
    id: 'velvet_sofa',
    name: 'Velvet Sofa',
    category: 'comfort',
    price: 10200,
    gridSize: '2x1',
    rating: 4,
    comfortBoost: 28,
    prestigeBoost: 22,
    description: 'Deep green emerald velvet couch with tufted backrest.',
    color: '#065f46',
    modelType: 'velvet_sofa'
  },
  {
    id: 'bean_bag',
    name: 'Bean Bag',
    category: 'comfort',
    price: 12000,
    gridSize: '1x1',
    rating: 3,
    comfortBoost: 22,
    prestigeBoost: 10,
    description: 'Plush orange leather bean bag for ultra-chill lounging.',
    color: '#ea580c',
    modelType: 'bean_bag'
  },
  {
    id: 'ceiling_fan',
    name: 'Ceiling Fan',
    category: 'light',
    price: 32000,
    gridSize: '1x1',
    rating: 4,
    comfortBoost: 30,
    prestigeBoost: 18,
    description: 'Silent 56-inch aerodynamic 3-blade ceiling fan with gold trim.',
    color: '#e2e8f0',
    modelType: 'ceiling_fan'
  },
  {
    id: 'royal_gold_sofa',
    name: 'Royal Gold Sofa',
    category: 'luxury',
    price: 55000,
    gridSize: '2x1',
    rating: 5,
    comfortBoost: 45,
    prestigeBoost: 60,
    description: 'Opulent gold-leaf carved sofa worthy of a Delta chief lounge.',
    color: '#eab308',
    modelType: 'royal_gold_sofa'
  },
  {
    id: 'split_ac',
    name: 'Split Air Conditioner (2HP)',
    category: 'comfort',
    price: 650000,
    gridSize: '1x1',
    rating: 5,
    comfortBoost: 65,
    prestigeBoost: 50,
    description: 'Inverter dual-cool whisper quiet split AC unit with ice-cold air.',
    color: '#f8fafc',
    modelType: 'split_ac'
  },
  {
    id: 'lekki_sectional',
    name: 'Lekki-Warri Sectional Sofa',
    category: 'luxury',
    price: 1500000,
    gridSize: '3x1',
    rating: 5,
    comfortBoost: 80,
    prestigeBoost: 95,
    description: 'Bespoke Italian modular sectional that wraps around your grand parlor.',
    color: '#1e293b',
    modelType: 'sofa'
  },
  {
    id: 'velvet_king_bed',
    name: 'Royal Velvet King Bed',
    category: 'sleep',
    price: 380000,
    gridSize: '2x2',
    rating: 5,
    comfortBoost: 70,
    prestigeBoost: 45,
    description: 'Custom upholstered headboard with memory foam mattress for 100% full energy restoration.',
    color: '#475569',
    modelType: 'bed'
  },
  {
    id: 'luxury_bath_tub',
    name: 'Freestanding Jacuzzi Bath',
    category: 'bath',
    price: 240000,
    gridSize: '2x1',
    rating: 4,
    comfortBoost: 40,
    prestigeBoost: 35,
    description: 'Deep soaking bathtub with chrome rainfall faucet.',
    color: '#ffffff',
    modelType: 'bathtub'
  },
  {
    id: 'marble_island',
    name: 'Carrara Marble Kitchen Island',
    category: 'kitchen',
    price: 520000,
    gridSize: '2x1',
    rating: 5,
    comfortBoost: 50,
    prestigeBoost: 60,
    description: 'Polished natural marble countertop with golden faucets and dual designer barstools.',
    color: '#e2e8f0',
    modelType: 'kitchen_island'
  },
  {
    id: 'smart_fridge',
    name: 'Smart Double-Door Refrigerator',
    category: 'kitchen',
    price: 310000,
    gridSize: '1x1',
    rating: 4,
    comfortBoost: 35,
    prestigeBoost: 30,
    description: 'Stainless steel frost-free smart fridge with touchscreen display and ice maker.',
    color: '#94a3b8',
    modelType: 'fridge'
  },
  {
    id: 'oled_tv_85',
    name: '85" 4K OLED Smart TV Wall',
    category: 'decor',
    price: 450000,
    gridSize: '2x1',
    rating: 5,
    comfortBoost: 55,
    prestigeBoost: 65,
    description: 'Razor-thin bezel smart screen with booming Dolby Atmos soundbar.',
    color: '#0f172a',
    modelType: 'tv_unit'
  },
  {
    id: 'gold_chandelier',
    name: 'Imperial Golden Crystal Chandelier',
    category: 'light',
    price: 290000,
    gridSize: '1x1',
    rating: 5,
    comfortBoost: 30,
    prestigeBoost: 75,
    description: 'Cascading warm crystal lighting that illuminates the double-height ceiling.',
    color: '#eab308',
    modelType: 'chandelier'
  },
  {
    id: 'gold_trophy_bar',
    name: '24K Solid Gold Delta Oil Baron Trophy',
    category: 'luxury',
    price: 1200000,
    gridSize: '1x1',
    rating: 5,
    comfortBoost: 20,
    prestigeBoost: 100,
    description: 'The ultimate symbol of wealth in Warri and Asaba. Gleams in 24-karat solid gold.',
    color: '#fbbf24',
    modelType: 'trophy'
  }
];

export const VEHICLES_CATALOG: VehicleItem[] = [
  {
    id: 'danfo_bus',
    name: 'Delta Commercial Yellow Danfo Bus',
    type: 'danfo',
    price: 450000,
    speed: 55,
    acceleration: 50,
    handling: 65,
    description: 'Classic yellow commercial transit bus seen across Warri and Effurun expressways.',
    color: '#eab308',
    tagline: 'Authentic Nigerian City Transit'
  },
  {
    id: 'keke_napep',
    name: 'Warri Keke Napep 3-Wheeler',
    type: 'keke',
    price: 350000,
    speed: 45,
    acceleration: 60,
    handling: 90,
    description: 'Iconic Delta yellow tricycle! Agile, navigates tight Warri streets and markets with ease.',
    color: '#fbbf24',
    tagline: 'The King of Warri Streets'
  },
  {
    id: 'cruiser_sedan',
    name: 'Warri Cruiser Executive Sedan',
    type: 'sedan',
    price: 850000,
    speed: 70,
    acceleration: 65,
    handling: 75,
    description: 'Comfortable air-conditioned sedan. Reliable daily driver for commuting between Warri and Effurun.',
    color: '#0ea5e9',
    tagline: 'Clean Comfort & Smooth Commute'
  },
  {
    id: 'gwagon_suv',
    name: 'Black Label G-Wagon 4x4',
    type: 'gwagon',
    price: 4500000,
    speed: 85,
    acceleration: 80,
    handling: 70,
    description: 'Imposing luxury SUV with roaring V8, tinted windows, and supreme Delta presence.',
    color: '#18181b',
    tagline: 'Oil Tycoon & Chief Status'
  },
  {
    id: 'supercar_gt',
    name: 'Apex Warri-Lekki Supercar',
    type: 'supercar',
    price: 9500000,
    speed: 100,
    acceleration: 95,
    handling: 88,
    description: 'V12 twin-turbo coupe with custom spoiler, neon underglow, and blazing 0-100 acceleration.',
    color: '#ef4444',
    tagline: 'Pure Adrenaline & Street Respect'
  },
  {
    id: 'private_jet',
    name: 'Delta Gulfstream Sky-650 Jet',
    type: 'jet',
    price: 25000000,
    speed: 120,
    acceleration: 98,
    handling: 80,
    description: 'Private twin-engine executive jet. Take off from Warri Airport runway and soar across Delta skies!',
    color: '#f8fafc',
    tagline: 'Billionaire Executive Flight'
  }
];

export const JOBS_CATALOG: JobDefinition[] = [
  {
    id: 'oil_engineer',
    title: 'Delta Oil & Gas Field Specialist',
    company: 'Warri Petrochemical Corp (WRPC)',
    locationName: 'Warri Refinery Complex',
    minPay: 180000,
    maxPay: 350000,
    energyCost: 25,
    durationSeconds: 8,
    description: 'Calibrate high-pressure valves, inspect crude pipeline flow meters, and oversee distillation towers.',
    icon: 'Fuel'
  },
  {
    id: 'tech_developer',
    title: 'Senior Fintech & Web3 Developer',
    company: 'Asaba Silicon Cyber Park',
    locationName: 'Asaba Innovation Hub',
    minPay: 120000,
    maxPay: 240000,
    energyCost: 18,
    durationSeconds: 7,
    description: 'Write smart contracts, scale payment gateways, and optimize mobile banking microservices.',
    icon: 'Terminal'
  },
  {
    id: 'vip_logistics',
    title: 'Warri VIP Interstate Dispatcher',
    company: 'Warri Express Logistics',
    locationName: 'Effurun Commercial Axis',
    minPay: 70000,
    maxPay: 150000,
    energyCost: 15,
    durationSeconds: 5,
    description: 'Dispatch luxury goods, oil parts, and documents across Warri, Sapele, and Asaba highways.',
    icon: 'Truck'
  },
  {
    id: 'club_dj_host',
    title: 'Club Empire VIP Hype Master & DJ',
    company: 'Club Empire Warri',
    locationName: 'Club Empire VIP Lounge',
    minPay: 90000,
    maxPay: 190000,
    energyCost: 20,
    durationSeconds: 6,
    description: 'Drop high-energy Afrobeats mixes, energize the dance floor, and spray cash with the crowd.',
    icon: 'Music'
  }
];

export const INITIAL_PHONE_MESSAGES: PhoneMessage[] = [
  {
    id: 'msg_1',
    sender: 'Shally Drip',
    handle: '@ShallyDrip',
    avatarBg: '#2563eb',
    text: 'Wow, your new house in Warri looks massive! When are you hosting the housewarming party? 🔥',
    time: '5:10 PM',
    unread: true
  },
  {
    id: 'msg_2',
    sender: 'DJ W Emmy',
    handle: '@djw_emmy',
    avatarBg: '#059669',
    text: '100?? Bro tonight at Club Empire is going down, make sure you show up with your squad!',
    time: '5:15 PM',
    unread: true
  },
  {
    id: 'msg_3',
    sender: 'Godly Roddy',
    handle: '@godlyroddy',
    avatarBg: '#dc2626',
    text: 'You said hello 👋 Just wanted to check if you got the keys to your new duplex villa.',
    time: '5:18 PM',
    unread: false
  },
  {
    id: 'msg_4',
    sender: 'Sweet Aza',
    handle: '@sweetaza',
    avatarBg: '#7c3aed',
    text: 'You: Oh ok. See you at Delta Mall later, I want to check some new living room decor.',
    time: '5:20 PM',
    unread: false
  }
];
