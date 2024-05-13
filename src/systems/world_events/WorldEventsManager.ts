import GameScene from '../../scenes/GameScene';
import { HexagonGrid } from '../hex_grid/HexagonGrid';
import { WorldModel } from '../world_generation/WorldModel';
import { Tile } from '../world_generation/Tile';
import { WorldEventEntity } from './WorldEventEntity';
import { worldEventsSettings } from './WorldEventSettings';
import {
  Mission,
  WorldEventSettings,
  WorldEventType,
  WorldEventsSettingsCollection,
} from '../../types';
import { EmpireEntity } from '../empires/EmpireEntity';

export class WorldEventsManager {
  scene: GameScene;
  randomGenerator: Phaser.Math.RandomDataGenerator;

  hexGrid: HexagonGrid;
  worldModel: WorldModel;

  worldEventSettings: WorldEventsSettingsCollection;

  activeEvents: WorldEventEntity[];

  nextEventCountdown: number;

  constructor(
    scene: GameScene,
    hexGrid: HexagonGrid,
    worldModel: WorldModel,
    worldEventSettings: WorldEventsSettingsCollection
  ) {
    this.scene = scene;
    this.randomGenerator = new Phaser.Math.RandomDataGenerator([
      worldEventSettings.seed,
    ]);

    this.hexGrid = hexGrid;
    this.worldModel = worldModel;

    this.worldEventSettings = worldEventSettings;

    this.activeEvents = [];

    this.nextEventCountdown = this.worldEventSettings.spawnIntervalSec;
  }

  public preload(): void {
    Object.entries(worldEventsSettings.perEventSettings).forEach(
      ([worldEventType, worldEventGraphicSettings]) => {
        this.scene.load.spritesheet(
          worldEventType + '_spritesheet',
          worldEventGraphicSettings.graphics.path,
          {
            frameWidth: worldEventGraphicSettings.graphics.frameWidth,
            frameHeight: worldEventGraphicSettings.graphics.frameHeight,
          }
        );
      }
    );
  }

  public create(): void {
    Object.entries(worldEventsSettings.perEventSettings).forEach(
      ([worldEventType, worldEventData]) => {
        this.scene.anims.create({
          key: worldEventData.type + '_animation',
          frames: this.scene.anims.generateFrameNumbers(
            worldEventData.type + '_spritesheet',
            {
              start: 0,
              end: worldEventData.graphics.frameCount - 1,
            }
          ),
          frameRate: 12,
          repeat: -1,
        });
      }
    );
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
      this.nextEventCountdown = this.worldEventSettings.spawnIntervalSec;

      this.spawnRandomWorldEvent();
    }

    this.applyEventEffects();
  }

  private spawnRandomWorldEvent(): void {
    const chosenWorldEventSettings: WorldEventSettings =
      this.getRandomWorldEvent();

    let targetTile: Tile | undefined = undefined;

    while (
      targetTile === undefined ||
      this.activeEvents.some((event) => event.targetTile === targetTile)
    ) {
      targetTile = this.worldModel.getRandomTile(
        chosenWorldEventSettings.terrainFilter,
        chosenWorldEventSettings.structureFilter
      );
    }

    let worldEvent: WorldEventEntity = new WorldEventEntity(
      this,
      chosenWorldEventSettings,
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
        name: 'Help stop the ' + chosenWorldEventSettings.type,
        description: 'Help stop the ' + chosenWorldEventSettings.type,
        empireName: affectedEmpire.empire.empireName,
        reward: 50,
        status: 'available',
      };
    }

    modifiedGameState.events.push({
      name: chosenWorldEventSettings.type,
      description: chosenWorldEventSettings.type,
      type: chosenWorldEventSettings.type as WorldEventType,
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

  private getRandomWorldEvent(): WorldEventSettings {
    const worldEventTypes: string[] = Object.keys(
      worldEventsSettings.perEventSettings
    );

    const chosenWorldEventType: WorldEventType = worldEventTypes[
      this.randomGenerator.between(0, worldEventTypes.length - 1)
    ] as WorldEventType;

    const chosenWorldEventSettings: WorldEventSettings =
      worldEventsSettings.perEventSettings[chosenWorldEventType];

    return chosenWorldEventSettings;
  }

  private applyEventEffects(): void {
    let totalReputationImpact = 0;

    this.activeEvents
      .filter((event) => event.atMaxPower())
      .forEach((activeEvent) => {
        totalReputationImpact +=
          activeEvent.worldEventSettings.scoreDeductionPerTick;
      });

    if (totalReputationImpact <= 0) return;

    this.scene.handleDataUpdate({
      ...this.scene.gameState!,
      reputation: this.scene.gameState!.reputation - totalReputationImpact,
    });

    this.scene.sendDataToPreact();
  }
}
