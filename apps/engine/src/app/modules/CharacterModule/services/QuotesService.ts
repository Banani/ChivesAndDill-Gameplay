import { ChannelType } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { ChatEngineEvents, SendChatMessageEvent } from '../../ChatModule/Events';

export class QuotesService extends EventParser {
   // characterId => last call
   quotesTimeStamps: Record<string, number> = {};
   QUOTE_COOLDOWN = 5000;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
      };
   }

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
      if (event.character.type !== CharacterType.Monster) {
         return;
      }

      const respawn = services.monsterRespawnTemplateService.getData()[event.character.respawnId];
      const template = services.monsterTemplateService.getData()[respawn.characterTemplate.id];
      const onDyingQuotes = template.quotesEvents?.onDying;

      //   if (this.quotesTimeStamps[event.characterId] > now() - this.QUOTE_COOLDOWN) {
      //      return;
      //   }

      if (!onDyingQuotes) {
         return;
      }

      if (services.randomGeneratorService.generateNumber() < onDyingQuotes.chance) {
         return;
      }

      //   this.quotesTimeStamps[event.characterId] = now();

      this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
         type: ChatEngineEvents.SendChatMessage,
         characterId: event.characterId,
         message: onDyingQuotes.quotes[Math.floor(services.randomGeneratorService.generateNumber() * onDyingQuotes.quotes.length)],
         channelType: ChannelType.Quotes,
      });
   };
}
