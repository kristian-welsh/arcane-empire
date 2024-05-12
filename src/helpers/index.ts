import { Duration } from 'luxon';

export const startScene = (scene: Phaser.Scene, sceneKey: string) => {
  !scene.scene.get(sceneKey) &&
    scene.scene.add(sceneKey, sceneKey as Phaser.Types.Scenes.SceneType);
  scene.scene.start(sceneKey);
};

export const secondsToMMSS = (seconds: number): string => {
  return Duration.fromObject({ seconds }).toFormat('mm:ss');
};

export const lerp = (
  a: Phaser.Math.Vector2,
  b: Phaser.Math.Vector2,
  t: number
) => {
  return new Phaser.Math.Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};
