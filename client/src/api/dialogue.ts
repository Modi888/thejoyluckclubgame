import type { DialogueResponse, DialogueTurn, GameState, SessionSeed } from '../types';

interface DialogueRequestPayload {
  theme: SessionSeed['theme'];
  triggerEvent: SessionSeed['triggerEvent'];
  motherEmotion: SessionSeed['motherEmotion'];
  environmentalFlavor: SessionSeed['environmentalFlavor'];
  conversationHistory: DialogueTurn[];
  playerInput: string;
  currentGameState: GameState;
  turnCount: number;
}

export async function requestDialogue(payload: DialogueRequestPayload): Promise<DialogueResponse> {
  const resp = await fetch('/api/dialogue/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error(`dialogue failed: ${resp.status}`);
  return resp.json();
}

interface ReflectionPayload {
  theme: SessionSeed['theme'];
  motherEmotion: SessionSeed['motherEmotion'];
  history: DialogueTurn[];
  endingId: string;
  endingTitle: string;
  voice: 'mother' | 'daughter';
}

export async function requestReflection(payload: ReflectionPayload): Promise<string> {
  const resp = await fetch('/api/dialogue/reflect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error(`reflect failed: ${resp.status}`);
  const data = await resp.json();
  return String(data.reflection || '').trim();
}
