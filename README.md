# What I Meant to Say

A short, literary dialogue game inspired by themes from Amy Tan's *The Joy Luck Club*. You play a daughter coming home for dinner. A small misunderstanding between you and your mother surfaces, unfolds, and settles into one of five endings in 3–6 minutes.

Built for an English literature class project. React + TypeScript + Phaser on the front, Express + an LLM proxy on the back, warm pixel-art tiles and sprites generated via the Tuzi image API.

---

## Quick start

You'll need Node 18+.

```bash
# 1. install server deps
cd server
npm install
cp .env.example .env   # or just fill in the existing .env
# edit .env to include a real TUZI_LLM_KEY

# 2. install client deps
cd ../client
npm install
```

Then in two terminals:

```bash
# terminal 1
cd server && npm run dev
# → http://localhost:3001   (exposes /api/health, /api/dialogue/respond)

# terminal 2
cd client && npm run dev
# → http://localhost:5173
```

Open http://localhost:5173, click **Start**, walk to your mother with arrow keys / WASD, and talk.

---

## Environment variables

`server/.env`:

| Variable        | Description                                               |
|-----------------|-----------------------------------------------------------|
| `TUZI_LLM_KEY`  | Tuzi API key for chat completions (OpenAI-compatible).    |
| `TUZI_BASE_URL` | Usually `https://api.tu-zi.com/v1`.                       |
| `TUZI_MODEL`    | Chat model, e.g. `gpt-5.4-mini`.                          |
| `PORT`          | Server port (default `3001`).                             |

The client never talks to the LLM directly. All calls go through `server/src/routes/dialogue.ts`, which injects the system prompt and enforces the JSON response schema.

---

## Architecture

```
client/                     React + Phaser, port 5173
├── src/
│   ├── pages/              Start, Game, Ending, About screens
│   ├── game/
│   │   ├── PhaserGame.tsx  React wrapper around Phaser.Game
│   │   ├── scenes/HomeScene.ts  tilemap + 4-direction sprite movement + proximity trigger
│   │   ├── eventBus.ts     tiny pub/sub bridging Phaser ↔ React
│   │   └── localAnalysis.ts regex-based player-intent classifier (tone nudges)
│   ├── components/
│   │   └── DialogueOverlay.tsx  dialogue UI, turn loop, analysis pipeline
│   ├── store/gameStore.ts  Zustand: screen, session seed, hidden state, transcript
│   ├── data/
│   │   ├── themes.ts       session seeds: theme / trigger / emotion / flavor
│   │   ├── endings.ts      5 literary endings + decide() function
│   │   └── research.ts     placeholder research sources shown in the About page
│   └── api/dialogue.ts     fetch wrapper for /api/dialogue/respond
└── vite.config.ts          proxies /api → localhost:3001

server/                     Express + TypeScript (tsx), port 3001
└── src/
    ├── index.ts            app + CORS + health
    ├── routes/dialogue.ts  POST /api/dialogue/respond
    ├── services/llm.ts     Tuzi chat call + JSON extract / clamp
    ├── prompts/mother.ts   system prompt + user-prompt builder
    ├── utils/fallback.ts   canned lines if the LLM fails
    └── types.ts

scripts/                    dev-only: sharp spritesheet builder (not part of runtime)
```

### The hidden state machine

Every session rolls a **seed** (theme, trigger, mother-emotion, flavor) and starts with a fresh `GameState`:

```
tension        0–100
openness       0–100
hurt           0–100
understanding  0–100
mother_worry   0–100
player_style   angry | silent | defensive | vulnerable | honest | neutral
```

Each daughter turn feeds two analyzers:
1. **Local regex classifier** (`localAnalysis.ts`) — cheap, deterministic tone nudges.
2. **LLM structured JSON** — the mother's reply *and* signed deltas (`-15..+15`) for each state variable, plus a `suggested_ending` hint.

Deltas are summed, clamped to `[0, 100]`, and the next turn's prompt is re-rendered with the new state. After 7 turns — or earlier, if the model sets `keep_conversation_going: false` — `decideEnding(state, suggested)` in `data/endings.ts` picks one of five literary endings:

- **Heard, But Not Fully** — partial recognition
- **The Dinner Ends in Silence** — unresolved distance
- **Something Shifts** — one quiet breakthrough
- **A Harder Silence** — the argument that doesn't close
- **A Softer Kind of Love** — expressed through food, not words

---

## Swapping things out

### Replace the three research sources
Edit `client/src/data/research.ts`. Each entry needs `id`, `title`, `author`, `year`, `takeaway` (one-sentence summary) and `connection` (how it shaped the game). Remove the `placeholder-note` paragraph in `client/src/pages/AboutScreen.tsx` once real sources are in.

### Swap the LLM / provider
All LLM calls live in `server/src/services/llm.ts`. It's plain `fetch()` against an OpenAI-compatible `/chat/completions` endpoint. Point it at any OpenAI-shaped provider (OpenAI, Anthropic via proxy, local Ollama with an OpenAI adapter, etc.) — just set `TUZI_BASE_URL`, `TUZI_LLM_KEY`, `TUZI_MODEL`.

### Tune the mother's voice
`server/src/prompts/mother.ts` holds the system prompt and the per-turn user-prompt builder. The system prompt is where the register lives ("immigrant mother, indirect, not therapeutic, 1–3 sentences"). Themes/triggers/emotions/flavors are described in the user-prompt builder so you can bias the session without retraining.

### Adjust endings or weighting
`client/src/data/endings.ts` — `decideEnding(state, suggested)` is a small rule-chain. Add endings there and a matching copy block.

---

## Presentation tips

- Open in a 16:9 window (e.g. full-screen the browser on a 1280×720 or 1920×1080 display). The apartment art is designed at 16:9 and won't look right letterboxed.
- Reload between demos — the state machine is session-scoped and carries no persistence by design.
- If the audience wants to see the mechanics, open the ending screen's "Show conversation transcript" fold-out. Mother turns and daughter turns are color-coded (mother neutral, daughter warm rose).
- The About page lists themes, personal connection, and research sources — good for a 1-slide framing of the project before playing.
- Network hiccups: the server falls back to canned mother lines from `utils/fallback.ts` so the game never hard-stops mid-dinner. If the audience sees a canned line twice, the LLM is rate-limited.

---

## License

Classroom project. Not for redistribution.
