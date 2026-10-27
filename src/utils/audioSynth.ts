/**
 * Web Audio procedural smooth jazz & ambient broadcast synthesizer for T.E.A.R.adio.
 * Provides soothing, authentic ambient chords, bassline, and subtle broadcast warmth.
 */

class TearRadioAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private intervalId: number | null = null;
  private currentChordIndex: number = 0;

  // Smooth Jazz chord frequencies (Ebmaj9, Cm9, Fm9, Bb13)
  private chords = [
    [155.56, 196.00, 233.08, 293.66, 349.23], // Eb maj9
    [130.81, 155.56, 196.00, 233.08, 293.66], // C min9
    [174.61, 207.65, 261.63, 311.13, 392.00], // F min9
    [116.54, 174.61, 233.08, 277.18, 349.23]  // Bb 13
  ];

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public setVolume(vol: number) {
    if (!this.masterGain || !this.ctx) return;
    const safeVol = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.setTargetAtTime(safeVol * 0.25, this.ctx.currentTime, 0.05);
  }

  public start(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isRunning) return true;
    this.isRunning = true;

    // Play first chord immediately
    this.playChordStep();

    // Loop through chord progression every 4 seconds
    this.intervalId = window.setInterval(() => {
      if (!this.isRunning) return;
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
      this.playChordStep();
    }, 4000);

    return true;
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  private playChordStep() {
    if (!this.ctx || !this.masterGain || !this.isRunning) return;

    const chord = this.chords[this.currentChordIndex];
    const now = this.ctx.currentTime;

    // Create a filter for warm vintage radio tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(this.masterGain);

    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Alternate sine and triangle for lush Rhodes/organ acoustic texture
      osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle warm detuning
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      // Smooth attack & gentle decay envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.07 / (idx + 1), now + 0.6);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(noteGain);
      noteGain.connect(filter);

      osc.start(now);
      osc.stop(now + 4);
    });
  }
}

export const tearRadioAudio = new TearRadioAudioEngine();
