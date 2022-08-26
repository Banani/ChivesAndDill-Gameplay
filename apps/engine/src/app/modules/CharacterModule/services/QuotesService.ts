import { ChannelType } from '@bananos/types';
import { now } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { ChatEngineEvents, SendChatMessageEvent } from '../../ChatModule/Events';
import { MonsterEngineEvents, MonsterPulledEvent } from '../../MonsterModule/Events';
import { Monster } from '../../MonsterModule/types';

export class QuotesService extends EventParser {
   // characterId => last call
   quotesTimeStamps: Record<string, number> = {};
   QUOTE_COOLDOWN = 5000;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [MonsterEngineEvents.MonsterPulled]: this.handleMonsterPulled,
      };
   }

   handleMonsterPulled: EngineEventHandler<MonsterPulledEvent> = ({ event, services }) => {
      const respawn = services.monsterRespawnTemplateService.getData()[event.monster.respawnId];
      const onPulling = respawn.characterTemplate.quotesEvents?.onPulling;

      if (this.quotesTimeStamps[event.monster.id] > now() - this.QUOTE_COOLDOWN) {
         return;
      }

      if (!onPulling) {
         return;
      }

      if (services.randomGeneratorService.generateNumber() < onPulling.chance) {
         return;
      }

      this.quotesTimeStamps[event.monster.id] = now();

      this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
         type: ChatEngineEvents.SendChatMessage,
         characterId: event.monster.id,
         message: onPulling.quotes[Math.floor(services.randomGeneratorService.generateNumber() * onPulling.quotes.length)],
         channelType: ChannelType.Quotes,
      });
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
      let quotesType;
      let characterId;
      let monster = event.character;

      if (event.character.type === CharacterType.Monster) {
         characterId = event.character.id;
         quotesType = 'onDying';
      } else if (event.character.type === CharacterType.Player) {
         characterId = event.killerId;
         quotesType = 'onKilling';
         monster = services.characterService.getCharacterById(characterId) as Monster;
      } else {
         return;
      }

      if (monster.type !== CharacterType.Monster) {
         return;
      }

      const respawn = services.monsterRespawnTemplateService.getData()[monster.respawnId];
      const quotes = respawn.characterTemplate.quotesEvents?.[quotesType];

      if (this.quotesTimeStamps[characterId] > now() - this.QUOTE_COOLDOWN) {
         return;
      }

      if (!quotes) {
         return;
      }

      if (services.randomGeneratorService.generateNumber() < quotes.chance) {
         return;
      }

      this.quotesTimeStamps[characterId] = now();

      this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
         type: ChatEngineEvents.SendChatMessage,
         characterId,
         message: quotes.quotes[Math.floor(services.randomGeneratorService.generateNumber() * quotes.quotes.length)],
         channelType: ChannelType.Quotes,
      });
   };
}
