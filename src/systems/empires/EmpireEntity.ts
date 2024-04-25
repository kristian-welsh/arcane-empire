import { eventEmitter } from "../../events/EventEmitter";
import { Empire, GameData } from "../../types";
import { CreateQuestMarker } from "../overlay_elements/OverlayElementsFactory";
import { QuestMarker } from "../overlay_elements/QuestMarker";
import { RegionOutline } from "../regions/RegionOutline";
import { StructureDatas } from "../world_generation/StructureRecords";
import { TerrainDatas } from "../world_generation/TerrainTileRecords";
import { Tile, WorldModel } from "../world_generation/WorldModel";
import { EmpiresSystem } from "./EmpireSystem";


export class EmpireEntity {

    empireSystem: EmpiresSystem;

    empire: Empire;

    empireName: string;
    captialName: string;
    rulerName: string;

    capitalTile: Tile;
    territoryTiles: Tile[];

    territoyOutline: RegionOutline;

    missionMarker: QuestMarker | undefined;

    constructor(empireSystem: EmpiresSystem, empire: Empire, capitalTile: Tile) {

        this.empireSystem = empireSystem;

        this.capitalTile = capitalTile;

        this.territoryTiles = [capitalTile];

        empireSystem.worldModel.getNeighbouringTiles(capitalTile).forEach(adjTile => {
            this.territoryTiles.push(adjTile);
        });

        this.empire = empire;

        this.territoyOutline = new RegionOutline(this.empireSystem.scene, this.empireSystem.hexGrid, [], this.empire.color, 3.5, false)

        this.capitalTile.terrainData = TerrainDatas.Grass;
        this.capitalTile.structureData = StructureDatas.Castle;
    }

    public create(): void {

        this.redrawTerritoryOutline();

        this.capitalTile.terrainImage?.setInteractive();

        //this.capitalTile.terrainImage?.on('pointerdown', this.empireSelected, this);
    }

    public update(time: number, mapOffset: Phaser.Math.Vector2): void {

        let capitalPixelPositon = this.empireSystem.hexGrid.convertGridHexToPixelHex(this.capitalTile.coordinates);

        if (this.missionMarker === undefined) {

            for (let activeEvent of this.empireSystem.scene.worldEventsManager.activeEvents) {

                if (this.isTileInTerritory(activeEvent.targetTile)) {
                    this.missionMarker = CreateQuestMarker(this.empireSystem.scene, capitalPixelPositon.x + mapOffset.x, capitalPixelPositon.y + mapOffset.y - (Math.sin(time / 100) * 5), 0.75);
                    break;
                }
            }
        } else {

            let allEventsCleared: boolean = true;

            for (let activeEvent of this.empireSystem.scene.worldEventsManager.activeEvents) {

                if (this.isTileInTerritory(activeEvent.targetTile)) {
                    allEventsCleared = false
                    break;
                }
            }

            if (allEventsCleared) {

                this.missionMarker.markerImage.destroy();
                this.missionMarker = undefined;
            } else {

                this.missionMarker.setPosition(capitalPixelPositon.x + mapOffset.x, capitalPixelPositon.y + mapOffset.y - (Math.sin(time / 100) * 5));
                this.missionMarker.setDepth(capitalPixelPositon.y + mapOffset.y - (Math.sin(time / 100) * 5));
            }
        }
    }

    public addTileToTerritories(newTile: Tile): void {

        this.territoryTiles.push(newTile);
    }

    public redrawTerritoryOutline() {

        this.territoyOutline.setHexes(this.territoryTiles.map(tile => tile.coordinates));
    }

    public getBorderTiles(worldModel: WorldModel): Tile[] {

        let borderTiles: Tile[] = []

        for (let i = 0; i < this.territoryTiles.length; i++) {
            if (worldModel.getNeighbouringTiles(this.territoryTiles[i]).some(neighbouringTile => this.isTileInTerritory(neighbouringTile) == false)) {
                borderTiles.push(this.territoryTiles[i])
            }
        }

        return borderTiles;
    }

    public getExpandableTiles(worldModel: WorldModel): Tile[] {

        let borderTiles: Tile[] = this.getBorderTiles(worldModel);
        let expandableTiles: Set<Tile> = new Set();

        borderTiles.forEach((borderTile: Tile) => {

            let neighbourTiles: Tile[] = worldModel.getNeighbouringTiles(borderTile);

            neighbourTiles.forEach((neighbourTile: Tile) => {

                if (this.isTileInTerritory(neighbourTile) == false &&
                    expandableTiles.has(neighbourTile) == false &&
                    this.empireSystem.getOwningEmpire(neighbourTile) === undefined) {

                    expandableTiles.add(neighbourTile);
                }
            });
        });

        let expandableTilesShuffled = Phaser.Math.RND.shuffle([...expandableTiles]);
        let expandableTilesSorted = expandableTilesShuffled.sort((a, b) => this.capitalTile.coordinates.distance(a.coordinates) - this.capitalTile.coordinates.distance(b.coordinates));

        return [...expandableTilesSorted];
    }

    public isTileInTerritory(tileToCheck: Tile): boolean {
        return this.territoryTiles.some(territoryTile => territoryTile == tileToCheck);
    }
}