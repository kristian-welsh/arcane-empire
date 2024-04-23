import { WizardManager } from "./WizardManager";
import { WizardData } from "./WizardRecords";

export class Wizard {

    wizardManager: WizardManager;

    name: string;
    level: number;

    wizardData: WizardData;

    image: Phaser.GameObjects.Image | undefined;

    constructor(wizardManager: WizardManager, name: string, wizardData: WizardData) {

        this.wizardManager = wizardManager;

        this.name = name;
        this.wizardData = wizardData;

        this.level = 1;
    }

    public spawnWizard(): Phaser.GameObjects.Image {

        this.image = this.wizardManager.scene.add.image(0, 0, this.wizardData.power + "_wizard");
        this.image.setScale(this.wizardData.scale);
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