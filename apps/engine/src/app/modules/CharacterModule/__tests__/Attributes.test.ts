import { GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import {} from '..';
import _ = require('lodash');

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('Attributes', () => {
   it('Player should be notified about his character attributes', () => {
      const { engineManager, players } = setupEngine();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
         data: {
            playerCharacter_1: {
               agility: 0,
               armor: 0,
               intelect: 0,
               spirit: 0,
               stamina: 0,
               strength: 0,
            },
         },
      });
   });
});
