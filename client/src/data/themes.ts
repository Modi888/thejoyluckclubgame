import type { Theme, TriggerEvent, MotherEmotion, EnvironmentalFlavor, SessionSeed } from '../types';

const THEMES: Theme[] = [
  'generational_misunderstanding',
  'love_expressed_as_control',
  'pressure_and_expectations',
  'silence_vs_expression',
  'sacrifice_and_resentment',
  'cultural_gap_at_home',
];

const TRIGGERS: TriggerEvent[] = [
  'dinner_call',
  'grades_question',
  'phone_comment',
  'future_pressure',
  'comparison',
  'gratitude_conflict',
];

const EMOTIONS: MotherEmotion[] = [
  'tired',
  'worried',
  'disappointed',
  'loving_but_indirect',
  'frustrated',
];

const FLAVORS: EnvironmentalFlavor[] = [
  'warm_rice_smell',
  'tv_in_background',
  'clinking_chopsticks',
  'evening_light',
  'quiet_apartment_tension',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rollSessionSeed(): SessionSeed {
  return {
    theme: pick(THEMES),
    triggerEvent: pick(TRIGGERS),
    motherEmotion: pick(EMOTIONS),
    environmentalFlavor: pick(FLAVORS),
  };
}

export const THEME_LABEL: Record<Theme, string> = {
  generational_misunderstanding: 'Generational Misunderstanding',
  love_expressed_as_control: 'Love Expressed as Control',
  pressure_and_expectations: 'Pressure and Expectations',
  silence_vs_expression: 'Silence vs. Expression',
  sacrifice_and_resentment: 'Sacrifice and Resentment',
  cultural_gap_at_home: 'Cultural Gap at Home',
};
