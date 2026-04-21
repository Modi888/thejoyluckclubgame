type Handler = (...args: any[]) => void;

class EventBus {
  private map = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: Handler) {
    this.map.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]) {
    this.map.get(event)?.forEach((h) => h(...args));
  }

  clear() {
    this.map.clear();
  }
}

export const eventBus = new EventBus();

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).__eventBus = eventBus;
}

export const EVENTS = {
  TRIGGER_MOTHER_DIALOGUE: 'trigger_mother_dialogue',
  DIALOGUE_ENDED: 'dialogue_ended',
  PAUSE_GAME: 'pause_game',
  RESUME_GAME: 'resume_game',
} as const;
