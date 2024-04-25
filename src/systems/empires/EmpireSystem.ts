import GameScene from "../../scenes/GameScene";
import { empireColours } from "../../setup/constants";
import { empireNames, castleNames, rulerNames } from "../../setup/empireNames";
import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { TerrainType } from "../world_generation/TerrainTileRecords";
import { Tile, WorldModel } from "../world_generation/WorldModel";
import { EmpireEntity } from "./Empire";

export interface EmpireSettings {
    seed: string;
    numberOfEmpires: number;
    minStartSize: number;
    maxStartSize: number;
    minSeparationDistance: number;
}

export class EmpiresSystem {

    scene: GameScene;
    randomGenerator: Phaser.Math.RandomDataGenerator;

    hexGrid: HexagonGrid;
    worldModel: WorldModel;

    empires: EmpireEntity[];

    constructor(scene: GameScene, hexGrid: HexagonGrid, worldModel: WorldModel, empireSettings: EmpireSettings) {

        this.scene = scene;
        this.randomGenerator = new Phaser.Math.RandomDataGenerator([empireSettings.seed]);

        this.hexGrid = hexGrid;
        this.worldModel = worldModel;

        this.empires = [];

        for (let i = 0; i < empireSettings.numberOfEmpires; i++) {

            let captialTile: Tile = worldModel.getRandomTile([TerrainType.Grass, TerrainType.Forest, TerrainType.Mountain]);

            while (this.empires.some(empire => empire.capitalTile.coordinates.distance(captialTile.coordinates) <= empireSettings.minSeparationDistance)) {
                captialTile = worldModel.getRandomTile([TerrainType.Grass, TerrainType.Forest, TerrainType.Mountain]);
            }

            this.empires[i] = new EmpireEntity(this,
                empireNames[this.randomGenerator.between(0, empireNames.length)],
                castleNames[this.randomGenerator.between(0, castleNames.length)],
                rulerNames[this.randomGenerator.between(0, rulerNames.length)],
                captialTile, empireColours[i]);
        }

        let empireSizes: number[] = [];

        for (let i = 0; i < this.empires.length; i++) {
            empireSizes[i] = this.randomGenerator.between(empireSettings.minStartSize, empireSettings.maxStartSize);
        }

        let territoryGenerationComplete: boolean = true;

        do {
            territoryGenerationComplete = true;

            for (let i = 0; i < this.empires.length; i++) {

                if (this.empires[i].territoryTiles.length == empireSizes[i])
                    continue;

                let newTerrirotyTile: Tile = this.empires[i].getExpandableTiles(worldModel)[0];

                this.empires[i].addTileToTerritories(newTerrirotyTile);

                territoryGenerationComplete = false;
            }
        } while (territoryGenerationComplete == false);

    }

    public create(): void {

        this.empires.forEach((empire: EmpireEntity) => {

            empire.create();
        });
    }

    public update(time: number): void {

        this.empires.forEach((empire: EmpireEntity) => {

            empire.update(time, new Phaser.Math.Vector2(this.hexGrid.getContainer().x, this.hexGrid.getContainer().y));
        });
    }

    public getOwningEmpire(tileToCheck: Tile): EmpireEntity | undefined {

        for (let i = 0; i < this.empires.length; i++) {
            if (this.empires[i].territoryTiles.some(empireTile => empireTile == tileToCheck)) {
                return this.empires[i];
            }
        }

        return undefined;
    }


}