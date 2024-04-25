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
}

export type WizardCounts = {
  [element in ElementType]: number;
}

export type Event = {
  name: string;
  description: string;
  difficultyRating: number;
  mission?: Mission;
  elementalEffectiveness: {
    [element in ElementType]: number;
  };
};

export type Wizard = {
  name: string;
  initials: string;
  level: number;
  status: 'idle' | 'moving' | 'away';
};

export type EmpirePersonality = 'aggressive' | 'passive' | 'friendly' | 'selfish';

export type ElementType = 'fire' | 'water' | 'earth' | 'air';
