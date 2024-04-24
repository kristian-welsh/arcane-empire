import { lerp } from "../../helpers";
import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { Tile } from "../world_generation/WorldModel";
import { WizardEntity } from "./Wizard";


export class MovementAction {

    hexGrid: HexagonGrid;

    wizard: WizardEntity;

    startTile: Tile;
    endTile: Tile;

    startPixelPosition: Phaser.Math.Vector2;
    endPixelPosition: Phaser.Math.Vector2;

    speed: number;

    distance: number;
    time: number;

    progress: number;

    complete: boolean;
    completeCallback: () => void;

    constructor(hexGrid: HexagonGrid, wizard: WizardEntity, startTile: Tile, endTile: Tile, speed: number, completeCallback: () => void) {

        this.hexGrid = hexGrid;

        this.wizard = wizard;

        this.startTile = startTile;
        this.endTile = endTile;

        this.startPixelPosition = this.hexGrid.convertGridHexToPixelHex(startTile.coordinates);
        this.endPixelPosition = this.hexGrid.convertGridHexToPixelHex(endTile.coordinates);

        this.speed = speed;

        this.distance = this.startPixelPosition.distance(this.endPixelPosition);
        this.time = this.distance / this.speed;

        this.progress = 0;

        this.complete = false;
        this.completeCallback = completeCallback;
    }

    public update(deltaTimeMs: number) {

        if (this.complete)
            return;

        this.progress += deltaTimeMs / 1000;

        if (this.progress >= this.time) {

            this.complete = true;
            this.completeCallback();
            return;
        }

        let wizardPosition = lerp(this.startPixelPosition, this.endPixelPosition, this.progress / this.time);

        let wizardImage = this.wizard.getImage();

        wizardImage.x = wizardPosition.x + this.hexGrid.getContainer().x;
        wizardImage.y = wizardPosition.y + this.hexGrid.getContainer().y;

        wizardImage.depth = wizardImage.y;


    }


}