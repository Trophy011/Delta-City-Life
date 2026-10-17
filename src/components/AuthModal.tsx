import React, { useState } from 'react';
import { User, Lock, Mail, Sparkles, CheckCircle2, ChevronRight, Home, ShieldCheck, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile } from '../types';
import { WELCOME_BONUS_NAIRA } from '../game/constants';
import { sound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (profile: PlayerProfile) => void;
  onClose: () => void;
  onPlayAsGuest: () => void;
}

const SKIN_TONES = [
  { name: 'Ebony Deep', color: '#3d2314' },
  { name: 'Rich Bronze', color: '#593b22' },
  { name: 'Delta Warm', color: '#8d5524' },
  { name: 'Golden Caramel', color: '#c68642' },
  { name: 'Fair Sand', color: '#e0ac69' },
];

const OUTFIT_COLORS = [
  { name: 'Warri Royal Blue', color: '#2563eb' },
  { name: 'Delta Emerald Green', color: '#059669' },
  { name: 'Midnight Onyx Suit', color: '#18181b' },
  { name: 'Sunset Crimson', color: '#dc2626' },
  { name: 'Oil Tycoon Gold', color: '#d97706' },
  { name: 'Asaba Purple', color: '#7c3aed' },
];

const HOUSE_RENTALS = [
  {
    tier: 'standard' as const,
    name: 'Warri Central 2-Storey Villa (Unfurnished)',
    area: 'Warri Urban Axis',
    monthlyRent: 150000,
    deposit: 300000,
    tagline: 'Spacious compound, ready for your furniture!',
  },
  {
    tier: 'duplex' as const,
    name: 'Effurun Executive Duplex (Unfurnished)',
    area: 'Effurun GRA',
    monthlyRent: 350000,
    deposit: 500000,
    tagline: 'Gated duplex compound near Delta Mall & WRPC.',
  },
  {
    tier: 'mansion' as const,
    name: 'Asaba High-Chief Villa (Unfurnished)',
    area: 'Asaba Waterfront',
    monthlyRent: 650000,
    deposit: 800000,
    tagline: 'Waterfront estate overlooking the River Niger.',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  onPlayAsGuest,
}) => {
  const [step, setStep] = useState<'auth' | 'avatar' | 'rent_house' | 'welcome_bonus'>('auth');
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState('Chief Ken');
  const [email, setEmail] = useState('player@deltalife.ng');
  const [password, setPassword] = useState('••••••••');
  const [selectedSkin, setSelectedSkin] = useState('#8d5524');
  const [selectedOutfit, setSelectedOutfit] = useState('#18181b');
  const [selectedHouse, setSelectedHouse] = useState(HOUSE_RENTALS[0]);
  const [createdProfile, setCreatedProfile] = useState<PlayerProfile | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    // Check for Admin Login Credentials as requested:
    // Email: godswilluzoma517@gmail.com, Password: smart446688
    if (
      email.trim().toLowerCase() === 'godswilluzoma517@gmail.com' &&
      password.trim() === 'smart446688'
    ) {
      const adminProfile: PlayerProfile = {
        id: 'admin_godswill',
        username: 'Godswill (Admin)',
        email: 'godswilluzoma517@gmail.com',
        title: 'Supreme Delta Administrator',
        balance: 999999999999, // Unlimited ₦999 Billion balance!
        hunger: 100,
        energy: 100,
        fun: 100,
        skinTone: '#593b22',
        outfitColor: '#18181b',
        hairStyle: 'fade',
        shoesColor: '#09090b',
        hasHouse: true,
        houseRented: true,
        houseTier: 'mansion',
        houseName: 'Warri High-Chief Presidential Estate',
        placedFurniture: [],
        ownedVehicles: ['danfo_bus', 'keke_napep', 'cruiser_sedan', 'gwagon_suv', 'supercar_gt', 'private_jet'],
        activeVehicleId: 'gwagon_suv',
        totalEarned: 999999999999,
        jobsCompleted: 99,
        cashPickedCount: 999,
        createdAt: new Date().toISOString(),
        isAdmin: true,
        friends: [],
      };

      const storedProfiles = JSON.parse(localStorage.getItem('delta_life_profiles') || '{}');
      storedProfiles[adminProfile.email] = adminProfile;
      localStorage.setItem('delta_life_profiles', JSON.stringify(storedProfiles));
      localStorage.setItem('delta_life_active_user', adminProfile.email);

      sound.playCelebration();
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
      onSuccess(adminProfile);
      return;
    }

    if (!isSignUp) {
      // Existing login check
      const stored = JSON.parse(localStorage.getItem('delta_life_profiles') || '{}');
      if (stored[email]) {
        onSuccess(stored[email]);
        return;
      }
    }

    // Move to Avatar Arrangement step as requested!
    setStep('avatar');
  };

  const handleAvatarDone = () => {
    sound.playClick();
    // Move to Rent a House step as requested!
    setStep('rent_house');
  };

  const handleHouseRented = () => {
    sound.playClick();

    const newPlayer: PlayerProfile = {
      id: 'player_' + Date.now(),
      username: username.trim() || 'Chief Ken',
      email: email.trim() || `citizen_${Date.now()}@delta.ng`,
      title: 'Delta Resident',
      balance: WELCOME_BONUS_NAIRA, // ₦1,000,000 Welcome Bonus!
      hunger: 90,
      energy: 100,
      fun: 85,
      skinTone: selectedSkin,
      outfitColor: selectedOutfit,
      hairStyle: 'fade',
      shoesColor: '#09090b',
      hasHouse: true,
      houseRented: true,
      houseTier: selectedHouse.tier,
      houseName: selectedHouse.name,
      placedFurniture: [], // House starts completely unfurnished so player can furnish and design it!
      ownedVehicles: ['keke_napep'],
      activeVehicleId: 'keke_napep',
      totalEarned: WELCOME_BONUS_NAIRA,
      jobsCompleted: 0,
      cashPickedCount: 0,
      createdAt: new Date().toISOString(),
      friends: [],
    };

    const storedProfiles = JSON.parse(localStorage.getItem('delta_life_profiles') || '{}');
    storedProfiles[newPlayer.email] = newPlayer;
    localStorage.setItem('delta_life_profiles', JSON.stringify(storedProfiles));
    localStorage.setItem('delta_life_active_user', newPlayer.email);

    setCreatedProfile(newPlayer);
    setStep('welcome_bonus');

    sound.playCelebration();
    confetti({
      particleCount: 140,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#eab308', '#38bdf8', '#f97316'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 text-white text-center relative">
          <div className="text-xs uppercase tracking-widest text-emerald-200 font-extrabold">
            Delta State 3D Life Simulation
          </div>
          <h2 className="text-2xl font-black text-white mt-1">DELTA LIFE</h2>
          <p className="text-xs text-emerald-100 font-medium">
            {step === 'auth' && 'Play as Guest or Register Your Identity'}
            {step === 'avatar' && 'Step 1: Arrange & Style Your Avatar'}
            {step === 'rent_house' && 'Step 2: Rent Your Villa in Delta State'}
            {step === 'welcome_bonus' && 'Step 3: Claim ₦1,000,000 Startup Cash!'}
          </p>
        </div>

        {/* STEP 1: AUTH (Supports playing without account!) */}
        {step === 'auth' && (
          <div className="p-6 space-y-5">
            <div className="flex border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 text-center py-2 font-bold text-xs cursor-pointer ${
                  isSignUp ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
                }`}
              >
                Sign Up (₦1M Bonus)
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 text-center py-2 font-bold text-xs cursor-pointer ${
                  !isSignUp ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Player Name / Alias
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Chief Ken, Warri Boss"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chief@delta.ng"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
              >
                {isSignUp ? 'Continue to Arrange Avatar' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('godswilluzoma517@gmail.com');
                  setPassword('smart446688');
                  setIsSignUp(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-300 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>👑 Quick Fill Admin Login (Unlimited Balance)</span>
              </button>
            </form>

            {/* Instant Guest Play button as requested: "make sure you can play without creating an account" */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onPlayAsGuest();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>⚡ Play as Guest (No Account Required)</span>
              </button>
              <p className="text-[10px] text-slate-500 mt-2">
                You will jump directly into Delta State with full 3D access and ₦1,000,000 cash.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: ARRANGE AVATAR as requested! */}
        {step === 'avatar' && (
          <div className="p-6 space-y-5">
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto rounded-full border-4 border-emerald-400 flex items-center justify-center text-white text-xl font-black shadow-xl"
                style={{ backgroundColor: selectedSkin }}
              >
                {username.charAt(0)}
              </div>
              <h3 className="font-bold text-white text-sm mt-2">{username}</h3>
              <p className="text-xs text-slate-400">Customize your avatar appearance</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Skin Tone</label>
                <div className="flex justify-center gap-3">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.color}
                      type="button"
                      onClick={() => setSelectedSkin(tone.color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedSkin === tone.color
                          ? 'border-emerald-400 scale-110 ring-2 ring-emerald-500'
                          : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: tone.color }}
                      title={tone.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Outfit Style</label>
                <div className="flex justify-center gap-3">
                  {OUTFIT_COLORS.map((outfit) => (
                    <button
                      key={outfit.color}
                      type="button"
                      onClick={() => setSelectedOutfit(outfit.color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedOutfit === outfit.color
                          ? 'border-emerald-400 scale-110 ring-2 ring-emerald-500'
                          : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: outfit.color }}
                      title={outfit.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAvatarDone}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Avatar Arranged · Proceed to Rent House</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: RENT A HOUSE as requested! */}
        {step === 'rent_house' && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                Residential Lease
              </span>
              <h3 className="text-lg font-black text-white mt-2">Rent Your Unfurnished Villa</h3>
              <p className="text-xs text-slate-400">
                All houses start unfurnished. You will build and design each room!
              </p>
            </div>

            <div className="space-y-2.5 max-h-[35vh] overflow-y-auto">
              {HOUSE_RENTALS.map((house) => {
                const isSelected = selectedHouse.tier === house.tier;
                return (
                  <div
                    key={house.tier}
                    onClick={() => setSelectedHouse(house)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-white">{house.name}</h4>
                        <div className="text-[10px] text-slate-400 mt-0.5">{house.area}</div>
                      </div>
                      <span className="text-xs font-black text-emerald-400 tabular-nums">
                        ₦{house.monthlyRent.toLocaleString()}/mo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2">{house.tagline}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleHouseRented}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Sign Lease &amp; Claim ₦1,000,000 Bonus</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: WELCOME BONUS CLAIM */}
        {step === 'welcome_bonus' && createdProfile && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Welcome, {createdProfile.username}!</h3>
              <p className="text-xs text-slate-400 mt-1">Your new player bonus is ready:</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/60 via-slate-800 to-slate-900 p-4 rounded-2xl border border-emerald-500/50">
              <div className="text-3xl font-black text-emerald-400 tabular-nums">₦1,000,000</div>
              <div className="text-xs text-slate-300 mt-1">
                Lease signed for {createdProfile.houseName}
              </div>
            </div>

            <button
              onClick={() => onSuccess(createdProfile)}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg cursor-pointer"
            >
              Enter Your Villa &amp; Start Furnishing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
