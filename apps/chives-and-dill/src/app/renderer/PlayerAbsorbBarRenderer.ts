import { AbsorbShieldTrack, GlobalStore } from '@bananos/types';
import { filter, forEach } from 'lodash';
import * as PIXI from 'pixi.js';
import { Renderer } from './Renderer';

export class PlayerAbsorbBarRenderer implements Renderer {
   private bars: PIXI.Graphics;
   private container: PIXI.Container;
   private activeShield: AbsorbShieldTrack[];

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
      const borderWidth = 1;
      const spriteHeight = 48;

      forEach(store.characterPowerPoints.data, (characterPowerPoints, characterId) => {
         this.activeShield = filter(store.absorbShields.data, (value, key) => {
            return value.ownerId === characterId;
         });
      });

      forEach(this.activeShield, (absorbShield) => {
         const location = store.characterMovements.data[absorbShield.ownerId].location;
         const { maxHp, currentHp } = store.characterPowerPoints.data[absorbShield.ownerId];
         const playerAbsorb = absorbShield.value;
         const barWidth = (playerAbsorb / (playerAbsorb + maxHp)) * 50;
         const healthBarWidth = (currentHp / (playerAbsorb + maxHp)) * 50 - 25;

         this.bars.beginFill(0xe8e8e8);
         this.bars.drawRect(location.x + healthBarWidth, location.y - spriteHeight + 7 + borderWidth, barWidth, 5);
         this.bars.endFill();
      });
   }
}
