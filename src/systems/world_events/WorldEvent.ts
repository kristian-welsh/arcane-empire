import { ProgressBar } from "../overlay_elements/ProgressBar";
import { BarFillColour, CreateProgressBar } from "../overlay_elements/OverlayElementsFactory";
import { Tile } from "../world_generation/WorldModel";
import { WorldEventData } from "./WorldEventRecords";
import { WorldEventsManager } from "./WorldEventsManager";

export class WorldEvent {

    worldEventManager: WorldEventsManager;

    eventData: WorldEventData;
    targetTile: Tile;

    sprite: Phaser.GameObjects.Sprite;

    chaos: number;
    chaosProgressBar: ProgressBar;

    constructor(worldEventManager: WorldEventsManager, eventData: WorldEventData, targetTile: Tile) {

        this.worldEventManager = worldEventManager;

        this.eventData = eventData;
        this.targetTile = targetTile;

        this.sprite = this.worldEventManager.scene.add.sprite(0, 0, eventData.type + "_spritesheet");

        this.sprite.setOrigin(eventData.originX, eventData.originY);
        this.sprite.setScale(this.worldEventManager.hexGrid.hexScale * eventData.scale);
        this.sprite.play(eventData.type + "_animation");

        this.chaos = 0;
        this.chaosProgressBar = CreateProgressBar(worldEventManager.scene, 0, 0, 0, BarFillColour.Red, 0.5);
    }

    public update(deltaTimeMs: number, mapOffset: Phaser.Math.Vector2): void {

        this.chaos = Phaser.Math.Clamp(this.chaos + (deltaTimeMs / 1000), 0, this.eventData.chaosCapacity);

        let tilePixelPosition = this.worldEventManager.hexGrid.convertGridHexToPixelHex(this.targetTile.coordinates);

        this.sprite.x = tilePixelPosition.x + mapOffset.x;
        this.sprite.y = tilePixelPosition.y + mapOffset.y;

        this.sprite.depth = this.sprite.y;

        this.chaosProgressBar.setFilledPercentage(this.chaos / this.eventData.chaosCapacity);
        this.chaosProgressBar.setPosition(tilePixelPosition.x + mapOffset.x, tilePixelPosition.y + mapOffset.y + 25);

        this.chaosProgressBar.setDepth(this.sprite.depth + 10000);
    }

    public atMaxPower(): boolean {

        return this.chaos >= this.eventData.chaosCapacity;
    }
}