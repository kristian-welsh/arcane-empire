import { Duration } from 'luxon';

export const startScene = (scene: Phaser.Scene, sceneKey: string) => {
  !scene.scene.get(sceneKey) &&
    scene.scene.add(sceneKey, sceneKey as Phaser.Types.Scenes.SceneType);
  scene.scene.start(sceneKey);
};

export const secondsToMMSS = (seconds: number): string => {
  return Duration.fromObject({ seconds }).toFormat('mm:ss');
};
