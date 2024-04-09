interface ItemReference {
    itemInstanceId: string;
    itemTemplateId: string;
}

export interface EquipmentReferenceTrack {
    head: ItemReference | null;
    neck: ItemReference | null;
    shoulder: ItemReference | null;
    back: ItemReference | null;
    chest: ItemReference | null;
    shirt: ItemReference | null;
    tabard: ItemReference | null;
    wrist: ItemReference | null;

    hands: ItemReference | null;
    waist: ItemReference | null;
    legs: ItemReference | null;
    feet: ItemReference | null;
    finger1: ItemReference | null;
    finger2: ItemReference | null;
    trinket1: ItemReference | null;
    trinket2: ItemReference | null;

    mainHand: ItemReference | null;
    offHand: ItemReference | null;
}

export enum EquipmentSlot {
    Head = 'head',
    Neck = 'neck',
    Shoulder = 'shoulder',
    Back = 'back',
    Chest = 'chest',
    Shirt = 'shirt',
    Tabard = 'tabard',
    Wrist = 'wrist',

    Hands = 'hands',
    Waist = 'waist',
    Legs = 'legs',
    Feet = 'feet',
    Finger = 'finger',
    Trinket = 'trinket',
}

export interface BackpackTrack {
    '1': number | null;
    '2': number | null;
    '3': number | null;
    '4': number | null;
    '5': number | null;
}

export interface ItemInstance {
    itemId: string;
    amount: number;
}

export interface ItemInstanceReference {
    itemId: string;
    amount: number;
    itemTemplateId: string;
}

export enum ItemTemplateType {
    Equipment = 'equipment',
    Generic = 'generic',
}

export interface BaseItemTemplate {
    type: ItemTemplateType;
    id: string;
    name: string;
    description?: string;
    image: string;
    stack?: number;
    value: number;
}

export interface EquipmentItemTemplate extends BaseItemTemplate {
    type: ItemTemplateType.Equipment;
    slot: EquipmentSlot;
    armor?: number;
    stamina?: number;
    agility?: number;
    intelect?: number;
    strength?: number;
    spirit?: number;
    haste?: number;
    criticalStrike?: number;
    dodge?: number;
    block?: number;
}

export interface GenericItemTemplate extends BaseItemTemplate {
    type: ItemTemplateType.Generic;
}

export type ItemTemplate = GenericItemTemplate | EquipmentItemTemplate;

export interface ItemLocationInBag {
    backpack: string;
    spot: string;
}

export type BackpackItemsSpot = Record<string, Record<string, ItemInstance>>;
export type BackpackItemsSpotReference = Record<string, Record<string, ItemInstanceReference>>;

export enum ItemClientActions {
    DeleteItem = 'Player_DeleteItem',
    MoveItemInBag = 'Player_MoveItemInBag',
    SplitItemStackInBag = 'Player_SplitItemStackInBag',
    RequestItemTemplates = 'Player_RequestItemTemplates',
    EquipItem = 'Player_EquipItem',
    StripItem = 'Player_StripItem',
}

export interface DeleteItem {
    type: ItemClientActions.DeleteItem;
    itemId: string;
}

export interface MoveItemInBag {
    type: ItemClientActions.MoveItemInBag;
    itemId: string;
    directionLocation: { backpack: string; spot: string };
}

export interface SplitItemStackInBag {
    type: ItemClientActions.SplitItemStackInBag;
    itemId: string;
    amount: number;
    directionLocation: { backpack: string; spot: string };
}

export interface RequestItemTemplates {
    type: ItemClientActions.RequestItemTemplates;
    itemTemplateIds: string[];
}

export interface EquipItem {
    type: ItemClientActions.EquipItem;
    itemInstanceId: string;
}

export interface StripItem {
    type: ItemClientActions.StripItem;
    itemInstanceId: string;
    desiredLocation?: ItemLocationInBag;
}

export type EngineItemAction = DeleteItem | MoveItemInBag | SplitItemStackInBag | RequestItemTemplates | EquipItem | StripItem;
