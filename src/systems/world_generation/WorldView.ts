import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { TerrainDatas } from "./TerrainTileRecords";
import { WorldModel } from "./WorldModel";

export class WorldView {

    scene: Phaser.Scene;
    worldModel: WorldModel;
    hexGrid: HexagonGrid;

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

    public drawWorld(): void {

        // Create images for each terain tile and group them in the map container

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {

                let pixelPosition: Phaser.Math.Vector2 = this.hexGrid.convertGridHexToPixelHex(new Phaser.Math.Vector2(x, y));

                let tileSpriteKey: string = this.worldModel.tiles[x][y].terrainData.name;

                let terrainSprite: Phaser.GameObjects.Image = this.scene.add.image(pixelPosition.x, pixelPosition.y, tileSpriteKey);
                terrainSprite.setScale(this.hexGrid.hexScale, this.hexGrid.hexScale * 1.065); // Magic number 1.065 is because the hex sprites are slightly squashed

                this.hexGrid.draggableContainer?.add(terrainSprite);
            }
        }
    }
}
