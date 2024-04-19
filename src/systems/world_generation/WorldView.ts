import { tileScalingConfig } from "../../setup/constants";
import { TerrainDatas } from "./TerrainTileRecords";
import { WorldModel } from "./WorldModel";

export class WorldView {

    scene: Phaser.Scene;
    worldModel: WorldModel;
    draggableContainer: Phaser.GameObjects.Container | undefined;

    tileScale: number = 1;

    public constructor(scene: Phaser.Scene, worldModel: WorldModel) {

        this.scene = scene;
        this.worldModel = worldModel;
    }

    public preloadWorldTiles(): void {

        Object.entries(TerrainDatas).forEach(([terrainType, terrainData]) => {
            console.log(terrainType);
            console.log(terrainData.path);

            this.scene.load.image(terrainType, terrainData.path);
        });
    }

    public drawWorld(): Phaser.GameObjects.Container {

        this.tileScale = this.scene.sys.canvas.width / (tileScalingConfig.horizontallyDisplayedTileCount * tileScalingConfig.tileSpriteWidth);

        this.draggableContainer = this.scene.add.container();

        // Create images for each terain tile and group them in the map container

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {

                let pixelPosition: Phaser.Math.Vector2 = this.convertGridToPixelCoords(x, y);

                let tileSpriteKey: string = this.worldModel.tiles[x][y].terrainData.name;

                let terrainSprite: Phaser.GameObjects.Image = this.scene.add.image(pixelPosition.x, pixelPosition.y, tileSpriteKey);
                terrainSprite.setScale(this.tileScale);

                this.draggableContainer.add(terrainSprite);
            }
        }

        // Make the map draggable

        this.draggableContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.getTotalMapWidth(), this.getTotalMapWidth()), Phaser.Geom.Rectangle.Contains);

        this.scene.input.setDraggable([this.draggableContainer])

        this.draggableContainer.on('drag', this.onDragMap, this);

        return this.draggableContainer;
    }

    public convertGridToPixelCoords(x: number, y: number): Phaser.Math.Vector2 {

        let offsetX = y % 2 == 1 ? (this.tileScale * tileScalingConfig.tileSpriteWidth) / 2 : 0;

        let tilePositionX: number = ((this.tileScale * tileScalingConfig.tileSpriteWidth) * x) + offsetX;
        let tilePositionY: number = (this.tileScale * tileScalingConfig.tileSpriteHeight) * y * 0.75;

        return new Phaser.Math.Vector2(tilePositionX, tilePositionY);
    }

    public getTotalMapWidth(): number {
        return ((this.tileScale * tileScalingConfig.tileSpriteWidth) * (this.worldModel.tiles[0].length - 1)) + (this.tileScale * tileScalingConfig.tileSpriteWidth) / 2;
    }

    public getTotalMapHeight(): number {
        return ((this.tileScale * tileScalingConfig.tileSpriteHeight) * this.worldModel.tiles.length) * 0.75 - (this.tileScale * tileScalingConfig.tileSpriteHeight) / 2;
    }

    public onDragMap(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {

        if (this.draggableContainer === undefined)
            return;

        this.draggableContainer.x = Phaser.Math.Clamp(dragX, -this.getTotalMapWidth() + this.scene.sys.canvas.width, 0);
        this.draggableContainer.y = Phaser.Math.Clamp(dragY, -this.getTotalMapHeight() + this.scene.sys.canvas.height, 0);
    }
}
