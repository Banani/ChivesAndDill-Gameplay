import { CorpseDropTrack } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { AddCurrencyToCharacterEvent, GenerateItemForCharacterEvent, ItemEngineEvents } from '../../ItemModule/Events';
import { PlayerEngineEvents, PlayerTriesToPickCoinsFromCorpseEvent, PlayerTriesToPickItemFromCorpseEvent } from '../../PlayerModule/Events';
import {
   AllItemsWerePickedFromCorpseEvent,
   CharacterEngineEvents,
   CoinsWerePickedFromCorpseEvent,
   CorpseDropTrackCreatedEvent,
   CorpseDropTrackRemovedEvent,
   ItemWasPickedFromCorpseEvent,
} from '../Events';

export class CorpseDropService extends EventParser {
   // deadCharacterId => itemId (incrementId)
   private corpsesDropTrack: Record<string, CorpseDropTrack> = {};
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [PlayerEngineEvents.PlayerTriesToPickItemFromCorpse]: this.handlePlayerTriesToPickItemFromCorpse,
         [PlayerEngineEvents.PlayerTriesToPickCoinsFromCorpse]: this.handlePlayerTriesToPickCoinsFromCorpse,
         [CharacterEngineEvents.ItemWasPickedFromCorpse]: this.handleItemWasPickedFromCorpse,
         [CharacterEngineEvents.AllItemsWerePickedFromCorpse]: this.handleAllItemsWerePickedFromCorpse,
         [CharacterEngineEvents.CoinsWerePickedFromCorpse]: this.handleCoinsWerePickedFromCorpse,
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
               corpseId: event.characterId,
            });
         }
      }
   };

   handlePlayerTriesToPickItemFromCorpse: EngineEventHandler<PlayerTriesToPickItemFromCorpseEvent> = ({ event, services }) => {
      const activeLoot = services.activeLootService.getCharacterActiveLoot(event.requestingCharacterId);

      if (!activeLoot) {
         this.sendErrorMessage(event.requestingCharacterId, 'You cannot take item from corpse that is not opened by you.');
         return;
      }

      const item = this.corpsesDropTrack[event.corpseId].items[event.itemId];
      if (!item) {
         this.sendErrorMessage(event.requestingCharacterId, 'This item is already taken.');
         return;
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

   handlePlayerTriesToPickCoinsFromCorpse: EngineEventHandler<PlayerTriesToPickCoinsFromCorpseEvent> = ({ event, services }) => {
      const activeLoot = services.activeLootService.getCharacterActiveLoot(event.requestingCharacterId);

      if (!activeLoot) {
         this.sendErrorMessage(event.requestingCharacterId, 'You cannot take item from corpse that is not opened by you.');
         return;
      }

      const coins = this.corpsesDropTrack[event.corpseId].coins;
      if (!coins) {
         this.sendErrorMessage(event.requestingCharacterId, 'This item is already taken.');
         return;
      }

      delete this.corpsesDropTrack[event.corpseId].coins;

      this.engineEventCrator.asyncCeateEvent<CoinsWerePickedFromCorpseEvent>({
         type: CharacterEngineEvents.CoinsWerePickedFromCorpse,
         corpseId: event.corpseId,
      });

      this.engineEventCrator.asyncCeateEvent<AddCurrencyToCharacterEvent>({
         type: ItemEngineEvents.AddCurrencyToCharacter,
         characterId: event.requestingCharacterId,
         amount: coins,
      });
   };

   handleItemWasPickedFromCorpse: EngineEventHandler<ItemWasPickedFromCorpseEvent> = ({ event, services }) => {
      if (!Object.keys(this.corpsesDropTrack[event.corpseId].items).length) {
         delete this.corpsesDropTrack[event.corpseId].items;

         this.engineEventCrator.asyncCeateEvent<AllItemsWerePickedFromCorpseEvent>({
            type: CharacterEngineEvents.AllItemsWerePickedFromCorpse,
            corpseId: event.corpseId,
         });
      }
   };

   handleAllItemsWerePickedFromCorpse: EngineEventHandler<AllItemsWerePickedFromCorpseEvent> = ({ event, services }) => {
      this.clearCorpse(event.corpseId);
   };

   handleCoinsWerePickedFromCorpse: EngineEventHandler<CoinsWerePickedFromCorpseEvent> = ({ event, services }) => {
      this.clearCorpse(event.corpseId);
   };

   clearCorpse = (corpseId: string) => {
      if (!Object.keys(this.corpsesDropTrack[corpseId]).length) {
         delete this.corpsesDropTrack[corpseId];

         this.engineEventCrator.asyncCeateEvent<CorpseDropTrackRemovedEvent>({
            type: CharacterEngineEvents.CorpseDropTrackRemoved,
            corpseId: corpseId,
         });
      }
   };

   getCorpseDropTrackById = (id: string) => this.corpsesDropTrack[id];
}
