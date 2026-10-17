import React, { useState } from 'react';
import { X, Car, Plane, Check, ArrowRight, Gauge, Zap, Shield, Sparkles } from 'lucide-react';
import { VEHICLES_CATALOG } from '../game/constants';
import { PlayerProfile, VehicleItem } from '../types';
import { sound } from '../utils/audio';

interface DealershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onBuyVehicle: (vehicleId: string, cost: number) => void;
  onEquipVehicle: (vehicleId: string | null) => void;
  onOpenCoinShop: () => void;
}

export const DealershipModal: React.FC<DealershipModalProps> = ({
  isOpen,
  onClose,
  player,
  onBuyVehicle,
  onEquipVehicle,
  onOpenCoinShop,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'car' | 'jet'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePurchase = (veh: VehicleItem) => {
    sound.playClick();
    if (player.balance < veh.price) {
      showToast(`❌ Insufficient funds! You need ₦${veh.price.toLocaleString()} for this.`);
      return;
    }
    onBuyVehicle(veh.id, veh.price);
    sound.playCelebration();
    showToast(`🎉 Congratulations! You now own the ${veh.name}!`);
  };

  const handleEquip = (vehId: string | null) => {
    sound.playClick();
    onEquipVehicle(vehId);
    showToast(vehId ? '🚗 Vehicle summoned! Ready to drive/fly.' : '🚶 Switched to walking on foot.');
  };

  const filtered = VEHICLES_CATALOG.filter((v) => {
    if (filterType === 'car') return v.type !== 'jet';
    if (filterType === 'jet') return v.type === 'jet';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-sky-200">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Delta Motors & Sky Aviation</h2>
              <p className="text-xs text-sky-200 font-medium">
                Warri Supercars, G-Wagons, Kekes & Gulfstream Private Jets
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance & Status Bar */}
        <div className="bg-slate-800/90 px-6 py-3 border-b border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleEquip(null)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                player.activeVehicleId === null
                  ? 'bg-slate-700 text-white border border-slate-500'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Walk on Foot
            </button>
            <span className="text-slate-400">
              Active Ride:{' '}
              <strong className="text-white">
                {player.activeVehicleId
                  ? VEHICLES_CATALOG.find((v) => v.id === player.activeVehicleId)?.name
                  : 'Walking on Foot'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Wallet:</span>
            <span className="text-emerald-400 font-black text-sm tabular-nums">
              ₦{player.balance.toLocaleString()}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenCoinShop();
              }}
              className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
            >
              + Get Coins
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-center text-emerald-300 font-semibold animate-in fade-in">
            {toastMsg}
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex gap-2 px-6 pt-4 pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              filterType === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            All Vehicles ({VEHICLES_CATALOG.length})
          </button>
          <button
            onClick={() => setFilterType('car')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              filterType === 'car' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Street Cars & Keke
          </button>
          <button
            onClick={() => setFilterType('jet')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
              filterType === 'jet' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Private Jets</span>
          </button>
        </div>

        {/* Vehicle Catalog Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((veh) => {
              const isOwned = player.ownedVehicles.includes(veh.id);
              const isEquipped = player.activeVehicleId === veh.id;
              const canAfford = player.balance >= veh.price;

              return (
                <div
                  key={veh.id}
                  className={`bg-slate-800/80 border rounded-xl p-4 flex flex-col justify-between transition-all ${
                    isEquipped
                      ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
                      : isOwned
                      ? 'border-sky-500/60'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-700">
                        {veh.type === 'jet' ? (
                          <Plane className="w-4 h-4 text-sky-400" />
                        ) : (
                          <Car className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {veh.tagline}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white mt-2">{veh.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{veh.description}</p>

                    {/* Stats */}
                    <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-700/60 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px] mb-0.5">
                          <span>Top Speed</span>
                          <span className="text-white font-bold">{veh.speed} KM/H</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full"
                            style={{ width: `${(veh.speed / 120) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px] mb-0.5">
                          <span>Acceleration</span>
                          <span className="text-white font-bold">{veh.acceleration}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${veh.acceleration}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-700/60">
                    <div className="text-emerald-400 font-black text-base tabular-nums mb-2">
                      ₦{veh.price.toLocaleString()}
                    </div>

                    {isOwned ? (
                      <button
                        onClick={() => handleEquip(isEquipped ? null : veh.id)}
                        className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          isEquipped
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Currently Driving</span>
                          </>
                        ) : (
                          <span>Equip &amp; Drive/Fly</span>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(veh)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          canAfford
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 active:scale-98'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span>{canAfford ? 'Purchase Vehicle' : 'Insufficient Naira'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
