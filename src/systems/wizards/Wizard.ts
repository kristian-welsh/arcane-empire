import { Wizard } from "../../types";
import { WizardManager } from "./WizardManager";
import { WizardGraphicData } from "./WizardRecords";

export class WizardEntity {

    wizardManager: WizardManager;

    wizardData: Wizard;

    wizardGraphicData: WizardGraphicData;

    image: Phaser.GameObjects.Image | undefined;

    constructor(wizardManager: WizardManager, wizardData: Wizard, wizardGraphicData: WizardGraphicData) {

        this.wizardManager = wizardManager;
        this.wizardData = wizardData;
        this.wizardGraphicData = wizardGraphicData;
    }

    public spawnWizard(): Phaser.GameObjects.Image {

        this.image = this.wizardManager.scene.add.image(0, 0, this.wizardGraphicData.power + "_wizard");
        this.image.setScale(this.wizardGraphicData.scale);
        return this.image;
    }

    public getImage(): Phaser.GameObjects.Image {

        if (this.image === undefined)
            throw "Attempting to access wizard image before it's been created";

        return this.image;
    }

    public setIdle(): void {
        this.wizardManager.scene.time.addEvent({
            callback: this.flipSpriteTimerEvent,
            callbackScope: this,
            delay: this.wizardManager.randomGenerator.between(2500, 4000),
            loop: true
        });
    }

    public flipSpriteTimerEvent(): void {

        if (this.image === undefined)
            return;

        this.image.toggleFlipX();
    }

}