import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { CharacterType } from '../../../types';
import { CharacterEngineEvents, SendQuoteMessageEvent } from '../Events';

export class RandomQuoteEngine extends Engine {
   doAction() {
      const characters = this.services.characterService.getAllCharacters();

      forEach(characters, (character) => {
         if (!character) {
            return;
         }

         if (character.type === CharacterType.Player) {
            return;
         }

         if (!this.services.quotesService.canNpcSayQuote(character.id)) {
            return;
         }

         const monsterFight = this.services.aggroService.getMonsterAggro()[character.id];
         if (monsterFight) {
            return;
         }

         let quotes;

         if (character.type === CharacterType.Monster) {
            quotes = this.services.monsterRespawnTemplateService.getData()[character.respawnId].characterTemplate.quotesEvents?.standard;
         }

         if (character.type === CharacterType.Npc) {
            quotes = this.services.npcRespawnTemplateService.getData()[character.respawnId].characterTemplate.quotesEvents?.standard;
         }

         const rand = this.services.randomGeneratorService.generateNumber();
         if (!quotes || rand > quotes.chance) {
            return;
         }

         this.eventCrator.createEvent<SendQuoteMessageEvent>({
            type: CharacterEngineEvents.SendQuoteMessage,
            characterId: character.id,
            message: quotes.quotes[Math.floor(this.services.randomGeneratorService.generateNumber() * quotes.quotes.length)],
         });
      });
   }
}
