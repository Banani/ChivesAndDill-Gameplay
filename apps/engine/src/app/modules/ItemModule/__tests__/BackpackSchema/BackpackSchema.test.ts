import { GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';

const CURRENT_MODULE = GlobalStoreModule.BACKPACK_SCHEMA;

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('BackpackSchema', () => {
   it('Player should get information about his backpack schema', () => {
      const { players, engineManager } = setupEngine();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            playerCharacter_3: {
               '1': 16,
               '2': null,
               '3': null,
               '4': null,
               '5': null,
            },
         },
      });
   });

   it('Other players should not get information about not their backpack schemas', () => {
      const { players, engineManager } = setupEngine();
      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
   });
});
