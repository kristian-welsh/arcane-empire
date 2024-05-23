import GameScene from '../../scenes/GameScene';
import { HexagonGrid } from '../hex_grid/HexagonGrid';
import { WorldModel } from '../world_generation/WorldModel';
import { Tile } from '../world_generation/Tile';
import { WorldEventEntity } from './WorldEventEntity';
import { worldEventsSettings } from './WorldEventSettings';
import {
  Mission,
  WorldEvent,
  WorldEventSettings,
  WorldEventType,
  WorldEventsSettingsCollection,
} from '../../types';
import { EmpireEntity } from '../empires/EmpireEntity';
import { WizardManager } from '../wizards/WizardManager';

export class WorldEventsManager {
  scene: GameScene;
  randomGenerator: Phaser.Math.RandomDataGenerator;

  hexGrid: HexagonGrid;
  worldModel: WorldModel;

  worldEventSettings: WorldEventsSettingsCollection;

  wizardManager: WizardManager;

  activeWorldEventEntities: WorldEventEntity[];

  nextEventCountdown: number;

  constructor(
    scene: GameScene,
    hexGrid: HexagonGrid,
    worldModel: WorldModel,
    worldEventSettings: WorldEventsSettingsCollection,
    wizardManager: WizardManager
  ) {
    this.scene = scene;
    this.randomGenerator = new Phaser.Math.RandomDataGenerator([
      worldEventSettings.seed,
    ]);

    this.hexGrid = hexGrid;
    this.worldModel = worldModel;

    this.worldEventSettings = worldEventSettings;

    this.wizardManager = wizardManager;

    this.activeWorldEventEntities = [];

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
    this.activeWorldEventEntities.forEach((activeEvent) => {
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
      this.activeWorldEventEntities.some(
        (event) => event.targetTile === targetTile
      )
    ) {
      targetTile = this.worldModel.getRandomTile(
        chosenWorldEventSettings.terrainFilter,
        chosenWorldEventSettings.structureFilter
      );
    }

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

    const newWorldEvent: WorldEvent = {
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
    };

    modifiedGameState.events.push(newWorldEvent);

    const worldEventEntity: WorldEventEntity = new WorldEventEntity(
      this,
      chosenWorldEventSettings,
      newWorldEvent,
      targetTile
    );

    targetTile.currentEvent = worldEventEntity;

    this.activeWorldEventEntities.push(worldEventEntity);

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

    this.activeWorldEventEntities.forEach((activeWorldEventEntity) => {
      const wizardsOnEvent = this.wizardManager.getWizardsOnTile(
        activeWorldEventEntity.targetTile
      );

      if (wizardsOnEvent.length > 0) {
        activeWorldEventEntity.reduceChaosPower(wizardsOnEvent.length + 1);

        if (activeWorldEventEntity.atNegativePower()) {
          this.banishActiveWorldEvent(activeWorldEventEntity);
        }
      }
    });

    this.activeWorldEventEntities
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

  private banishActiveWorldEvent(worldEventEntity: WorldEventEntity): void {
    if (
      this.activeWorldEventEntities.some(
        (activeWorldEvent) => activeWorldEvent === worldEventEntity
      ) == false
    )
      return;

    worldEventEntity.targetTile.currentEvent = null;
    worldEventEntity.destroy();

    this.activeWorldEventEntities = this.activeWorldEventEntities.filter(
      (activeEvent) => activeEvent !== worldEventEntity
    );

    let modifiedGameState = { ...this.scene.gameState! };

    modifiedGameState.events = modifiedGameState.events.filter(
      (worldEvent) => worldEvent !== worldEventEntity.worldEvent
    );

    modifiedGameState.reputation +=
      worldEventEntity.worldEventSettings.banishmentScore;

    this.scene.handleDataUpdate(modifiedGameState);
    this.scene.sendDataToPreact();
  }
}
