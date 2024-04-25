import progress_bar_empty_path from "../../assets/ui/bar_empty.png";
import progress_bar_fill_red_path from "../../assets/ui/bar_fill_red.png";
import quest_marker_path from "../../assets/ui/quest_icon.png";

import { ProgressBar } from "./ProgressBar";
import { QuestMarker } from "./QuestMarker";

export enum BarFillColour {
    Red = "red",
}

export const PreloadOverlayAssets = (scene: Phaser.Scene) => {

    scene.load.image("progress_bar_empty", progress_bar_empty_path);
    scene.load.image("progress_bar_fill_red", progress_bar_fill_red_path);

    scene.load.image("quest_marker", quest_marker_path);
}

export const CreateProgressBar = (scene: Phaser.Scene, initialFill: number, x: number, y: number, fillColour: BarFillColour, scale: number): ProgressBar => {

    let fillImageKey = "progress_bar_fill_" + fillColour;

    let barFillImage = scene.add.image(x, y, fillImageKey);
    let barEmptyImage = scene.add.image(x, y, "progress_bar_empty");

    barFillImage.setOrigin(0, 0.5);

    return new ProgressBar(initialFill, x, y, barEmptyImage, barFillImage, scale);
}

export const CreateQuestMarker = (scene: Phaser.Scene, x: number, y: number, scale: number): QuestMarker => {

    let markerImage = scene.add.image(x, y, "quest_marker");

    return new QuestMarker(x, y, markerImage, scale);
}
