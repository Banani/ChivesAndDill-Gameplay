import { EngineModule } from '../../types/EngineModule';
import { BackpackItemsNotifier } from './notifiers/BackpackItemsNotifier';
import { BackpackNotifier } from './notifiers/BackpackNotifier';
import { CurrencyNotifier } from './notifiers/CurrencyNotifier';
import { EquipmentNotifier } from './notifiers/EquipmentNotifier';
import { ItemNotifier } from './notifiers/ItemNotifier';
import { BackpackItemsService } from './services/BackpackItemsService';
import { BackpackService } from './services/BackpackService';
import { CurrencyService } from './services/CurrencyService';
import { EquipmentService } from './services/EquipmentService';
import { ItemMessagesService } from './services/ItemMessagesService';
import { ItemService } from './services/ItemService';
import { ItemTemplateService } from './services/ItemTemplateService';

export interface ItemModuleServices {
    currencyService: CurrencyService;
    backpackService: BackpackService;
    backpackItemsService: BackpackItemsService;
    itemService: ItemService;
    equipmentService: EquipmentService;
    itemTemplateService: ItemTemplateService;
    itemMessagesService: ItemMessagesService;
}

export const getItemModule: () => EngineModule<ItemModuleServices> = () => {
    return {
        notifiers: [new CurrencyNotifier(), new BackpackNotifier(), new BackpackItemsNotifier(), new ItemNotifier(), new EquipmentNotifier()],
        services: {
            currencyService: new CurrencyService(),
            backpackService: new BackpackService(),
            backpackItemsService: new BackpackItemsService(),
            itemService: new ItemService(),
            equipmentService: new EquipmentService(),
            itemTemplateService: new ItemTemplateService(),
            itemMessagesService: new ItemMessagesService(),
        },
    };
};
