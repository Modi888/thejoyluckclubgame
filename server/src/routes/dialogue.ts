import { Router } from 'express';
import { generateDialogue, generateMotherReflection, generateDaughterReflection } from '../services/llm.js';
import type { DialogueRequest } from '../types.js';

export const dialogueRouter = Router();

dialogueRouter.post('/respond', async (req, res) => {
  try {
    const body = req.body as DialogueRequest;
    if (!body || !body.theme || !body.triggerEvent) {
      return res.status(400).json({ error: 'missing required fields' });
    }
    const response = await generateDialogue(body);
    res.json(response);
  } catch (err) {
    console.error('[dialogue] unhandled', err);
    res.status(500).json({ error: 'internal error' });
  }
});

dialogueRouter.post('/reflect', async (req, res) => {
  try {
    const { theme, motherEmotion, history, endingId, endingTitle, voice } = req.body || {};
    if (!theme || !Array.isArray(history) || !endingId) {
      return res.status(400).json({ error: 'missing required fields' });
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
});
