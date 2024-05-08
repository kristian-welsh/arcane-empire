import { WizardEntity } from '../systems/wizards/Wizard';
import { WorldEvent } from '../systems/world_events/WorldEvent';
import { StructureData } from '../systems/world_generation/StructureRecords';
import { TerrainData } from '../systems/world_generation/TerrainTileRecords';
import { WorldModel } from '../systems/world_generation/WorldModel';

export type GameData = null | {
  wizards: WizardCollection;
  empires: EmpireCollection;
  tower: Tower;
  playerGold: number;
  reputation: number;
  upgrades: {
    [key: string]: boolean;
  };
  events: Event[];
};

export type WizardCollection = {
  [element in ElementType]: Wizard[];
};

export type TileType = {
  parentWorldModel: WorldModel;
  coordinates: Phaser.Math.Vector2;
  terrainData: TerrainData;
  structureData: StructureData | undefined;
  terrainImage: Phaser.GameObjects.Image | undefined;
  wizardSlots: WizardEntity[];
  currentEvent: WorldEvent | null;
  getWizardCapacity: () => number;
  setImage: (terrainImage: Phaser.GameObjects.Image) => void;
  makeInteractive: () => void;
};

export type EmpireCollection = Empire[];

export type Empire = {
  empireName: string;
  capitalName: string;
  rulerName: string;
  regionalStrength: number;
  playerReputation: number;
  personality: EmpirePersonality;
  color: number;
};

export type Mission = {
  name: string;
  empireName: string;
  description: string;
  reward: number;
  status: 'available' | 'in-progress' | 'completed';
};

export type Tower = {
  baseWizardCost: number;
  perExtraWizardCost: number;
  wizardCapacities: WizardCounts;
};

export type WizardCounts = {
  [element in ElementType]: number;
};

/* WorldEvent is used for events at the moment */
// export type EventType = {
//   name: string;
//   description: string;
//   difficultyRating: number;
//   mission?: Mission;
//   elementalEffectiveness: {
//     [element in ElementType]: number;
//   };
// };

export type Wizard = {
  name: string;
  initials: string;
  level: number;
  status: 'idle' | 'moving' | 'away';
};

export type EmpirePersonality =
  | 'aggressive'
  | 'passive'
  | 'friendly'
  | 'selfish';

export type ElementType = 'fire' | 'water' | 'earth' | 'air';
