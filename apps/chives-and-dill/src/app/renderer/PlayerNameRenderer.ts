import { GlobalStore } from "@bananos/types";
import { forEach } from "lodash";
import * as PIXI from 'pixi.js';
import { Renderer } from "./Renderer";

export class PlayerNameRenderer implements Renderer {
    private names: Record<string, PIXI.Text> = {};
    private container: PIXI.Container;
    private textStyle: PIXI.TextStyle;

    constructor(container: PIXI.Container) {
        this.container = container;
        this.textStyle = new PIXI.TextStyle({
            fontSize: 15,
            fill: 'green',
            fontWeight: 'bold',
            lineJoin: 'round',
            strokeThickness: 4,
            fontFamily: 'Septimus',
        });
    }

    updateScene(store: GlobalStore) {
        forEach(store.character.data, (character, characterId) => {
            if (this.names[characterId] || !store.characterMovements.data[character.id]) {
                return;
            }

            this.names[characterId] = new PIXI.Text(character.name, this.textStyle);
            const location = store.characterMovements.data[character.id].location;
            // 48 is a sprite height
            this.names[character.id].y = location.y - 48 / 1.5;
            this.names[character.id].x = location.x;
            this.names[character.id].anchor.set(0.5, 1.3)
            this.container.addChild(this.names[character.id]);
        });

        forEach(this.names, (_, characterId) => {
            if (store.character.data[characterId] && store.characterMovements.data[characterId]) {
                return;
            }

            this.container.removeChild(this.names[characterId])
            delete this.names[characterId];
        })
    }

    render(store: GlobalStore) {
        forEach(this.names, (pixiText, characterId) => {
            const location = store.characterMovements.data[characterId].location;

            // 48 is a sprite height
            pixiText.y = location.y - 48 / 1.5;
            pixiText.x = location.x;
        })
    }
}