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

        this.tiles = [];
        this.randomGenerator = new Phaser.Math.RandomDataGenerator(generationSettings.seed);

        this.generateTerrain()

        this.generateStructures();
    }

    private generateTerrain(): void {

        for (let y = 0; y < this.gridSize.height; y++) {

            this.tiles[y] = [];

            for (let x = 0; x < this.gridSize.width; x++) {

                if (y <= 1 || x <= 1 || y >= this.gridSize.height - 2 || x >= this.gridSize.width - 2) {
                    this.tiles[y][x] = new Tile(new Phaser.Math.Vector2(x, y), TerrainDatas.Ocean);
                } else {
                    let randomTerrainData: TerrainData = TerrainDatas[TerrainTypes[this.randomGenerator.between(0, 3)]];
                    this.tiles[y][x] = new Tile(new Phaser.Math.Vector2(x, y), randomTerrainData);
                }
            }
        }
    }

    private generateStructures(): void {

        for (let c = 0; c < this.generationSettings.castlesCount; c++) {

            let chosenTile: Tile = this.getRandomTile([TerrainType.Grass, TerrainType.Forest]);
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].structureData = StructureDatas.Castle;
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].terrainData = TerrainDatas.Grass;
        }

        for (let c = 0; c < this.generationSettings.cavesCount; c++) {

            let chosenTile: Tile = this.getRandomTile([TerrainType.Mountain]);
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].structureData = StructureDatas.Cave_Entrance;
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].terrainData = TerrainDatas.Grass;

        }

        for (let f = 0; f < this.generationSettings.farmsCount; f++) {

            //TODO Farms should generate with a wheath field or paddle next to it

            let chosenTile: Tile = this.getRandomTile([TerrainType.Grass, TerrainType.Forest]);
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].structureData = StructureDatas.Farm_Hut;
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].terrainData = TerrainDatas.Grass;
        }

        for (let v = 0; v < this.generationSettings.villagesCount; v++) {

            let chosenTile: Tile = this.getRandomTile([TerrainType.Grass, TerrainType.Forest]);
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].structureData = StructureDatas.Village_Small;
            this.tiles[chosenTile.coordinates.y][chosenTile.coordinates.x].terrainData = TerrainDatas.Grass;
        }
    }

    public getTile(x: number, y: number): Tile | undefined {

        if (x >= 0 && x < this.gridSize.width && y >= 0 && y < this.gridSize.height) {
            return this.tiles[y][x];
        }

        return undefined;
    }

    public getRandomTile(terrainFilters: TerrainType[] | undefined): Tile {

        let flatTiles: Tile[] = this.tiles.flat();

        if (terrainFilters !== undefined) {
            flatTiles = flatTiles.filter(tile => terrainFilters.some(terrainFilter => tile.terrainData.name == terrainFilter));
        }

        return flatTiles[this.randomGenerator.between(0, flatTiles.length - 1)];
    }
}

