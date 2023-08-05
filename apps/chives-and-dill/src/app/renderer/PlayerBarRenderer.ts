import { GlobalStore } from "@bananos/types";
import { forEach } from "lodash";
import * as PIXI from 'pixi.js';
import { Renderer } from "./Renderer";

export class PlayerBarRenderer implements Renderer {
    private bars: PIXI.Graphics;
    private container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    updateScene(store: GlobalStore) {
        if (!this.bars) {
            this.bars = new PIXI.Graphics();
            this.container.addChild(this.bars);
        }
    }

    render(store: GlobalStore) {
        this.bars.clear();
        const barWidth = 50;
        const borderWidth = 1;
        const spriteHeight = 48;

        forEach(store.characterPowerPoints.data, (characterPowerPoints, characterId) => {
            const location = store.characterMovements.data[characterId].location;
            const barPositionY = location.y - spriteHeight + 7 + borderWidth;
            const barPositionX = location.x - (barWidth / 2)

            this.bars.beginFill(0x000000);
            this.bars.drawRect(
                barPositionX - borderWidth,
                barPositionY - borderWidth,
                (barWidth + borderWidth * 2),
                7
            );
            this.bars.endFill();

            const healthWidth = characterPowerPoints.currentHp / characterPowerPoints.maxHp;
            this.bars.beginFill(0x00ff00);
            this.bars.drawRect(
                barPositionX,
                barPositionY,
                barWidth * healthWidth,
                5
            );
            this.bars.endFill();

            this.bars.beginFill(0xff0000);
            this.bars.drawRect(
                barPositionX + barWidth * healthWidth,
                barPositionY,
                barWidth * (1 - healthWidth),
                5
            );
            this.bars.endFill();
        });
    }
}