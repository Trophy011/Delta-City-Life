import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Home,
  ShoppingBag,
  Map,
  Smartphone,
  Eye,
  Camera,
  DoorOpen,
  ArrowRight,
  Sparkles,
  Zap,
  FastForward,
  MessageCircle,
} from 'lucide-react';
import { PlayerProfile, DeltaLocation } from '../types';
import { ViewMode } from '../game/GameCanvas';
import { sound } from '../utils/audio';

interface GameHUDProps {
  player: PlayerProfile;
  viewMode: ViewMode;
  nearLocation: DeltaLocation | null;
  nearPedestrian: string | null;
  cabDestination: DeltaLocation | null;
  onSelectTab: (tab: 'home' | 'buy' | 'map' | 'phone') => void;
  onToggleOutsideInside: () => void;
  onSkipCabTrip: () => void;
  onOpenCoinShop: () => void;
  onTalkPedestrian: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onOpenChatAndFriends: () => void;
  onOpenAdminFix?: () => void;
  touchInputRef: React.MutableRefObject<{
    moveX: number;
    moveY: number;
    jump: boolean;
    action: boolean;
    sprint: boolean;
  }>;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  viewMode,
  nearLocation,
  nearPedestrian,
  cabDestination,
  onSelectTab,
  onToggleOutsideInside,
  onSkipCabTrip,
  onOpenCoinShop,
  onTalkPedestrian,
  onToggleMute,
  isMuted,
  onOpenChatAndFriends,
  onOpenAdminFix,
  touchInputRef,
}) => {
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [isDraggingKnob, setIsDraggingKnob] = useState(false);

  const formatShortNaira = (amt: number) => {
    if (amt >= 1_000_000_000) return `₦${(amt / 1_000_000_000).toFixed(1)}B`;
    if (amt >= 1_000_000) return `₦${(amt / 1_000_000).toFixed(1)}M`;
    if (amt >= 1_000) return `₦${(amt / 1_000).toFixed(0)}K`;
    return `₦${amt}`;
  };

  const isHouse = viewMode === 'house_dollhouse';
  const isCab = viewMode === 'cab_ride';
  const isStreet = viewMode === 'street_walk';

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 md:p-5 z-20 overflow-hidden">
      {/* 1. TOP STATUS BAR MATCHING VIDEO 00:00-00:04 & 00:47 */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          {/* Left Pill: Time & Mood ☀️ 3:57 😄 */}
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
            <span>☀️ 3:58</span>
            <span>😄</span>
          </div>

          {/* Center Pill: Dropdown or Status */}
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <span>{isHouse ? 'Home sweet home' : isCab ? 'Highway Cruise' : 'Warri Central'}</span>
          </div>

          {/* Right Pill: Naira Balance ₦1.6B + and Admin Fix */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            {player.isAdmin && onOpenAdminFix && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAdminFix();
                }}
                className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 cursor-pointer animate-pulse"
              >
                <span>👑 ADMIN FIX</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onOpenCoinShop();
              }}
              className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/50 text-white text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer hover:border-emerald-400 transition-colors"
            >
              <span className="text-emerald-400 tabular-nums">{formatShortNaira(player.balance)}</span>
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center">
                +
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onToggleMute();
              }}
              className="p-1.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* 2. TOP BANNER & ACTION ROW MATCHING VIDEO 00:01 */}
        {isCab && cabDestination && (
          <div className="pointer-events-auto max-w-md mx-auto w-full flex flex-col gap-1.5 animate-in slide-in-from-top-2">
            <div className="bg-white/95 text-slate-900 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs md:text-sm">
              <span className="text-base">🚗</span>
              <span>On the way to {cabDestination.name}...</span>
            </div>

            {/* Quick Actions matching video: Horn · Map · Skip */}
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => sound.playHorn()}
                className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>📯 Horn</span>
              </button>
              <button
                onClick={() => onSelectTab('map')}
                className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>🗺️ Map</span>
              </button>
              <button
                onClick={onSkipCabTrip}
                className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold flex items-center gap-1 cursor-pointer shadow-md"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip</span>
              </button>
            </div>
          </div>
        )}

        {isHouse && (
          <div className="pointer-events-auto max-w-sm mx-auto bg-white/90 text-slate-900 px-4 py-1.5 rounded-full shadow-lg flex items-center justify-center gap-2 text-xs font-extrabold animate-in fade-in">
            <span>🏠 Home sweet home</span>
          </div>
        )}
      </div>

      {/* 3. STREET INTERACTION BUBBLES MATCHING VIDEO 01:06-01:13 */}
      {isStreet && (
        <div className="pointer-events-auto self-center flex flex-col items-center gap-2 mb-2 animate-in zoom-in-95">
          {nearPedestrian && (
            <button
              onClick={() => {
                sound.playClick();
                onTalkPedestrian();
              }}
              className="px-4 py-2 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-2xl flex items-center gap-2 border border-slate-300 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Talk · {nearPedestrian}</span>
            </button>
          )}

          {nearLocation && (
            <button
              onClick={() => {
                sound.playClick();
                if (nearLocation.id === 'loc_home') onToggleOutsideInside();
                else onSelectTab('phone');
              }}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 cursor-pointer active:scale-95"
            >
              <DoorOpen className="w-4 h-4" />
              <span>{nearLocation.id === 'loc_home' ? 'Go inside' : `Enter ${nearLocation.name}`}</span>
            </button>
          )}
        </div>
      )}

      {/* 4. STREET ON-SCREEN CONTROLS (Fluid GTA Virtual Analog Joystick) */}
      {isStreet && (
        <div className="flex justify-between items-end w-full pb-14 pointer-events-none">
          {/* Virtual Analog Joystick (Clean GTA mobile thumbstick - Run button removed, analog controls walking and sprinting directly!) */}
          <div className="pointer-events-auto select-none">
            <div
              className={`relative w-36 h-36 rounded-full border-2 ${
                isDraggingKnob ? 'border-emerald-400 bg-black/50 shadow-emerald-500/20' : 'border-white/40 bg-black/35'
              } backdrop-blur-md flex items-center justify-center touch-none shadow-2xl transition-colors duration-200`}
              onPointerDown={(e) => {
                const target = e.currentTarget;
                target.setPointerCapture(e.pointerId);
                setIsDraggingKnob(true);
                const rect = target.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const maxR = rect.width / 2 - 20;
                const dx = e.clientX - cx;
                const dy = e.clientY - cy;
                const dist = Math.hypot(dx, dy);
                const clampedDist = Math.min(dist, maxR);
                const angle = Math.atan2(dy, dx);
                const kx = Math.cos(angle) * clampedDist;
                const ky = Math.sin(angle) * clampedDist;
                setKnobOffset({ x: kx, y: ky });

                const normX = kx / maxR;
                const normY = ky / maxR;
                touchInputRef.current.moveX = normX;
                touchInputRef.current.moveY = normY;
                touchInputRef.current.sprint = Math.hypot(normX, normY) > 0.65;
              }}
              onPointerMove={(e) => {
                if (isDraggingKnob || e.buttons > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const cx = rect.left + rect.width / 2;
                  const cy = rect.top + rect.height / 2;
                  const maxR = rect.width / 2 - 20;
                  const dx = e.clientX - cx;
                  const dy = e.clientY - cy;
                  const dist = Math.hypot(dx, dy);
                  const clampedDist = Math.min(dist, maxR);
                  const angle = Math.atan2(dy, dx);
                  const kx = Math.cos(angle) * clampedDist;
                  const ky = Math.sin(angle) * clampedDist;
                  setKnobOffset({ x: kx, y: ky });

                  const normX = kx / maxR;
                  const normY = ky / maxR;
                  touchInputRef.current.moveX = normX;
                  touchInputRef.current.moveY = normY;
                  touchInputRef.current.sprint = Math.hypot(normX, normY) > 0.65;
                }
              }}
              onPointerUp={(e) => {
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {
                  // ignore
                }
                setIsDraggingKnob(false);
                setKnobOffset({ x: 0, y: 0 });
                touchInputRef.current.moveX = 0;
                touchInputRef.current.moveY = 0;
                touchInputRef.current.sprint = false;
              }}
              onPointerCancel={(e) => {
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {
                  // ignore
                }
                setIsDraggingKnob(false);
                setKnobOffset({ x: 0, y: 0 });
                touchInputRef.current.moveX = 0;
                touchInputRef.current.moveY = 0;
                touchInputRef.current.sprint = false;
              }}
            >
              {/* Outer directional indicators */}
              <div className="absolute top-1 text-[9px] font-black text-white/40 tracking-wider">▲</div>
              <div className="absolute bottom-1 text-[9px] font-black text-white/40 tracking-wider">▼</div>
              <div className="absolute left-1.5 text-[9px] font-black text-white/40">◀</div>
              <div className="absolute right-1.5 text-[9px] font-black text-white/40">▶</div>

              {/* Sprint boundary threshold circle */}
              <div className="absolute w-24 h-24 rounded-full border border-dashed border-white/15 pointer-events-none" />

              {/* Inner Analog Knob */}
              <div
                className={`w-14 h-14 rounded-full ${
                  isDraggingKnob
                    ? 'bg-gradient-to-br from-white to-slate-200 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                    : 'bg-white/95 border-2 border-slate-300 shadow-xl'
                } pointer-events-none transition-transform duration-75 flex items-center justify-center`}
                style={{
                  transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full transition-colors ${
                    Math.hypot(knobOffset.x, knobOffset.y) > 30 ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Right side floating controls matching video 00:00-00:46 */}
          <div className="pointer-events-auto flex flex-col items-end gap-2.5">
            {/* GPS center */}
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('map');
              }}
              className="w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-xl flex items-center justify-center font-black cursor-pointer hover:bg-white"
              title="GPS Center"
            >
              ⌖
            </button>

            {/* Eye: Camera View Mode */}
            <button
              onClick={() => {
                sound.playClick();
              }}
              className="w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-xl flex items-center justify-center cursor-pointer hover:bg-white"
              title="Camera View"
            >
              <Eye className="w-5 h-5 text-slate-800" />
            </button>

            {/* Volume toggle */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleMute();
              }}
              className="w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-xl flex items-center justify-center cursor-pointer hover:bg-white"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-slate-800" />}
            </button>

            {/* Door: Go inside */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleOutsideInside();
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl flex items-center gap-1.5 cursor-pointer mt-1"
            >
              <DoorOpen className="w-4 h-4" />
              <span>Go inside</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. BOTTOM NAVIGATION BAR MATCHING VIDEO 00:01, 00:04, 00:10, 00:47 EXACTLY */}
      <div className="pointer-events-auto self-center w-full max-w-lg bg-white/95 text-slate-800 rounded-3xl p-2 px-3.5 shadow-2xl border border-slate-200 flex items-center justify-between backdrop-blur-md">
        {/* Left: Avatar circle with energy percentage ring 56% matching video */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
          <div
            className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-white font-black text-xs shadow"
            style={{ backgroundColor: player.skinTone }}
          >
            {player.username.charAt(0)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
            <span>🔑</span>
            <span className="tabular-nums">56%</span>
          </div>
        </div>

        {/* Tab 1: Home (House icon) */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('home');
          }}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all cursor-pointer ${
            isHouse ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Tab 2: Buy (Furniture catalogue) */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('buy');
          }}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">Buy</span>
        </button>

        {/* Tab 3: Map */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('map');
          }}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-bold">Map</span>
        </button>

        {/* Tab 4: Social / Chat & Friends with other players! */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenChatAndFriends();
          }}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl text-slate-600 hover:text-slate-900 transition-all cursor-pointer relative"
        >
          <MessageCircle className="w-5 h-5 text-sky-600" />
          <span className="text-[10px] font-bold">Chat</span>
          <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-sky-500 animate-ping" />
        </button>

        {/* Tab 5: Go Outside / Inside Toggle Button */}
        {isHouse ? (
          <button
            onClick={() => {
              sound.playClick();
              onToggleOutsideInside();
            }}
            className="px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
          >
            <DoorOpen className="w-4 h-4 text-emerald-400" />
            <span>Go outside</span>
          </button>
        ) : null}

        {/* Tab 6: Phone (Smartphone icon matching video!) */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('phone');
          }}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors cursor-pointer border border-slate-300 shadow-sm"
          title="Open Phone"
        >
          <Smartphone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
