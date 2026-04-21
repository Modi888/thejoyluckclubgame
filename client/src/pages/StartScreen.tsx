import { useGameStore } from '../store/gameStore';

export function StartScreen() {
  const startNewSession = useGameStore((s) => s.startNewSession);
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="start-screen">
      <div className="start-card">
        <h1>What I Meant to Say</h1>
        <p className="subtitle">A mother-daughter dialogue simulator inspired by <em>The Joy Luck Club</em>.</p>
        <p className="intro">
          You are a daughter coming home for dinner. Walk to your mother. Some words will be said.
          Some will not.
        </p>
        <div className="start-buttons">
          <button className="primary" onClick={() => startNewSession()}>Start</button>
          <button className="ghost" onClick={() => setScreen('about')}>About this project</button>
        </div>
        <p className="epigraph">Sometimes dinner is not about dinner.</p>
      </div>
    </div>
  );
}
