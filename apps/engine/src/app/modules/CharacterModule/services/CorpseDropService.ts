import type { CorpseDropTrack } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import type { AddCurrencyToCharacterEvent, GenerateItemForCharacterEvent} from '../../ItemModule/Events';
import { ItemEngineEvents } from '../../ItemModule/Events';
import type { Monster } from '../../MonsterModule/types';
import type { PlayerTriesToPickCoinsFromCorpseEvent, PlayerTriesToPickItemFromCorpseEvent } from '../../PlayerModule/Events';
import { PlayerEngineEvents } from '../../PlayerModule/Events';
import type {
   AllItemsWerePickedFromCorpseEvent,
   CoinsWerePickedFromCorpseEvent,
   CorpseDropTrackCreatedEvent,
   CorpseDropTrackRemovedEvent,
   ItemWasPickedFromCorpseEvent} from '../Events';
import {
   CharacterEngineEvents
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
      const monster: Monster = services.monsterService.getAllCharacters()[event.characterId];
      const monsterRespawns = services.monsterRespawnTemplateService.getData();

      if (monster) {
         const characterTemplate = monsterRespawns[monster.respawnId].characterTemplate;

         if (!characterTemplate.dropSchema) {
            return;
         }

         const corpseDropTrack: CorpseDropTrack = {
            loot: {},
            corpse: {
               location: monster.location,
               monsterTemplateId: characterTemplate.id,
            },
         };
         const { coins } = characterTemplate.dropSchema;
         let coinsAmount = 0;

         if (coins && coins.dropChance >= services.randomGeneratorService.generateNumber()) {
            const amountRange = coins.maxAmount - coins.minAmount;
            coinsAmount = coins.minAmount + Math.round(amountRange * services.randomGeneratorService.generateNumber());
         }

         if (coinsAmount) {
            corpseDropTrack.loot.coins = coinsAmount;
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
            corpseDropTrack.loot.items = itemsToDrop;
         }

         if (Object.keys(corpseDropTrack.loot).length) {
            this.corpsesDropTrack[event.characterId] = corpseDropTrack;

            this.engineEventCrator.asyncCeateEvent<CorpseDropTrackCreatedEvent>({
               type: CharacterEngineEvents.CorpseDropTrackCreated,
               corpseId: event.characterId,
               characterCorpse: corpseDropTrack.corpse,
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
      console.log(this.corpsesDropTrack);
      const item = this.corpsesDropTrack[event.corpseId].loot.items[event.itemId];
      if (!item) {
         this.sendErrorMessage(event.requestingCharacterId, 'This item is already taken.');
         return;
      }

      delete this.corpsesDropTrack[event.corpseId].loot.items[event.itemId];

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

      const coins = this.corpsesDropTrack[event.corpseId].loot.coins;
      if (!coins) {
         this.sendErrorMessage(event.requestingCharacterId, 'This item is already taken.');
         return;
      }

      delete this.corpsesDropTrack[event.corpseId].loot.coins;

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
      if (!Object.keys(this.corpsesDropTrack[event.corpseId].loot.items).length) {
         delete this.corpsesDropTrack[event.corpseId].loot.items;

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
      if (!Object.keys(this.corpsesDropTrack[corpseId].loot).length) {
         delete this.corpsesDropTrack[corpseId];

         this.engineEventCrator.asyncCeateEvent<CorpseDropTrackRemovedEvent>({
            type: CharacterEngineEvents.CorpseDropTrackRemoved,
            corpseId: corpseId,
         });
      }
   };

   getCorpseDropTrackById = (id: string) => this.corpsesDropTrack[id];
}
