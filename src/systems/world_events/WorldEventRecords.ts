import tornado_spirtesheet_path from '../../assets/effects/tornado_spritesheet.png';
import fire_1_spirtesheet_path from '../../assets/effects/fire_1_spritesheet.png';
import fire_2_spirtesheet_path from '../../assets/effects/fire_2_spritesheet.png';
import earthquake_spirtesheet_path from '../../assets/effects/earthquake_spritesheet.png';
import { TerrainType } from '../world_generation/TerrainTileRecords';
import { StructureType } from '../world_generation/StructureRecords';

export enum WorldEventType {
  Tornado = 'Tornado',
  Fire = 'Fire',
  Earthquake = 'Earthquake',
}

export type WorldEventData = {
  type: WorldEventType;
  path: string;
  scale: number;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  originX: number;
  originY: number;
  terrainFilter?: TerrainType[];
  structureFilter?: StructureType[];
  chaosRate: number;
  chaosCapacity: number;
};

export const WorldEventTypes: (keyof typeof WorldEventType)[] = <
  (keyof typeof WorldEventType)[]
>Object.keys(WorldEventType);

export const WorldEventDatas: Record<WorldEventType, WorldEventData> = {
  [WorldEventType.Tornado]: {
    type: WorldEventType.Tornado,
    path: tornado_spirtesheet_path,
    scale: 0.6,
    frameWidth: 66,
    frameHeight: 66,
    frameCount: 6,
    originX: 0.5,
    originY: 0.8,
    terrainFilter: [
      TerrainType.Grass,
      TerrainType.Forest,
      TerrainType.Mountain,
    ],
    chaosRate: 1,
    chaosCapacity: 10,
  },
  [WorldEventType.Fire]: {
    type: WorldEventType.Fire,
    path: fire_1_spirtesheet_path,
    scale: 0.75,
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    originX: 0.45,
    originY: 0.6,
    terrainFilter: [
      TerrainType.Grass,
      TerrainType.Forest,
      TerrainType.Mountain,
    ],
    chaosRate: 1,
    chaosCapacity: 10,
  },
  [WorldEventType.Earthquake]: {
    type: WorldEventType.Earthquake,
    path: earthquake_spirtesheet_path,
    scale: 0.3,
    frameWidth: 200,
    frameHeight: 200,
    frameCount: 4,
    originX: 0.5,
    originY: 0.5,
    terrainFilter: [TerrainType.Grass, TerrainType.Mountain],
    chaosRate: 1,
    chaosCapacity: 10,
  },
};
