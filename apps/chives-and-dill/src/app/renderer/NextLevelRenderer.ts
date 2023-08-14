import { CharacterClientEvents, GlobalStore } from '@bananos/types';
import { forEach, now } from 'lodash';
import * as PIXI from 'pixi.js';
import { GameSettings, Renderer } from './Renderer';

enum TextStyles {
   Text = 'text',
   Level = 'level',
}

export class NextLevelRenderer implements Renderer {
   private nextLevelText: any = {};
   private nextLevel: any = {};
   private background: PIXI.Graphics;
   private numberTimestamps: Record<string, number> = {};
   private container: PIXI.Container;
   private textStyles: Record<string, PIXI.TextStyle>;

   constructor(container: PIXI.Container) {
      this.container = container;
      const defaultTextStyle = new PIXI.TextStyle({
         fill: '#e8e8e8',
         stroke: '#000000',
         strokeThickness: 2,
         dropShadow: true,
         dropShadowColor: '#363837',
         dropShadowBlur: 4,
         dropShadowAngle: Math.PI / 6,
         dropShadowDistance: 6,
      });

      this.textStyles = {
         [TextStyles.Text]: new PIXI.TextStyle({
            ...defaultTextStyle,
            fontSize: '30px',
         }),
         [TextStyles.Level]: new PIXI.TextStyle({
            ...defaultTextStyle,
            fontSize: '40px',
            fill: '#fac20a',
            dropShadowBlur: 6,
            strokeThickness: 3,
         }),
      };
   }

   updateScene(store: GlobalStore, _, settings: GameSettings) {
      forEach(store.experience.events, (event: any, i) => {
         if (event.type === CharacterClientEvents.LevelChanged) {
            const eventId = event.id;
            if (this.numberTimestamps[eventId]) {
               return;
            }

            const currentTimestamp = now();
            this.nextLevelText[eventId] = new PIXI.Text('You have reached', this.textStyles[TextStyles.Text]);
            this.nextLevel[eventId] = new PIXI.Text(`level: ${event.level}`, this.textStyles[TextStyles.Level]);
            this.background = new PIXI.Graphics();

            this.nextLevelText[eventId].anchor.set(0.5, 0);
            this.nextLevel[eventId].anchor.set(0.5, 0);

            this.numberTimestamps[eventId] = currentTimestamp;
            this.container.addChild(this.background);
            this.container.addChild(this.nextLevelText[eventId]);
            this.container.addChild(this.nextLevel[eventId]);
         }
      });

      const currentTimestamp = now();
      forEach(this.nextLevelText, (number, eventId) => {
         if (this.numberTimestamps[eventId] + 3000 < currentTimestamp) {
            this.container.removeChild(this.nextLevelText[eventId]);
            this.container.removeChild(this.nextLevel[eventId]);
            this.background.clear();
            delete this.nextLevelText[eventId];
            delete this.nextLevel[eventId];
         }
      });
   }

   updateLocalization = (playerLocation, messages, y = 0) => {
      forEach(messages, (event, index) => {
         event.x = playerLocation.x;
         event.y = playerLocation.y + y - 200;
      });
   };

   render(store: GlobalStore) {
      const playerLocation = store.characterMovements.data[store.activeCharacter.data.activeCharacterId].location;
      this.updateLocalization(playerLocation, this.nextLevelText);
      this.updateLocalization(playerLocation, this.nextLevel, 50);

      forEach(this.nextLevelText, () => {
         this.background.clear();
         const rectangleWidth = playerLocation.x + 200 - (playerLocation.x - 200);
         const rectangleHeight = playerLocation.y + 80 - (playerLocation.y - 80);
         this.background.lineStyle(2, 0xfac20a);
         this.background.beginFill(0x000, 0.5);
         this.background.drawRoundedRect(playerLocation.x - 200, playerLocation.y - 230, rectangleWidth, rectangleHeight, 15);
      });
   }
}
