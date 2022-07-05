import { BackpackItemsSpot, BackpackTrack } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum ItemEngineEvents {
   CurrencyAmountUpdated = 'CurrencyAmountUpdated',

   BackpackTrackCreated = 'BackpackTrackCreated',

   BackpackItemsContainmentUpdated = 'BackpackItemsContainmentUpdated',

   GenerateItemForCharacter = 'GenerateItemForCharacter',
   AddItemToCharacter = 'AddItemToCharacter',
   ItemAddedToCharacter = 'ItemAddedToCharacter',

   PlayerTriesToDeleteItem = 'PlayerTriesToDeleteItem',
   ItemDeleted = 'ItemDeleted',
   ItemRemovedFromBag = 'ItemRemovedFromBag',
}

export interface CurrencyAmountUpdatedEvent extends EngineEvent {
   type: ItemEngineEvents.CurrencyAmountUpdated;
   characterId: string;
   newAmount: number;
}

export interface BackpackTrackCreatedEvent extends EngineEvent {
   type: ItemEngineEvents.BackpackTrackCreated;
   characterId: string;
   backpackTrack: BackpackTrack;
}

export interface BackpackItemsContainmentUpdatedEvent extends EngineEvent {
   type: ItemEngineEvents.BackpackItemsContainmentUpdated;
   characterId: string;
   backpackItemsContainment: BackpackItemsSpot;
}

export interface GenerateItemForCharacterEvent extends EngineEvent {
   type: ItemEngineEvents.GenerateItemForCharacter;
   characterId: string;
   itemTemplateId: string;
   amount: number;
}

export interface AddItemToCharacterEvent extends EngineEvent {
   type: ItemEngineEvents.AddItemToCharacter;
   characterId: string;
   itemId: string;
   amount: number;
}

export interface ItemAddedToCharacterEvent extends EngineEvent {
   type: ItemEngineEvents.ItemAddedToCharacter;
   characterId: string;
   itemId: string;
   amount: number;
   position: { backpack: number; spot: number };
}

export interface PlayerTriesToDeleteItemEvent extends EngineEvent {
   type: ItemEngineEvents.PlayerTriesToDeleteItem;
   itemId: string;
}

export interface ItemDeletedEvent extends EngineEvent {
   type: ItemEngineEvents.ItemDeleted;
   lastCharacterOwnerId: string;
   itemId: string;
}

export interface ItemRemovedFromBagEvent extends EngineEvent {
   type: ItemEngineEvents.ItemRemovedFromBag;
   ownerId: string;
   itemId: string;
   position: { backpack: number; spot: number };
}

export interface ItemEngineEventsMap {
   [ItemEngineEvents.CurrencyAmountUpdated]: EngineEventHandler<CurrencyAmountUpdatedEvent>;
   [ItemEngineEvents.BackpackTrackCreated]: EngineEventHandler<BackpackTrackCreatedEvent>;
   [ItemEngineEvents.BackpackItemsContainmentUpdated]: EngineEventHandler<BackpackItemsContainmentUpdatedEvent>;
   [ItemEngineEvents.GenerateItemForCharacter]: EngineEventHandler<GenerateItemForCharacterEvent>;
   [ItemEngineEvents.AddItemToCharacter]: EngineEventHandler<AddItemToCharacterEvent>;
   [ItemEngineEvents.ItemAddedToCharacter]: EngineEventHandler<ItemAddedToCharacterEvent>;
   [ItemEngineEvents.PlayerTriesToDeleteItem]: EngineEventHandler<PlayerTriesToDeleteItemEvent>;
   [ItemEngineEvents.ItemDeleted]: EngineEventHandler<ItemDeletedEvent>;
   [ItemEngineEvents.ItemRemovedFromBag]: EngineEventHandler<ItemRemovedFromBagEvent>;
}
