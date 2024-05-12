export class QuestMarker {
  markerImage: Phaser.GameObjects.Image;
  scale: number;

  constructor(
    x: number,
    y: number,
    markerImage: Phaser.GameObjects.Image,
    scale: number
  ) {
    this.markerImage = markerImage;
    this.scale = scale;

    this.markerImage.setScale(this.scale);

    this.setPosition(x, y);
  }

  public setDepth(depth: number): void {
    this.markerImage.depth = depth;
  }

  public setPosition(x: number, y: number): void {
    this.markerImage.x = x;
    this.markerImage.y = y;
  }
}
