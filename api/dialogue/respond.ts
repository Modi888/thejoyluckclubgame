import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateDialogue } from '../_lib/llm';
import type { DialogueRequest } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  try {
    const body = req.body as DialogueRequest;
    if (!body || !body.theme || !body.triggerEvent) {
      res.status(400).json({ error: 'missing required fields' });
      return;
    }
    const response = await generateDialogue(body);
    res.json(response);
  } catch (err) {
    console.error('[dialogue] unhandled', err);
    res.status(500).json({ error: 'internal error' });
  }
}
