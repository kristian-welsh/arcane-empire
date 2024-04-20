import { GridSize } from "../hex_grid/HexagonGrid";
import { StructureData, StructureDatas } from "./StructureRecords";
import { TerrainType, TerrainData, TerrainTypes, TerrainDatas } from "./TerrainTileRecords";

export interface GenerationSettings {
    seed: string;
    castlesCount: number;
    cavesCount: number;
    farmsCount: number;
    villagesCount: number;
}

export class Tile {

    coordinates: Phaser.Math.Vector2;
    terrainData: TerrainData
    structureData: StructureData | undefined;

    constructor(coordinates: Phaser.Math.Vector2, terrainType: TerrainData) {

        this.coordinates = coordinates;
        this.terrainData = terrainType;
    }
}

export class WorldModel {

    gridSize: GridSize;
    generationSettings: GenerationSettings;

    tiles: Tile[][];

    randomGenerator: Phaser.Math.RandomDataGenerator;

    public constructor(gridSize: GridSize, generationSettings: GenerationSettings) {

        this.gridSize = gridSize;
        this.generationSettings = generationSettings;

        this.randomGenerator = new Phaser.Math.RandomDataGenerator([generationSettings.seed]);

        // Pre fill with ocean

        this.tiles = [];

        for (let x = 0; x < this.gridSize.width; x++) {

            this.tiles[x] = [];

            for (let y = 0; y < this.gridSize.height; y++) {
                this.tiles[x][y] = new Tile(new Phaser.Math.Vector2(x, y), TerrainDatas.Ocean);
            }
        }

        this.generateTerrain()

        this.generateStructures();
    }

    private generateTerrain(): void {

        for (let x = 0; x < this.gridSize.width; x++) {

            for (let y = 0; y < this.gridSize.height; y++) {

                if (y <= 1 || x <= 1 || y >= this.gridSize.height - 2 || x >= this.gridSize.width - 2) {
                    this.tiles[x][y] = new Tile(new Phaser.Math.Vector2(x, y), TerrainDatas.Ocean);
                } else {
                    let randomTerrainData: TerrainData = TerrainDatas[TerrainTypes[this.randomGenerator.between(0, 3)]];
                    this.tiles[x][y] = new Tile(new Phaser.Math.Vector2(x, y), randomTerrainData);
                }
            }
        }
    }

    private generateStructures(): void {

        for (let c = 0; c < this.generationSettings.castlesCount; c++) {

            let chosenTile: Tile = this.getRandomTile(StructureDatas.Castle.terrain_filter);
            chosenTile.structureData = StructureDatas.Castle;

            if (StructureDatas.Castle.flatten_terrain) {
                chosenTile.terrainData = TerrainDatas.Grass;
            }
        }

        for (let c = 0; c < this.generationSettings.cavesCount; c++) {

            let chosenTile: Tile = this.getRandomTile(StructureDatas.Cave_Entrance.terrain_filter);
            chosenTile.structureData = StructureDatas.Cave_Entrance;

            if (StructureDatas.Castle.flatten_terrain) {
                chosenTile.terrainData = TerrainDatas.Grass;
            }
        }

        for (let f = 0; f < this.generationSettings.farmsCount; f++) {

            //TODO Farms should generate with a wheath field or paddle next to it

            let chosenTile: Tile = this.getRandomTile(StructureDatas.Farm_Hut.terrain_filter);
            chosenTile.structureData = StructureDatas.Farm_Hut;

            if (StructureDatas.Castle.flatten_terrain) {
                chosenTile.terrainData = TerrainDatas.Grass;
            }
        }

        for (let v = 0; v < this.generationSettings.villagesCount; v++) {

            let chosenTile: Tile = this.getRandomTile(StructureDatas.Village_Small.terrain_filter);
            chosenTile.structureData = StructureDatas.Village_Small;

            if (StructureDatas.Castle.flatten_terrain) {
                chosenTile.terrainData = TerrainDatas.Grass;
            }
        }
    }

    public getTile(coord: Phaser.Math.Vector2): Tile | undefined {

        if (coord.x >= 0 && coord.x < this.gridSize.width && coord.y >= 0 && coord.y < this.gridSize.height) {
            return this.tiles[coord.x][coord.y];
        }

        return undefined;
    }

    public forEachTile(func: (x: number, y: number, tile: Tile) => void) {
        for (let x = 0; x < this.gridSize.width; x++) {
            for (let y = 0; y < this.gridSize.height; y++) {
                func(x, y, this.tiles[x][y]);
            }
        }
    }

    public getRandomTile(terrainFilters: TerrainType[] | undefined): Tile {

        let flatTiles: Tile[] = this.tiles.flat();

        if (terrainFilters !== undefined) {
            flatTiles = flatTiles.filter(tile => terrainFilters.some(terrainFilter => tile.terrainData.name == terrainFilter));
        }

        return flatTiles[this.randomGenerator.between(0, flatTiles.length - 1)];
    }
}

