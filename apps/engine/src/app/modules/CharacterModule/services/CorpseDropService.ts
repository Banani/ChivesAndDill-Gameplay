import { CorpseDropTrack } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, EngineEventHandler } from '../../../types';
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
      const monsterRespawns = services.monsterRespawnTemplateService.getData();

      if (monster) {
         const characterTemplate = monsterRespawns[monster.respawnId].characterTemplate;
         const corpseDropTrack: CorpseDropTrack = {};

         if (!characterTemplate.dropSchema) {
            return;
         }

         const { coins } = characterTemplate.dropSchema;
         let coinsAmount = 0;

         if (coins && coins.dropChance >= services.randomGeneratorService.generateNumber()) {
            const amountRange = coins.maxAmount - coins.minAmount;
            coinsAmount = coins.minAmount + Math.round(amountRange * services.randomGeneratorService.generateNumber());
         }

         if (coinsAmount) {
            corpseDropTrack.coins = coinsAmount;
         }

         const itemsToDrop = {};
         characterTemplate.dropSchema.items
            ?.filter((dropItem) => dropItem.dropChance >= services.randomGeneratorService.generateNumber())
            .forEach((dropItem) => {
               this.increment++;
               const amountRange = dropItem.maxAmount - dropItem.minAmount;
               itemsToDrop['corpseItemId_' + this.increment] = {
                  amount: dropItem.minAmount + Math.round(amountRange * services.randomGeneratorService.generateNumber()),
                  itemId: dropItem.itemTempalteId,
               };
            });

         if (Object.keys(itemsToDrop).length > 0) {
            corpseDropTrack.items = itemsToDrop;
         }

         if (Object.keys(corpseDropTrack).length) {
            this.corpsesDropTrack[event.characterId] = corpseDropTrack;

            this.engineEventCrator.asyncCeateEvent<CorpseDropTrackCreatedEvent>({
               type: CharacterEngineEvents.CorpseDropTrackCreated,
               characterId: event.characterId,
            });
         }
      }
   };

   getCorpseDropTrackById = (id: string) => this.corpsesDropTrack[id];
}
