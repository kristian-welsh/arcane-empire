export default class MainMenuScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'MainMenuScene' });
  }

  public preload() {}

  public create() {
    const background = this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0xff0000);
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);
  }
}