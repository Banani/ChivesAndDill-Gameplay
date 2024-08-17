import { CharacterType, GlobalStore } from '@bananos/types';
import { forEach } from 'lodash';
import * as PIXI from 'pixi.js';
import exclamationMark from '../../assets/spritesheets/questNpc/exclamationMark.png';
import questionMark from '../../assets/spritesheets/questNpc/questionMark.png';
import questionMarkGray from '../../assets/spritesheets/questNpc/questionMarkGray.png';
import { Renderer } from './Renderer';

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

         const templateId = (character as any).templateId;

         if (Object.keys(store.npcQuests.data[templateId] ?? {}).length === 0) {
            return;
         }

         this.questMarks[npcId] = new PIXI.Sprite();
         this.questMarks[npcId].texture = PIXI.Texture.from(exclamationMark);
         this.questMarks[npcId].x = store.characterMovements.data[npcId].location.x;
         this.questMarks[npcId].y = store.characterMovements.data[npcId].location.y - 95;
         this.container.addChild(this.questMarks[npcId]);
      });

      forEach(this.questMarks, (_, npcId) => {
         const npc = store.character.data[npcId];
         const templateId = (npc as any).templateId;

         if (Object.keys(store.npcQuests.data[templateId] ?? {}).length !== 0) {
            return;
         }

         this.container.removeChild(this.questMarks[npcId]);
         delete this.questMarks[npcId];
      });
   }

   render(store: GlobalStore) {
      forEach(store.character.data, (character, npcId) => {
         const templateId = (character as any).templateId;
         forEach(store.npcQuests.data[templateId], (_, questId) => {
            if (store.questProgress.data[questId]?.allStagesCompleted) {
               this.questMarks[npcId].texture = PIXI.Texture.from(questionMark);
            } else if (!store.questProgress?.data[questId]) {
               this.questMarks[npcId].texture = PIXI.Texture.from(exclamationMark);
            } else if (store.questProgress?.data[questId]) {
               this.questMarks[npcId].texture = PIXI.Texture.from(questionMarkGray);
            }
         });
      });
   }
}
