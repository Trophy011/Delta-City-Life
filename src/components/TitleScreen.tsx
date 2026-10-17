import React from 'react';
import { Play, Sparkles, User, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenAuth: () => void;
  hasExistingPlayer: boolean;
  playerName?: string;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenAuth,
  hasExistingPlayer,
  playerName,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-12 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/90 text-white select-none">
      {/* Top Bar Branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Delta State 3D Simulation</span>
          </span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenAuth();
          }}
          className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
        >
          <User className="w-4 h-4 text-emerald-400" />
          <span>{hasExistingPlayer ? `Player: ${playerName}` : 'Sign Up / Sign In'}</span>
        </button>
      </div>

      {/* Bespoke Centerpiece & Title Lockup */}
      <div className="max-w-2xl space-y-4 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>New Players Receive ₦1,000,000 Welcome Cash Bonus!</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none drop-shadow-2xl">
          DELTA <span className="text-emerald-400">LIFE</span> 3D
        </h1>

        <p className="text-base md:text-xl text-slate-300 font-medium max-w-xl drop-shadow">
          Experience the pulse of Warri, Effurun, and Asaba. Own and furnish your raw villa, work Oil &amp; Gas jobs, collect money and dance in Club Empire, and take flight in private jets.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['🏠 Furnish Empty Villa', '🎵 Club Empire Money Rain', '🛢️ Oil & Gas Shifts', '✈️ Private Jet Flight', '💳 Flutterwave Store'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Primary Start CTA */}
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 cursor-pointer transition-all transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{hasExistingPlayer ? 'Resume Living in Delta' : 'Claim ₦1,000,000 & Start'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Flat Control Hint Line */}
      <div className="text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
        WASD Move · Space Jump/Takeoff · Shift Sprint · E Interact/Enter · F Dance · H Horn
      </div>
    </div>
  );
};
