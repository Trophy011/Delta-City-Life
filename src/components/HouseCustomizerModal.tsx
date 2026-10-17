import React, { useState } from 'react';
import {
  X,
  Home,
  Plus,
  Trash2,
  ArrowDown,
  ArrowUp,
  Star,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { FURNITURE_CATALOG } from '../game/constants';
import { FurnitureItem, PlacedFurniture, PlayerProfile, FurnitureCategory } from '../types';
import { sound } from '../utils/audio';

interface HouseCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  activeFloor: 'downstairs' | 'upstairs';
  onToggleFloor: (floor: 'downstairs' | 'upstairs') => void;
  onUpdateHouseFurniture: (items: PlacedFurniture[], cost: number, comfortBoost: number) => void;
}

const CATEGORY_TABS: { id: FurnitureCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '✨' },
  { id: 'comfort', label: 'Comfort', icon: '🪑' },
  { id: 'sleep', label: 'Sleep', icon: '🛏️' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'bath', label: 'Bath', icon: '🛁' },
  { id: 'light', label: 'Light', icon: '💡' },
  { id: 'decor', label: 'Decor', icon: '🖼️' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'design', label: 'Design', icon: '🛋️' },
];

export const HouseCustomizerModal: React.FC<HouseCustomizerModalProps> = ({
  isOpen,
  onClose,
  player,
  activeFloor,
  onToggleFloor,
  onUpdateHouseFurniture,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory | 'all'>('comfort');
  const [showCatalogDrawer, setShowCatalogDrawer] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBuyAndPlace = (item: FurnitureItem) => {
    sound.playClick();
    if (player.balance < item.price) {
      showToast(`❌ Insufficient funds! You need ₦${item.price.toLocaleString()} for this.`);
      return;
    }

    // Coordinates for placing inside dollhouse rooms
    const offset = player.placedFurniture.length * 0.4;
    const newPlaced: PlacedFurniture = {
      instanceId: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      furnitureId: item.id,
      x: (Math.random() - 0.5) * 8,
      y: 0,
      z: (Math.random() - 0.5) * 8,
      rotationY: Math.random() > 0.5 ? 0 : Math.PI / 2,
      floor: activeFloor,
    };

    const updated = [...player.placedFurniture, newPlaced];
    onUpdateHouseFurniture(updated, item.price, item.comfortBoost);
    sound.playCelebration();
    showToast(`✅ Built "${item.name}"! Placed ${activeFloor}.`);
  };

  const handleRemove = (instanceId: string) => {
    sound.playClick();
    const updated = player.placedFurniture.filter((p) => p.instanceId !== instanceId);
    onUpdateHouseFurniture(updated, 0, 0);
    showToast('Removed furniture piece.');
  };

  const filteredItems = selectedCategory === 'all'
    ? FURNITURE_CATALOG
    : FURNITURE_CATALOG.filter((f) => f.category === selectedCategory);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between select-none">
      {/* 1. TOP BAR MATCHING VIDEO 00:31 ("Buy mode", balance, Downstairs/Upstairs toggle) */}
      <div className="pointer-events-auto p-3 md:p-5 flex items-center justify-between gap-3 w-full">
        {/* Left: Buy Mode Title & Floor toggle */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 rounded-2xl p-2 shadow-xl">
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-black text-xs uppercase rounded-xl">
            Buy mode
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onToggleFloor(activeFloor === 'downstairs' ? 'upstairs' : 'downstairs');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            {activeFloor === 'downstairs' ? (
              <>
                <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Downstairs</span>
              </>
            ) : (
              <>
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upstairs</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Live Balance */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-2 shadow-xl text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Wallet Balance</div>
          <div className="text-base md:text-lg font-black text-emerald-400 tabular-nums">
            ₦{player.balance.toLocaleString()}
          </div>
        </div>

        {/* Right: Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white cursor-pointer shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="pointer-events-none self-center bg-slate-900/95 border border-emerald-500 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl animate-in zoom-in-95">
          {toastMessage}
        </div>
      )}

      {/* 2. CATALOGUE DRAWER MATCHING VIDEO 00:31-00:46 */}
      <div className="pointer-events-auto w-full max-w-4xl mx-auto px-3 pb-3">
        <div className="bg-slate-900/95 border border-slate-700/90 rounded-3xl p-4 shadow-2xl backdrop-blur-md">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base">Catalogue</span>
              <span className="text-xs text-slate-400">
                ({player.placedFurniture.length} items built in villa)
              </span>
            </div>

            <button
              onClick={() => setShowCatalogDrawer(!showCatalogDrawer)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              {showCatalogDrawer ? 'Hide' : 'Show'}
            </button>
          </div>

          {showCatalogDrawer && (
            <>
              {/* Category Filter Pills Matching Video Icons */}
              <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                        : 'text-slate-400 hover:text-white bg-slate-900/50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Items Horizontal Scroll / Grid Matching Video exact cards! */}
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                {filteredItems.map((item) => {
                  const canAfford = player.balance >= item.price;

                  return (
                    <div
                      key={item.id}
                      className="w-40 md:w-44 shrink-0 bg-slate-800/90 border border-slate-700 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-500 transition-colors"
                    >
                      <div>
                        {/* Top info strip: Grid size + Star rating */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">
                            {item.gridSize}
                          </span>
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-current" />
                            ))}
                          </div>
                        </div>

                        {/* Item Name */}
                        <h4 className="font-bold text-xs text-white truncate mt-1">{item.name}</h4>

                        {/* Price in Naira Matching Video */}
                        <div className="text-emerald-400 font-black text-sm tabular-nums mt-1">
                          ₦{item.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Buy & Build Action Button */}
                      <button
                        onClick={() => handleBuyAndPlace(item)}
                        disabled={!canAfford}
                        className={`w-full mt-3 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{canAfford ? 'Build' : 'Low Funds'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
