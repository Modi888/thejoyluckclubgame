import type { DialogueResponse, DialogueRequest } from '../types.js';

const MOTHER_FALLBACKS = [
  'Sit down. The food is getting cold.',
  'You always say you\'re fine.',
  'I\'m not angry. I just worry.',
  'You don\'t have to answer me like that.',
  'Eat first. We can talk after.',
  'I did everything so you wouldn\'t have to.',
  'Look up. Just for a minute.',
];

export function buildFallbackResponse(req: DialogueRequest): DialogueResponse {
  const idx = Math.abs(req.turnCount + req.playerInput.length) % MOTHER_FALLBACKS.length;
  return {
    motherReply: MOTHER_FALLBACKS[idx],
    optionalNarration: '',
    structuredAnalysis: {
      detected_player_emotion: 'unclear',
      response_style: 'neutral',
      tension_delta: 2,
      openness_delta: 0,
      understanding_delta: 0,
      hurt_delta: 1,
      mother_worry_delta: 1,
      mother_emotion_next: req.motherEmotion,
      keep_conversation_going: req.turnCount < 5,
      suggested_end_if_any: null,
    },
  };
}
