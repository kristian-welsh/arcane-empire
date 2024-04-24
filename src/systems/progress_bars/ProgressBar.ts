

export class ProgressBar {

    barImage: Phaser.GameObjects.Image;
    fillImage: Phaser.GameObjects.Image;

    fillPercentage: number;

    scale: number;

    constructor(initialFill: number, x: number, y: number, barImage: Phaser.GameObjects.Image, fillImage: Phaser.GameObjects.Image, scale: number) {

        this.barImage = barImage;
        this.fillImage = fillImage;

        this.scale = scale;

        this.fillImage.setScale(this.scale);
        this.barImage.setScale(this.scale);

        this.fillPercentage = initialFill;

        this.setPosition(x, y);
        this.setFilledPercentage(this.fillPercentage);
    }

    public setFilledPercentage(percentage: number): void {
        this.fillImage.setScale(Phaser.Math.Clamp(percentage, 0, 1) * this.scale, this.scale);
    }

    public setDepth(depth: number): void {
        this.barImage.depth = depth;
        this.fillImage.depth = depth;
    }

    public setPosition(x: number, y: number): void {

        this.barImage.x = x;
        this.barImage.y = y;

        // Magic number 9 is the offset in pixels from the left of the bar frame that the fill starts
        this.fillImage.x = x - (this.barImage.displayWidth / 2) + (6 * this.scale);
        this.fillImage.y = y;
    }

}