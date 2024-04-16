import forest_path from "../../assets/environment/tiles/forest.png";
import grass_path from "../../assets/environment/tiles/grass.png";
import mountain_path from "../../assets/environment/tiles/mountains.png";
import ocean_path from "../../assets/environment/tiles/ocean_deep.png";

// Define enum for tile types
enum TileType {
    Forest,
    Grass,
    Mountain,
    Ocean
}

// Define a class for the tile
class Tile {

    type: TileType

    constructor(type: TileType) {
        this.type = type;
    }
}

const renderingConfig = {
    tileWidth: 32,
    tileHeight: 34,
    tileScale: 1.75,
    scaledTileWidth: function (): number {
        return this.tileWidth * this.tileScale
    },
    scaledTileHeight: function (): number {
        return this.tileHeight * this.tileScale
    },
}

export const getTileTypeKey = (type: TileType) => {
    switch (type) {
        case TileType.Forest:
            return "Forest";
        case TileType.Grass:
            return "Grass";
        case TileType.Mountain:
            return "Mountain";
        case TileType.Ocean:
            return "Ocean";
    }
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class WorldModel {

    seed: number
    width: number
    height: number
    tiles: Tile[][]

    public constructor(seed: number, width: number, height: number) {

        this.seed = seed;

        this.width = width;
        this.height = height;
        this.tiles = [];

        // Initialize the map with default tiles (grass)
        for (let y = 0; y < height; y++) {

            this.tiles[y] = [];

            for (let x = 0; x < width; x++) {
                this.tiles[y][x] = new Tile(randomInt(0, 3));
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
    public setTile(x: number, y: number, type: TileType): void {

        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y][x] = new Tile(type);
        }
    }
}

export class WorldRenderer {

    scene: Phaser.Scene;
    worldModel: WorldModel;

    public constructor(scene: Phaser.Scene, worldModel: WorldModel) {
        this.scene = scene;
        this.worldModel = worldModel;
    }

    public preloadWorldTiles(): void {
        this.scene.load.image("Forest", forest_path);
        this.scene.load.image("Grass", grass_path);
        this.scene.load.image("Ocean", ocean_path);
        this.scene.load.image("Mountain", mountain_path);

    }

    public drawWorld(): void {

        for (let y = 0; y < this.worldModel.tiles.length; y++) {

            let offsetX = y % 2 == 1 ? renderingConfig.scaledTileWidth() / 2 : 0;

            for (let x = 0; x < this.worldModel.tiles[y].length; x++) {
                let tilePositionX: number = renderingConfig.scaledTileWidth() * x;
                let tilePositionY: number = renderingConfig.scaledTileHeight() * y * 0.75;

                let tileSpriteKey: string = getTileTypeKey(this.worldModel.tiles[x][y].type);

                this.scene.add.image(tilePositionX + offsetX, tilePositionY, tileSpriteKey).setScale(renderingConfig.tileScale);
            }
        }
    }
}
