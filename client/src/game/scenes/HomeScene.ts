import Phaser from 'phaser';
import { eventBus, EVENTS } from '../eventBus';

import apartmentUrl from '../../assets/tiles/home-tileset.png';
import daughterSheetUrl from '../../assets/characters/daughter-spritesheet.png';
import motherSheetUrl from '../../assets/characters/mother-spritesheet.png';

// Apartment image is 16:9. We'll scale it to fill the canvas.
// Spritesheet: 3 cols (idle, walk1, walk2) x 4 rows (down, left, right, up). 128x128 per frame.
const FRAME = 128;
const ROWS = { down: 0, left: 1, right: 2, up: 3 } as const;

// Walkable bounds: where on the apartment image the daughter can move.
// Values tuned by hand for the current home-tileset.png (1376x774 approx, 16:9).
// Represented as fraction of image (0-1) for resolution independence.
const WALK_BOUNDS = { x: 0.03, y: 0.04, w: 0.94, h: 0.92 };

// Mother stand zone (where the NPC waits) — near the dining table (top-center area)
const MOTHER_POS = { x: 0.42, y: 0.2 };

// Trigger zone around mother (fraction). Entering it starts dialogue.
const TRIGGER_RADIUS = 0.09;

export class HomeScene extends Phaser.Scene {
  private daughter!: Phaser.Physics.Arcade.Sprite;
  private mother!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private bg!: Phaser.GameObjects.Image;
  private hint!: Phaser.GameObjects.Text;
  private triggered = false;
  private paused = false;

  constructor() {
    super('HomeScene');
  }

  preload() {
    this.load.image('apartment', apartmentUrl);
    this.load.spritesheet('daughter', daughterSheetUrl, { frameWidth: FRAME, frameHeight: FRAME });
    this.load.spritesheet('mother', motherSheetUrl, { frameWidth: FRAME, frameHeight: FRAME });
  }

  create() {
    const { width, height } = this.scale;

    this.bg = this.add.image(0, 0, 'apartment').setOrigin(0, 0);
    this.bg.setDisplaySize(width, height);

    // Mother (static NPC at dining area)
    this.mother = this.add.sprite(width * MOTHER_POS.x, height * MOTHER_POS.y, 'mother', 0);
    const motherScale = (height * 0.22) / FRAME;
    this.mother.setScale(motherScale);

    // Daughter spawn near the entrance (bottom-left)
    this.daughter = this.physics.add.sprite(width * 0.15, height * 0.82, 'daughter', 0);
    const daughterScale = (height * 0.22) / FRAME;
    this.daughter.setScale(daughterScale);
    this.daughter.setCollideWorldBounds(false);

    this.setupAnimations();

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D') as any;

    this.hint = this.add
      .text(width / 2, height - 28, 'Use arrow keys or WASD to walk. Find mom.', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#fff5dc',
        backgroundColor: '#3a2414cc',
        padding: { left: 12, right: 12, top: 6, bottom: 6 },
      })
      .setOrigin(0.5, 1);

    eventBus.on(EVENTS.DIALOGUE_ENDED, this.onDialogueEnded);
    eventBus.on(EVENTS.PAUSE_GAME, this.onPause);
    eventBus.on(EVENTS.RESUME_GAME, this.onResume);

    this.scale.on('resize', this.handleResize, this);
  }

  private setupAnimations() {
    const mk = (key: string, sheet: string, row: number) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(sheet, { start: row * 3 + 1, end: row * 3 + 2 }),
        frameRate: 6,
        repeat: -1,
      });
    };
    const idle = (key: string, sheet: string, row: number) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: [{ key: sheet, frame: row * 3 }],
        frameRate: 1,
        repeat: -1,
      });
    };

    (['down', 'left', 'right', 'up'] as const).forEach((dir) => {
      const row = ROWS[dir];
      idle(`daughter_idle_${dir}`, 'daughter', row);
      mk(`daughter_walk_${dir}`, 'daughter', row);
      idle(`mother_idle_${dir}`, 'mother', row);
    });

    this.daughter.play('daughter_idle_down');
    this.mother.play('mother_idle_down');
  }

  private onDialogueEnded = () => {
    this.paused = false;
  };
  private onPause = () => {
    this.paused = true;
    this.daughter.setVelocity(0, 0);
    if (this.input.keyboard) this.input.keyboard.enabled = false;
  };
  private onResume = () => {
    this.paused = false;
    if (this.input.keyboard) this.input.keyboard.enabled = true;
  };

  private handleResize = (gameSize: Phaser.Structs.Size) => {
    const { width, height } = gameSize;
    this.bg.setDisplaySize(width, height);
    this.mother.setPosition(width * MOTHER_POS.x, height * MOTHER_POS.y);
    const scale = (height * 0.22) / FRAME;
    this.mother.setScale(scale);
    this.daughter.setScale(scale);
    this.hint.setPosition(width / 2, height - 28);
  };

  update() {
    if (this.paused) return;

    const speed = 180;
    const body = this.daughter.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const left = this.cursors.left?.isDown || this.wasd.A.isDown;
    const right = this.cursors.right?.isDown || this.wasd.D.isDown;
    const up = this.cursors.up?.isDown || this.wasd.W.isDown;
    const down = this.cursors.down?.isDown || this.wasd.S.isDown;

    let vx = 0;
    let vy = 0;
    if (left) vx = -speed;
    else if (right) vx = speed;
    if (up) vy = -speed;
    else if (down) vy = speed;
    body.setVelocity(vx, vy);

    // Constrain to walkable bounds
    const { width, height } = this.scale;
    const minX = width * WALK_BOUNDS.x;
    const maxX = width * (WALK_BOUNDS.x + WALK_BOUNDS.w);
    const minY = height * WALK_BOUNDS.y;
    const maxY = height * (WALK_BOUNDS.y + WALK_BOUNDS.h);
    this.daughter.x = Phaser.Math.Clamp(this.daughter.x, minX, maxX);
    this.daughter.y = Phaser.Math.Clamp(this.daughter.y, minY, maxY);

    // Animation
    if (vx === 0 && vy === 0) {
      const cur = this.daughter.anims.currentAnim?.key || 'daughter_idle_down';
      const dir = cur.split('_').pop()!;
      this.daughter.play(`daughter_idle_${dir}`, true);
    } else {
      let dir: 'down' | 'up' | 'left' | 'right' = 'down';
      if (Math.abs(vx) > Math.abs(vy)) dir = vx > 0 ? 'right' : 'left';
      else dir = vy > 0 ? 'down' : 'up';
      this.daughter.play(`daughter_walk_${dir}`, true);
    }

    // Trigger check
    if (!this.triggered) {
      const mx = width * MOTHER_POS.x;
      const my = height * MOTHER_POS.y;
      const dist = Phaser.Math.Distance.Between(this.daughter.x, this.daughter.y, mx, my);
      const thresholdPx = width * TRIGGER_RADIUS;
      if (dist < thresholdPx) {
        this.triggered = true;
        this.paused = true;
        body.setVelocity(0, 0);
        eventBus.emit(EVENTS.TRIGGER_MOTHER_DIALOGUE);
      }
    }
  }
}
