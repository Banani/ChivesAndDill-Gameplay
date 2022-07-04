import { EngineModule } from '../../types/EngineModule';
import { BackpackItemsNotifier } from './notifiers/BackpackItemsNotifier';
import { BackpackNotifier } from './notifiers/BackpackNotifier';
import { CurrencyNotifier } from './notifiers/CurrencyNotifier';
import { BackpackItemsService } from './services/BackpackItemsService';
import { BackpackService } from './services/BackpackService';
import { CurrencyService } from './services/CurrencyService';
import { ItemService } from './services/ItemService';

export interface ItemModuleServices {
   currencyService: CurrencyService;
   backpackService: BackpackService;
   backpackItemsService: BackpackItemsService;
   itemService: ItemService;
}

export const getItemModule: () => EngineModule<ItemModuleServices> = () => {
   return {
      notifiers: [new CurrencyNotifier(), new BackpackNotifier(), new BackpackItemsNotifier()],
      services: {
         currencyService: new CurrencyService(),
         backpackService: new BackpackService(),
         backpackItemsService: new BackpackItemsService(),
         itemService: new ItemService(),
      },
   };
};
