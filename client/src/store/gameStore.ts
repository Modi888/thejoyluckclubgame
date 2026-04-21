import { create } from 'zustand';
import type { DialogueTurn, EndingId, GameState, SessionSeed, StructuredAnalysis } from '../types';
import { rollSessionSeed } from '../data/themes';
import type { LocalAnalysis } from '../game/localAnalysis';
import { decideEnding } from '../data/endings';

export type Screen = 'start' | 'game' | 'ending' | 'about';

export interface DialogueState {
  active: boolean;
  turnCount: number;
  history: DialogueTurn[];
  motherNarration: string;
  awaitingReply: boolean;
}

export const MAX_TURNS = 7;

interface Store {
  screen: Screen;
  seed: SessionSeed;
  state: GameState;
  dialogue: DialogueState;
  endingId: EndingId | null;
  reflection1: string;
  reflection2: string;

  setScreen: (s: Screen) => void;
  startNewSession: () => void;
  openDialogue: () => void;
  pushMotherTurn: (content: string, narration?: string) => void;
  pushDaughterTurn: (content: string) => void;
  setAwaitingReply: (v: boolean) => void;
  applyAnalysis: (local: LocalAnalysis, llm: StructuredAnalysis) => void;
  endDialogue: (suggested?: EndingId | null) => void;
  setReflection: (idx: 1 | 2, v: string) => void;
  goHomeScreen: () => void;
}

const INITIAL_STATE: GameState = {
  tension: 25,
  openness: 45,
  hurt: 20,
  understanding: 35,
  mother_worry: 55,
  player_style: 'neutral',
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export const useGameStore = create<Store>((set, get) => ({
  screen: 'start',
  seed: rollSessionSeed(),
  state: { ...INITIAL_STATE },
  dialogue: {
    active: false,
    turnCount: 0,
    history: [],
    motherNarration: '',
    awaitingReply: false,
  },
  endingId: null,
  reflection1: '',
  reflection2: '',

  setScreen: (screen) => set({ screen }),

  startNewSession: () =>
    set({
      screen: 'game',
      seed: rollSessionSeed(),
      state: { ...INITIAL_STATE },
      dialogue: { active: false, turnCount: 0, history: [], motherNarration: '', awaitingReply: false },
      endingId: null,
      reflection1: '',
      reflection2: '',
    }),

  openDialogue: () =>
    set({
      dialogue: { active: true, turnCount: 0, history: [], motherNarration: '', awaitingReply: true },
    }),

  pushMotherTurn: (content, narration = '') => {
    const d = get().dialogue;
    set({
      dialogue: {
        ...d,
        history: [...d.history, { role: 'mother', content, narration }],
        motherNarration: narration,
        turnCount: d.turnCount + 1,
        awaitingReply: false,
      },
    });
  },

  pushDaughterTurn: (content) => {
    const d = get().dialogue;
    set({
      dialogue: {
        ...d,
        history: [...d.history, { role: 'daughter', content }],
        awaitingReply: true,
      },
    });
  },

  setAwaitingReply: (v) => {
    const d = get().dialogue;
    set({ dialogue: { ...d, awaitingReply: v } });
  },

  applyAnalysis: (local, llm) => {
    const s = get().state;
    const next: GameState = {
      tension: clamp(s.tension + local.tensionNudge + llm.tension_delta),
      openness: clamp(s.openness + local.opennessNudge + llm.openness_delta),
      hurt: clamp(s.hurt + local.hurtNudge + llm.hurt_delta),
      understanding: clamp(s.understanding + local.understandingNudge + llm.understanding_delta),
      mother_worry: clamp(s.mother_worry + llm.mother_worry_delta),
      player_style: local.style !== 'neutral' ? local.style : llm.response_style,
    };
    set({ state: next });
  },

  endDialogue: (suggested) => {
    const state = get().state;
    const ending = decideEnding(state, suggested);
    const d = get().dialogue;
    set({
      dialogue: { ...d, active: false, awaitingReply: false },
      endingId: ending,
      screen: 'ending',
    });
  },

  setReflection: (idx, v) => (idx === 1 ? set({ reflection1: v }) : set({ reflection2: v })),

  goHomeScreen: () => set({ screen: 'start' }),
}));
