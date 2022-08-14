import { CorpseDropTrack } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../ItemModule/Events';
import { PlayerEngineEvents, PlayerTriesToPickItemFromCorpseEvent } from '../../PlayerModule/Events';
import { CharacterEngineEvents, CorpseDropTrackCreatedEvent, ItemWasPickedFromCorpseEvent } from '../Events';

export class CorpseDropService extends EventParser {
   // deadCharacterId => itemId (incrementId)
   private corpsesDropTrack: Record<string, CorpseDropTrack> = {};
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [PlayerEngineEvents.PlayerTriesToPickItemFromCorpse]: this.handlePlayerTriesToPickItemFromCorpse,
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
                  itemTemplateId: dropItem.itemTemplateId,
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

   handlePlayerTriesToPickItemFromCorpse: EngineEventHandler<PlayerTriesToPickItemFromCorpseEvent> = ({ event, services }) => {
      // a co jesli ten character nie ma otwartego loota?

      const corpse = this.corpsesDropTrack[event.corpseId];
      if (!corpse) {
         // nie ma ciala
      }

      const item = corpse.items[event.itemId];
      if (!item) {
         // nie ma itemu
      }

      delete this.corpsesDropTrack[event.corpseId].items[event.itemId];

      this.engineEventCrator.asyncCeateEvent<ItemWasPickedFromCorpseEvent>({
         type: CharacterEngineEvents.ItemWasPickedFromCorpse,
         itemId: event.itemId,
         characterId: event.requestingCharacterId,
         corpseId: event.corpseId,
      });

      this.engineEventCrator.asyncCeateEvent<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: event.requestingCharacterId,
         itemTemplateId: item.itemTemplateId,
         amount: item.amount,
      });
   };

   getCorpseDropTrackById = (id: string) => this.corpsesDropTrack[id];
}
