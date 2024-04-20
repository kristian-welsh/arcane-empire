import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { StructureDatas } from "./StructureRecords";
import { TerrainDatas } from "./TerrainTileRecords";
import { GenerationSettings, Tile, WorldModel } from "./WorldModel";

export class WorldView {

    scene: Phaser.Scene;
    worldModel: WorldModel;
    hexGrid: HexagonGrid;

    randomGenerator: Phaser.Math.RandomDataGenerator;

    public constructor(scene: Phaser.Scene, worldModel: WorldModel, hexGrid: HexagonGrid, generationSettings: GenerationSettings) {

        this.scene = scene;
        this.worldModel = worldModel;
        this.hexGrid = hexGrid;

        this.randomGenerator = new Phaser.Math.RandomDataGenerator([generationSettings.seed]);
    }

    public preloadWorldTiles(): void {

        Object.entries(TerrainDatas).forEach(([terrainType, terrainData]) => {
            this.scene.load.image(terrainType, terrainData.path);
        });

        Object.entries(StructureDatas).forEach(([structureType, structureData]) => {
            this.scene.load.image(structureType, structureData.path);

            if (structureData.alt_path !== undefined) {
                this.scene.load.image(structureType + "_alt", structureData.alt_path);
            }
        });
    }

    public drawWorld(): void {

        // Draw all the base terrain tiles

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {

                let pixelPosition: Phaser.Math.Vector2 = this.hexGrid.convertGridHexToPixelHex(new Phaser.Math.Vector2(x, y));

                let tileSpriteKey: string = this.worldModel.tiles[x][y].terrainData.name;

                let terrainSprite: Phaser.GameObjects.Image = this.scene.add.image(pixelPosition.x, pixelPosition.y, tileSpriteKey);
                terrainSprite.setScale(this.hexGrid.hexScale, this.hexGrid.hexScale * 1.065); // Magic number 1.065 is because the hex sprites are slightly squashed

                this.hexGrid.draggableContainer?.add(terrainSprite);
            }
        }

        // Draw the dotted structures on top

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {

                let tile: Tile = this.worldModel.tiles[x][y];

                if (tile.structureData === undefined)
                    continue;

                let pixelPosition: Phaser.Math.Vector2 = this.hexGrid.convertGridHexToPixelHex(new Phaser.Math.Vector2(x, y));

                let structureSpriteKey: string = tile.structureData.name;

                if (tile.structureData.alt_path !== undefined && this.randomGenerator.between(0, 1) == 1) {
                    structureSpriteKey += "_alt";
                }

                let structureSprite: Phaser.GameObjects.Image = this.scene.add.image(pixelPosition.x, pixelPosition.y, structureSpriteKey);
                structureSprite.setScale(this.hexGrid.hexScale * tile.structureData.sprite_scale, this.hexGrid.hexScale * tile.structureData.sprite_scale);

                this.hexGrid.draggableContainer?.add(structureSprite);
            }
        }
    }
}
