import progress_bar_empty_path from "../../assets/ui/bar_empty.png";
import progress_bar_fill_red_path from "../../assets/ui/bar_fill_red.png";
import { ProgressBar } from "./ProgressBar";


export enum BarFillColour {
    Red = "red",
}

export const PreloadProgressBarsForScene = (scene: Phaser.Scene) => {

    scene.load.image("progress_bar_empty", progress_bar_empty_path);
    scene.load.image("progress_bar_fill_red", progress_bar_fill_red_path);
}

export const CreateProgressBar = (scene: Phaser.Scene, initialFill: number, x: number, y: number, fillColour: BarFillColour, scale: number): ProgressBar => {

    let fillImageKey = "progress_bar_fill_" + fillColour;

    let barFillImage = scene.add.image(x, y, fillImageKey);
    let barEmptyImage = scene.add.image(x, y, "progress_bar_empty");

    barFillImage.setOrigin(0, 0.5);

    return new ProgressBar(initialFill, x, y, barEmptyImage, barFillImage, scale);
}
