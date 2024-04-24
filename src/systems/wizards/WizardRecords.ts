import fire_wizard_path from "../../assets/wizards/wizard_red.png";
import water_wizard_path from "../../assets/wizards/wizard_blue.png";
import earth_wizard_path from "../../assets/wizards/wizard_brown.png";
import air_wizard_path from "../../assets/wizards/wizard_white.png";

export enum WizardType {
    Fire = "fire",
    Water = "water",
    Earth = "earth",
    Air = "air"
}

export interface WizardCounts {
    fire: number;
    water: number;
    earth: number;
    air: number;
    //ice: number;
    //nature: number;
    //lightning: number;
    //metal: number;
}

export type WizardGraphicData = {
    power: WizardType;
    path: string;
    scale: number;
};

export const WizardTypes: (keyof typeof WizardType)[] = <(keyof typeof WizardType)[]>Object.keys(WizardType);

export const WizardGraphicDatas: Record<WizardType, WizardGraphicData> = {
    [WizardType.Fire]: {
        power: WizardType.Fire,
        path: fire_wizard_path,
        scale: 0.75,
    },
    [WizardType.Water]: {
        power: WizardType.Water,
        path: water_wizard_path,
        scale: 0.75,
    },
    [WizardType.Earth]: {
        power: WizardType.Earth,
        path: earth_wizard_path,
        scale: 0.75,
    },
    [WizardType.Air]: {
        power: WizardType.Air,
        path: air_wizard_path,
        scale: 0.75,
    },
};