import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateMotherReflection, generateDaughterReflection } from '../_lib/llm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  try {
    const { theme, motherEmotion, history, endingId, endingTitle, voice } = req.body || {};
    if (!theme || !Array.isArray(history) || !endingId) {
      res.status(400).json({ error: 'missing required fields' });
      return;
    }
    const params = {
      theme,
      motherEmotion: motherEmotion || 'tired',
      history,
      endingId,
      endingTitle: endingTitle || '',
    };
    const reflection =
      voice === 'daughter'
        ? await generateDaughterReflection(params)
        : await generateMotherReflection(params);
    res.json({ reflection });
  } catch (err) {
    console.error('[reflect] unhandled', err);
    res.status(500).json({ error: 'internal error' });
  }
}
