/*
 * GameScene.tsx
 * This scene is responsible for handling the whole game logic. When the game ends, it will transition to the PostGameScene.
 */

import { eventEmitter } from '../events/EventEmitter';
import { secondsToMMSS, startScene } from '../helpers';
import { defaultGenerationSettings, defaultGridSize } from '../setup/constants';
import { HexagonGrid } from '../systems/hex_grid/HexagonGrid';
import { RegionOutline } from '../systems/regions/RegionOutline';
import { WorldModel } from '../systems/world_generation/WorldModel';
import { WorldView } from '../systems/world_generation/WorldView';

export default class GameScene extends Phaser.Scene {
  private startTime: number = 0;
  private gameStarted: boolean = false;
  private elapsedSeconds: number = 0;
  private gameTimeText: Phaser.GameObjects.Text | undefined;
  private eventSubscription: (() => void) | undefined;

  private hexGrid: HexagonGrid;
  private worldModel: WorldModel;
  private worldView: WorldView;

  public constructor() {
    super({ key: 'GameScene' });

    this.hexGrid = new HexagonGrid(this, defaultGridSize);
    this.worldModel = new WorldModel(this.hexGrid, defaultGridSize, defaultGenerationSettings);
    this.worldView = new WorldView(this, this.hexGrid, this.worldModel, defaultGenerationSettings);
  }

  public preload() {
    this.hexGrid.preload();
    this.worldView.preloadWorldTiles();
  }

  public create() {
    this.eventSubscription = eventEmitter.subscribe('update-data', this.handleDataUpdate.bind(this));

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

    const startButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'End game',
      {
        fontSize: '24px',
        color: '#FFFFFF',
      })
      .setOrigin(0.5);

    startButton.setInteractive({ useHandCursor: true });

    startButton.on(
      'pointerup',
      () => {
        this.data.set('gametime', this.elapsedSeconds);
        startScene(this, 'PostGameScene');
      },
      this
    );

    this.worldView.drawWorld();
  }

  public update(time: number): void {
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
  }

  public handleDataUpdate = (data: GameData) => {
    console.log('Data received in GameScene: ', data);
  }

  public shutdown() {
    if (this.eventSubscription) {
      this.eventSubscription();
    }
  }
}
