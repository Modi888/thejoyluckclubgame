import type { DialogueRequest, DialogueResponse } from '../types.js';
import { SYSTEM_PROMPT, buildUserPrompt } from '../prompts/mother.js';
import { buildFallbackResponse } from '../utils/fallback.js';

const TUZI_LLM_KEY = process.env.TUZI_LLM_KEY;
const TUZI_BASE_URL = process.env.TUZI_BASE_URL || 'https://api.tu-zi.com/v1';
const TUZI_MODEL = process.env.TUZI_MODEL || 'gpt-5.4-mini';

function stripJsonFences(text: string): string {
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }
  return t.trim();
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

export async function generateDialogue(req: DialogueRequest): Promise<DialogueResponse> {
  if (!TUZI_LLM_KEY) {
    console.warn('[llm] TUZI_LLM_KEY not set, using fallback');
    return buildFallbackResponse(req);
  }

  const body = {
    model: TUZI_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(req) },
    ],
    temperature: 0.85,
    max_tokens: 500,
  };

  try {
    const resp = await fetch(`${TUZI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TUZI_LLM_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      console.error('[llm] non-ok status', resp.status, await resp.text().catch(() => ''));
      return buildFallbackResponse(req);
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (typeof raw !== 'string') {
      console.error('[llm] no content in response', data);
      return buildFallbackResponse(req);
    }

    const stripped = stripJsonFences(raw);
    const jsonStr = extractJsonObject(stripped) || stripped;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error('[llm] JSON parse failed', raw);
      return buildFallbackResponse(req);
    }

    if (!parsed.motherReply || !parsed.structuredAnalysis) {
      console.error('[llm] missing fields', parsed);
      return buildFallbackResponse(req);
    }

    return {
      motherReply: String(parsed.motherReply).trim(),
      optionalNarration: parsed.optionalNarration ? String(parsed.optionalNarration).trim() : '',
      structuredAnalysis: {
        detected_player_emotion: parsed.structuredAnalysis.detected_player_emotion || 'unclear',
        response_style: parsed.structuredAnalysis.response_style || 'neutral',
        tension_delta: clampDelta(parsed.structuredAnalysis.tension_delta),
        openness_delta: clampDelta(parsed.structuredAnalysis.openness_delta),
        understanding_delta: clampDelta(parsed.structuredAnalysis.understanding_delta),
        hurt_delta: clampDelta(parsed.structuredAnalysis.hurt_delta),
        mother_worry_delta: clampDelta(parsed.structuredAnalysis.mother_worry_delta),
        mother_emotion_next: parsed.structuredAnalysis.mother_emotion_next || req.motherEmotion,
        keep_conversation_going: Boolean(parsed.structuredAnalysis.keep_conversation_going),
        suggested_end_if_any: parsed.structuredAnalysis.suggested_end_if_any || null,
      },
    };
  } catch (err) {
    console.error('[llm] error', err);
    return buildFallbackResponse(req);
  }
}

function clampDelta(n: unknown): number {
  const v = typeof n === 'number' ? n : parseInt(String(n || '0'), 10);
  if (Number.isNaN(v)) return 0;
  return Math.max(-15, Math.min(15, Math.round(v)));
}

const REFLECTION_SYSTEM = `You are a Chinese-American immigrant mother, the same mother from the dinner conversation that just happened. The daughter has gone back to her room. She is asking herself what you wished she understood.

Write 2-4 sentences in her voice — what she wishes her daughter understood about her, about the evening, about the love she could not say plainly at the table. First person ("I"). No therapy vocabulary. No grand statements. Keep the same cadence as an immigrant mother speaking English as a second language: short sentences, direct, sometimes a small deflection, sometimes a sudden honesty. Mention something concrete from the conversation if it fits — the rice, the grades, the phone, the silence.

Return ONLY the reflection text. No preamble, no quotes, no JSON.`;

const DAUGHTER_REFLECTION_SYSTEM = `You are the daughter from the dinner conversation that just ended. You are upstairs in your room now, the door closed. You are writing a private journal entry — what you wish your mother understood, the thing you could not say at the table.

Write 2-4 sentences in her voice. First person ("I"). She is in her late teens or twenties, second-generation Chinese-American, fluent English, articulate but tired. The voice should feel like someone who has thought this many times before but is only now putting it into words. No therapy vocabulary. No grand statements. Mention something concrete from the conversation if it fits — what her mother said, what was on the table, the moment that hurt or almost helped.

Return ONLY the reflection text. No preamble, no quotes, no JSON.`;

async function generateReflection(
  systemPrompt: string,
  fallback: string,
  params: {
    theme: string;
    motherEmotion: string;
    history: { role: 'mother' | 'daughter'; content: string; narration?: string }[];
    endingId: string;
    endingTitle: string;
  },
): Promise<string> {
  const { theme, motherEmotion, history, endingId, endingTitle } = params;

  if (!TUZI_LLM_KEY) return fallback;

  const transcript = history
    .map((t) => `${t.role === 'mother' ? 'MOTHER' : 'DAUGHTER'}: ${t.content}`)
    .join('\n');

  const userPrompt = `Theme of the evening: ${theme}
Mother's emotional starting point: ${motherEmotion}
How it ended: ${endingTitle} (${endingId})

Full transcript:
${transcript}

Now write the private reflection. 2-4 sentences, first person.`;

  const body = {
    model: TUZI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.9,
    max_tokens: 250,
  };

  try {
    const resp = await fetch(`${TUZI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TUZI_LLM_KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error('llm non-ok');
    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (typeof raw !== 'string') throw new Error('no content');
    return raw.trim().replace(/^["']|["']$/g, '');
  } catch (err) {
    console.error('[reflect] error', err);
    return fallback;
  }
}

export async function generateMotherReflection(params: {
  theme: string;
  motherEmotion: string;
  history: { role: 'mother' | 'daughter'; content: string; narration?: string }[];
  endingId: string;
  endingTitle: string;
}): Promise<string> {
  return generateReflection(
    REFLECTION_SYSTEM,
    "I know you think I only care about grades. That is not true. I care about grades because I do not know how else to ask if you are eating, sleeping, safe. When I ask the small thing, I am asking the big thing. I just never learned to say it the other way.",
    params,
  );
}

export async function generateDaughterReflection(params: {
  theme: string;
  motherEmotion: string;
  history: { role: 'mother' | 'daughter'; content: string; narration?: string }[];
  endingId: string;
  endingTitle: string;
}): Promise<string> {
  return generateReflection(
    DAUGHTER_REFLECTION_SYSTEM,
    "I wish she understood that when I push back, I am not trying to hurt her. I am trying to be heard as a person, not just as a daughter who got the grade or didn't. The food was good. I should have said that.",
    params,
  );
}
