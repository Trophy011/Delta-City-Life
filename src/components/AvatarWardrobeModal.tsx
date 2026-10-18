import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShoppingBag,
  X,
  Shirt,
  Scissors,
  Palette,
  Watch,
  Coins,
} from 'lucide-react';
import { PlayerProfile } from '../types';
import { sound } from '../utils/audio';

interface AvatarWardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
}

interface OutfitItem {
  id: string;
  name: string;
  style: 'street' | 'senator' | 'tycoon' | 'casual' | 'bomber';
  outfitColor: string;
  price: number;
  description: string;
  badge?: string;
}

const WARDROBE_OUTFITS: OutfitItem[] = [
  {
    id: 'outfit_street',
    name: 'Warri Streetwear Drip',
    style: 'street',
    outfitColor: '#18181b',
    price: 0,
    description: 'Black denim jeans, graphic street hoodie, and signature gold Cuban chain.',
    badge: 'Starter Drip',
  },
  {
    id: 'outfit_agbada',
    name: 'Royal Blue Agbada & Cap',
    style: 'senator',
    outfitColor: '#1d4ed8',
    price: 350000,
    description: 'Regal embroidered Delta chieftain agbada with gold wrist beads.',
    badge: 'Chieftain',
  },
  {
    id: 'outfit_tycoon',
    name: 'Oil Tycoon Midnight Suit',
    style: 'tycoon',
    outfitColor: '#09090b',
    price: 500000,
    description: 'Double-breasted Italian tailored tuxedo, silk lapels, and gold cufflinks.',
    badge: 'High Roller',
  },
  {
    id: 'outfit_senator',
    name: 'Emerald Green Senator Wear',
    style: 'senator',
    outfitColor: '#047857',
    price: 250000,
    description: 'Crisp Nigerian senator attire in rich Delta emerald with silver buttons.',
  },
  {
    id: 'outfit_bomber',
    name: 'Crimson Varsity Bomber',
    style: 'bomber',
    outfitColor: '#dc2626',
    price: 180000,
    description: 'Leather-sleeved varsity jacket with ribbed collar and urban sneakers.',
  },
  {
    id: 'outfit_eagles',
    name: 'Super Eagles Green Tracksuit',
    style: 'casual',
    outfitColor: '#16a34a',
    price: 120000,
    description: 'National green & white sportswear with zip-up jacket and flex joggers.',
  },
];

const SKIN_TONES = [
  { id: 'skin_ebony', name: 'Ebony Deep', color: '#3d2314' },
  { id: 'skin_bronze', name: 'Rich Bronze', color: '#593b22' },
  { id: 'skin_warm', name: 'Delta Warm', color: '#8d5524' },
  { id: 'skin_caramel', name: 'Golden Caramel', color: '#c68642' },
  { id: 'skin_fair', name: 'Fair Sand', color: '#e0ac69' },
];

const HAIRSTYLES = [
  { id: 'fade', name: 'Clean High Fade', price: 0 },
  { id: 'afro_taper', name: 'Afro Low Taper', price: 25000 },
  { id: 'waves_360', name: '360 Waves', price: 35000 },
  { id: 'dreads', name: 'Urban Dreadlocks', price: 60000 },
  { id: 'clean_shave', name: 'Clean Shaven (Bald)', price: 0 },
];

