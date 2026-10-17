export interface PlayerProfile {
  id: string;
  username: string;
  email: string;
  title: string;
  balance: number; // In Naira (₦)
  hunger: number; // 0 - 100
  energy: number; // 0 - 100
  fun: number; // 0 - 100
  skinTone: string;
  outfitColor: string;
  hairStyle: string;
  shoesColor: string;
  hasHouse: boolean;
  houseRented: boolean;
  houseTier: 'standard' | 'duplex' | 'mansion';
  houseName: string;
  placedFurniture: PlacedFurniture[];
  ownedVehicles: string[]; // vehicle ids
  activeVehicleId: string | null;
  totalEarned: number;
  jobsCompleted: number;
  cashPickedCount: number;
  createdAt: string;
  isAdmin?: boolean;
  friends: Friend[];
}

export interface Friend {
  id: string;
  username: string;
  handle: string;
  avatarColor: string;
  status: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  handle: string;
  avatarColor: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isDirect?: boolean;
  recipientHandle?: string;
  transferAmount?: number;
  isTransferReceipt?: boolean;
  refNumber?: string;
}

export interface PlacedFurniture {
  instanceId: string;
  furnitureId: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  floor: 'downstairs' | 'upstairs';
}

export type FurnitureCategory =
  | 'design'
  | 'sleep'
  | 'kitchen'
  | 'bath'
  | 'comfort'
  | 'light'
  | 'decor'
  | 'pets'
  | 'luxury';

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  price: number; // in Naira
  gridSize: string; // e.g. "1x1", "2x2", "3x1"
  rating: number; // 1 to 5 stars
  comfortBoost: number;
  prestigeBoost: number;
  description: string;
  color: string;
  modelType: string;
}

export interface VehicleItem {
  id: string;
  name: string;
  type: 'keke' | 'sedan' | 'gwagon' | 'supercar' | 'jet' | 'danfo';
  price: number; // in Naira
  speed: number;
  acceleration: number;
  handling: number;
  description: string;
  color: string;
  tagline: string;
}

export interface CoinPackage {
  id: string;
  nairaAmount: number;
  usdPrice: number;
  label: string;
  badge?: string;
  bonusText?: string;
}

export interface JobDefinition {
  id: string;
  title: string;
  company: string;
  locationName: string;
  minPay: number;
  maxPay: number;
  energyCost: number;
  durationSeconds: number;
  description: string;
  icon: string;
}

export interface DeltaLocation {
  id: string;
  name: string;
  area: 'Warri' | 'Effurun' | 'Asaba' | 'Sapele' | 'Abraka';
  category: 'refinery' | 'club' | 'mall' | 'landmark' | 'airport' | 'residence' | 'food' | 'palace';
  description: string;
  icon: string;
  x: number;
  z: number;
  cabFare: number; // in Naira
  hasInterior: boolean;
  tagline?: string;
}

export interface CabTrip {
  destination: DeltaLocation;
  fare: number;
  vehicleType: 'keke' | 'bolt_cab' | 'vip_ride';
  inProgress: boolean;
}

export interface PhoneMessage {
  id: string;
  sender: string;
  handle: string;
  avatarBg: string;
  text: string;
  time: string;
  unread: boolean;
}
