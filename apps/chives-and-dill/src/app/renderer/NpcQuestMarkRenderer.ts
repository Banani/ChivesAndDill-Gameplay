import { CharacterType, GlobalStore } from "@bananos/types";
import { forEach } from "lodash";
import * as PIXI from 'pixi.js';
import exclamationMark from '../../assets/spritesheets/questNpc/exclamationMark.png';
import { Renderer } from "./Renderer";
// import questionMark from '../../assets/spritesheets/questNpc/questionMark.png';

export class NpcQuestMarkRenderer implements Renderer {
    private questMarks: Record<string, PIXI.Sprite> = {};
    private container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    updateScene(store: GlobalStore) {

        forEach(store.character.data, (character, npcId) => {
            if (character.type !== CharacterType.Npc || this.questMarks[npcId]) {
                return;
            }

            const templateId = (character as any).templateId

            if (Object.keys(store.npcQuests.data[templateId] ?? {}).length === 0) {
                return;
            }

            this.questMarks[npcId] = PIXI.Sprite.from(exclamationMark);
            this.questMarks[npcId].x = store.characterMovements.data[npcId].location.x;
            this.questMarks[npcId].y = store.characterMovements.data[npcId].location.y - 95;
            this.container.addChild(this.questMarks[npcId])
        });
    }

    render(store: GlobalStore) { }
}