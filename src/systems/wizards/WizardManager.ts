import GameScene from "../../scenes/GameScene";
import { airWizardNames, earthWizardNames, fireWizardNames, guildNames, waterWizardNames } from "../../setup/wizardNames";
import { GameData, Wizard } from "../../types";
import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { StructureType } from "../world_generation/StructureRecords";
import { Tile, WorldModel } from "../world_generation/WorldModel";
import { MovementAction } from "./MovementAction";
import { WizardEntity } from "./Wizard";
import { WizardType, WizardCounts, WizardGraphicDatas } from "./WizardRecords";

export interface WizardSetings {
    seed: string;
    numberOfWizaards: WizardCounts;
}

export class WizardManager {

    scene: GameScene;
    randomGenerator: Phaser.Math.RandomDataGenerator;

    hexGrid: HexagonGrid;
    worldModel: WorldModel;

    guildName: string;
    guildTowerTile: Tile;

    wizardsEntities: WizardEntity[];

    staticWizards: Map<WizardEntity, Tile>;
    movingWizards: Map<WizardEntity, MovementAction>;

    constructor(scene: GameScene, hexGrid: HexagonGrid, worldModel: WorldModel, wizardSettings: WizardSetings) {

        this.scene = scene;
        this.randomGenerator = new Phaser.Math.RandomDataGenerator([wizardSettings.seed]);

        this.hexGrid = hexGrid;
        this.worldModel = worldModel;

        this.guildName = this.randomGenerator.pick(guildNames);
        this.guildTowerTile = this.worldModel.getRandomTile(undefined, [StructureType.Wizard_Tower]);

        this.wizardsEntities = [];

        this.staticWizards = new Map<WizardEntity, Tile>();
        this.movingWizards = new Map<WizardEntity, MovementAction>();

        let gameState: GameData = {
            ...this.scene.gameState!,
            wizards: {
                fire: [],
                water: [],
                earth: [],
                air: []
            }
        };

        for (let i = 0; i < wizardSettings.numberOfWizaards.fire; i++) {

            let [name, initials] = this.getRandomWizardNameAndInitials(WizardType.Fire);

            let wizard: Wizard = {
                name: name,
                initials: initials,
                level: 1,
                status: 'idle'
            };

            gameState.wizards.fire.push(wizard);

            this.wizardsEntities.push(new WizardEntity(this, wizard, WizardGraphicDatas.fire));
        }

        for (let i = 0; i < wizardSettings.numberOfWizaards.water; i++) {

            let [name, initials] = this.getRandomWizardNameAndInitials(WizardType.Water);

            let wizard: Wizard = {
                name: name,
                initials: initials,
                level: 1,
                status: 'idle'
            };

            gameState.wizards.water.push(wizard);

            this.wizardsEntities.push(new WizardEntity(this, wizard, WizardGraphicDatas.water));
        }

        for (let i = 0; i < wizardSettings.numberOfWizaards.earth; i++) {

            let [name, initials] = this.getRandomWizardNameAndInitials(WizardType.Earth);

            let wizard: Wizard = {
                name: name,
                initials: initials,
                level: 1,
                status: 'idle'
            };

            gameState.wizards.earth.push(wizard);

            this.wizardsEntities.push(new WizardEntity(this, wizard, WizardGraphicDatas.earth));
        }

        for (let i = 0; i < wizardSettings.numberOfWizaards.air; i++) {

            let [name, initials] = this.getRandomWizardNameAndInitials(WizardType.Air);

            let wizard: Wizard = {
                name: name,
                initials: initials,
                level: 1,
                status: 'idle'
            };

            gameState.wizards.air.push(wizard);

            this.wizardsEntities.push(new WizardEntity(this, wizard, WizardGraphicDatas.air));
        }

        this.wizardsEntities = this.randomGenerator.shuffle(this.wizardsEntities);

        scene.handleDataUpdate(gameState);
        scene.sendDataToPreact();

        console.log(this.scene.gameState!.wizards);
    }

    public preload(): void {

        Object.entries(WizardGraphicDatas).forEach(([elementalPower, wizardData]) => {
            this.scene.load.image(elementalPower + "_wizard", wizardData.path);
        });
    }

    public create(): void {

        for (let i = 0; i < this.wizardsEntities.length; i++) {

            this.wizardsEntities[i].spawnWizard();

            this.staticWizards.set(this.wizardsEntities[i], this.guildTowerTile);

            this.wizardsEntities[i].setIdle();
        }

        this.sendWizardToTile(this.wizardsEntities[0], this.worldModel.getRandomTile());
    }

    public update(deltaTimeMs: number): void {

        // Lock the idle wizards to their respective slot on their tile

        this.getOccupiedTiles().forEach(tile => {

            this.getWizardsOnTile(tile).forEach((wizard, index) => {

                let slotPosition = this.hexGrid.getUnitSlotPixelPosition(tile.coordinates, index);

                let wizardImage = wizard.getImage();

                wizardImage.x = slotPosition.x + this.hexGrid.getContainer().x;
                wizardImage.y = slotPosition.y + this.hexGrid.getContainer().y;

                wizardImage.depth = wizardImage.y;
            })
        });

        // Update the motions of any wizards moving between tiles

        for (const [_, movementAction] of this.movingWizards.entries()) {
            movementAction.update(deltaTimeMs);
        };
    }

    public getRandomWizardNameAndInitials(powerType: WizardType): [string, string] {

        let name: string = "Master Nonameus";

        switch (powerType) {
            case WizardType.Fire:
                name = this.randomGenerator.pick(fireWizardNames);
                break;
            case WizardType.Water:
                name = this.randomGenerator.pick(waterWizardNames);
                break;
            case WizardType.Earth:
                name = this.randomGenerator.pick(earthWizardNames);
                break;
            case WizardType.Air:
                name = this.randomGenerator.pick(airWizardNames);
                break;
        }

        let nameParts = name.split(" ");
        let initials = nameParts.map(word => word[0].toUpperCase()).join(".") + ".";

        return [name, initials];
    }

    public getOccupiedTiles(): Tile[] {

        return Array.from(this.staticWizards.values());
    }

    public getWizardsOnTile(tileToCheck: Tile): WizardEntity[] {

        let wizards: WizardEntity[] = [];

        for (const [wizard, tile] of this.staticWizards.entries()) {
            if (tile === tileToCheck) {
                wizards.push(wizard);
            }
        }

        return wizards;
    }

    public sendWizardToTile(targetWizard: WizardEntity, targetTile: Tile): void {

        if (this.staticWizards.has(targetWizard) == false)
            return;

        let currentTile = this.staticWizards.get(targetWizard);

        if (currentTile === undefined)
            return;

        this.movingWizards.set(targetWizard, new MovementAction(this.hexGrid, targetWizard, currentTile, targetTile, 30, () => {
            this.setWizardToStatic(targetWizard, targetTile);
        }));

        this.staticWizards.delete(targetWizard);
    }

    private setWizardToStatic(targetWizard: WizardEntity, targetTile: Tile): void {

        this.movingWizards.delete(targetWizard);
        this.staticWizards.set(targetWizard, targetTile);
    }

}