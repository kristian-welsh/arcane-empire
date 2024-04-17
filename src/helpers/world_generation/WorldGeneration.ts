import forest_path from "../../assets/environment/tiles/forest.png";
import grass_path from "../../assets/environment/tiles/grass.png";
import mountain_path from "../../assets/environment/tiles/mountains.png";
import ocean_path from "../../assets/environment/tiles/ocean_deep.png";
import { randomInt } from "../math/MathHelper";

// Define enum for tile types
export enum TerrainType {
    Forest,
    Grass,
    Mountain,
    Ocean
}

// Define a class for the tile
export class Tile {

    terrainType: TerrainType

    constructor(terrainType: TerrainType) {
        this.terrainType = terrainType;
    }
}

const renderingConfig = {
    tileWidth: 32,
    tileHeight: 34,
    tileScale: 2,
    scaledTileWidth: function (): number {
        return this.tileWidth * this.tileScale
    },
    scaledTileHeight: function (): number {
        return this.tileHeight * this.tileScale
    },
}

export const getTileTypeKey = (type: TerrainType) => {
    switch (type) {
        case TerrainType.Forest:
            return "Forest";
        case TerrainType.Grass:
            return "Grass";
        case TerrainType.Mountain:
            return "Mountain";
        case TerrainType.Ocean:
            return "Ocean";
    }
}

export class WorldModel {

    seed: number;
    width: number;
    height: number;
    tiles: Tile[][];

    public constructor(seed: number, width: number, height: number) {

        this.seed = seed;

        this.width = width;
        this.height = height;
        this.tiles = [];

        // Initialize the map with default tiles (grass)
        for (let y = 0; y < height; y++) {

            this.tiles[y] = [];

            for (let x = 0; x < width; x++) {
                this.tiles[y][x] = new Tile(randomInt(4));
            }
        }
    }

    // Method to get a tile at given coordinates
    public getTile(x: number, y: number): Tile | undefined {

        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.tiles[y][x];
        }

        return undefined; // Return undefined if coordinates are out of bounds
    }

    // Method to set a tile at given coordinates
    public setTile(x: number, y: number, type: TerrainType): void {

        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y][x] = new Tile(type);
        }
    }
}

export class WorldRenderer {

    scene: Phaser.Scene;
    worldModel: WorldModel;
    tilesContainer: Phaser.GameObjects.Container | undefined;

    public constructor(scene: Phaser.Scene, worldModel: WorldModel) {
        this.scene = scene;
        this.worldModel = worldModel;
    }

    public preloadWorldTiles(): void {
        this.scene.load.image(getTileTypeKey(TerrainType.Forest), forest_path);
        this.scene.load.image(getTileTypeKey(TerrainType.Grass), grass_path);
        this.scene.load.image(getTileTypeKey(TerrainType.Ocean), ocean_path);
        this.scene.load.image(getTileTypeKey(TerrainType.Mountain), mountain_path);
    }

    public drawWorld(): Phaser.GameObjects.Container {
        
        this.tilesContainer = this.scene.add.container();

        // Create images for each terain tile and group them in the map container

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            let offsetX = y % 2 == 1 ? renderingConfig.scaledTileWidth() / 2 : 0;

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {
                let tilePositionX: number = renderingConfig.scaledTileWidth() * x;
                let tilePositionY: number = renderingConfig.scaledTileHeight() * y * 0.75;

                let tileSpriteKey: string = getTileTypeKey(this.worldModel.tiles[x][y].terrainType);

                let terrainSprite: Phaser.GameObjects.Image = this.scene.add.image(tilePositionX + offsetX, tilePositionY, tileSpriteKey);
                terrainSprite.setScale(renderingConfig.tileScale);

                this.tilesContainer.add(terrainSprite);
            }
        }

        // Make the map draggable

        this.tilesContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.getTotalMapWidth(), this.getTotalMapWidth()), Phaser.Geom.Rectangle.Contains);

        this.scene.input.setDraggable([this.tilesContainer])

        this.tilesContainer.on('drag', this.onDragMap, this);

        return this.tilesContainer;
    }

    public getTotalMapWidth(): number {
        return (renderingConfig.scaledTileWidth() * (this.worldModel.tiles[0].length - 1)) + renderingConfig.scaledTileWidth() / 2;
    }

    public getTotalMapHeight(): number {
        return (renderingConfig.scaledTileHeight() * this.worldModel.tiles.length) * 0.75 - renderingConfig.scaledTileHeight() / 2;
    }

    public onDragMap(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {

        if (this.tilesContainer === undefined)
            return;

        this.tilesContainer.x = Phaser.Math.Clamp(dragX, -this.getTotalMapWidth() + this.scene.sys.canvas.width, 0);
        this.tilesContainer.y = Phaser.Math.Clamp(dragY, -this.getTotalMapHeight() + this.scene.sys.canvas.height, 0);
    }
}
