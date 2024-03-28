import { BackpackItemsSpot, BackpackTrack, EquipmentTrack, ItemInstance, ItemLocationInBag, PossibleEquipmentPlaces, RecursivePartial } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum ItemEngineEvents {
    CurrencyAmountUpdated = 'CurrencyAmountUpdated',
    RemoveCurrencyFromCharacter = 'RemoveCurrencyFromCharacter',
    AddCurrencyToCharacter = 'AddCurrencyToCharacter',

    BackpackTrackCreated = 'BackpackTrackCreated',
    BackpackItemsContainmentUpdated = 'BackpackItemsContainmentUpdated',

    EquipmentTrackCreated = 'EquipmentTrackCreated',
    ItemEquipped = 'ItemEquiped',
    ItemStripped = 'ItemStripped',

    GenerateItemForCharacter = 'GenerateItemForCharacter',
    AddItemToCharacterInventory = 'AddItemToCharacterInventory',
    ItemAddedToCharacter = 'ItemAddedToCharacter',

    DeleteItem = 'DeleteItem',
    ItemDeleted = 'ItemDeleted',
    ItemRemovedFromBag = 'ItemRemovedFromBag',

    MoveItemInBag = "MoveItemInBag",
    ItemsMovedInBag = 'ItemsMovedInBag',
}

export interface CurrencyAmountUpdatedEvent extends EngineEvent {
    type: ItemEngineEvents.CurrencyAmountUpdated;
    characterId: string;
    newAmount: number;
}

export interface RemoveCurrencyFromCharacterEvent extends EngineEvent {
    type: ItemEngineEvents.RemoveCurrencyFromCharacter;
    characterId: string;
    amount: number;
}

export interface AddCurrencyToCharacterEvent extends EngineEvent {
    type: ItemEngineEvents.AddCurrencyToCharacter;
    characterId: string;
    amount: number;
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

export interface EquipmentTrackCreatedEvent extends EngineEvent {
    type: ItemEngineEvents.EquipmentTrackCreated;
    characterId: string;
    equipmentTrack: EquipmentTrack;
}

export interface GenerateItemForCharacterEvent extends EngineEvent {
    type: ItemEngineEvents.GenerateItemForCharacter;
    characterId: string;
    itemTemplateId: string;
    amount?: number;
    desiredLocation?: ItemLocationInBag;
}

export interface AddItemToCharacterInventoryEvent extends EngineEvent {
    type: ItemEngineEvents.AddItemToCharacterInventory;
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

export interface ItemDeletedEvent extends EngineEvent {
    type: ItemEngineEvents.ItemDeleted;
    lastCharacterOwnerId: string;
    itemId: string;
}

export interface ItemRemovedFromBagEvent extends EngineEvent {
    type: ItemEngineEvents.ItemRemovedFromBag;
    ownerId: string;
    itemId: string;
    position: ItemLocationInBag;
}

export interface MoveItemInBagEvent extends EngineEvent {
    type: ItemEngineEvents.MoveItemInBag;
    itemId: string;
    characterId: string;
    directionLocation: { backpack: string; spot: string };
}

export interface ItemsMovedInBagEvent extends EngineEvent {
    type: ItemEngineEvents.ItemsMovedInBag;
    characterId: string;
    items: { itemInstance: ItemInstance; newLocation: ItemLocationInBag; oldPosition: ItemLocationInBag }[];
}

export interface DeleteItemEvent extends EngineEvent {
    type: ItemEngineEvents.DeleteItem;
    itemId: string;
}

export interface ItemEquippedEvent extends EngineEvent {
    type: ItemEngineEvents.ItemEquipped;
    itemInstanceId: string;
    characterId: string;
    slot: PossibleEquipmentPlaces;
}

export interface ItemStrippedEvent extends EngineEvent {
    type: ItemEngineEvents.ItemStripped;
    itemInstanceId: string;
    characterId: string;
    desiredLocation?: ItemLocationInBag;
    slot: PossibleEquipmentPlaces;
}

export interface ItemEngineEventsMap {
    [ItemEngineEvents.CurrencyAmountUpdated]: EngineEventHandler<CurrencyAmountUpdatedEvent>;
    [ItemEngineEvents.RemoveCurrencyFromCharacter]: EngineEventHandler<RemoveCurrencyFromCharacterEvent>;
    [ItemEngineEvents.AddCurrencyToCharacter]: EngineEventHandler<AddCurrencyToCharacterEvent>;

    [ItemEngineEvents.EquipmentTrackCreated]: EngineEventHandler<EquipmentTrackCreatedEvent>;
    [ItemEngineEvents.ItemEquipped]: EngineEventHandler<ItemEquippedEvent>;
    [ItemEngineEvents.ItemStripped]: EngineEventHandler<ItemStrippedEvent>;

    [ItemEngineEvents.BackpackTrackCreated]: EngineEventHandler<BackpackTrackCreatedEvent>;
    [ItemEngineEvents.BackpackItemsContainmentUpdated]: EngineEventHandler<BackpackItemsContainmentUpdatedEvent>;

    [ItemEngineEvents.GenerateItemForCharacter]: EngineEventHandler<GenerateItemForCharacterEvent>;
    [ItemEngineEvents.AddItemToCharacterInventory]: EngineEventHandler<AddItemToCharacterInventoryEvent>;
    [ItemEngineEvents.ItemAddedToCharacter]: EngineEventHandler<ItemAddedToCharacterEvent>;
    [ItemEngineEvents.ItemDeleted]: EngineEventHandler<ItemDeletedEvent>;
    [ItemEngineEvents.ItemRemovedFromBag]: EngineEventHandler<ItemRemovedFromBagEvent>;
    [ItemEngineEvents.MoveItemInBag]: EngineEventHandler<MoveItemInBagEvent>;
    [ItemEngineEvents.ItemsMovedInBag]: EngineEventHandler<ItemsMovedInBagEvent>;
    [ItemEngineEvents.DeleteItem]: EngineEventHandler<DeleteItemEvent>;
}
