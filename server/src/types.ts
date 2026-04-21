export type Theme =
  | 'generational_misunderstanding'
  | 'love_expressed_as_control'
  | 'pressure_and_expectations'
  | 'silence_vs_expression'
  | 'sacrifice_and_resentment'
  | 'cultural_gap_at_home';

export type TriggerEvent =
  | 'dinner_call'
  | 'grades_question'
  | 'phone_comment'
  | 'future_pressure'
  | 'comparison'
  | 'gratitude_conflict';

export type MotherEmotion =
  | 'tired'
  | 'worried'
  | 'disappointed'
  | 'loving_but_indirect'
  | 'frustrated';

export type EnvironmentalFlavor =
  | 'warm_rice_smell'
  | 'tv_in_background'
  | 'clinking_chopsticks'
  | 'evening_light'
  | 'quiet_apartment_tension';

export type PlayerStyle =
  | 'defensive'
  | 'silent'
  | 'honest'
  | 'angry'
  | 'vulnerable'
  | 'neutral';

export type EndingId =
  | 'misunderstood'
  | 'temporary_peace'
  | 'heard_but_not_fully'
  | 'a_small_opening'
  | 'what_i_wish_i_said';

export interface GameState {
  tension: number;
  openness: number;
  hurt: number;
  understanding: number;
  mother_worry: number;
  player_style: PlayerStyle;
}

export interface DialogueTurn {
  role: 'mother' | 'daughter';
  content: string;
}

export interface StructuredAnalysis {
  detected_player_emotion: string;
  response_style: PlayerStyle;
  tension_delta: number;
  openness_delta: number;
  understanding_delta: number;
  hurt_delta: number;
  mother_worry_delta: number;
  mother_emotion_next: MotherEmotion;
  keep_conversation_going: boolean;
  suggested_end_if_any: EndingId | null;
}

export interface DialogueRequest {
  theme: Theme;
  triggerEvent: TriggerEvent;
  motherEmotion: MotherEmotion;
  environmentalFlavor: EnvironmentalFlavor;
  conversationHistory: DialogueTurn[];
  playerInput: string;
  currentGameState: GameState;
  turnCount: number;
}

export interface DialogueResponse {
  motherReply: string;
  optionalNarration?: string;
  structuredAnalysis: StructuredAnalysis;
}
