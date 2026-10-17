import React, { useState } from 'react';
import { X, Briefcase, Fuel, Terminal, Truck, Music, CheckCircle2, Play, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { JOBS_CATALOG } from '../game/constants';
import { JobDefinition, PlayerProfile } from '../types';
import { sound } from '../utils/audio';

interface JobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onJobCompleted: (earnedNaira: number, energyUsed: number, jobTitle: string) => void;
}

export const JobsModal: React.FC<JobsModalProps> = ({
  isOpen,
  onClose,
  player,
  onJobCompleted,
}) => {
  const [activeJob, setActiveJob] = useState<JobDefinition | null>(null);
  const [workingProgress, setWorkingProgress] = useState(0);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [minigameStep, setMinigameStep] = useState(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartShift = (job: JobDefinition) => {
    sound.playClick();
    if (player.energy < job.energyCost) {
      setToastMsg(`⚠️ Not enough energy! You need at least ${job.energyCost}% energy to work this shift.`);
      return;
    }
    setActiveJob(job);
    setIsShiftActive(true);
    setWorkingProgress(0);
    setMinigameStep(1);

    // Run interactive work shift progress
    const interval = setInterval(() => {
      setWorkingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishShift(job);
          return 100;
        }
        return prev + 20;
      });
    }, 700);
  };

  const finishShift = (job: JobDefinition) => {
    const pay = Math.floor(Math.random() * (job.maxPay - job.minPay + 1)) + job.minPay;
    sound.playCelebration();
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });

    onJobCompleted(pay, job.energyCost, job.title);
    setTimeout(() => {
      setIsShiftActive(false);
      setActiveJob(null);
    }, 1200);
  };

  const getJobIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fuel':
        return <Fuel className="w-5 h-5 text-emerald-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-purple-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-amber-400" />;
      case 'Music':
        return <Music className="w-5 h-5 text-pink-400" />;
      default:
        return <Briefcase className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-emerald-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Delta Employment & Gig Board</h2>
              <p className="text-xs text-emerald-200 font-medium">
                Work Shifts in Oil & Gas, Tech Innovation, Logistics & Club Nightlife
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

        {/* Player Energy & Wallet bar */}
        <div className="bg-slate-800/90 px-6 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Player Energy: <strong className="text-cyan-400">{player.energy}%</strong>
            </span>
            <span className="text-slate-400">
              Jobs Completed: <strong className="text-white">{player.jobsCompleted}</strong>
            </span>
          </div>
          <div className="text-slate-400">
            Wallet: <strong className="text-emerald-400 tabular-nums">₦{player.balance.toLocaleString()}</strong>
          </div>
        </div>

        {/* Toast Warning */}
        {toastMsg && (
          <div className="bg-amber-950/80 border-b border-amber-800 px-4 py-2 text-xs text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isShiftActive && activeJob ? (
            /* Active Working Minigame Screen */
            <div className="py-8 px-4 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                {getJobIcon(activeJob.icon)}
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  Shift in Progress · {activeJob.company}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">{activeJob.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeJob.description}</p>
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Performing Work Protocol...</span>
                  <span className="text-emerald-400 font-bold">{workingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                    style={{ width: `${workingProgress}%` }}
                  />
                </div>
              </div>

              {workingProgress >= 100 && (
                <div className="text-emerald-400 font-bold text-sm animate-pulse flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Shift Completed! Crediting High Salary...</span>
                </div>
              )}
            </div>
          ) : (
            /* Jobs List */
            <div className="space-y-3">
              {JOBS_CATALOG.map((job) => {
                const canWork = player.energy >= job.energyCost;

                return (
                  <div
                    key={job.id}
                    className="bg-slate-800/80 border border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        {getJobIcon(job.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-white">{job.title}</h4>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            {job.company}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-md">{job.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                          <span>
                            Location: <strong className="text-slate-300">{job.locationName}</strong>
                          </span>
                          <span>
                            Energy Cost: <strong className="text-amber-400">-{job.energyCost}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-end justify-between w-full md:w-auto shrink-0 gap-2">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Shift Pay</div>
                        <div className="text-emerald-400 font-black text-sm tabular-nums">
                          ₦{job.minPay.toLocaleString()} - ₦{job.maxPay.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartShift(job)}
                        disabled={!canWork}
                        className={`py-2 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                          canWork
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 active:scale-98'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Work Shift</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
