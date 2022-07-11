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

export interface ItemTemplate {
   name: string;
   image: string;
   stack?: number;
   value: number;
}

export interface ItemLocationInBag {
   backpack: string;
   spot: string;
}

export type BackpackItemsSpot = Record<string, Record<string, ItemInstance>>;

export enum ItemClientMessages {
   Deleteitem = 'DeleteItem',
   MoveItemInBag = 'MoveItemInBag',
   SplitItemStackInBag = 'SplitItemStackInBag',
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

export type EngineItemMessages = DeleteItem | MoveItemInBag | SplitItemStackInBag;
