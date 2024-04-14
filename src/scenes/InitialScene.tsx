/*
 * InitialScene.tsx
 * This is the first scene that is loaded when the game is started.
 * It is responsible for loading the game assets and displaying an introduction sequence.
 */

import {
  loadInitialSceneAnimations,
  loadInitialSceneSprites,
} from '../setup/animationSetup';

export default class InitialScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'InitialScene' });
  }

  public preload() {
    loadInitialSceneSprites(this);
  }

  public create() {
    loadInitialSceneAnimations(this);

    const background = this.add.rectangle(
      0,
      0,
      this.sys.canvas.width,
      this.sys.canvas.height,
      0x070750
    );
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    const loadingText = this.add.text(
      50,
      this.sys.canvas.height - 75,
      'Loading...',
      { fontSize: '24px', color: '#ffffff' }
    );
    loadingText.setOrigin(0, 1);

    const runner = this.add.sprite(
      140,
      this.sys.canvas.height - 10,
      'runningRogueSheet'
    );
    runner.setOrigin(0, 1);
    runner.setScale(1.5);
    runner.play('runningRogueAnimation');

    this.time.delayedCall(3000, () => {
      this.scene.start('MenuScene');
    });
  }
}
