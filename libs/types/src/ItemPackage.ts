export interface BackpackTrack {
   '1': number | null;
   '2': number | null;
   '3': number | null;
   '4': number | null;
   '5': number | null;
}

export type BackpackItemsSpot = Record<string, Record<string, { itemId: string; amount: number }>>;

export enum ItemClientMessages {
   Deleteitem = 'DeleteItem',
   MoveItemInBag = 'MoveItemInBag',
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

export type EngineItemMessages = DeleteItem | MoveItemInBag;
