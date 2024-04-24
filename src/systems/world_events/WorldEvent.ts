import { Tile } from "../world_generation/WorldModel";
import { WorldEventData } from "./WorldEventRecords";
import { WorldEventsManager } from "./WorldEventsManager";

export class WorldEvent {

    worldEventManager: WorldEventsManager;

    eventData: WorldEventData;
    targetTile: Tile;

    sprite: Phaser.GameObjects.Sprite;

    constructor(worldEventManager: WorldEventsManager, eventData: WorldEventData, targetTile: Tile) {

        this.worldEventManager = worldEventManager;

        this.eventData = eventData;
        this.targetTile = targetTile;

        this.sprite = this.worldEventManager.scene.add.sprite(0, 0, eventData.type + "_spritesheet");

        this.sprite.setOrigin(eventData.originX, eventData.originY);
        this.sprite.setScale(this.worldEventManager.hexGrid.hexScale * eventData.scale);
        this.sprite.play(eventData.type + "_animation");
    }

    public updatePosition(mapOffset: Phaser.Math.Vector2): void {

        let tilePixelPosition = this.worldEventManager.hexGrid.convertGridHexToPixelHex(this.targetTile.coordinates);

        this.sprite.x = tilePixelPosition.x + mapOffset.x;
        this.sprite.y = tilePixelPosition.y + mapOffset.y;

        this.sprite.depth = this.sprite.y;
    }
}