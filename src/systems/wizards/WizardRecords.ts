import fire_wizard_path from "../../assets/wizards/wizard_red.png";
import water_wizard_path from "../../assets/wizards/wizard_blue.png";
import earth_wizard_path from "../../assets/wizards/wizard_brown.png";
import air_wizard_path from "../../assets/wizards/wizard_white.png";

export enum ElementalPower {
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

export type WizardData = {
    power: ElementalPower;
    path: string;
    scale: number;
};

export const ElementalPowers: (keyof typeof ElementalPower)[] = <(keyof typeof ElementalPower)[]>Object.keys(ElementalPower);

export const WizardDatas: Record<ElementalPower, WizardData> = {
    fire: {
        power: ElementalPower.Fire,
        path: fire_wizard_path,
        scale: 0.75,
    },
    water: {
        power: ElementalPower.Water,
        path: water_wizard_path,
        scale: 0.75,
    },
    earth: {
        power: ElementalPower.Earth,
        path: earth_wizard_path,
        scale: 0.75,
    },
    air: {
        power: ElementalPower.Air,
        path: air_wizard_path,
        scale: 0.75,
    },
};