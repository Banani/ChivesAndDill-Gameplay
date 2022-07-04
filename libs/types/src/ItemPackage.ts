export interface BackpackTrack {
   '1': number | null;
   '2': number | null;
   '3': number | null;
   '4': number | null;
   '5': number | null;
}

export type BackpackItemsSpot = Record<string, Record<string, { itemId: string; amount: number }>>;

export enum ItemClientMessages {
   MoveItemInBackpack = 'MoveItemInBackpack',
}

export interface MoveItemInBackpack {
   type: ItemClientMessages.MoveItemInBackpack;
}

export type EngineItemMessages = MoveItemInBackpack;
