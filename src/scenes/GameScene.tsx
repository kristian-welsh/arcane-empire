/*
 * GameScene.tsx
 * This scene is responsible for handling the whole game logic. When the game ends, it will transition to the PostGameScene.
 */

import { eventEmitter } from '../events/EventEmitter';
import { secondsToMMSS } from '../helpers';
import {
  defaultEmpireSettings,
  defaultGenerationSettings,
  defaultGridSize,
  defaultWizardSettings,
} from '../setup/constants';
import { EmpiresSystem } from '../systems/empires/EmpireSystem';
import { HexagonGrid } from '../systems/hex_grid/HexagonGrid';
import { ProgressBar } from '../systems/overlay_elements/ProgressBar';
import { PreloadOverlayAssets } from '../systems/overlay_elements/OverlayElementsFactory';
import { WizardManager } from '../systems/wizards/WizardManager';
import { WorldEventsManager } from '../systems/world_events/WorldEventsManager';
import { UniformDistributionGenerator, WorldModel } from '../systems/world_generation/WorldModel';
import { WorldView } from '../systems/world_generation/WorldView';
import { GameData } from '../types';
import { worldEventsSettings } from '../systems/world_events/WorldEventSettings';

export default class GameScene extends Phaser.Scene {
  public gameState: GameData = null;

  private startTime: number = 0;
  private gameStarted: boolean = false;
  private elapsedSeconds: number = 0;
  private gameTimeText: Phaser.GameObjects.Text | undefined;
  private eventSubscription: (() => void) | undefined;

  hexGrid: HexagonGrid;
  worldModel: WorldModel;
  worldView: WorldView;
  empireSystem: EmpiresSystem;
  wizardManager: WizardManager;
  worldEventsManager: WorldEventsManager;

  public constructor() {
    super({ key: 'GameScene' });

    this.gameState = {
      wizards: {
        fire: [],
        water: [],
        earth: [],
        air: [],
      },
      empires: [],
      tower: {
        baseWizardCost: 50,
        perExtraWizardCost: 10,
        wizardCapacities: {
          fire: 3,
          water: 3,
          earth: 3,
          air: 3,
        },
      },
      playerGold: 50,
      reputation: 100,
      upgrades: {},
      events: [],
    };

    this.hexGrid = new HexagonGrid(this, defaultGridSize);

    let worldgen = new UniformDistributionGenerator(defaultGenerationSettings, defaultGridSize);
    this.worldModel = worldgen.generate(this.hexGrid);

    this.worldView = new WorldView(
      this,
      this.hexGrid,
      this.worldModel,
      defaultGenerationSettings
    );

    this.empireSystem = new EmpiresSystem(
      this,
      this.hexGrid,
      this.worldModel,
      defaultEmpireSettings
    );

    this.wizardManager = new WizardManager(
      this,
      this.hexGrid,
      this.worldModel,
      defaultWizardSettings
    );

    this.worldEventsManager = new WorldEventsManager(
      this,
      this.hexGrid,
      this.worldModel,
      worldEventsSettings,
      this.wizardManager
    );
  }

  public preload() {
    PreloadOverlayAssets(this);

    this.hexGrid.preload();
    this.worldView.preload();
    this.wizardManager.preload();
    this.worldEventsManager.preload();
  }

  public create() {
    this.eventSubscription = eventEmitter.subscribe(
      'update-phaser-data',
      this.handleDataUpdate.bind(this)
    );

    this.hexGrid.initDragListeners();
    const background = this.add.rectangle(
      0,
      0,
      this.sys.canvas.width,
      this.sys.canvas.height,
      0x000000
    );
    background.setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    this.children.sendToBack(background);

    this.gameTimeText = this.add.text(
      this.scale.width / 1.15,
      this.scale.height / 40,
      this.elapsedSeconds.toString(),
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'right',
      }
    );

    // const startButton = this.add.text(
    //   this.cameras.main.centerX,
    //   this.cameras.main.centerY,
    //   'End game',
    //   {
    //     fontSize: '24px',
    //     color: '#FFFFFF',
    //   })
    //   .setOrigin(0.5);

    // startButton.setInteractive({ useHandCursor: true });

    // startButton.on(
    //   'pointerup',
    //   () => {
    //     this.data.set('gametime', this.elapsedSeconds);
    //     startScene(this, 'PostGameScene');
    //   },
    //   this
    // );

    this.worldView.create();
    this.empireSystem.create();
    this.wizardManager.create();
    this.worldEventsManager.create();

    this.time.addEvent({
      callback: this.tick,
      callbackScope: this,
      delay: 1000,
      loop: true,
    });
  }

  prog: ProgressBar | undefined;

  public update(time: number, deltaTimeMs: number): void {
    if (!this.gameStarted) {
      this.elapsedSeconds = 0;
      this.startTime = this.time.now;
      this.gameStarted = true;
    }

    this.elapsedSeconds = Math.floor((time - this.startTime) / 1000);

    this.gameTimeText?.setText(secondsToMMSS(this.elapsedSeconds));
    this.gameTimeText?.setPosition(
      this.scale.width / 1.05 - this.gameTimeText.width,
      this.scale.height / 40
    );

    this.empireSystem.update(time);
    this.wizardManager.update(deltaTimeMs);
    this.worldEventsManager.update(deltaTimeMs);
  }

  public tick(): void {
    this.worldEventsManager.tick();
  }

  public handleDataUpdate = (data: GameData) => {
    this.gameState = data;
  };

  public sendDataToPreact = () => {
    eventEmitter.emit('update-app-data', this.gameState);
  };

  public shutdown() {
    if (this.eventSubscription) {
      this.eventSubscription();
    }
  }
}
