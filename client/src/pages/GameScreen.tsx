import { PhaserGame } from '../game/PhaserGame';
import { DialogueOverlay } from '../components/DialogueOverlay';

export function GameScreen() {
  return (
    <div className="game-screen">
      <PhaserGame />
      <DialogueOverlay />
    </div>
  );
}
