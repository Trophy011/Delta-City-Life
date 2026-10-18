/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameCanvas, ViewMode } from './game/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { TitleScreen } from './components/TitleScreen';
import { AuthModal } from './components/AuthModal';
import { CoinShopModal } from './components/CoinShopModal';
import { HouseCustomizerModal } from './components/HouseCustomizerModal';
import { DealershipModal } from './components/DealershipModal';
import { JobsModal } from './components/JobsModal';
import { PhoneModal } from './components/PhoneModal';
import { MapOverlay } from './components/MapOverlay';
import { AdminFixModal } from './components/AdminFixModal';
import { ChatAndFriendsModal } from './components/ChatAndFriendsModal';
import { AvatarWardrobeModal } from './components/AvatarWardrobeModal';
import { PlayerProfile, PlacedFurniture, DeltaLocation, Friend, ChatMessage } from './types';
import { WELCOME_BONUS_NAIRA, DELTA_LOCATIONS, INITIAL_FRIENDS, INITIAL_CHAT_MESSAGES } from './game/constants';
import { sound } from './utils/audio';

const STORAGE_ACTIVE_USER = 'delta_life_active_user';
const STORAGE_PROFILES = 'delta_life_profiles';

const DEFAULT_GUEST_PLAYER: PlayerProfile = {
  id: 'guest_player',
  username: 'Chief Ken',
  email: 'guest@deltalife.ng',
  title: 'Warri Pioneer',
  balance: WELCOME_BONUS_NAIRA, // ₦1,000,000 Welcome Bonus!
  hunger: 85,
  energy: 100,
  fun: 90,
  skinTone: '#8d5524',
  outfitColor: '#18181b',
  hairStyle: 'fade',
  shoesColor: '#09090b',
  hasHouse: true,
  houseRented: true,
  houseTier: 'standard',
  houseName: 'Warri Central Villa (Unfurnished)',
  placedFurniture: [], // House starts bare and unfurnished!
  ownedVehicles: ['keke_napep'],
  activeVehicleId: null, // Start on foot so 3D character is visible in third person when stepping outside!
  totalEarned: WELCOME_BONUS_NAIRA,
  jobsCompleted: 0,
  cashPickedCount: 0,
  createdAt: new Date().toISOString(),
  friends: INITIAL_FRIENDS,
};

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'playing'>('title');
  const [viewMode, setViewMode] = useState<ViewMode>('house_dollhouse');
  const [activeFloor, setActiveFloor] = useState<'downstairs' | 'upstairs'>('downstairs');
  const [isDancing, setIsDancing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Landmarks & Pedestrian interaction
  const [nearLocation, setNearLocation] = useState<DeltaLocation | null>(null);
  const [nearPedestrian, setNearPedestrian] = useState<string | null>(null);
  const [pedestrianDialogue, setPedestrianDialogue] = useState<string | null>(null);
  const [cabDestination, setCabDestination] = useState<DeltaLocation | null>(null);

  // Transition screen ("Stepping outside..." matching video 00:54-00:55!)
  const [transitionText, setTransitionText] = useState<string | null>(null);

  // Modals & Panels
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCoinShopOpen, setIsCoinShopOpen] = useState(false);
  const [isHouseCatalogueOpen, setIsHouseCatalogueOpen] = useState(false);
  const [isDealershipOpen, setIsDealershipOpen] = useState(false);
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isAdminFixOpen, setIsAdminFixOpen] = useState(false);
  const [isChatAndFriendsOpen, setIsChatAndFriendsOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);

  // Multiplayer Social state
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  // Player state
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    try {
      const activeEmail = localStorage.getItem(STORAGE_ACTIVE_USER);
      if (activeEmail) {
        const profiles = JSON.parse(localStorage.getItem(STORAGE_PROFILES) || '{}');
        if (profiles[activeEmail]) {
          return profiles[activeEmail];
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_GUEST_PLAYER;
  });

  const touchInputRef = useRef({
    moveX: 0,
    moveY: 0,
    jump: false,
    action: false,
    sprint: false,
  });

  const savePlayerState = (updated: PlayerProfile) => {
    setPlayer(updated);
    try {
      const profiles = JSON.parse(localStorage.getItem(STORAGE_PROFILES) || '{}');
      profiles[updated.email] = updated;
      localStorage.setItem(STORAGE_PROFILES, JSON.stringify(profiles));
      localStorage.setItem(STORAGE_ACTIVE_USER, updated.email);
    } catch {
      // ignore
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Stepping outside / stepping inside transition (matching video 00:54-00:55!)
  const handleToggleOutsideInside = () => {
    const goingOutside = viewMode === 'house_dollhouse';
    setTransitionText(goingOutside ? 'Stepping outside...' : 'Stepping inside...');
    sound.playClick();

    setTimeout(() => {
      if (goingOutside) {
        // When stepping outside, ensure player is on foot so realistic 3D GTA character is visible!
        savePlayerState({
          ...player,
          activeVehicleId: null,
        });
      }
      setViewMode(goingOutside ? 'street_walk' : 'house_dollhouse');
      setTransitionText(null);
    }, 450);
  };

  // Bottom Navigation Bar Select
  const handleSelectTab = (tab: 'home' | 'buy' | 'map' | 'phone') => {
    if (tab === 'home') {
      setViewMode('house_dollhouse');
      setIsMapOpen(false);
      setIsPhoneOpen(false);
    } else if (tab === 'buy') {
      setViewMode('house_dollhouse');
      setIsHouseCatalogueOpen(true);
      setIsMapOpen(false);
      setIsPhoneOpen(false);
    } else if (tab === 'map') {
      setIsMapOpen(true);
      setIsPhoneOpen(false);
    } else if (tab === 'phone') {
      setIsPhoneOpen(true);
    }
  };

  // Call a Cab to a Destination (matching video 00:00-00:03!)
  const handleCallCab = (dest: DeltaLocation, fare: number) => {
    if (fare > 0) {
      savePlayerState({
        ...player,
        balance: Math.max(0, player.balance - fare),
      });
    }
    setCabDestination(dest);
    setViewMode('cab_ride');
    setIsMapOpen(false);
    setIsPhoneOpen(false);
    showNotification(`🚗 On the way to ${dest.name}...`);

    setTimeout(() => {
      setCabDestination((curr) => {
        if (curr?.id === dest.id) {
          handleArriveAtDestination(dest);
        }
        return null;
      });
    }, 7000);
  };

  const handleSkipCabTrip = () => {
    if (cabDestination) {
      handleArriveAtDestination(cabDestination);
      setCabDestination(null);
    }
  };

  const handleArriveAtDestination = (dest: DeltaLocation) => {
    sound.playCelebration();
    if (dest.id === 'loc_home') {
      setViewMode('house_dollhouse');
    } else {
      setViewMode('street_walk');
    }
    showNotification(`Arrived at ${dest.name}!`);
  };

  // Pick money from club / streets
  const handlePickCash = (amount: number) => {
    const updated: PlayerProfile = {
      ...player,
      balance: player.balance + amount,
      totalEarned: player.totalEarned + amount,
      cashPickedCount: player.cashPickedCount + 1,
      fun: Math.min(100, player.fun + 5),
    };
    savePlayerState(updated);
    showNotification(`+₦${amount.toLocaleString()} Picked from Club Floor!`);
  };

  // Credit Naira from Flutterwave payment
  const handleCreditBalance = (nairaAmount: number, desc: string) => {
    const updated: PlayerProfile = {
      ...player,
      balance: player.balance + nairaAmount,
      totalEarned: player.totalEarned + nairaAmount,
    };
    savePlayerState(updated);
    showNotification(`+₦${nairaAmount.toLocaleString()} Credited via Flutterwave!`);
  };

  // Update house furniture (furnishing the raw house)
  const handleUpdateHouseFurniture = (items: PlacedFurniture[], cost: number, comfortBoost: number) => {
    const updated: PlayerProfile = {
      ...player,
      balance: Math.max(0, player.balance - cost),
      placedFurniture: items,
      fun: Math.min(100, player.fun + 10),
      energy: Math.min(100, player.energy + comfortBoost),
    };
    savePlayerState(updated);
  };

  // Talk to passer-by on street
  const handleTalkPedestrian = () => {
    const phrases = [
      '"How far na, Chief! Warri no dey carry last!"',
      '"Club Empire go hot tonight o! Make sure you go pick money!"',
      '"Your new duplex villa for Warri here fine die!"',
      '"You don visit the new Shoprite for Delta Mall? E clean well well!"',
      '"Safe journey my brother, God bless your hustle!"',
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPedestrianDialogue(phrase);
    sound.playClick();
    setTimeout(() => setPedestrianDialogue(null), 4000);
  };

  // Work Shift Completed
  const handleJobCompleted = (earnedPay: number, energyUsed: number, jobTitle: string) => {
    const updated: PlayerProfile = {
      ...player,
      balance: player.balance + earnedPay,
      totalEarned: player.totalEarned + earnedPay,
      energy: Math.max(0, player.energy - energyUsed),
      jobsCompleted: player.jobsCompleted + 1,
    };
    savePlayerState(updated);
    showNotification(`+₦${earnedPay.toLocaleString()} Earned from ${jobTitle}!`);
  };

  // Send Private 1-on-1 Chat Message
  const handleSendMessage = (text: string, recipientHandle?: string) => {
    const userHandle = `@${player.username.toLowerCase().replace(/\s+/g, '')}`;
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: player.username,
      handle: userHandle,
      avatarColor: player.skinTone || '#2563eb',
      text,
      timestamp: 'Just now',
      isDirect: !!recipientHandle,
      recipientHandle: recipientHandle || '@blakchase',
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulate realistic private player reply from the specific friend
    setTimeout(() => {
      const targetFriend = friends.find((f) => f.handle === recipientHandle) || friends[0];
      const botReplies: Record<string, string[]> = {
        '@blakchase': [
          'Big boss! Meet me for Club Empire, the party just started!',
          'That your Warri duplex is looking clean bro!',
          'Sharp! How much did you pay for that new ride?',
          'Salute Chief! Catch me cruising on the expressway.',
        ],
        '@Amane': [
          'I dey furnish my parlor now, you fit come inspect!',
          'Warri life sweet pass anything, no cap!',
          'Nice one bro! Let us link up at Delta Mall later.',
        ],
        '@djw_emmy': [
          'Turn up tonight at Club Empire! High energy beats only!',
          'Bro when you pull up to the VIP lounge let me know!',
        ],
      };

      const replies = botReplies[targetFriend?.handle || ''] || [
        'Sharp bro! Received your message loud and clear.',
        'Odogwu! How body? Everything dey move well here.',
        'Safe bro! Let us connect for Delta central soon.',
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: targetFriend ? targetFriend.username : 'Delta Player',
        handle: targetFriend ? targetFriend.handle : '@player',
        avatarColor: targetFriend ? targetFriend.avatarColor : '#059669',
        text: replyText,
        timestamp: 'Just now',
        isDirect: true,
        recipientHandle: userHandle,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  // Send Money to Anyone (P2P Delta Bank Wire Transfer)
  const handleSendMoney = (recipientHandle: string, amount: number, memo?: string): boolean => {
    if (player.balance < amount) {
      showNotification(`❌ Insufficient funds! You have ₦${player.balance.toLocaleString()}`);
      return false;
    }

    const cleanRecipient = recipientHandle.startsWith('@') ? recipientHandle : `@${recipientHandle}`;
    const userHandle = `@${player.username.toLowerCase().replace(/\s+/g, '')}`;
    const newBalance = player.balance - amount;

    savePlayerState({
      ...player,
      balance: newBalance,
    });

    sound.playCelebration();

    const refNum = 'DLTA-' + Math.floor(100000 + Math.random() * 900000);
    const receiptMsg: ChatMessage = {
      id: 'tx_' + Date.now(),
      sender: player.username,
      handle: userHandle,
      avatarColor: player.skinTone || '#2563eb',
      text: memo || 'Instant Bank Wire Transfer',
      timestamp: 'Just now',
      isDirect: true,
      recipientHandle: cleanRecipient,
      transferAmount: amount,
      isTransferReceipt: true,
      refNumber: refNum,
    };

    setChatMessages((prev) => [...prev, receiptMsg]);
    showNotification(`💸 Sent ₦${amount.toLocaleString()} to ${cleanRecipient}!`);

    // Simulated recipient acknowledgement in private chat
    setTimeout(() => {
      const ackMsg: ChatMessage = {
        id: 'msg_ack_' + Date.now(),
        sender: cleanRecipient.replace(/^@/, ''),
        handle: cleanRecipient,
        avatarColor: '#10b981',
        text: `Odogwu! I just received the ₦${amount.toLocaleString()} alert! Thank you so much big boss 🙌🔥`,
        timestamp: 'Just now',
        isDirect: true,
        recipientHandle: userHandle,
      };
      setChatMessages((prev) => [...prev, ackMsg]);
    }, 1500);

    return true;
  };

  // Add Friend by Username
  const handleAddFriend = (username: string) => {
    const cleanUser = username.replace(/^@/, '');
    const newFriend: Friend = {
      id: 'friend_' + Date.now(),
      username: cleanUser,
      handle: `@${cleanUser}`,
      avatarColor: ['#2563eb', '#059669', '#db2777', '#d97706', '#7c3aed'][Math.floor(Math.random() * 5)],
      status: 'Online in Warri',
      isOnline: true,
    };
    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    savePlayerState({
      ...player,
      friends: updatedFriends,
    });
    showNotification(`Added @${cleanUser} to Friends!`);
  };

  // Admin Teleport
  const handleAdminTeleport = (x: number, z: number, locName: string) => {
    setViewMode('street_walk');
    showNotification(`⚡ Admin Warp: Teleported to ${locName}!`);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D Game World Canvas */}
      <GameCanvas
        player={player}
        viewMode={viewMode}
        activeFloor={activeFloor}
        isDancing={isDancing}
        cabDestination={cabDestination}
        onPickCash={handlePickCash}
        onNearLocationChange={setNearLocation}
        onNearPedestrianChange={setNearPedestrian}
        onEnterLocation={(loc) => {
          if (loc.id === 'loc_home') handleToggleOutsideInside();
          else if (loc.id === 'loc_club') sound.startClubMusic();
          else setIsPhoneOpen(true);
        }}
        onStopDancing={() => setIsDancing(false)}
        touchInputRef={touchInputRef}
      />

      {/* Stepping Outside Transition Modal matching video 00:54-00:55 */}
      {transitionText && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white space-y-3 animate-in fade-in duration-200">
          <div className="text-4xl animate-bounce">🚪</div>
          <div className="text-sm font-bold tracking-wide text-slate-300">{transitionText}</div>
        </div>
      )}

      {/* Passer-by Dialogue Bubble */}
      {pedestrianDialogue && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-white text-slate-900 px-5 py-2.5 rounded-2xl shadow-2xl font-bold text-xs border border-slate-300 animate-in slide-in-from-top-2">
          {pedestrianDialogue}
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in slide-in-from-top-2">
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 px-4 py-2 rounded-2xl shadow-2xl font-black text-xs">
            {notification}
          </div>
        </div>
      )}

      {/* Title Screen vs In-Game Full Viewport Shell */}
      {gameState === 'title' ? (
        <TitleScreen
          onStartGame={() => {
            setGameState('playing');
            sound.playCelebration();
          }}
          onOpenAuth={() => setIsAuthOpen(true)}
          hasExistingPlayer={!!player.username}
          playerName={player.username}
        />
      ) : (
        <GameHUD
          player={player}
          viewMode={viewMode}
          nearLocation={nearLocation}
          nearPedestrian={nearPedestrian}
          cabDestination={cabDestination}
          onSelectTab={handleSelectTab}
          onToggleOutsideInside={handleToggleOutsideInside}
          onSkipCabTrip={handleSkipCabTrip}
          onOpenCoinShop={() => setIsCoinShopOpen(true)}
          onTalkPedestrian={handleTalkPedestrian}
          onToggleMute={handleToggleMute}
          isMuted={isMuted}
          onOpenChatAndFriends={() => setIsChatAndFriendsOpen(true)}
          onOpenWardrobe={() => setIsWardrobeOpen(true)}
          onOpenAdminFix={() => setIsAdminFixOpen(true)}
          touchInputRef={touchInputRef}
        />
      )}

      {/* Avatar Wardrobe & Boutique (GTA Style clothes and avatar editor) */}
      <AvatarWardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        player={player}
        onUpdateProfile={savePlayerState}
      />

      {/* Buy Mode / Catalogue for House matching video 00:31-00:46 */}
      <HouseCustomizerModal
        isOpen={isHouseCatalogueOpen}
        onClose={() => setIsHouseCatalogueOpen(false)}
        player={player}
        activeFloor={activeFloor}
        onToggleFloor={setActiveFloor}
        onUpdateHouseFurniture={handleUpdateHouseFurniture}
      />

      {/* Smartphone matching video 00:47-00:51 */}
      <PhoneModal
        isOpen={isPhoneOpen}
        onClose={() => setIsPhoneOpen(false)}
        player={player}
        onCallCab={handleCallCab}
        onOpenJobs={() => setIsJobsOpen(true)}
        onOpenCoinShop={() => setIsCoinShopOpen(true)}
        onRentHouse={() => setIsAuthOpen(true)}
        onOpenTransfers={() => setIsChatAndFriendsOpen(true)}
        onOpenWardrobe={() => setIsWardrobeOpen(true)}
      />

      {/* Interactive 3D Map Overlay matching video 00:10-00:30 */}
      <MapOverlay
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        player={player}
        onSelectDestinationCab={handleCallCab}
      />

      {/* Multiplayer Chat & Friends Modal */}
      <ChatAndFriendsModal
        isOpen={isChatAndFriendsOpen}
        onClose={() => setIsChatAndFriendsOpen(false)}
        player={player}
        friends={friends}
        chatMessages={chatMessages}
        onSendMessage={handleSendMessage}
        onSendMoney={handleSendMoney}
        onAddFriend={handleAddFriend}
      />

      {/* Admin Fix God-Mode Modal */}
      <AdminFixModal
        isOpen={isAdminFixOpen}
        onClose={() => setIsAdminFixOpen(false)}
        player={player}
        onUpdatePlayer={savePlayerState}
        onTeleport={handleAdminTeleport}
      />

      {/* Auth Modal (Supports Instant Guest Play, Admin Login & Avatar/House Renting) */}
      <AuthModal
        isOpen={isAuthOpen}
        onSuccess={(newProfile) => {
          setPlayer(newProfile);
          setIsAuthOpen(false);
          setGameState('playing');
        }}
        onClose={() => setIsAuthOpen(false)}
        onPlayAsGuest={() => {
          setPlayer(DEFAULT_GUEST_PLAYER);
          setIsAuthOpen(false);
          setGameState('playing');
        }}
      />

      {/* Real-Money Coin Shop (Flutterwave 1m for $10, 5m for $50, 10m for $75) */}
      <CoinShopModal
        isOpen={isCoinShopOpen}
        onClose={() => setIsCoinShopOpen(false)}
        onCreditBalance={handleCreditBalance}
        currentBalance={player.balance}
      />

      {/* Dealership (Danfo Bus, Cars, Keke, G-Wagon, Supercar, Private Jet) */}
      <DealershipModal
        isOpen={isDealershipOpen}
        onClose={() => setIsDealershipOpen(false)}
        player={player}
        onBuyVehicle={(vehId, cost) => {
          const owned = [...player.ownedVehicles];
          if (!owned.includes(vehId)) owned.push(vehId);
          savePlayerState({
            ...player,
            balance: Math.max(0, player.balance - cost),
            ownedVehicles: owned,
            activeVehicleId: vehId,
          });
          showNotification(`Purchased ${vehId}!`);
        }}
        onEquipVehicle={(vehId) => {
          savePlayerState({
            ...player,
            activeVehicleId: vehId,
          });
        }}
        onOpenCoinShop={() => {
          setIsDealershipOpen(false);
          setIsCoinShopOpen(true);
        }}
      />

      {/* Jobs Modal (WRPC Oil & Gas, Asaba Tech Hub, Logistics, VIP Club) */}
      <JobsModal
        isOpen={isJobsOpen}
        onClose={() => setIsJobsOpen(false)}
        player={player}
        onJobCompleted={handleJobCompleted}
      />
    </div>
  );
}
