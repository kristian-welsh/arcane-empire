import tornado_spritesheet_path from '../../assets/effects/tornado_spritesheet.png';
import fire_1_spritesheet_path from '../../assets/effects/fire_1_spritesheet.png';
import fire_2_spirtesheet_path from '../../assets/effects/fire_2_spritesheet.png';
import earthquake_spritesheet_path from '../../assets/effects/earthquake_spritesheet.png';
import { TerrainType } from '../world_generation/TerrainTileRecords';
import { WorldEventsSettingsCollection } from '../../types';

export const worldEventsSettings: WorldEventsSettingsCollection = {
  seed: 'default',
  spawnIntervalSec: 5,
  perEventSettings: {
    tornado: {
      type: 'tornado',
      path: tornado_spritesheet_path,
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
      scoreDeductionPerTick: 1,
    },
    fire: {
      type: 'fire',
      path: fire_1_spritesheet_path,
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
      scoreDeductionPerTick: 1,
    },
    earthquake: {
      type: 'earthquake',
      path: earthquake_spritesheet_path,
      scale: 0.3,
      frameWidth: 200,
      frameHeight: 200,
      frameCount: 4,
      originX: 0.5,
      originY: 0.5,
      terrainFilter: [TerrainType.Grass, TerrainType.Mountain],
      chaosRate: 1,
      chaosCapacity: 10,
      scoreDeductionPerTick: 1,
    },
  },
};
