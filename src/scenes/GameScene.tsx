/*
 * GameScene.tsx
 * This scene is responsible for handling the whole game logic. When the game ends, it will transition to the PostGameScene.
 */

import { secondsToMMSS, startScene } from '../helpers';

export default class GameScene extends Phaser.Scene {
  private startTime: number = 0;
  private gameStarted: boolean = false;
  private elapsedSeconds: number = 0;
  private gameTimeText: Phaser.GameObjects.Text | undefined;

  public constructor() {
    super({ key: 'GameScene' });
  }

  public preload() {}

  public create() {
    const background = this.add.rectangle(
      0,
      0,
      this.sys.canvas.width,
      this.sys.canvas.height,
      0x000000
    );
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    this.gameTimeText = this.add.text(
      this.scale.width / 1.15,
      this.scale.height / 40,
      this.elapsedSeconds.toString(),
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'right',
      }
    );

    const startButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'End game', {
        fontSize: '24px',
        color: '#FFFFFF',
      })
      .setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    startButton.on(
      'pointerup',
      () => {
        this.data.set('gametime', this.elapsedSeconds);
        startScene(this, 'PostGameScene');
      },
      this
    );
  }

  public update(time: number): void {
    if (!this.gameStarted) {
      this.elapsedSeconds = 0;
      this.startTime = this.time.now;
      this.gameStarted = true;
    }

    this.elapsedSeconds = Math.floor((time - this.startTime) / 1000);

    this.gameTimeText &&
      this.gameTimeText.setText(secondsToMMSS(this.elapsedSeconds));
    this.gameTimeText &&
      this.gameTimeText.setPosition(
        this.scale.width / 1.05 - this.gameTimeText.width,
        this.scale.height / 40
      );
  }
}
