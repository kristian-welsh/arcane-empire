/*
 * MenuScene.tsx
 * This scene loads after the InitialScene.
 * It will display any game options eg. the difficulty, world selection, and the start button.
 */

import { startScene } from '../helpers';

export default class MenuScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'MenuScene' });
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

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        'Arcane Empire',
        {
          fontSize: '24px',
          color: '#ff0000',
        }
      )
      .setOrigin(0.5);
    
    const startButton = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start', {
        fontSize: '24px',
        color: '#FFFFFF',
      })
      .setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    startButton.on(
      'pointerup',
      () => {
        startScene(this, 'GameScene');
      },
      this
    );
  }
}
