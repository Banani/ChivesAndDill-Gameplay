import { EquipmentSlot, GlobalStoreModule, ItemClientMessages, ItemTemplateType } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';

const CURRENT_MODULE = GlobalStoreModule.ITEMS;

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('Items', () => {
   it('Player should get requested item templates', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.RequestItemTemplates, itemTemplateIds: ['1', '3'] });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            '1': {
               id: '1',
               image: 'https://www.tibiaitens.com.br/image/cache/catalog/espadas/mercenary-swordtibia-605-500x500.png',
               name: 'Mercenary sword',
               value: 1000,
               type: ItemTemplateType.Equipment,
               slot: EquipmentSlot.Feet,
            },
            '3': {
               id: '3',
               image: 'https://static.wikia.nocookie.net/wowpedia/images/7/78/Inv_misc_fish_24.png',
               name: 'Mackerel',
               stack: 20,
               value: 95,
               type: ItemTemplateType.Generic,
            },
         },
      });
   });

   it('Player should get requested item templates', () => {
      const { players, engineManager } = setupEngine();
      const RANDOM_ID = 'RANDOM_ID';

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.RequestItemTemplates, itemTemplateIds: [RANDOM_ID] });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            [RANDOM_ID]: undefined,
         },
      });
   });
});
