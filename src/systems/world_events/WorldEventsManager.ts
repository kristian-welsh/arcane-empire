import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { TerrainType } from "../world_generation/TerrainTileRecords";
import { Tile, WorldModel } from "../world_generation/WorldModel";
import { WorldEvent } from "./WorldEvent";
import { WorldEventData, WorldEventDatas, WorldEventType, WorldEventTypes } from "./WorldEventRecords";

export interface WorldEventSettings {
    seed: string;
    eventIntervalSec: number;
}

export class WorldEventsManager {

    scene: Phaser.Scene;
    randomGenerator: Phaser.Math.RandomDataGenerator;

    hexGrid: HexagonGrid;
    worldModel: WorldModel;

    worldEventSettings: WorldEventSettings

    activeEvents: WorldEvent[];

    constructor(scene: Phaser.Scene, hexGrid: HexagonGrid, worldModel: WorldModel, worldEventSettings: WorldEventSettings) {

        this.scene = scene;
        this.randomGenerator = new Phaser.Math.RandomDataGenerator([worldEventSettings.seed]);

        this.hexGrid = hexGrid;
        this.worldModel = worldModel;

        this.worldEventSettings = worldEventSettings;

        this.activeEvents = [];
    }

    public preload(): void {

        Object.entries(WorldEventDatas).forEach(([worldEventType, worldEventData]) => {

            this.scene.load.spritesheet(worldEventType + "_spritesheet", worldEventData.path, {
                frameWidth: worldEventData.frameWidth,
                frameHeight: worldEventData.frameHeight
            });
        })
    }

    public create(): void {

        Object.entries(WorldEventDatas).forEach(([_, worldEventData]) => {
            this.scene.anims.create({
                key: worldEventData.type + "_animation",
                frames: this.scene.anims.generateFrameNumbers(worldEventData.type + "_spritesheet", {
                    start: 0,
                    end: worldEventData.frameCount - 1,
                }),
                frameRate: 12,
                repeat: -1,
            });
        });

        this.scene.time.addEvent({
            callback: this.spawnRandomWorldEvent,
            callbackScope: this,
            delay: this.worldEventSettings.eventIntervalSec * 1000,
            loop: true
        });
    }

    public update(): void {

        this.activeEvents.forEach((activeEvent) => {
            activeEvent.updatePosition(new Phaser.Math.Vector2(this.hexGrid.getContainer().x, this.hexGrid.getContainer().y));
        });
    }

    private spawnRandomWorldEvent(): void {

        let randomEventData: WorldEventData = WorldEventDatas[WorldEventTypes[this.randomGenerator.between(0, WorldEventTypes.length - 1)]];

        let targetTile: Tile = this.worldModel.getRandomTile(randomEventData.terrainFilter, randomEventData.structureFilter);

        while (this.activeEvents.some(event => event.targetTile === targetTile)) {

            targetTile = this.worldModel.getRandomTile(randomEventData.terrainFilter, randomEventData.structureFilter);
        }

        let worldEvent: WorldEvent = new WorldEvent(this, randomEventData, targetTile);

        this.activeEvents.push(worldEvent);
    }

}