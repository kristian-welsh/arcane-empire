import { GridSize, HexagonGrid } from '../hex_grid/HexagonGrid';
import { StructureDatas, StructureType } from './StructureRecords';
import {
  TerrainType,
  TerrainData,
  TerrainTypes,
  TerrainDatas,
} from './TerrainTileRecords';
import { Tile } from './Tile';

export interface GenerationSettings {
  seed: string;
  fortsCount: number;
  cavesCount: number;
  farmsCount: number;
  villagesCount: number;
  wizardTowersCount: number;
}

export class UniformDistributionGenerator {
  generationSettings: GenerationSettings;
  randomGenerator: Phaser.Math.RandomDataGenerator;

  public constructor(
    generationSettings: GenerationSettings,
    gridSize: GridSize
  ) {
    this.generationSettings = generationSettings;
    this.gridSize = gridSize;
    this.randomGenerator = new Phaser.Math.RandomDataGenerator([generationSettings.seed]);
  }

  public generate(hexGrid: HexagonGrid): WorldModel {
    const world = new WorldModel(hexGrid, this.gridSize, this.randomGenerator)

    // todo: first tile parameter is tangling the worldgen with world model, refactor

    this.placeTerrain(world);
    this.placeStructures(world);
    return world;
  }

  public placeTerrain(world: WorldModel, gridSize: Phaser.Math.Vector2): Tile[][] {
    const { width, height }: {width: number, height: number} = this.gridSize;
    // Pre fill with ocean
    const tiles = [];
    for (let x = 0; x < width; x++) {
      tiles[x] = [];
      for (let y = 0; y < height; y++) {
        tiles[x][y] = new Tile(
          world,
          new Phaser.Math.Vector2(x, y),
          TerrainDatas.Ocean
        );
      }
    }

    // generate terrain
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (
          y <= 1 ||
          x <= 1 ||
          y >= height - 2 ||
          x >= width - 2
        ) {
          tiles[x][y] = new Tile(
            world,
            new Phaser.Math.Vector2(x, y),
            TerrainDatas.Ocean
          );
        } else {
          let randomTerrainData: TerrainData =
            TerrainDatas[TerrainTypes[this.randomGenerator.between(0, 3)]];
          tiles[x][y] = new Tile(
            world,
            new Phaser.Math.Vector2(x, y),
            randomTerrainData
          );
        }
      }
    }
    world.updateTerrain(tiles);
    return tiles;
  }

  public placeStructures(world: WorldModel): void {
    let { fortsCount, cavesCount, farmsCount, villagesCount, wizardTowersCount } = this.generationSettings;
    // forts
    for (let f = 0; f < fortsCount; f++) {
      let chosenTile: Tile = world.getRandomTile(
        StructureDatas.Fort.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Fort;

      if (StructureDatas.Fort.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }
    // caves
    for (let c = 0; c < cavesCount; c++) {
      let chosenTile: Tile = world.getRandomTile(
        StructureDatas.Cave_Entrance.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Cave_Entrance;

      if (StructureDatas.Castle.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }
    // farms
    for (let f = 0; f < farmsCount; f++) {
      let chosenTile: Tile = world.getRandomTile(
        StructureDatas.Farm_Hut.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Farm_Hut;

      if (StructureDatas.Castle.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }

      let neighbourHexes: Phaser.Math.Vector2[] =
        world.hexGrid.getNeighbouringHexes(chosenTile.coordinates);
      let chosenFieldTile: Tile | undefined = world.getTile(
        neighbourHexes[
          this.randomGenerator.between(0, neighbourHexes.length - 1)
        ]
      );

      if (chosenFieldTile !== undefined) {
        chosenFieldTile.terrainData = TerrainDatas.Grass;
        chosenFieldTile.structureData = StructureDatas.Wheat_Farm;
      }
    }
    // villages
    for (let v = 0; v < villagesCount; v++) {
      let chosenTile: Tile = world.getRandomTile(
        StructureDatas.Village_Small.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Village_Small;

      if (StructureDatas.Castle.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }
    // wizard towers
    for (let w = 0; w < wizardTowersCount; w++) {
      let chosenTile: Tile = world.getRandomTile(
        StructureDatas.Wizard_Tower.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Wizard_Tower;

      if (StructureDatas.Wizard_Tower.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }
  }
}

export class WorldModel {
  hexGrid: HexagonGrid;
  gridSize: GridSize;
  randomGenerator: Phaser.Math.RandomDataGenerator;
  tiles: Tile[][];

  public constructor(
    hexGrid: HexagonGrid,
    gridSize: GridSize,
    randomGenerator: Phaser.Math.RandomDataGenerator
  ) {
    this.hexGrid = hexGrid;
    this.gridSize = gridSize;
    this.randomGenerator = randomGenerator;
    // WARNING, object is not fully initialized until updateTerrain is called
  }

  public updateTerrain(tiles: Tile[][]): void {
    this.tiles = tiles;
  }


  public getTile(coord: Phaser.Math.Vector2): Tile {
    if (
      coord.x < 0 ||
      coord.x >= this.gridSize.width ||
      coord.y < 0 ||
      coord.y >= this.gridSize.height
    )
      throw 'Tile coordinates are out of bounds';

    return this.tiles[coord.x][coord.y];
  }

  public getNeighbouringTiles(centreTile: Tile): Tile[] {
    let neighbourHexes: Phaser.Math.Vector2[] =
      this.hexGrid.getNeighbouringHexes(centreTile.coordinates);

    let neighbourTiles: Tile[] = [];

    for (let i = 0; i < neighbourHexes.length; i++) {
      neighbourTiles[i] = this.tiles[neighbourHexes[i].x][neighbourHexes[i].y];
    }

    return neighbourTiles;
  }

  public forEachTile(func: (x: number, y: number, tile: Tile) => void) {
    for (let x = 0; x < this.gridSize.width; x++) {
      for (let y = 0; y < this.gridSize.height; y++) {
        func(x, y, this.tiles[x][y]);
      }
    }
  }

  public getRandomTile(
    terrainFilters: TerrainType[] | undefined = undefined,
    sturctureFilters: StructureType[] | undefined = undefined
  ): Tile {
    let flatTiles: Tile[] = this.tiles.flat();

    if (terrainFilters !== undefined) {
      flatTiles = flatTiles.filter((tile) =>
        terrainFilters.some(
          (terrainFilter) => tile.terrainData.name == terrainFilter
        )
      );
    }

    if (sturctureFilters !== undefined) {
      flatTiles = flatTiles.filter((tile) =>
        sturctureFilters.some(
          (sturctureFilter) =>
            tile.structureData !== undefined &&
            tile.structureData.name == sturctureFilter
        )
      );
    }

    return flatTiles[this.randomGenerator.between(0, flatTiles.length - 1)];
  }
}
