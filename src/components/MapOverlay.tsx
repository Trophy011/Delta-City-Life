import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  ExternalLink,
  X,
  Compass,
  Sparkles,
  Music,
  Fuel,
  ShoppingBag,
  Plane,
  Crown,
  Home,
  Check,
} from 'lucide-react';
import { DELTA_LOCATIONS, FLUTTERWAVE_PAY_URL } from '../game/constants';
import { DeltaLocation, PlayerProfile } from '../types';
import { sound } from '../utils/audio';

interface MapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onSelectDestinationCab: (loc: DeltaLocation, fare: number) => void;
}

export const MapOverlay: React.FC<MapOverlayProps> = ({
  isOpen,
  onClose,
  player,
  onSelectDestinationCab,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<DeltaLocation | null>(DELTA_LOCATIONS[1]); // Default to Club Empire!

  if (!isOpen) return null;

  const CITIES = ['All', 'Warri', 'Asaba', 'Sapele', 'Agbor', 'Abraka'] as const;

  const filteredLocations = DELTA_LOCATIONS.filter((loc) => {
    if (selectedCity === 'All') return true;
    if (selectedCity === 'Warri') return loc.area === 'Warri' || loc.area === 'Effurun';
    return loc.area === selectedCity;
  });

  const getLocationIcon = (category: string) => {
    switch (category) {
      case 'club':
        return <Music className="w-4 h-4 text-pink-400" />;
      case 'refinery':
        return <Fuel className="w-4 h-4 text-emerald-400" />;
      case 'mall':
        return <ShoppingBag className="w-4 h-4 text-sky-400" />;
      case 'airport':
        return <Plane className="w-4 h-4 text-cyan-400" />;
      case 'palace':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'residence':
        return <Home className="w-4 h-4 text-purple-400" />;
      default:
        return <MapPin className="w-4 h-4 text-yellow-400" />;
    }
  };

  const handleTakeCab = (loc: DeltaLocation) => {
    sound.playClick();
    if (player.balance < loc.cabFare && loc.cabFare > 0) {
      alert(`Insufficient funds! Cab fare is ₦${loc.cabFare.toLocaleString()}`);
      return;
    }
    onSelectDestinationCab(loc, loc.cabFare);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none bg-black/40 backdrop-blur-[2px]">
      {/* Top Banner on Map View */}
      <div className="pointer-events-auto flex items-center justify-between">
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin" />
          <div>
            <div className="font-black text-xs sm:text-sm text-white">Delta State Interactive GPS Highway Map</div>
            <div className="text-[10px] text-slate-400">Main Road Navigation & Highway Routing</div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="p-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-white cursor-pointer shadow-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Floating 3D Map Markers Cluster */}
      <div className="pointer-events-auto my-auto max-w-4xl w-full mx-auto bg-slate-900/95 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Delta State Cities & Landmarks</div>
            <div className="text-sm sm:text-base font-black text-white">Select a Landmark in Warri, Asaba, Sapele, Agbor or Abraka</div>
          </div>
          <div className="text-xs text-emerald-400 font-black tabular-nums bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/80 self-start sm:self-auto">
            Wallet: ₦{player.balance.toLocaleString()}
          </div>
        </div>

        {/* City Filter Tabs (All, Warri, Asaba, Sapele, Agbor, Abraka) */}
        <div className="flex items-center gap-1.5 pt-3 pb-2 overflow-x-auto">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => {
                sound.playClick();
                setSelectedCity(city);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                selectedCity === city
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {city === 'All' ? '🌟 All Delta Cities' : `📍 ${city}`}
            </button>
          ))}
        </div>

        {/* Location Grid Pins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 max-h-[36vh] overflow-y-auto">
          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedLocation(loc);
                }}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {getLocationIcon(loc.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-white truncate">{loc.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                      {loc.area}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{loc.category}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-black mt-1">
                    {loc.cabFare > 0 ? `Cab Fare: ₦${loc.cabFare.toLocaleString()}` : 'Free / Own Villa'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Location Card Bottom Sheet matching video 00:28! */}
      {selectedLocation && (
        <div className="pointer-events-auto max-w-lg w-full mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                {selectedLocation.area} · {selectedLocation.category.toUpperCase()}
              </span>
              <h3 className="text-lg font-black text-white mt-1">{selectedLocation.name}</h3>
              <p className="text-xs text-slate-300 mt-1">{selectedLocation.description}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              {getLocationIcon(selectedLocation.category)}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-400">Estimated Transport Fare</div>
              <div className="text-emerald-400 font-black text-sm tabular-nums">
                {selectedLocation.cabFare > 0
                  ? `₦${selectedLocation.cabFare.toLocaleString()}`
                  : 'Free'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTakeCab(selectedLocation)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Car className="w-4 h-4 fill-current" />
                <span>Take Cab Now</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectDestinationCab(selectedLocation, 0);
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Travel Directly
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
