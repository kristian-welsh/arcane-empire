export type GameData = any;

export type WizardCollection = {
  [element in ElementType]: Wizard[];
};

export type Wizard = {
  name: string;
  status: 'idle' | 'away';
};

export type ElementType = 'fire' | 'water' | 'earth' | 'air';
