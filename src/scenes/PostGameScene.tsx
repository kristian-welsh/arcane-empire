/*
 * PostGameScene.tsx
 * Displays the game statistics after the game has ended and the opportunity to play again.
 */

import { secondsToMMSS, startScene } from '../helpers';

export default class PostGameScene extends Phaser.Scene {
  private gameScene: Phaser.Scene | null = null;

  public constructor() {
    super({ key: 'PostGameScene' });
  }

  public preload() {}

  public create() {
    this.gameScene = this.scene.get('GameScene');
    const gametime = this.gameScene.data.get('gametime');

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

    const startButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'Back to menu',
        {
          fontSize: '24px',
          color: '#FFFFFF',
        }
      )
      .setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    startButton.on(
      'pointerup',
      () => {
        startScene(this, 'MenuScene');
      },
      this
    );

    this.add.text(
      this.scale.width / 20,
      this.scale.height / 20,
      'Survived: ' + secondsToMMSS(gametime),
      {
        fontSize: '24px',
        color: '#FFFFFF',
      }
    );
  }
}
