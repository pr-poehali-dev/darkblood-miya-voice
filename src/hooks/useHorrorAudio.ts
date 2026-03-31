import { useRef, useEffect } from 'react';

export function useHorrorAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const startedRef = useRef(false);
  const nodesRef = useRef<AudioNode[]>([]);

  const boot = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 5);
    master.connect(ctx.destination);
    nodesRef.current.push(master);

    // --- Глубокий дроновый бас (фундамент ужаса) ---
    [27.5, 36.7, 55.0].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + i * 0.02;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 0.8;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      const g = ctx.createGain();
      g.gain.value = 0.13 - i * 0.02;
      const flt = ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.value = 200;
      flt.Q.value = 3;
      osc.connect(flt); flt.connect(g); g.connect(master);
      osc.start(); lfo.start();
      nodesRef.current.push(osc, lfo, lfoG, g, flt);
    });

    // --- Диссонирующие средние тона (тревога) ---
    [155.5, 164.8, 220.5, 233.1].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.07 + i * 0.03;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 2;
      lfo.connect(lfoG); lfoG.connect(osc.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 4 + i);
      osc.connect(g); g.connect(master);
      osc.start(); lfo.start();
      nodesRef.current.push(osc, lfo, lfoG, g);
    });

    // --- Высокий шёпот-пад ---
    const whisper = ctx.createOscillator();
    whisper.type = 'sine';
    whisper.frequency.setValueAtTime(880, ctx.currentTime);
    const wLfo = ctx.createOscillator();
    wLfo.type = 'sine';
    wLfo.frequency.value = 0.11;
    const wLfoG = ctx.createGain();
    wLfoG.gain.value = 4;
    wLfo.connect(wLfoG); wLfoG.connect(whisper.frequency);
    const wFilter = ctx.createBiquadFilter();
    wFilter.type = 'highpass';
    wFilter.frequency.value = 700;
    const wGain = ctx.createGain();
    wGain.gain.setValueAtTime(0, ctx.currentTime);
    wGain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 7);
    whisper.connect(wFilter); wFilter.connect(wGain); wGain.connect(master);
    whisper.start(); wLfo.start();
    nodesRef.current.push(whisper, wLfo, wLfoG, wFilter, wGain);

    // --- Суб-румбл (подземный гул) ---
    const rumble = ctx.createOscillator();
    rumble.type = 'sawtooth';
    rumble.frequency.value = 18;
    const rFlt = ctx.createBiquadFilter();
    rFlt.type = 'lowpass';
    rFlt.frequency.value = 55;
    const rGain = ctx.createGain();
    rGain.gain.setValueAtTime(0, ctx.currentTime);
    rGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 6);
    rumble.connect(rFlt); rFlt.connect(rGain); rGain.connect(master);
    rumble.start();
    nodesRef.current.push(rumble, rFlt, rGain);

    // --- Периодические скрипы ---
    const scheduleCreak = () => {
      if (!ctxRef.current) return;
      const c = ctxRef.current;
      const bufSize = c.sampleRate * 0.28;
      const buf = c.createBuffer(1, bufSize, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2.5);
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const flt = c.createBiquadFilter();
      flt.type = 'bandpass';
      flt.frequency.value = 900 + Math.random() * 1100;
      flt.Q.value = 9;
      const g = c.createGain();
      g.gain.value = 0.07 + Math.random() * 0.05;
      src.connect(flt); flt.connect(g); g.connect(master);
      src.start();
      setTimeout(scheduleCreak, 3500 + Math.random() * 6000);
    };
    setTimeout(scheduleCreak, 5000);

    // --- Пульс сердца вдалеке ---
    const scheduleHeart = () => {
      if (!ctxRef.current) return;
      const c = ctxRef.current;
      const t = c.currentTime;
      const beat = (delay: number) => {
        const o = c.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(58, t + delay);
        o.frequency.exponentialRampToValueAtTime(28, t + delay + 0.14);
        const g = c.createGain();
        g.gain.setValueAtTime(0, t + delay);
        g.gain.linearRampToValueAtTime(0.18, t + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.28);
        o.connect(g); g.connect(master);
        o.start(t + delay);
        o.stop(t + delay + 0.3);
      };
      beat(0); beat(0.24);
      setTimeout(scheduleHeart, 1300 + Math.random() * 500);
    };
    setTimeout(scheduleHeart, 7000);
  };

  // Автозапуск при первом взаимодействии пользователя
  useEffect(() => {
    const trigger = () => {
      boot();
      window.removeEventListener('click', trigger);
      window.removeEventListener('keydown', trigger);
      window.removeEventListener('touchstart', trigger);
    };
    window.addEventListener('click', trigger);
    window.addEventListener('keydown', trigger);
    window.addEventListener('touchstart', trigger);
    return () => {
      window.removeEventListener('click', trigger);
      window.removeEventListener('keydown', trigger);
      window.removeEventListener('touchstart', trigger);
    };
  }, []);
}
