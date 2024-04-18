import forest_path from "../../assets/environment/tiles/forest.png";
import grass_path from "../../assets/environment/tiles/grass.png";
import mountain_path from "../../assets/environment/tiles/mountains.png";
import ocean_path from "../../assets/environment/tiles/ocean_deep.png";
import { randomInt } from "../../helpers/math/MathHelper";

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
    tileSpriteWidth: 32,
    tileSpriteHeight: 34,
    horizontallyDisplayedTileCount: 20,
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

        this.scene.load.image(getTileTypeKey(TerrainType.Forest), forest_path);
        this.scene.load.image(getTileTypeKey(TerrainType.Grass), grass_path);
        this.scene.load.image(getTileTypeKey(TerrainType.Ocean), ocean_path);
        this.scene.load.image(getTileTypeKey(TerrainType.Mountain), mountain_path);
    }

    public drawWorld(): Phaser.GameObjects.Container {

        this.tileScale = this.scene.sys.canvas.width / (renderingConfig.horizontallyDisplayedTileCount * renderingConfig.tileSpriteWidth);

        this.draggableContainer = this.scene.add.container();

        // Create images for each terain tile and group them in the map container

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {

                let pixelPosition: Phaser.Math.Vector2 = this.convertGridToPixelCoords(x, y);

                let tileSpriteKey: string = getTileTypeKey(this.worldModel.tiles[x][y].terrainType);

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

        let offsetX = y % 2 == 1 ? (this.tileScale * renderingConfig.tileSpriteWidth) / 2 : 0;

        let tilePositionX: number = ((this.tileScale * renderingConfig.tileSpriteWidth) * x) + offsetX;
        let tilePositionY: number = (this.tileScale * renderingConfig.tileSpriteHeight) * y * 0.75;

        return new Phaser.Math.Vector2(tilePositionX, tilePositionY);
    }

    public getTotalMapWidth(): number {
        return ((this.tileScale * renderingConfig.tileSpriteWidth) * (this.worldModel.tiles[0].length - 1)) + (this.tileScale * renderingConfig.tileSpriteWidth) / 2;
    }

    public getTotalMapHeight(): number {
        return ((this.tileScale * renderingConfig.tileSpriteHeight) * this.worldModel.tiles.length) * 0.75 - (this.tileScale * renderingConfig.tileSpriteHeight) / 2;
    }

    public onDragMap(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {

        if (this.draggableContainer === undefined)
            return;

        this.draggableContainer.x = Phaser.Math.Clamp(dragX, -this.getTotalMapWidth() + this.scene.sys.canvas.width, 0);
        this.draggableContainer.y = Phaser.Math.Clamp(dragY, -this.getTotalMapHeight() + this.scene.sys.canvas.height, 0);
    }
}
