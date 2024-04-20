import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { TerrainDatas } from "./TerrainTileRecords";
import { WorldModel } from "./WorldModel";

export class WorldView {

    scene: Phaser.Scene;
    worldModel: WorldModel;
    hexGrid: HexagonGrid;

    draggableContainer: Phaser.GameObjects.Container | undefined;

    public constructor(scene: Phaser.Scene, worldModel: WorldModel, hexGrid: HexagonGrid) {

        this.scene = scene;
        this.worldModel = worldModel;
        this.hexGrid = hexGrid;
    }

    public preloadWorldTiles(): void {

        Object.entries(TerrainDatas).forEach(([terrainType, terrainData]) => {
            this.scene.load.image(terrainType, terrainData.path);
        });
    }

    public drawWorld(): Phaser.GameObjects.Container {

        this.draggableContainer = this.scene.add.container();

        // Create images for each terain tile and group them in the map container

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {

                let pixelPosition: Phaser.Math.Vector2 = this.hexGrid.convertGridHexToPixelHex(new Phaser.Math.Vector2(x, y));

                let tileSpriteKey: string = this.worldModel.tiles[x][y].terrainData.name;

                let terrainSprite: Phaser.GameObjects.Image = this.scene.add.image(pixelPosition.x, pixelPosition.y, tileSpriteKey);
                terrainSprite.setScale(this.hexGrid.hexScale, this.hexGrid.hexScale * 1.065); // Magic number 1.065 is because the hex sprites are slightly squashed

                this.draggableContainer.add(terrainSprite);
            }
        }

        // Make the map draggable

        this.draggableContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.hexGrid.getPixelWidth(), this.hexGrid.getPixelHeight()), Phaser.Geom.Rectangle.Contains);

        this.scene.input.setDraggable([this.draggableContainer])

        this.draggableContainer.on('drag', this.onDragMap, this);

        return this.draggableContainer;
    }

    public onDragMap(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {

        if (this.draggableContainer === undefined)
            return;

        this.draggableContainer.x = Phaser.Math.Clamp(dragX, -this.hexGrid.getPixelWidth() + this.scene.sys.canvas.width, 0);
        this.draggableContainer.y = Phaser.Math.Clamp(dragY, -this.hexGrid.getPixelHeight() + this.scene.sys.canvas.height, 0);
    }
}
