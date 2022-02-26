import { CorpseDropTrack } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { MonsterRespawns } from '../../MonsterModule/MonsterRespawns';
import { CharacterEngineEvents, CorpseDropTrackCreatedEvent } from '../Events';

export class CorpseDropService extends EventParser {
   // deadCharacterId => itemId (incrementId)
   private corpsesDropTrack: Record<string, CorpseDropTrack> = {};
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
      };
   }

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
      const monster = services.monsterService.getAllCharacters()[event.characterId];

      if (monster) {
         const characterTemplate = MonsterRespawns[monster.respawnId].characterTemplate;
         const itemsToDrop = {};

         // TODO: create some Random number generator service
         characterTemplate.dropSchema
            ?.filter((dropItem) => dropItem.dropChance >= Math.random())
            .forEach((dropItem) => {
               this.increment++;
               const amountRange = dropItem.maxAmount - dropItem.minAmount;
               itemsToDrop[this.increment] = { amount: dropItem.minAmount + Math.round(amountRange * Math.random()), item: dropItem.item };
            });

         if (Object.keys(itemsToDrop).length) {
            this.corpsesDropTrack[event.characterId] = itemsToDrop;

            this.engineEventCrator.asyncCeateEvent<CorpseDropTrackCreatedEvent>({
               type: CharacterEngineEvents.CorpseDropTrackCreated,
               characterId: event.characterId,
            });
         }
      }
   };

   getCorpseDropTrackById = (id: string) => this.corpsesDropTrack[id];
}
