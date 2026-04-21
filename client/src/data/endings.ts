import type { EndingId, GameState } from '../types';

export interface EndingCopy {
  id: EndingId;
  title: string;
  literary: string;
  reflectionPrompt1: string;
  reflectionPrompt2: string;
  researchInsight: string;
}

export const ENDINGS: Record<EndingId, EndingCopy> = {
  misunderstood: {
    id: 'misunderstood',
    title: 'Misunderstood',
    literary:
      'The rice cools on the table. Neither of you moved the plates. What you meant was not what she heard, and what she said was not what she meant.',
    reflectionPrompt1: 'What I wish she understood',
    reflectionPrompt2: 'What she wished I understood',
    researchInsight:
      'Research on intergenerational communication in immigrant families suggests that misunderstanding often lives in the space between translated meaning and untranslated feeling.',
  },
  temporary_peace: {
    id: 'temporary_peace',
    title: 'Temporary Peace',
    literary:
      'You finish the rice. The conversation ended before anything was said. Tomorrow the same quiet, the same table.',
    reflectionPrompt1: 'What I wish she understood',
    reflectionPrompt2: 'What she wished I understood',
    researchInsight:
      'Studies of Asian American family dynamics note that avoidance can feel safer than rupture — but unresolved tension tends to return at the next meal.',
  },
  heard_but_not_fully: {
    id: 'heard_but_not_fully',
    title: 'Heard, But Not Fully',
    literary:
      'She heard you. She did not hear all of you. Something passed between you — smaller than understanding, larger than silence.',
    reflectionPrompt1: 'What I wish she understood',
    reflectionPrompt2: 'What she wished I understood',
    researchInsight:
      'Partial recognition is often the most honest ending in real family dialogue; full understanding is a rarer event than stories usually admit.',
  },
  a_small_opening: {
    id: 'a_small_opening',
    title: 'A Small Opening',
    literary:
      'You both looked up at the same time. She put down her chopsticks. You did not agree. But something opened — a crack of light in a wall that had been there for years.',
    reflectionPrompt1: 'What I wish she understood',
    reflectionPrompt2: 'What she wished I understood',
    researchInsight:
      'Research on repair in close relationships suggests that the turning point is rarely dramatic — it tends to be a single moment where one person chooses curiosity over defense.',
  },
  what_i_wish_i_said: {
    id: 'what_i_wish_i_said',
    title: 'What I Wish I Said',
    literary:
      'The words stayed in your mouth. Later, in your room, you wrote them down. She will not read this. But you will remember you meant it.',
    reflectionPrompt1: 'What I wish she understood',
    reflectionPrompt2: 'What she wished I understood',
    researchInsight:
      'In immigrant family narratives, unspoken words often become the clearest record of love. Silence is never only absence.',
  },
};

export function decideEnding(state: GameState, suggested?: EndingId | null): EndingId {
  if (suggested) return suggested;

  const { tension, openness, hurt, understanding, player_style } = state;

  if (understanding >= 60 && openness >= 55 && hurt < 55) return 'a_small_opening';
  if (tension >= 70 && hurt >= 55) return 'misunderstood';
  if (openness >= 50 && understanding >= 35 && understanding < 60) return 'heard_but_not_fully';
  if (player_style === 'silent' || player_style === 'defensive') return 'what_i_wish_i_said';
  return 'temporary_peace';
}
