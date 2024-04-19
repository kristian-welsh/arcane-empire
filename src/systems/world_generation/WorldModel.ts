import { MapLayout } from "../../types";
import { TerrainType, TerrainData, TerrainTypes, TerrainDatas } from "./TerrainTileRecords";

export class Tile {

    terrainData: TerrainData

    constructor(terrainType: TerrainData) {
        this.terrainData = terrainType;
    }
}

export class WorldModel {

    mapLayout: MapLayout;

    tiles: Tile[][];

    public constructor(mapLayoutConfig: MapLayout) {

        this.mapLayout = mapLayoutConfig;
        this.tiles = [];

        // Find a way to use the seed field

        for (let y = 0; y < this.mapLayout.height; y++) {

            this.tiles[y] = [];


            for (let x = 0; x < this.mapLayout.width; x++) {
                this.tiles[y][x] = new Tile(TerrainDatas[TerrainTypes[Phaser.Math.Between(0, 3)]]);
            }
        }
    }

    public getTile(x: number, y: number): Tile | undefined {

        if (x >= 0 && x < this.mapLayout.width && y >= 0 && y < this.mapLayout.height) {
            return this.tiles[y][x];
        }

        return undefined;
    }

    public setTile(x: number, y: number, type: TerrainType): void {

        if (x >= 0 && x < this.mapLayout.width && y >= 0 && y < this.mapLayout.height) {
            this.tiles[y][x] = new Tile(TerrainDatas[type]);
        }
    }
}

