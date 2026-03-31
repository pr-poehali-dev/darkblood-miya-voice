import { useRef, useCallback } from 'react';

export function useHorrorAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const startedRef = useRef(false);

  const stop = useCallback(() => {
    nodesRef.current.forEach(n => {
      try { (n as OscillatorNode).stop?.(); } catch (_e) { void _e; }
      try { n.disconnect(); } catch (_e) { void _e; }
    });
    nodesRef.current = [];
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    startedRef.current = false;
  }, []);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 4);
    master.connect(ctx.destination);

    // ---- Deep drone bass ----
    const droneFreqs = [27.5, 36.7, 41.2];
    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.setTargetAtTime(freq * 0.995, ctx.currentTime + 8, 12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12 - i * 0.02, ctx.currentTime + 3 + i);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;
      filter.Q.value = 2;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();
      nodesRef.current.push(osc, filter, gain);
    });

    // ---- Dissonant mid tones ----
    const dissonant = [155.5, 164.8, 220.5, 233.1];
    dissonant.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.07 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 5 + i * 2);

      osc.connect(gain);
      gain.connect(master);
      osc.start();
      lfo.start();
      nodesRef.current.push(osc, lfo, lfoGain, gain);
    });

    // ---- Creaking/scratch noise ----
    const scratchNoise = () => {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800 + Math.random() * 1200;
      filter.Q.value = 8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08 + Math.random() * 0.06, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start();
      nodesRef.current.push(source, filter, gain);
    };

    const scheduleCreaks = () => {
      if (!startedRef.current) return;
      scratchNoise();
      const next = 3000 + Math.random() * 7000;
      setTimeout(scheduleCreaks, next);
    };
    setTimeout(scheduleCreaks, 4000);

    // ---- Distant heartbeat pulse ----
    const heartbeat = () => {
      if (!startedRef.current || !ctxRef.current) return;
      const t = ctxRef.current.currentTime;

      const beat = (delay: number) => {
        const osc = ctxRef.current!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, t + delay);
        osc.frequency.exponentialRampToValueAtTime(30, t + delay + 0.12);

        const g = ctxRef.current!.createGain();
        g.gain.setValueAtTime(0, t + delay);
        g.gain.linearRampToValueAtTime(0.15, t + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25);

        osc.connect(g);
        g.connect(master);
        osc.start(t + delay);
        osc.stop(t + delay + 0.3);
        nodesRef.current.push(osc, g);
      };

      beat(0);
      beat(0.22);
      setTimeout(heartbeat, 1400 + Math.random() * 400);
    };
    setTimeout(heartbeat, 6000);

    // ---- High whisper pad ----
    const whisper = ctx.createOscillator();
    whisper.type = 'sine';
    whisper.frequency.setValueAtTime(880, ctx.currentTime);
    whisper.frequency.setTargetAtTime(831, ctx.currentTime + 10, 20);

    const whisperLFO = ctx.createOscillator();
    whisperLFO.type = 'sine';
    whisperLFO.frequency.value = 0.12;
    const wlg = ctx.createGain();
    wlg.gain.value = 3;
    whisperLFO.connect(wlg);
    wlg.connect(whisper.frequency);

    const whisperGain = ctx.createGain();
    whisperGain.gain.setValueAtTime(0, ctx.currentTime);
    whisperGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 8);

    const whisperFilter = ctx.createBiquadFilter();
    whisperFilter.type = 'highpass';
    whisperFilter.frequency.value = 700;

    whisper.connect(whisperFilter);
    whisperFilter.connect(whisperGain);
    whisperGain.connect(master);
    whisper.start();
    whisperLFO.start();
    nodesRef.current.push(whisper, whisperLFO, wlg, whisperGain, whisperFilter);

    // ---- Rumble sub-bass ----
    const rumble = ctx.createOscillator();
    rumble.type = 'sawtooth';
    rumble.frequency.value = 18;
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 60;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0, ctx.currentTime);
    rumbleGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 6);
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(master);
    rumble.start();
    nodesRef.current.push(rumble, rumbleFilter, rumbleGain, master);

  }, [stop]);

  return { start, stop, isStarted: () => startedRef.current };
}