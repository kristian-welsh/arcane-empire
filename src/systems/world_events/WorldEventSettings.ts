import tornado_spritesheet_path from '../../assets/effects/tornado_spritesheet.png';
import fire_1_spritesheet_path from '../../assets/effects/fire_1_spritesheet.png';
import fire_2_spirtesheet_path from '../../assets/effects/fire_2_spritesheet.png';
import earthquake_spritesheet_path from '../../assets/effects/earthquake_spritesheet.png';
import { TerrainType } from '../world_generation/TerrainTileRecords';
import { WorldEventsSettingsCollection } from '../../types';

export const worldEventsSettings: WorldEventsSettingsCollection = {
  seed: 'default',
  spawnIntervalSec: 15,
  perEventSettings: {
    tornado: {
      type: 'tornado',
      graphics: {
        path: tornado_spritesheet_path,
        scale: 0.6,
        frameWidth: 66,
        frameHeight: 66,
        frameCount: 6,
        originX: 0.5,
        originY: 0.8,
      },
      terrainFilter: [
        TerrainType.Grass,
        TerrainType.Forest,
        TerrainType.Mountain,
      ],
      chaosRate: 1,
      chaosCapacity: 15,
      scoreDeductionPerTick: 1,
      banishmentScore: 20,
    },
    fire: {
      type: 'fire',
      graphics: {
        path: fire_1_spritesheet_path,
        scale: 0.75,
        frameWidth: 32,
        frameHeight: 32,
        frameCount: 4,
        originX: 0.45,
        originY: 0.6,
      },
      terrainFilter: [
        TerrainType.Grass,
        TerrainType.Forest,
        TerrainType.Mountain,
      ],
      chaosRate: 1,
      chaosCapacity: 15,
      scoreDeductionPerTick: 1,
      banishmentScore: 20,
    },
    earthquake: {
      type: 'earthquake',
      graphics: {
        path: earthquake_spritesheet_path,
        scale: 0.3,
        frameWidth: 200,
        frameHeight: 200,
        frameCount: 4,
        originX: 0.5,
        originY: 0.5,
      },
      terrainFilter: [TerrainType.Grass, TerrainType.Mountain],
      chaosRate: 1,
      chaosCapacity: 15,
      scoreDeductionPerTick: 1,
      banishmentScore: 20,
    },
  },
};
