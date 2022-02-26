export enum DropItemType {
   CURRENCY,
}

export interface DropCurrency {
   type: DropItemType.CURRENCY;
   name: string;
}

export type DropItem = DropCurrency; // OR DropObject

export const items: Record<string, DropItem> = {
   money: {
      type: DropItemType.CURRENCY,
      name: 'money',
   },
};
