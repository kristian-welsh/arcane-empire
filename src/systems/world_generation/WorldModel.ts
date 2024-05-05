import { eventEmitter } from '../../events/EventEmitter';
import { GridSize, HexagonGrid } from '../hex_grid/HexagonGrid';
import { WizardEntity } from '../wizards/Wizard';
import {
  StructureData,
  StructureDatas,
  StructureType,
} from './StructureRecords';
import {
  TerrainType,
  TerrainData,
  TerrainTypes,
  TerrainDatas,
} from './TerrainTileRecords';

export interface GenerationSettings {
  seed: string;
  fortsCount: number;
  cavesCount: number;
  farmsCount: number;
  villagesCount: number;
  wizardTowersCount: number;
}

export class Tile {
  parentWorldModel: WorldModel;

  coordinates: Phaser.Math.Vector2;
  terrainData: TerrainData;
  structureData: StructureData | undefined;

  terrainImage: Phaser.GameObjects.Image | undefined;

  wizardSlots: WizardEntity[];

  constructor(
    parentWorldModel: WorldModel,
    coordinates: Phaser.Math.Vector2,
    terrainType: TerrainData
  ) {
    this.parentWorldModel = parentWorldModel;
    this.coordinates = coordinates;
    this.terrainData = terrainType;

    this.wizardSlots = [];
  }

  public getWizardCapacity(): number {
    return 5 - this.wizardSlots.length; // Hard coded 5 slots for now but should probably be in a setting somewhere
  }

  public setImage(terrainImage: Phaser.GameObjects.Image): void {
    this.terrainImage = terrainImage;
    this.makeInteractive();
  }

  public makeInteractive(): void {
    if (!this.terrainImage) {
      return;
    }
    this.terrainImage.setInteractive();

    this.terrainImage.on('pointerup', () => {
      if (!this.parentWorldModel.hexGrid.isDragging) {
        eventEmitter.emit('tile-clicked', this);
      }
    });

    this.terrainImage.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.preventDefault();
      this.parentWorldModel.hexGrid.isDragging = true;
      this.parentWorldModel.hexGrid.dragStartX = pointer.position.x;
      this.parentWorldModel.hexGrid.dragStartY = pointer.position.y;
    });

    this.terrainImage.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.parentWorldModel.hexGrid.isDragging) {
        const dx =
          pointer.position.x - this.parentWorldModel.hexGrid.dragStartX;
        const dy =
          pointer.position.y - this.parentWorldModel.hexGrid.dragStartY;
        this.parentWorldModel.hexGrid.dragMap(dx, dy);
        this.parentWorldModel.hexGrid.dragStartX = pointer.position.x;
        this.parentWorldModel.hexGrid.dragStartY = pointer.position.y;
      }
    });

    this.terrainImage.on('pointerup', () => {
      this.parentWorldModel.hexGrid.isDragging = false;
    });

    this.terrainImage.on('pointerup', () => {
      if (!this.parentWorldModel.hexGrid.isDragging) {
        eventEmitter.emit('tile-clicked', this);
      }
    });
  }
}

export class WorldModel {
  gridSize: GridSize;
  generationSettings: GenerationSettings;

  hexGrid: HexagonGrid;
  tiles: Tile[][];

  randomGenerator: Phaser.Math.RandomDataGenerator;

  public constructor(
    hexGrid: HexagonGrid,
    gridSize: GridSize,
    generationSettings: GenerationSettings
  ) {
    this.hexGrid = hexGrid;
    this.gridSize = gridSize;
    this.generationSettings = generationSettings;

    this.randomGenerator = new Phaser.Math.RandomDataGenerator([
      generationSettings.seed,
    ]);

    // Pre fill with ocean

    this.tiles = [];

    for (let x = 0; x < this.gridSize.width; x++) {
      this.tiles[x] = [];

      for (let y = 0; y < this.gridSize.height; y++) {
        this.tiles[x][y] = new Tile(
          this,
          new Phaser.Math.Vector2(x, y),
          TerrainDatas.Ocean
        );
      }
    }

    this.generateTerrain();

    this.generateStructures();
  }

  private generateTerrain(): void {
    for (let x = 0; x < this.gridSize.width; x++) {
      for (let y = 0; y < this.gridSize.height; y++) {
        if (
          y <= 1 ||
          x <= 1 ||
          y >= this.gridSize.height - 2 ||
          x >= this.gridSize.width - 2
        ) {
          this.tiles[x][y] = new Tile(
            this,
            new Phaser.Math.Vector2(x, y),
            TerrainDatas.Ocean
          );
        } else {
          let randomTerrainData: TerrainData =
            TerrainDatas[TerrainTypes[this.randomGenerator.between(0, 3)]];
          this.tiles[x][y] = new Tile(
            this,
            new Phaser.Math.Vector2(x, y),
            randomTerrainData
          );
        }
      }
    }
  }

  private generateStructures(): void {
    for (let c = 0; c < this.generationSettings.fortsCount; c++) {
      let chosenTile: Tile = this.getRandomTile(
        StructureDatas.Fort.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Fort;

      if (StructureDatas.Fort.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }

    for (let c = 0; c < this.generationSettings.cavesCount; c++) {
      let chosenTile: Tile = this.getRandomTile(
        StructureDatas.Cave_Entrance.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Cave_Entrance;

      if (StructureDatas.Castle.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }

    for (let f = 0; f < this.generationSettings.farmsCount; f++) {
      let chosenTile: Tile = this.getRandomTile(
        StructureDatas.Farm_Hut.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Farm_Hut;

      if (StructureDatas.Castle.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }

      let neighbourHexes: Phaser.Math.Vector2[] =
        this.hexGrid.getNeighbouringHexes(chosenTile.coordinates);
      let chosenFieldTile: Tile | undefined = this.getTile(
        neighbourHexes[
          this.randomGenerator.between(0, neighbourHexes.length - 1)
        ]
      );

      if (chosenFieldTile !== undefined) {
        chosenFieldTile.terrainData = TerrainDatas.Grass;
        chosenFieldTile.structureData = StructureDatas.Wheat_Farm;
      }
    }

    for (let v = 0; v < this.generationSettings.villagesCount; v++) {
      let chosenTile: Tile = this.getRandomTile(
        StructureDatas.Village_Small.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Village_Small;

      if (StructureDatas.Castle.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }

    for (let c = 0; c < this.generationSettings.wizardTowersCount; c++) {
      let chosenTile: Tile = this.getRandomTile(
        StructureDatas.Wizard_Tower.terrain_filter
      );
      chosenTile.structureData = StructureDatas.Wizard_Tower;

      if (StructureDatas.Wizard_Tower.flatten_terrain) {
        chosenTile.terrainData = TerrainDatas.Grass;
      }
    }
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
