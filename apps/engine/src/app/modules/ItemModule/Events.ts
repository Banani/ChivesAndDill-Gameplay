import { BackpackItemsSpot, BackpackTrack, ItemInstance } from '@bananos/types';
import { EngineEvent, EngineEventHandler, RecursivePartial } from '../../types';

export enum ItemEngineEvents {
   CurrencyAmountUpdated = 'CurrencyAmountUpdated',

   BackpackTrackCreated = 'BackpackTrackCreated',

   BackpackItemsContainmentUpdated = 'BackpackItemsContainmentUpdated',

   GenerateItemForCharacter = 'GenerateItemForCharacter',
   AddItemToCharacter = 'AddItemToCharacter',
   ItemAddedToCharacter = 'ItemAddedToCharacter',

   PlayerTriesToDeleteItem = 'PlayerTriesToDeleteItem',
   DeleteItem = 'DeleteItem',
   ItemDeleted = 'ItemDeleted',
   ItemRemovedFromBag = 'ItemRemovedFromBag',

   PlayerTriesToMoveItemInBag = 'PlayerTriesToMoveItemInBag',
   ItemsMovedInBag = 'ItemsMovedInBag',

   PlayerTriesToSplitItemStack = 'PlayerTriesToSplitItemStack',
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
   backpackItemsContainment: RecursivePartial<BackpackItemsSpot>;
}

export interface GenerateItemForCharacterEvent extends EngineEvent {
   type: ItemEngineEvents.GenerateItemForCharacter;
   characterId: string;
   itemTemplateId: string;
   amount?: number;
   desiredLocation?: ItemLocationInBag;
}

export interface AddItemToCharacterEvent extends EngineEvent {
   type: ItemEngineEvents.AddItemToCharacter;
   characterId: string;
   itemId: string;
   amount: number;
   desiredLocation?: ItemLocationInBag;
}

export interface ItemAddedToCharacterEvent extends EngineEvent {
   type: ItemEngineEvents.ItemAddedToCharacter;
   characterId: string;
   itemId: string;
   amount: number;
   position: ItemLocationInBag;
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

export interface ItemLocationInBag {
   backpack: string;
   spot: string;
}

export interface ItemRemovedFromBagEvent extends EngineEvent {
   type: ItemEngineEvents.ItemRemovedFromBag;
   ownerId: string;
   itemId: string;
   position: ItemLocationInBag;
}

export interface PlayerTriesToMoveItemInBagEvent extends EngineEvent {
   type: ItemEngineEvents.PlayerTriesToMoveItemInBag;
   itemId: string;
   directionLocation: ItemLocationInBag;
}

export interface ItemsMovedInBagEvent extends EngineEvent {
   type: ItemEngineEvents.ItemsMovedInBag;
   characterId: string;
   items: { itemInstance: ItemInstance; newLocation: ItemLocationInBag; oldPosition: ItemLocationInBag }[];
}

export interface PlayerTriesToSplitItemStackEvent extends EngineEvent {
   type: ItemEngineEvents.PlayerTriesToSplitItemStack;
   itemId: string;
   amount: number;
   directionLocation: ItemLocationInBag;
}

export interface DeleteItemEvent extends EngineEvent {
   type: ItemEngineEvents.DeleteItem;
   itemId: string;
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
   [ItemEngineEvents.PlayerTriesToMoveItemInBag]: EngineEventHandler<PlayerTriesToMoveItemInBagEvent>;
   [ItemEngineEvents.ItemsMovedInBag]: EngineEventHandler<ItemsMovedInBagEvent>;
   [ItemEngineEvents.PlayerTriesToSplitItemStack]: EngineEventHandler<PlayerTriesToSplitItemStackEvent>;
   [ItemEngineEvents.DeleteItem]: EngineEventHandler<DeleteItemEvent>;
}
