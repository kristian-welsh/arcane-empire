import { EmpireSettings } from '../systems/empires/EmpireSystem';
import { GridSize } from '../systems/hex_grid/HexagonGrid';
import { WizardSetings } from '../systems/wizards/WizardManager';
import { WorldEventSettings } from '../systems/world_events/WorldEventsManager';
import { GenerationSettings } from '../systems/world_generation/WorldModel';

// Temp till we get a game setup menu
export const defaultGridSize: GridSize = {
  width: 40,
  height: 30,
};

export const defaultGenerationSettings: GenerationSettings = {
  seed: 'default',
  fortsCount: 8,
  cavesCount: 4,
  farmsCount: 14,
  villagesCount: 14,
  wizardTowersCount: 1,
};

export const defaultEmpireSettings: EmpireSettings = {
  seed: 'default',
  numberOfEmpires: 4,
  minStartSize: 10,
  maxStartSize: 22,
  minSeparationDistance: 12,
};

export const defaultWizardSettings: WizardSetings = {
  seed: 'default',
  numberOfWizaards: {
    fire: 1,
    water: 2,
    earth: 1,
    air: 1,
  },
};

export const defaultWorldEventSettings: WorldEventSettings = {
  seed: 'default',
  eventIntervalSec: 5,
  scoreDecreasePerEvent: 1,
};

export const empireColours = [
  0x43fa00, // Green
  0xfae102, // Yellow
  0x00e5fa, // Cyan
  0xfa0f02, // Red
  0xfa6d02, // Orange
  0xfa02b8, // Magenta
];
