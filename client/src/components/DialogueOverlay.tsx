import { useEffect, useState } from 'react';
import { useGameStore, MAX_TURNS } from '../store/gameStore';
import { eventBus, EVENTS } from '../game/eventBus';
import { requestDialogue } from '../api/dialogue';
import { analyzePlayerInput } from '../game/localAnalysis';
import daughterPortrait from '../assets/characters/daughter-portrait.png';
import motherPortrait from '../assets/characters/mother.png';

export function DialogueOverlay() {
  const dialogue = useGameStore((s) => s.dialogue);
  const seed = useGameStore((s) => s.seed);
  const state = useGameStore((s) => s.state);
  const pushMother = useGameStore((s) => s.pushMotherTurn);
  const pushDaughter = useGameStore((s) => s.pushDaughterTurn);
  const applyAnalysis = useGameStore((s) => s.applyAnalysis);
  const endDialogue = useGameStore((s) => s.endDialogue);
  const setAwaitingReply = useGameStore((s) => s.setAwaitingReply);
  const openDialogue = useGameStore((s) => s.openDialogue);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstLineRequested, setFirstLineRequested] = useState(false);

  // Wire up the trigger from Phaser
  useEffect(() => {
    const unsub = eventBus.on(EVENTS.TRIGGER_MOTHER_DIALOGUE, () => {
      openDialogue();
      eventBus.emit(EVENTS.PAUSE_GAME);
      setFirstLineRequested(false);
    });
    return unsub;
  }, [openDialogue]);

  // Fetch mother's opening line once dialogue becomes active
  useEffect(() => {
    if (!dialogue.active) return;
    if (dialogue.history.length > 0) return;
    if (firstLineRequested) return;

    setFirstLineRequested(true);
    setLoading(true);
    requestDialogue({
      theme: seed.theme,
      triggerEvent: seed.triggerEvent,
      motherEmotion: seed.motherEmotion,
      environmentalFlavor: seed.environmentalFlavor,
      conversationHistory: [],
      playerInput: '',
      currentGameState: state,
      turnCount: 0,
    })
      .then((resp) => {
        pushMother(resp.motherReply, resp.optionalNarration);
      })
      .catch((e) => {
        console.error(e);
        pushMother('Sit down. The food is getting cold.', 'She doesn\'t quite look at you.');
      })
      .finally(() => setLoading(false));
  }, [dialogue.active, dialogue.history.length, firstLineRequested, seed, state, pushMother]);

  if (!dialogue.active) return null;

  const canSend = !loading && input.trim().length > 0 && dialogue.history.length > 0;
  const latestMother = [...dialogue.history].reverse().find((t) => t.role === 'mother');

  async function handleSend() {
    if (!canSend) return;
    const text = input.trim();
    setInput('');
    const local = analyzePlayerInput(text);
    pushDaughter(text);
    setLoading(true);

    try {
      // Use latest store values
      const s = useGameStore.getState();
      const resp = await requestDialogue({
        theme: s.seed.theme,
        triggerEvent: s.seed.triggerEvent,
        motherEmotion: s.seed.motherEmotion,
        environmentalFlavor: s.seed.environmentalFlavor,
        conversationHistory: s.dialogue.history,
        playerInput: text,
        currentGameState: s.state,
        turnCount: s.dialogue.turnCount,
      });

      applyAnalysis(local, resp.structuredAnalysis);
      pushMother(resp.motherReply, resp.optionalNarration);

      const nextTurnCount = useGameStore.getState().dialogue.turnCount;
      const shouldEnd =
        !resp.structuredAnalysis.keep_conversation_going ||
        resp.structuredAnalysis.suggested_end_if_any ||
        nextTurnCount >= MAX_TURNS;

      if (shouldEnd) {
        setTimeout(() => {
          eventBus.emit(EVENTS.DIALOGUE_ENDED);
          endDialogue(resp.structuredAnalysis.suggested_end_if_any);
        }, 2200);
      }
    } catch (e) {
      console.error(e);
      pushMother('...', '(A long pause.)');
      setAwaitingReply(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-portraits">
        <div className="portrait mother-portrait">
          <img src={motherPortrait} alt="mother" />
          <span>Mom</span>
        </div>
        <div className="portrait daughter-portrait">
          <img src={daughterPortrait} alt="you" />
          <span>You</span>
        </div>
      </div>

      <div className="dialogue-box">
        {latestMother ? (
          <>
            <div className="mother-line">{latestMother.content}</div>
            {latestMother.narration && (
              <div className="narration">{latestMother.narration}</div>
            )}
          </>
        ) : (
          <div className="mother-line">...</div>
        )}

        {loading && <div className="loading-dots">...</div>}

        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') handleSend();
            }}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            placeholder={loading ? 'Mom is thinking…' : 'What do you say?'}
            disabled={loading}
            autoFocus
          />
          <button onClick={handleSend} disabled={!canSend}>
            Say
          </button>
        </div>

        <div className="turn-indicator">
          Turn {Math.min(dialogue.turnCount, MAX_TURNS)} / {MAX_TURNS}
        </div>
      </div>
    </div>
  );
}
