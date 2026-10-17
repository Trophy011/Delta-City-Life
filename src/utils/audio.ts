// Procedural Web Audio API sound synthesizer for Delta Life 3D
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private clubMusicPlaying: boolean = false;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ctx) {
      if (this.engineGain) {
        this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cash Pickup sound - crisp high-pitched coin/bill chime
  public playCashPickup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    // Naira bundle chime notes (E6 -> G#6 -> B6 arpeggio)
    osc1.frequency.setValueAtTime(1318.51, t);
    osc1.frequency.setValueAtTime(1661.22, t + 0.05);
    osc1.frequency.setValueAtTime(1975.53, t + 0.1);

    osc2.frequency.setValueAtTime(2637, t);
    osc2.frequency.setValueAtTime(3951, t + 0.08);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  // Celebration / Big Naira Bonus / Job Done Fanfare
  public playCelebration() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // Dance move sound / crowd cheer
  public playDanceBeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Kick drum thump
    const kick = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();
    kick.frequency.setValueAtTime(140, t);
    kick.frequency.exponentialRampToValueAtTime(38, t + 0.18);
    kickGain.gain.setValueAtTime(0.35, t);
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    kick.connect(kickGain);
    kickGain.connect(this.ctx.destination);
    kick.start(t);
    kick.stop(t + 0.22);

    // Afrobeats Shaker / Rim click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'highpass' as unknown as OscillatorType;
    osc.frequency.setValueAtTime(800, t + 0.08);
    gain.gain.setValueAtTime(0.15, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t + 0.08);
    osc.stop(t + 0.16);
  }

  // Car Horn Honk
  public playHorn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.setValueAtTime(440, t); // A4
    osc2.frequency.setValueAtTime(554.37, t); // C#5
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  // UI Click sound
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Procedural Afrobeats Club Groove Generator
  public startClubMusic() {
    if (this.clubMusicPlaying) return;
    this.clubMusicPlaying = true;
    this.initCtx();

    let step = 0;
    const bassScale = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 98];

    this.musicInterval = window.setInterval(() => {
      if (this.isMuted || !this.clubMusicPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Kick on steps 0, 3, 6, 10, 12 (Afrobeats polyrhythm)
      if (step === 0 || step === 3 || step === 6 || step === 10 || step === 12) {
        const kick = this.ctx.createOscillator();
        const kg = this.ctx.createGain();
        kick.frequency.setValueAtTime(130, t);
        kick.frequency.exponentialRampToValueAtTime(45, t + 0.15);
        kg.gain.setValueAtTime(0.28, t);
        kg.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        kick.connect(kg);
        kg.connect(this.ctx.destination);
        kick.start(t);
        kick.stop(t + 0.18);
      }

      // 2. Afrobeats Log Drum / Amapiano & Naija vibe bass
      if (step % 2 === 0) {
        const bass = this.ctx.createOscillator();
        const bg = this.ctx.createGain();
        const note = bassScale[(Math.floor(step / 2)) % bassScale.length];
        bass.type = 'triangle';
        bass.frequency.setValueAtTime(note, t);
        bass.frequency.exponentialRampToValueAtTime(note * 0.9, t + 0.2);
        bg.gain.setValueAtTime(0.2, t);
        bg.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        bass.connect(bg);
        bg.connect(this.ctx.destination);
        bass.start(t);
        bass.stop(t + 0.22);
      }

      // 3. Shaker / Hi-hat syncopation
      if (step % 2 === 1) {
        const hat = this.ctx.createOscillator();
        const hg = this.ctx.createGain();
        hat.type = 'triangle';
        hat.frequency.setValueAtTime(2800 + (step % 4) * 200, t);
        hg.gain.setValueAtTime(0.05, t);
        hg.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        hat.connect(hg);
        hg.connect(this.ctx.destination);
        hat.start(t);
        hat.stop(t + 0.06);
      }

      step = (step + 1) % 16;
    }, 125); // ~120 BPM 16th note feel
  }

  public stopClubMusic() {
    this.clubMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Vehicle engine sound modulation based on speed
  public updateEngineSound(speedRatio: number, isJet: boolean = false) {
    if (this.isMuted) {
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return;
    }
    this.initCtx();
    if (!this.ctx) return;

    if (!this.engineOsc) {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineOsc.type = isJet ? 'sawtooth' : 'sawtooth';
      this.engineGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();
    }

    const t = this.ctx.currentTime;
    if (isJet) {
      const freq = 120 + speedRatio * 380;
      this.engineOsc.frequency.setTargetAtTime(freq, t, 0.1);
      this.engineGain?.gain.setTargetAtTime(0.08 + speedRatio * 0.14, t, 0.1);
    } else {
      const freq = 55 + speedRatio * 180;
      this.engineOsc.frequency.setTargetAtTime(freq, t, 0.1);
      this.engineGain?.gain.setTargetAtTime(speedRatio > 0.02 ? 0.07 + speedRatio * 0.09 : 0.02, t, 0.1);
    }
  }

  public stopEngineSound() {
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    }
  }
}

export const sound = new SoundEngine();
