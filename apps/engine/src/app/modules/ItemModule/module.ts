import { EngineModule } from '../../types/EngineModule';
import { BackpackNotifier } from './notifiers/BackpackNotifier';
import { CurrencyNotifier } from './notifiers/CurrencyNotifier';
import { BackpackService } from './services/BackpackService';
import { CurrencyService } from './services/CurrencyService';

export interface ItemModuleServices {
   currencyService: CurrencyService;
   backpackService: BackpackService;
}

export const getItemModule: () => EngineModule<ItemModuleServices> = () => {
   return {
      notifiers: [new CurrencyNotifier(), new BackpackNotifier()],
      services: {
         currencyService: new CurrencyService(),
         backpackService: new BackpackService(),
      },
   };
};
