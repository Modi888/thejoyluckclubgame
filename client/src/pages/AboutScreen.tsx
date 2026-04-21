import { RESEARCH_SOURCES } from '../data/research';
import { useGameStore } from '../store/gameStore';

export function AboutScreen() {
  const goHome = useGameStore((s) => s.goHomeScreen);

  return (
    <div className="about-screen">
      <div className="about-card">
        <h1>About this project</h1>

        <section>
          <h2>What this is</h2>
          <p>
            <em>What I Meant to Say</em> is a short, literary dialogue game inspired by themes from
            Amy Tan&apos;s <em>The Joy Luck Club</em>. You play a daughter coming home for dinner.
            In three to six minutes, a small misunderstanding between you and your mother will
            surface, unfold, and settle into one of several endings.
          </p>
        </section>

        <section>
          <h2>Themes</h2>
          <ul>
            <li>Mother-daughter relationships</li>
            <li>Generational conflict and misunderstanding</li>
            <li>Cultural identity and indirect expressions of love</li>
          </ul>
        </section>

        <section>
          <h2>Why a dinner scene</h2>
          <p>
            Most real family arguments are not about the thing they appear to be about. An
            argument about rice, grades, or a phone is often an argument about love, expectation,
            and being understood. The dinner table is where those things surface most often, and
            where the least of them can be said out loud.
          </p>
        </section>

        <section>
          <h2>Personal connection</h2>
          <p>
            This project draws on the experience of speaking two languages — one at home, one
            outside — and realizing, as a daughter, how much of my mother&apos;s care I only
            learned to recognize later. The mother character in this game is not my mother. But
            some of what she doesn&apos;t say comes from what I once failed to hear.
          </p>
        </section>

        <section>
          <h2>Research behind the project</h2>
          <ul className="sources">
            {RESEARCH_SOURCES.map((r) => (
              <li key={r.id}>
                <div className="source-title">
                  <em>{r.title}</em> — {r.author} ({r.year})
                </div>
                <div className="source-takeaway">{r.takeaway}</div>
                <div className="source-connection">
                  <strong>How it shaped the game:</strong> {r.connection}
                </div>
              </li>
            ))}
          </ul>
          <p className="placeholder-note">
            Bracketed entries are placeholders — they will be replaced with the three real sources
            cited in the final submission.
          </p>
        </section>

        <section>
          <h2>How the game was made</h2>
          <p>
            Built with React, TypeScript, and Phaser.js. The mother&apos;s dialogue is generated
            by a language model constrained by a hidden state machine and a prompt that restricts
            it to the emotional register of an immigrant mother — never therapeutic, never
            melodramatic, never off-topic. The state variables (tension, openness, hurt,
            understanding, worry) shift with each exchange and decide which of five endings you
            arrive at.
          </p>
        </section>

        <button className="ghost" onClick={() => goHome()}>Back</button>
      </div>
    </div>
  );
}
