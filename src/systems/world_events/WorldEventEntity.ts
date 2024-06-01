import { ProgressBar } from '../overlay_elements/ProgressBar';
import {
  BarFillColour,
  CreateProgressBar,
} from '../overlay_elements/OverlayElementsFactory';
import { Tile } from '../world_generation/Tile';
import { WorldEventsManager } from './WorldEventsManager';
import { WorldEvent, WorldEventSettings } from '../../types';

export class WorldEventEntity {
  worldEventManager: WorldEventsManager;
  worldEventSettings: WorldEventSettings;

  worldEvent: WorldEvent;
  targetTile: Tile;

  sprite: Phaser.GameObjects.Sprite;

  chaos: number;
  chaosProgressBar: ProgressBar;

  constructor(
    worldEventManager: WorldEventsManager,
    worldEventSettings: WorldEventSettings,
    worldEvent: WorldEvent,
    targetTile: Tile
  ) {
    this.worldEventManager = worldEventManager;
    this.worldEventSettings = worldEventSettings;

    this.worldEvent = worldEvent;
    this.targetTile = targetTile;

    this.sprite = this.worldEventManager.scene.add.sprite(
      0,
      0,
      worldEventSettings.type + '_spritesheet'
    );

    this.sprite.setOrigin(
      worldEventSettings.graphics.originX,
      worldEventSettings.graphics.originY
    );
    this.sprite.setScale(
      this.worldEventManager.hexGrid.hexScale *
        worldEventSettings.graphics.scale
    );
    this.sprite.play(worldEventSettings.type + '_animation');

    this.chaos = 0;
    this.chaosProgressBar = CreateProgressBar(
      worldEventManager.scene,
      0,
      0,
      0,
      BarFillColour.Red,
      0.5
    );
  }

  public update(deltaTimeMs: number, mapOffset: Phaser.Math.Vector2): void {
    this.chaos = Phaser.Math.Clamp(
      this.chaos + deltaTimeMs / 1000,
      -1,
      this.worldEventSettings.chaosCapacity
    );

    let tilePixelPosition =
      this.worldEventManager.hexGrid.convertGridHexToPixelHex(
        this.targetTile.coordinates
      );

    this.sprite.x = tilePixelPosition.x + mapOffset.x;
    this.sprite.y = tilePixelPosition.y + mapOffset.y;

    this.sprite.depth = this.sprite.y;

    this.chaosProgressBar.setFilledPercentage(
      this.chaos / this.worldEventSettings.chaosCapacity
    );
    this.chaosProgressBar.setPosition(
      tilePixelPosition.x + mapOffset.x,
      tilePixelPosition.y + mapOffset.y + 25
    );

    this.chaosProgressBar.setDepth(this.sprite.depth + 10000);
  }

  public destroy(): void {
    this.chaosProgressBar.destroy();
    this.sprite.destroy();
  }

  public atNegativePower(): boolean {
    return this.chaos <= 0;
  }

  public atMaxPower(): boolean {
    return this.chaos >= this.worldEventSettings.chaosCapacity;
  }

  public reduceChaosPower(amount: number): void {
    this.chaos -= amount;
  }
}
