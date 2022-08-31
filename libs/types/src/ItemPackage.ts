// place => itemInstanceId
export interface EquipmentTrack {
   head: string | null;
   neck: string | null;
   shoulder: string | null;
   back: string | null;
   chest: string | null;
   shirt: string | null;
   tabard: string | null;
   wrist: string | null;

   hands: string | null;
   waist: string | null;
   legs: string | null;
   feet: string | null;
   finger1: string | null;
   finger2: string | null;
   trinket1: string | null;
   trinket2: string | null;

   mainHand: string | null;
   offHand: string | null;
}

export type PossibleEquipmentPlaces = keyof EquipmentTrack;

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

export enum ItemTemplateType {
   Equipment,
   Generic,
}

export interface BaseItemTemplate {
   type: ItemTemplateType;
   id: string;
   name: string;
   image: string;
   stack?: number;
   value: number;
}

export interface EquipmentItemTemplate extends BaseItemTemplate {
   type: ItemTemplateType.Equipment;
   slot: EquipmentSlot;
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

export enum ItemClientMessages {
   Deleteitem = 'DeleteItem',
   MoveItemInBag = 'MoveItemInBag',
   SplitItemStackInBag = 'SplitItemStackInBag',
   RequestItemTemplates = 'RequestItemTemplates',

   EquipItem = 'EquipItem',
   StripItem = 'StripItem',
}

export interface DeleteItem {
   type: ItemClientMessages.Deleteitem;
   itemId: string;
}

export interface MoveItemInBag {
   type: ItemClientMessages.MoveItemInBag;
   itemId: string;
   directionLocation: { backpack: string; spot: string };
}

export interface SplitItemStackInBag {
   type: ItemClientMessages.SplitItemStackInBag;
   itemId: string;
   amount: number;
   directionLocation: { backpack: string; spot: string };
}

export interface RequestItemTemplates {
   type: ItemClientMessages.RequestItemTemplates;
   itemTemplateIds: string[];
}

export interface EquipItem {
   type: ItemClientMessages.EquipItem;
   itemInstanceId: string;
}

export interface StripItem {
   type: ItemClientMessages.StripItem;
   itemInstanceId: string;
   desiredLocation?: ItemLocationInBag;
}

export type EngineItemMessages = DeleteItem | MoveItemInBag | SplitItemStackInBag | RequestItemTemplates | EquipItem | StripItem;
