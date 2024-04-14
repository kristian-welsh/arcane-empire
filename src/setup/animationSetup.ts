import RunningRogueSheet from '../assets/ui/running-rogue.png';

export const loadInitialSceneSprites = (scene: Phaser.Scene) => {
  scene.load.spritesheet('runningRogueSheet', RunningRogueSheet, {
    frameWidth: 100,
    frameHeight: 100,
  });
};

export const loadInitialSceneAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'runningRogueAnimation',
    frames: scene.anims.generateFrameNumbers('runningRogueSheet', {
      start: 0,
      end: 5,
    }),
    frameRate: 12,
    repeat: -1,
  });
};
