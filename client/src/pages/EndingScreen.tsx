import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ENDINGS } from '../data/endings';
import { THEME_LABEL } from '../data/themes';
import { requestReflection } from '../api/dialogue';

export function EndingScreen() {
  const endingId = useGameStore((s) => s.endingId);
  const seed = useGameStore((s) => s.seed);
  const dialogue = useGameStore((s) => s.dialogue);
  const startNewSession = useGameStore((s) => s.startNewSession);
  const goHome = useGameStore((s) => s.goHomeScreen);

  const [daughterReflection, setDaughterReflection] = useState('');
  const [motherReflection, setMotherReflection] = useState('');
  const [loadingDaughter, setLoadingDaughter] = useState(false);
  const [loadingMother, setLoadingMother] = useState(false);
  const [daughterError, setDaughterError] = useState(false);
  const [motherError, setMotherError] = useState(false);

  const ending = endingId ? ENDINGS[endingId] : null;

  useEffect(() => {
    if (!ending || !endingId) return;
    let cancelled = false;

    setLoadingDaughter(true);
    setLoadingMother(true);
    setDaughterError(false);
    setMotherError(false);

    const base = {
      theme: seed.theme,
      motherEmotion: seed.motherEmotion,
      history: dialogue.history,
      endingId,
      endingTitle: ending.title,
    };

    requestReflection({ ...base, voice: 'daughter' })
      .then((text) => { if (!cancelled) setDaughterReflection(text); })
      .catch((e) => { console.error(e); if (!cancelled) setDaughterError(true); })
      .finally(() => { if (!cancelled) setLoadingDaughter(false); });

    requestReflection({ ...base, voice: 'mother' })
      .then((text) => { if (!cancelled) setMotherReflection(text); })
      .catch((e) => { console.error(e); if (!cancelled) setMotherError(true); })
      .finally(() => { if (!cancelled) setLoadingMother(false); });

    return () => {
      cancelled = true;
    };
  }, [endingId]);

  if (!endingId || !ending) return null;

  const renderReflection = (
    loading: boolean,
    error: boolean,
    text: string,
    waitHint: string,
    extraClass: string,
  ) => {
    if (loading) {
      return (
        <div className="mother-reflection-loading">
          <span className="loading-dots">...</span>
          <span className="mother-reflection-hint">{waitHint}</span>
        </div>
      );
    }
    if (error) {
      return <div className="mother-reflection-error">(The thought did not reach the page.)</div>;
    }
    return <blockquote className={`mother-reflection-text ${extraClass}`}>{text}</blockquote>;
  };

  return (
    <div className="ending-screen">
      <div className="ending-card">
        <div className="ending-meta">Theme: {THEME_LABEL[seed.theme]}</div>
        <h1>{ending.title}</h1>
        <p className="literary">{ending.literary}</p>

        <div className="reflection">
          <div className="mother-reflection">
            <div className="mother-reflection-label">{ending.reflectionPrompt1}</div>
            {renderReflection(
              loadingDaughter,
              daughterError,
              daughterReflection,
              'You are putting it into words upstairs.',
              'voice-daughter',
            )}
          </div>

          <div className="mother-reflection">
            <div className="mother-reflection-label">{ending.reflectionPrompt2}</div>
            {renderReflection(
              loadingMother,
              motherError,
              motherReflection,
              'She is thinking about tonight.',
              'voice-mother',
            )}
          </div>
        </div>

        <div className="research-insight">
          <div className="research-label">Research note</div>
          <p>{ending.researchInsight}</p>
        </div>

        {dialogue.history.length > 0 && (
          <details className="transcript">
            <summary>Show conversation transcript</summary>
            <ul>
              {dialogue.history.map((t, i) => (
                <li key={i} className={`turn turn-${t.role}`}>
                  <strong>{t.role === 'mother' ? 'Mom' : 'You'}:</strong> {t.content}
                  {t.narration && <div className="narration">{t.narration}</div>}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="ending-buttons">
          <button className="primary" onClick={() => startNewSession()}>Play again</button>
          <button className="ghost" onClick={() => goHome()}>Back to start</button>
        </div>
      </div>
    </div>
  );
}
