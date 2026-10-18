import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Briefcase,
  Car,
  Home,
  Zap,
  ArrowLeft,
  Send,
  Navigation,
  CheckCircle2,
  Sparkles,
  Phone,
  Compass,
} from 'lucide-react';
import { INITIAL_PHONE_MESSAGES, DELTA_LOCATIONS } from '../game/constants';
import { PlayerProfile, DeltaLocation } from '../types';
import { sound } from '../utils/audio';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onCallCab: (dest: DeltaLocation, fare: number) => void;
  onOpenJobs: () => void;
  onOpenCoinShop: () => void;
  onRentHouse: () => void;
  onOpenTransfers?: () => void;
  onOpenWardrobe?: () => void;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({
  isOpen,
  onClose,
  player,
  onCallCab,
  onOpenJobs,
  onOpenCoinShop,
  onRentHouse,
  onOpenTransfers,
  onOpenWardrobe,
}) => {
  const [activeApp, setActiveApp] = useState<'home' | 'messages' | 'cab' | 'chat_thread'>('home');
  const [selectedThread, setSelectedThread] = useState<typeof INITIAL_PHONE_MESSAGES[0] | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [messages, setMessages] = useState(INITIAL_PHONE_MESSAGES);
  const [cabBookingSuccess, setCabBookingSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedThread) return;
    sound.playClick();

    const updated = messages.map((m) => {
      if (m.id === selectedThread.id) {
        return {
          ...m,
          text: `You: ${replyInput.trim()}`,
          time: 'Just now',
          unread: false,
        };
      }
      return m;
    });

    setMessages(updated);
    setSelectedThread({
      ...selectedThread,
      text: `You: ${replyInput.trim()}`,
      time: 'Just now',
    });
    setReplyInput('');
  };

  const handleOrderCab = (loc: DeltaLocation) => {
    sound.playClick();
    if (player.balance < loc.cabFare) {
      alert(`Insufficient funds! A cab to ${loc.name} costs ₦${loc.cabFare.toLocaleString()}`);
      return;
    }
    setCabBookingSuccess(loc.name);
    setTimeout(() => {
      onCallCab(loc, loc.cabFare);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      {/* iPhone Device Wrapper matching video 00:48 */}
      <div className="relative w-[340px] h-[670px] bg-slate-950 rounded-[44px] border-[6px] border-slate-700 shadow-2xl overflow-hidden flex flex-col select-none">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
        </div>

        {/* Top Status Bar (3:58 PM · 4G · 98%) */}
        <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[11px] text-white font-semibold z-30">
          <span>3:58 PM</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>4G</span>
            <span>98%</span>
          </div>
        </div>

        {/* Close Button at Top */}
        <div className="px-4 py-1 flex justify-end z-30">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Close</span>
          </button>
        </div>

        {/* App Screens */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-1 text-white">
          {activeApp === 'home' && (
            /* Home Screen App Grid matching video 00:48! */
            <div className="space-y-6 pt-3">
              <div className="text-center">
                <div className="text-xs text-slate-400">Welcome,</div>
                <div className="text-lg font-black text-white">{player.username}</div>
                <div className="text-xs text-emerald-400 font-bold tabular-nums">
                  ₦{player.balance.toLocaleString()}
                </div>
              </div>

              {/* 4x3 App Grid */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
                {/* Messages */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveApp('messages');
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md relative group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-black flex items-center justify-center border-2 border-slate-900">
                      8
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200">Messages</span>
                </button>

                {/* Cab Ride Hail */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveApp('cab');
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200">Bolt Cab</span>
                </button>

                {/* Jobs */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenJobs();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200">Jobs</span>
                </button>

                {/* Rent / Upgrade House */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onRentHouse();
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Home className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200">House</span>
                </button>

                {/* Delta Bank / Coins */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenCoinShop();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200">Buy Coins</span>
                </button>

                {/* Send Money / Bank Transfer */}
                <button
                  onClick={() => {
                    sound.playClick();
                    if (onOpenTransfers) onOpenTransfers();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-xl font-black">₦</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200">Transfer</span>
                </button>

                {/* Delta Drip / Wardrobe */}
                <button
                  onClick={() => {
                    sound.playClick();
                    if (onOpenWardrobe) onOpenWardrobe();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-xl">👔</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200">Delta Drip</span>
                </button>

                {/* PopOut Tickets */}
                <div className="flex flex-col items-center gap-1 opacity-80">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md font-bold text-xs">
                    🎟️
                  </div>
                  <span className="text-[10px] text-slate-300">Tickets</span>
                </div>

                {/* NollyWoc */}
                <div className="flex flex-col items-center gap-1 opacity-80">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md font-bold text-xs">
                    🎬
                  </div>
                  <span className="text-[10px] text-slate-300">NollyWoc</span>
                </div>

                {/* BetTips */}
                <div className="flex flex-col items-center gap-1 opacity-80">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md font-bold text-xs">
                    ⚽
                  </div>
                  <span className="text-[10px] text-slate-300">BetTips</span>
                </div>
              </div>
            </div>
          )}

          {activeApp === 'messages' && (
            /* Messaging App matching video 00:50! */
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveApp('home')}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-sm text-white">Messages</h3>
                <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full ml-auto">
                  8+
                </span>
              </div>

              <div className="space-y-2">
                {messages.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedThread(thread);
                      setActiveApp('chat_thread');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ backgroundColor: thread.avatarBg }}
                    >
                      {thread.sender.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-white truncate">{thread.sender}</span>
                        <span className="text-[10px] text-slate-400">{thread.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{thread.handle}</div>
                      <p className="text-[11px] text-slate-300 truncate mt-0.5">{thread.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeApp === 'chat_thread' && selectedThread && (
            /* Individual Chat Thread */
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                  <button
                    onClick={() => setActiveApp('messages')}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-bold text-white">{selectedThread.sender}</div>
                  <span className="text-[10px] text-slate-400 ml-auto">{selectedThread.handle}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl max-w-[85%] text-slate-200">
                    {selectedThread.text}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendReply} className="flex gap-2 pt-4">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {activeApp === 'cab' && (
            /* Bolt Cab Ride Hail Screen with genuine Nigerian prices! */
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveApp('home')}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-sm text-white">Bolt Delta Cab &amp; Keke</h3>
              </div>

              {cabBookingSuccess && (
                <div className="bg-emerald-950 border border-emerald-800 p-2.5 rounded-xl text-center text-xs text-emerald-300 font-bold animate-in zoom-in-95">
                  🚖 Cab booked to {cabBookingSuccess}! Driver is picking you up...
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                Choose your destination. Real Nigerian transport fares:
              </p>

              <div className="space-y-2">
                {DELTA_LOCATIONS.filter((l) => l.cabFare > 0).map((loc) => (
                  <div
                    key={loc.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.area} · {loc.tagline}</div>
                    </div>
                    <button
                      onClick={() => handleOrderCab(loc)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>₦{loc.cabFare.toLocaleString()}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* iPhone Home Bar */}
        <div className="pb-2 pt-1 flex justify-center z-30">
          <div
            onClick={() => setActiveApp('home')}
            className="w-32 h-1 bg-white/40 rounded-full cursor-pointer hover:bg-white"
          />
        </div>
      </div>
    </div>
  );
};
