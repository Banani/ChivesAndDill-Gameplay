import { GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';

const CURRENT_MODULE = GlobalStoreModule.BACKPACK_ITEMS;

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('BackpackItemsContainment', () => {
   it('Player should get information about his backpack items', () => {
      const { players, engineManager } = setupEngine();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            playerCharacter_3: {
               '1': {
                  '3': {
                     amount: 1,
                     itemId: '2',
                  },
               },
            },
         },
      });
   });

   it('Other players should not get information about not their backpack items', () => {
      const { players, engineManager } = setupEngine();
      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
   });
});
