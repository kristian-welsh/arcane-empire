import { GridSize } from "../hex_grid/HexagonGrid";
import { TerrainType, TerrainData, TerrainTypes, TerrainDatas } from "./TerrainTileRecords";

export class Tile {

    terrainData: TerrainData

    constructor(terrainType: TerrainData) {
        this.terrainData = terrainType;
    }
}

export class WorldModel {

    gridSize: GridSize;

    tiles: Tile[][];

    public constructor(gridSize: GridSize) {

        this.gridSize = gridSize;
        this.tiles = [];

        // Find a way to use the seed field

        for (let y = 0; y < this.gridSize.height; y++) {

            this.tiles[y] = [];

            for (let x = 0; x < this.gridSize.width; x++) {

                if (y <= 1 || x <= 1 || y >= this.gridSize.height - 2 || x >= this.gridSize.width - 2) {
                    this.tiles[y][x] = new Tile(TerrainDatas.Ocean);
                } else {
                    this.tiles[y][x] = new Tile(TerrainDatas[TerrainTypes[Phaser.Math.Between(0, 3)]]);
                }
            }
        }

    }

    public getTile(x: number, y: number): Tile | undefined {

        if (x >= 0 && x < this.gridSize.width && y >= 0 && y < this.gridSize.height) {
            return this.tiles[y][x];
        }

        return undefined;
    }

    public setTile(x: number, y: number, type: TerrainType): void {

        if (x >= 0 && x < this.gridSize.width && y >= 0 && y < this.gridSize.height) {
            this.tiles[y][x] = new Tile(TerrainDatas[type]);
        }
    }
}

