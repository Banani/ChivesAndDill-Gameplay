import { DropItem, DropItemType } from '@bananos/types';

export const items: Record<string, DropItem> = {
   money: {
      type: DropItemType.CURRENCY,
   },
};
