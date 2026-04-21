import type { PlayerStyle } from '../types';

const ANGRY_MARKERS = /(!!|whatever|fine!|stop it|leave me|shut|why do you always|i hate|annoying)/i;
const SILENT_MARKERS = /^(ok|okay|k|sure|yeah|no|nothing|idk|i don'?t know|mm+|hm+)\.?$/i;
const DEFENSIVE_MARKERS = /(you don'?t understand|it'?s not like that|stop|not my fault|why do you always|can you not)/i;
const VULNERABLE_MARKERS = /(i feel|i'?m scared|i'?m tired|i don'?t know how to|sometimes i|i wish|i miss)/i;
const HONEST_MARKERS = /(i think|i want|i just|the truth is|actually|i mean|because)/i;

export interface LocalAnalysis {
  style: PlayerStyle;
  tensionNudge: number;
  opennessNudge: number;
  hurtNudge: number;
  understandingNudge: number;
}

export function analyzePlayerInput(text: string): LocalAnalysis {
  const t = text.trim();
  const words = t.split(/\s+/).filter(Boolean);

  if (t.length === 0) {
    return { style: 'silent', tensionNudge: 2, opennessNudge: -2, hurtNudge: 1, understandingNudge: -1 };
  }
  if (ANGRY_MARKERS.test(t)) {
    return { style: 'angry', tensionNudge: 6, opennessNudge: -2, hurtNudge: 4, understandingNudge: -3 };
  }
  if (SILENT_MARKERS.test(t) || words.length <= 2) {
    return { style: 'silent', tensionNudge: 2, opennessNudge: -2, hurtNudge: 1, understandingNudge: -1 };
  }
  if (DEFENSIVE_MARKERS.test(t)) {
    return { style: 'defensive', tensionNudge: 4, opennessNudge: -1, hurtNudge: 2, understandingNudge: -2 };
  }
  if (VULNERABLE_MARKERS.test(t)) {
    return { style: 'vulnerable', tensionNudge: -2, opennessNudge: 5, hurtNudge: -1, understandingNudge: 4 };
  }
  if (HONEST_MARKERS.test(t)) {
    return { style: 'honest', tensionNudge: -1, opennessNudge: 3, hurtNudge: 0, understandingNudge: 3 };
  }
  return { style: 'neutral', tensionNudge: 0, opennessNudge: 1, hurtNudge: 0, understandingNudge: 1 };
}