export const AvatarWardrobeModal: React.FC<AvatarWardrobeModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'outfits' | 'skin' | 'hair' | 'bling'>('outfits');
  const [ownedOutfits, setOwnedOutfits] = useState<string[]>(['outfit_street']);
  const [currentOutfit, setCurrentOutfit] = useState<string>(
    WARDROBE_OUTFITS.find((o) => o.outfitColor === player.outfitColor)?.id || 'outfit_street'
  );
  const [currentSkin, setCurrentSkin] = useState<string>(player.skinTone);
  const [currentHair, setCurrentHair] = useState<string>(player.hairStyle || 'fade');
  const [hasGlasses, setHasGlasses] = useState<boolean>(player.hasGlasses ?? true);
  const [hasGoldChain, setHasGoldChain] = useState<boolean>(player.hasGoldChain ?? true);
  const [hasWatch, setHasWatch] = useState<boolean>(player.hasWatch ?? true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleSelectOutfit = (outfit: OutfitItem) => {
    sound.playClick();
    const isOwned = ownedOutfits.includes(outfit.id) || outfit.price === 0;

    if (!isOwned) {
      if (player.balance < outfit.price) {
        alert(`Insufficient funds! This outfit costs ₦${outfit.price.toLocaleString()}`);
        return;
      }
      // Purchase outfit
      const updatedBalance = player.balance - outfit.price;
      setOwnedOutfits((prev) => [...prev, outfit.id]);
      setCurrentOutfit(outfit.id);

      const updated: PlayerProfile = {
        ...player,
        balance: updatedBalance,
        outfitColor: outfit.outfitColor,
        outfitStyle: outfit.style,
      };
      onUpdateProfile(updated);
      sound.playCashPickup();
      showSuccess(`Purchased ${outfit.name}!`);
    } else {
      // Just equip
      setCurrentOutfit(outfit.id);
      const updated: PlayerProfile = {
        ...player,
        outfitColor: outfit.outfitColor,
        outfitStyle: outfit.style,
      };
      onUpdateProfile(updated);
      showSuccess(`Equipped ${outfit.name}!`);
    }
  };

  const handleSelectSkin = (color: string, name: string) => {
    sound.playClick();
    setCurrentSkin(color);
    const updated: PlayerProfile = {
      ...player,
      skinTone: color,
    };
    onUpdateProfile(updated);
    showSuccess(`Updated skin tone to ${name}!`);
  };

  const handleSelectHair = (hair: typeof HAIRSTYLES[0]) => {
    sound.playClick();
    if (hair.price > 0 && player.hairStyle !== hair.id) {
      if (player.balance < hair.price) {
        alert(`Insufficient funds! Barber charges ₦${hair.price.toLocaleString()}`);
        return;
      }
      const updated: PlayerProfile = {
        ...player,
        balance: player.balance - hair.price,
        hairStyle: hair.id,
      };
      setCurrentHair(hair.id);
      onUpdateProfile(updated);
      sound.playCashPickup();
      showSuccess(`Got fresh ${hair.name} cut!`);
    } else {
      setCurrentHair(hair.id);
      const updated: PlayerProfile = {
        ...player,
        hairStyle: hair.id,
      };
      onUpdateProfile(updated);
      showSuccess(`Switched to ${hair.name}!`);
    }
  };

  const handleToggleAccessory = (type: 'glasses' | 'chain' | 'watch') => {
    sound.playClick();
    let updated: PlayerProfile = { ...player };

    if (type === 'glasses') {
      const newVal = !hasGlasses;
      setHasGlasses(newVal);
      updated.hasGlasses = newVal;
      showSuccess(newVal ? 'Equipped Aviator Sunglasses' : 'Removed Sunglasses');
    } else if (type === 'chain') {
      const newVal = !hasGoldChain;
      setHasGoldChain(newVal);
      updated.hasGoldChain = newVal;
      showSuccess(newVal ? 'Equipped 24K Gold Cuban Chain' : 'Removed Gold Chain');
    } else if (type === 'watch') {
      const newVal = !hasWatch;
      setHasWatch(newVal);
      updated.hasWatch = newVal;
      showSuccess(newVal ? 'Equipped Luxury Gold Watch' : 'Removed Watch');
    }

    onUpdateProfile(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shirt className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Delta Drip & Boutique
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  GTA Style Wardrobe
                </span>
              </h2>
              <p className="text-xs text-slate-400">Customize your 3D avatar & buy designer clothes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400">Wallet Balance</div>
              <div className="text-sm font-black text-emerald-400 tabular-nums">
                ₦{player.balance.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div className="bg-emerald-950/90 border-b border-emerald-700 text-emerald-300 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-3 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('outfits')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'outfits'
                ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4 text-sky-400" />
            Outfits & Clothes
          </button>

          <button
            onClick={() => setActiveTab('skin')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'skin'
                ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            Skin Complexion
          </button>

          <button
            onClick={() => setActiveTab('hair')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'hair'
                ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4 text-purple-400" />
            Barber & Haircuts
          </button>

          <button
            onClick={() => setActiveTab('bling')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'bling'
                ? 'bg-slate-800 text-white border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Watch className="w-4 h-4 text-yellow-400" />
            Bling & Accessories
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'outfits' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WARDROBE_OUTFITS.map((outfit) => {
                const isOwned = ownedOutfits.includes(outfit.id) || outfit.price === 0;
                const isEquipped = currentOutfit === outfit.id;

                return (
                  <div
                    key={outfit.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: outfit.outfitColor }}
                          />
                          <h4 className="font-bold text-sm text-white">{outfit.name}</h4>
                        </div>
                        {outfit.badge && (
                          <span className="text-[10px] bg-slate-700 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                            {outfit.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{outfit.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      <div className="text-xs font-bold">
                        {outfit.price === 0 ? (
                          <span className="text-emerald-400">Included</span>
                        ) : isOwned ? (
                          <span className="text-slate-400">Owned in Wardrobe</span>
                        ) : (
                          <span className="text-amber-400 font-black tabular-nums">
                            ₦{outfit.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectOutfit(outfit)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-emerald-600 text-white cursor-default'
                            : isOwned
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Equipped
                          </>
                        ) : isOwned ? (
                          'Equip Drip'
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> Buy & Wear
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'skin' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Choose your avatar's complexion. Your 3D character will update instantly in-game!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SKIN_TONES.map((tone) => {
                  const isSelected = currentSkin === tone.color;
                  return (
                    <button
                      key={tone.id}
                      onClick={() => handleSelectSkin(tone.color, tone.name)}
                      className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white/40 shadow-inner shrink-0"
                        style={{ backgroundColor: tone.color }}
                      />
                      <div className="text-left min-w-0">
                        <div className="text-xs font-bold text-white truncate">{tone.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {isSelected ? 'Active Tone' : 'Click to Apply'}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'hair' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Visit the Delta Executive Barbershop. Fresh haircuts apply directly to your character.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HAIRSTYLES.map((hair) => {
                  const isSelected = currentHair === hair.id;
                  return (
                    <div
                      key={hair.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30'
                          : 'bg-slate-800/60 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                          <Scissors className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{hair.name}</div>
                          <div className="text-[10px] text-amber-400 font-bold">
                            {hair.price === 0 ? 'Free' : `₦${hair.price.toLocaleString()}`}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectHair(hair)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white cursor-default'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        {isSelected ? 'Active Cut' : 'Get Haircut'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'bling' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Toggle luxury jewelry, sunglasses, and wrist accessories on your 3D character.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Sunglasses */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Aviator Sunglasses</span>
                      <span className="text-[10px] bg-slate-700 text-sky-300 font-bold px-1.5 py-0.5 rounded">
                        GTA Vibe
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Dark polarized lenses with chrome gold frame.</p>
                  </div>
                  <button
                    onClick={() => handleToggleAccessory('glasses')}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      hasGlasses ? 'bg-sky-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {hasGlasses ? 'Equipped (Glasses ON)' : 'Equip Sunglasses'}
                  </button>
                </div>

                {/* Cuban Chain */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">24K Cuban Chain</span>
                      <span className="text-[10px] bg-slate-700 text-yellow-300 font-bold px-1.5 py-0.5 rounded">
                        Solid Gold
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Heavy braided gold chain around avatar collar.</p>
                  </div>
                  <button
                    onClick={() => handleToggleAccessory('chain')}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      hasGoldChain ? 'bg-amber-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {hasGoldChain ? 'Equipped (Chain ON)' : 'Equip Gold Chain'}
                  </button>
                </div>

                {/* Luxury Watch */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Gold Chrono Watch</span>
                      <span className="text-[10px] bg-slate-700 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                        Presidential
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Polished gold timepiece on avatar left wrist.</p>
                  </div>
                  <button
                    onClick={() => handleToggleAccessory('watch')}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      hasWatch ? 'bg-yellow-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {hasWatch ? 'Equipped (Watch ON)' : 'Equip Watch'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Outfit Style: <span className="font-bold text-white capitalize">{player.outfitStyle || 'Street'}</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            Apply & Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
