import { useGameStore } from './store/gameStore';
import { StartScreen } from './pages/StartScreen';
import { GameScreen } from './pages/GameScreen';
import { EndingScreen } from './pages/EndingScreen';
import { AboutScreen } from './pages/AboutScreen';

export function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="app">
      {screen === 'start' && <StartScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'ending' && <EndingScreen />}
      {screen === 'about' && <AboutScreen />}
    </div>
  );
}
