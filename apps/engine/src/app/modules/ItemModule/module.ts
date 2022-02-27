import { EngineModule } from '../../types/EngineModule';
import { CurrencyNotifier } from './notifiers/CurrencyNotifier';
import { CurrencyService } from './services/CurrencyService';

export interface ItemModuleServices {
   currencyService: CurrencyService;
}

export const getItemModule: () => EngineModule<ItemModuleServices> = () => {
   return {
      notifiers: [new CurrencyNotifier()],
      services: {
         currencyService: new CurrencyService(),
      },
   };
};
