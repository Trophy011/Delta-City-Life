import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Wrench,
  Zap,
  DollarSign,
  Car,
  Home,
  Compass,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile, DeltaLocation, PlacedFurniture } from '../types';
import { DELTA_LOCATIONS, FURNITURE_CATALOG, VEHICLES_CATALOG } from '../game/constants';
import { sound } from '../utils/audio';

interface AdminFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onTeleport: (x: number, z: number, locName: string) => void;
}

export const AdminFixModal: React.FC<AdminFixModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
  onTeleport,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'economy' | 'vehicles' | 'house' | 'teleport'>('quick');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. Unlimited Balance Fix
  const handleFixBalance = (amount = 999999999999) => {
    sound.playCelebration();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    onUpdatePlayer({
      ...player,
      balance: amount,
      totalEarned: player.totalEarned + amount,
    });
    showToast(`✅ Admin Fix Applied: Balance set to ₦${amount.toLocaleString()}!`);
  };

  // 2. Max Needs (Energy, Fun, Hunger)
  const handleMaxNeeds = () => {
    sound.playCelebration();
    onUpdatePlayer({
      ...player,
      energy: 100,
      fun: 100,
      hunger: 100,
    });
    showToast('✅ Admin Fix: Energy, Fun & Health restored to 100%!');
  };

  // 3. Unlock All Vehicles
  const handleUnlockAllVehicles = () => {
    sound.playCelebration();
    const allIds = VEHICLES_CATALOG.map((v) => v.id);
    onUpdatePlayer({
      ...player,
      ownedVehicles: allIds,
      activeVehicleId: 'jet',
    });
    showToast('✅ Admin Fix: All vehicles & Private Jets unlocked!');
  };

  // 4. Auto Furnish Mansion with luxury items
  const handleAutoFurnishHouse = () => {
    sound.playCelebration();
    const luxuryItems: PlacedFurniture[] = [
      { instanceId: 'adm_1', furnitureId: 'lekki_sectional', x: -3, y: 0, z: 2, rotationY: 0, floor: 'downstairs' },
      { instanceId: 'adm_2', furnitureId: 'oled_tv_85', x: -3, y: 0, z: -5, rotationY: 0, floor: 'downstairs' },
      { instanceId: 'adm_3', furnitureId: 'split_ac', x: 0, y: 0, z: -5, rotationY: 0, floor: 'downstairs' },
      { instanceId: 'adm_4', furnitureId: 'royal_gold_sofa', x: 4, y: 0, z: 2, rotationY: -Math.PI / 2, floor: 'downstairs' },
      { instanceId: 'adm_5', furnitureId: 'marble_island', x: 4, y: 0, z: 5, rotationY: Math.PI / 2, floor: 'downstairs' },
      { instanceId: 'adm_6', furnitureId: 'smart_fridge', x: 7, y: 0, z: 5, rotationY: -Math.PI / 2, floor: 'downstairs' },
      { instanceId: 'adm_7', furnitureId: 'velvet_king_bed', x: 5, y: 0, z: -4, rotationY: 0, floor: 'upstairs' },
      { instanceId: 'adm_8', furnitureId: 'luxury_bath_tub', x: -6, y: 0, z: 4, rotationY: 0, floor: 'upstairs' },
      { instanceId: 'adm_9', furnitureId: 'gold_trophy_bar', x: 0, y: 0, z: -3, rotationY: 0, floor: 'downstairs' },
    ];
    onUpdatePlayer({
      ...player,
      hasHouse: true,
      houseRented: true,
      houseTier: 'mansion',
      houseName: 'Asaba High-Chief Villa (Fully Furnished)',
      placedFurniture: luxuryItems,
    });
    showToast('✅ Admin Fix: Villa upgraded & fully furnished with 5-star luxury!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-red-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/30 flex items-center justify-center text-yellow-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Supreme Admin God-Mode Panel</h2>
                <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded text-amber-300">
                  godswilluzoma517@gmail.com
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                Fix Any System · Unlimited Balance · God Speed · Spawner
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-950 border-b border-emerald-800 px-4 py-2 text-xs text-center text-emerald-300 font-bold animate-in fade-in">
            {toastMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-2 overflow-x-auto gap-2">
          {[
            { id: 'quick', label: '⚡ One-Click Fixes' },
            { id: 'economy', label: '💰 Unlimited Money' },
            { id: 'vehicles', label: '🚗 Unlock Vehicles' },
            { id: 'house', label: '🏠 Mansion & Decor' },
            { id: 'teleport', label: '📍 Warp Teleport' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'quick' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Set Unlimited ₦999B Balance</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Instantly sets your account balance to ₦999,999,999,999 Naira.
                  </p>
                </div>
                <button
                  onClick={() => handleFixBalance(999999999999)}
                  className="mt-3 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Apply ₦999B Balance
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Restore Full Energy &amp; Needs</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Maxes out Energy (100%), Fun (100%), and Hunger (100%).
                  </p>
                </div>
                <button
                  onClick={handleMaxNeeds}
                  className="mt-3 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Max All Player Needs
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-400" />
                    <span>Unlock All Supercars &amp; Private Jet</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Unlocks G-Wagon, Supercar, Gulfstream Jet, Danfo Bus, and Keke.
                  </p>
                </div>
                <button
                  onClick={handleUnlockAllVehicles}
                  className="mt-3 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Unlock All Rides
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Home className="w-4 h-4 text-purple-400" />
                    <span>Auto-Furnish Luxury Villa</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Instantly upgrades to mansion and places all 5-star furniture pieces.
                  </p>
                </div>
                <button
                  onClick={handleAutoFurnishHouse}
                  className="mt-3 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Furnish Mansion Completely
                </button>
              </div>
            </div>
          )}

          {activeTab === 'economy' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">Inject custom amounts of Naira into your account:</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '+₦10,000,000', amount: 10000000 },
                  { label: '+₦100,000,000', amount: 100000000 },
                  { label: '+₦1,000,000,000 (1B)', amount: 1000000000 },
                  { label: '+₦10,000,000,000 (10B)', amount: 10000000000 },
                  { label: '+₦100,000,000,000 (100B)', amount: 100000000000 },
                  { label: 'Unlimited ₦999B', amount: 999999999999 },
                ].map((tier) => (
                  <button
                    key={tier.label}
                    onClick={() => handleFixBalance(tier.amount)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-black text-xs cursor-pointer text-center"
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teleport' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">Instantly warp anywhere across Delta State:</p>
              <div className="grid grid-cols-2 gap-2.5">
                {DELTA_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      sound.playCelebration();
                      onTeleport(loc.x, loc.z, loc.name);
                      showToast(`Warped to ${loc.name}!`);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.area}</div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">WARP ➔</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="space-y-3">
              <button
                onClick={handleUnlockAllVehicles}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer shadow-md mb-2"
              >
                Unlock All Vehicles &amp; Equips
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                {VEHICLES_CATALOG.map((veh) => (
                  <div key={veh.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs text-white">{veh.name}</div>
                      <div className="text-[10px] text-slate-400">{veh.tagline}</div>
                    </div>
                    <button
                      onClick={() => {
                        onUpdatePlayer({ ...player, activeVehicleId: veh.id });
                        showToast(`Equipped ${veh.name}!`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Spawn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'house' && (
            <div className="space-y-3">
              <button
                onClick={handleAutoFurnishHouse}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Auto-Furnish All Rooms with 5-Star Items
              </button>
              <p className="text-xs text-slate-400">
                Instantly places Lekki Sectionals, 85&quot; OLED TV wall, split ACs, marble islands, and gold trophies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
