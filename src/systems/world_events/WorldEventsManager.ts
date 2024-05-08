import GameScene from '../../scenes/GameScene';
import { HexagonGrid } from '../hex_grid/HexagonGrid';
import { WorldModel } from '../world_generation/WorldModel';
import { Tile } from '../world_generation/Tile';
import { WorldEvent } from './WorldEvent';
import {
  WorldEventData,
  WorldEventDatas,
  WorldEventTypes,
} from './WorldEventRecords';
import { Mission } from '../../types';
import { EmpireEntity } from '../empires/EmpireEntity';

export interface WorldEventSettings {
  seed: string;
  eventIntervalSec: number;
  scoreDecreasePerEvent: number;
}

export class WorldEventsManager {
  scene: GameScene;
  randomGenerator: Phaser.Math.RandomDataGenerator;

  hexGrid: HexagonGrid;
  worldModel: WorldModel;

  worldEventSettings: WorldEventSettings;

  activeEvents: WorldEvent[];

  nextEventCountdown: number;

  constructor(
    scene: GameScene,
    hexGrid: HexagonGrid,
    worldModel: WorldModel,
    worldEventSettings: WorldEventSettings
  ) {
    this.scene = scene;
    this.randomGenerator = new Phaser.Math.RandomDataGenerator([
      worldEventSettings.seed,
    ]);

    this.hexGrid = hexGrid;
    this.worldModel = worldModel;

    this.worldEventSettings = worldEventSettings;

    this.activeEvents = [];

    this.nextEventCountdown = this.worldEventSettings.eventIntervalSec;
  }

  public preload(): void {
    Object.entries(WorldEventDatas).forEach(
      ([worldEventType, worldEventData]) => {
        this.scene.load.spritesheet(
          worldEventType + '_spritesheet',
          worldEventData.path,
          {
            frameWidth: worldEventData.frameWidth,
            frameHeight: worldEventData.frameHeight,
          }
        );
      }
    );
  }

  public create(): void {
    Object.entries(WorldEventDatas).forEach(([_, worldEventData]) => {
      this.scene.anims.create({
        key: worldEventData.type + '_animation',
        frames: this.scene.anims.generateFrameNumbers(
          worldEventData.type + '_spritesheet',
          {
            start: 0,
            end: worldEventData.frameCount - 1,
          }
        ),
        frameRate: 12,
        repeat: -1,
      });
    });
  }

  public update(deltaTimeMs: number): void {
    this.activeEvents.forEach((activeEvent) => {
      activeEvent.update(
        deltaTimeMs,
        new Phaser.Math.Vector2(
          this.hexGrid.getContainer().x,
          this.hexGrid.getContainer().y
        )
      );
    });
  }

  public tick(): void {
    if (this.nextEventCountdown > 0) {
      this.nextEventCountdown--;
    } else {
      this.nextEventCountdown = this.worldEventSettings.eventIntervalSec;

      this.spawnRandomWorldEvent();
    }

    this.applyEventEffects();
  }

  private spawnRandomWorldEvent(): void {
    let randomEventData: WorldEventData =
      WorldEventDatas[
        WorldEventTypes[
          this.randomGenerator.between(0, WorldEventTypes.length - 1)
        ]
      ];

    let targetTile: Tile = this.worldModel.getRandomTile(
      randomEventData.terrainFilter,
      randomEventData.structureFilter
    );

    while (this.activeEvents.some((event) => event.targetTile === targetTile)) {
      targetTile = this.worldModel.getRandomTile(
        randomEventData.terrainFilter,
        randomEventData.structureFilter
      );
    }

    let worldEvent: WorldEvent = new WorldEvent(
      this,
      randomEventData,
      targetTile
    );

    targetTile.currentEvent = worldEvent;

    this.activeEvents.push(worldEvent);

    let modifiedGameState = { ...this.scene.gameState! };

    let mission: Mission | undefined;

    let affectedEmpire: EmpireEntity | undefined =
      this.scene.empireSystem.getOwningEmpire(targetTile);

    if (affectedEmpire !== undefined) {
      mission = {
        name: 'Help stop the ' + randomEventData.type,
        description: 'Help stop the ' + randomEventData.type,
        empireName: affectedEmpire.empire.empireName,
        reward: 50,
        status: 'available',
      };
    }

    modifiedGameState.events.push({
      name: randomEventData.type,
      description: randomEventData.type,
      //type: randomEventData.type as WorldEventType,
      difficultyRating: 1,
      elementalEffectiveness: {
        fire: 1,
        water: 1,
        earth: 1,
        air: 1,
      },
      mission: mission,
    });

    this.scene.handleDataUpdate(modifiedGameState);
    this.scene.sendDataToPreact();
  }

  private applyEventEffects(): void {
    let eventsAtMaxPowerCount = this.activeEvents.filter((event) =>
      event.atMaxPower()
    ).length;

    if (eventsAtMaxPowerCount <= 0) return;

    let totalReputationImpact =
      eventsAtMaxPowerCount * this.worldEventSettings.scoreDecreasePerEvent;

    this.scene.handleDataUpdate({
      ...this.scene.gameState!,
      reputation: this.scene.gameState!.reputation - totalReputationImpact,
    });

    this.scene.sendDataToPreact();
  }
}
