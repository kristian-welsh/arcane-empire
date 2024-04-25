import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { StructureDatas } from "./StructureRecords";
import { TerrainDatas } from "./TerrainTileRecords";
import { GenerationSettings, Tile, WorldModel } from "./WorldModel";

export class WorldView {

    scene: Phaser.Scene;
    worldModel: WorldModel;
    hexGrid: HexagonGrid;

    randomGenerator: Phaser.Math.RandomDataGenerator;

    public constructor(scene: Phaser.Scene, hexGrid: HexagonGrid, worldModel: WorldModel, generationSettings: GenerationSettings) {

        this.scene = scene;
        this.worldModel = worldModel;
        this.hexGrid = hexGrid;

        this.randomGenerator = new Phaser.Math.RandomDataGenerator([generationSettings.seed]);
    }

    public preload(): void {

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

    public create(): void {

        // Draw all the base terrain tiles

        this.worldModel.forEachTile((x, y, tile) => {

            let pixelPosition: Phaser.Math.Vector2 = this.hexGrid.convertGridHexToPixelHex(new Phaser.Math.Vector2(x, y));

            let tileSpriteKey: string = tile.terrainData.name;

            let terrainSprite: Phaser.GameObjects.Image = this.scene.add.image(pixelPosition.x, pixelPosition.y, tileSpriteKey);
            terrainSprite.setScale(this.hexGrid.hexScale, this.hexGrid.hexScale * 1.065); // Magic number 1.065 is because the hex sprites are slightly squashed

            this.hexGrid.draggableContainer?.add(terrainSprite);

            tile.setImage(terrainSprite);
        })

        // Draw the dotted structures on top

        this.worldModel.forEachTile((x, y, tile) => {

            if (tile.structureData === undefined)
                return;

            let pixelPosition: Phaser.Math.Vector2 = this.hexGrid.convertGridHexToPixelHex(new Phaser.Math.Vector2(x, y));

            let structureSpriteKey: string = tile.structureData.name;

            if (tile.structureData.alt_path !== undefined && this.randomGenerator.between(0, 1) == 1) {
                structureSpriteKey += "_alt";
            }

            let structureSprite: Phaser.GameObjects.Image = this.scene.add.image(pixelPosition.x, pixelPosition.y, structureSpriteKey);
            structureSprite.setScale(this.hexGrid.hexScale * tile.structureData.sprite_scale, this.hexGrid.hexScale * tile.structureData.sprite_scale);

            this.hexGrid.draggableContainer?.add(structureSprite);
        });
    }
}
