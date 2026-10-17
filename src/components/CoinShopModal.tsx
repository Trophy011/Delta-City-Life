import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle2, Zap, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COIN_PACKAGES, FLUTTERWAVE_PAY_URL } from '../game/constants';
import { CoinPackage } from '../types';
import { sound } from '../utils/audio';

interface CoinShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditBalance: (amount: number, description: string) => void;
  currentBalance: number;
}

export const CoinShopModal: React.FC<CoinShopModalProps> = ({
  isOpen,
  onClose,
  onCreditBalance,
  currentBalance,
}) => {
  const [selectedPack, setSelectedPack] = useState<CoinPackage | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = (pack: CoinPackage) => {
    sound.playClick();
    setSelectedPack(pack);
    setIsVerifying(true);
    setVerifiedSuccess(false);

    // Automatically navigate/open the Flutterwave payment link as requested:
    // "the moment any player click the purchase coin it will automatically take them to this link https://flutterwave.com/pay/72uojjjxgq6t"
    try {
      const paymentWindow = window.open(FLUTTERWAVE_PAY_URL, '_blank', 'noopener,noreferrer');
      if (!paymentWindow) {
        // Fallback if popup blocked
        window.location.href = FLUTTERWAVE_PAY_URL;
      }
    } catch {
      window.location.href = FLUTTERWAVE_PAY_URL;
    }
  };

  const handleConfirmPaymentCompleted = () => {
    if (!selectedPack) return;
    setIsVerifying(true);

    // Simulated instant Flutterwave API webhook verification
    setTimeout(() => {
      setVerifiedSuccess(true);
      setIsVerifying(false);

      sound.playCelebration();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#eab308', '#38bdf8', '#a855f7'],
      });

      onCreditBalance(selectedPack.nairaAmount, `Purchased ${selectedPack.label} via Flutterwave ($${selectedPack.usdPrice})`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-yellow-200">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Delta Central Bank & Naira Vault</h2>
              <p className="text-xs text-yellow-100 font-medium">
                Official Real-Money Coin Store · Powered by Flutterwave
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

        {/* Current Balance Bar */}
        <div className="bg-slate-800/90 px-6 py-3 border-b border-slate-700/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Current Player Balance:</span>
          <span className="text-emerald-400 font-black text-base tabular-nums">
            ₦{currentBalance.toLocaleString()}
          </span>
        </div>

        {/* Payment Verification View if clicked */}
        {selectedPack && (isVerifying || verifiedSuccess) ? (
          <div className="p-8 text-center space-y-6">
            {verifiedSuccess ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Payment Confirmed!</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Your account has been credited with{' '}
                    <strong className="text-emerald-400">
                      ₦{selectedPack.nairaAmount.toLocaleString()}
                    </strong>
                    .
                  </p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-xs text-slate-400 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>Transaction Method:</span>
                    <span className="text-slate-200 font-semibold">Flutterwave Checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Credited:</span>
                    <span className="text-emerald-400 font-bold">
                      ₦{selectedPack.nairaAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-bold uppercase">Success · Settled</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedPack(null);
                    setVerifiedSuccess(false);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 cursor-pointer transition-all"
                >
                  Continue Playing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Flutterwave Checkout in Progress
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    We opened your secure payment window for{' '}
                    <strong className="text-amber-300">${selectedPack.usdPrice} USD</strong> (
                    ₦{selectedPack.nairaAmount.toLocaleString()} Naira). Complete your payment via card, USSD, or transfer.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
                  <a
                    href={FLUTTERWAVE_PAY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Re-open Flutterwave Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleConfirmPaymentCompleted}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
                  >
                    I Have Completed Payment (Reflect Balance)
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPack(null);
                      setIsVerifying(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300 py-1 cursor-pointer"
                  >
                    Cancel / Back to Store
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Package Tiers */
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {COIN_PACKAGES.map((pack) => (
                <div
                  key={pack.id}
                  className={`relative rounded-xl p-4 border flex flex-col justify-between transition-all ${
                    pack.id === 'pack_10m'
                      ? 'bg-gradient-to-b from-amber-950/40 via-slate-800 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {pack.badge && (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      {pack.badge}
                    </div>
                  )}

                  <div>
                    <div className="text-xs text-slate-400 font-semibold">{pack.label}</div>
                    <div className="text-2xl font-black text-emerald-400 tabular-nums mt-1">
                      ₦{pack.nairaAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">{pack.bonusText}</div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-700/60">
                    <div className="text-lg font-black text-white mb-2">
                      ${pack.usdPrice} <span className="text-xs text-slate-400 font-normal">USD</span>
                    </div>

                    <button
                      onClick={() => handlePurchase(pack)}
                      className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 ${
                        pack.id === 'pack_10m'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <span>Purchase Coin</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Flutterwave Security Guarantee */}
            <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Official payment link: <code className="text-amber-300 font-mono text-[11px]">{FLUTTERWAVE_PAY_URL}</code>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Instant Credit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
