import { eventEmitter } from '../../events/EventEmitter';
import { TileType } from '../../types';
import { WizardEntity } from '../wizards/WizardEntity';
import { WorldEventEntity } from '../world_events/WorldEventEntity';
import { StructureData } from './StructureRecords';
import { TerrainData } from './TerrainTileRecords';
import { WorldModel } from './WorldModel';

export class Tile implements TileType {
  parentWorldModel: WorldModel;

  coordinates: Phaser.Math.Vector2;
  terrainData: TerrainData;
  structureData: StructureData | undefined;
  currentEvent: WorldEventEntity | null;

  terrainImage: Phaser.GameObjects.Image | undefined;

  wizardSlots: WizardEntity[];

  constructor(
    parentWorldModel: WorldModel,
    coordinates: Phaser.Math.Vector2,
    terrainType: TerrainData
  ) {
    this.parentWorldModel = parentWorldModel;
    this.coordinates = coordinates;
    this.terrainData = terrainType;
    this.currentEvent = null;

    this.wizardSlots = [];
  }

  public getWizardCapacity(): number {
    return 5 - this.wizardSlots.length; // Hard coded 5 slots for now but should probably be in a setting somewhere
  }

  public setImage(terrainImage: Phaser.GameObjects.Image): void {
    this.terrainImage = terrainImage;
    this.makeInteractive();
  }

  public makeInteractive(): void {
    if (!this.terrainImage) {
      return;
    }
    this.terrainImage.setInteractive();

    this.terrainImage.on('pointerup', () => {
      if (!this.parentWorldModel.hexGrid.isDragging) {
        eventEmitter.emit('tile-clicked', this);
      }
    });

    this.terrainImage.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.preventDefault();
      this.parentWorldModel.hexGrid.isDragging = true;
      this.parentWorldModel.hexGrid.dragStartX = pointer.position.x;
      this.parentWorldModel.hexGrid.dragStartY = pointer.position.y;
    });

    this.terrainImage.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.parentWorldModel.hexGrid.isDragging) {
        const dx =
          pointer.position.x - this.parentWorldModel.hexGrid.dragStartX;
        const dy =
          pointer.position.y - this.parentWorldModel.hexGrid.dragStartY;
        this.parentWorldModel.hexGrid.dragMap(dx, dy);
        this.parentWorldModel.hexGrid.dragStartX = pointer.position.x;
        this.parentWorldModel.hexGrid.dragStartY = pointer.position.y;
      }
    });

    this.terrainImage.on('pointerup', () => {
      this.parentWorldModel.hexGrid.isDragging = false;
    });

    this.terrainImage.on('pointerup', () => {
      if (!this.parentWorldModel.hexGrid.isDragging) {
        eventEmitter.emit('tile-clicked', this);
      }
    });
  }
}
