import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import _ = require('lodash');
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../../ItemModule/Events';
import { NpcTemplates } from '../../NpcTemplate';
import { NpcRespawnTemplateService } from '../../services/NpcRespawnTemplateService';

jest.mock('../../services/NpcRespawnTemplateService', () => {
   const getData = jest.fn();

   return {
      NpcRespawnTemplateService: function () {
         return {
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
         };
      },
   };
});

const setupEngine = () => {
   const respawnService = new NpcRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue({
      Manczur: {
         id: 'Manczur',
         location: { x: 100, y: 100 },
         characterTemplate: NpcTemplates['Manczur'],
         time: 20000,
         walkingType: WalkingType.None,
      },
   });

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('SellItemToNpc action', () => {
   it('Player should have some money removed when he is buying new item', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '3',
         amount: 6,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.SellItemToNpc,
         itemId,
         npcId,
      });

      checkIfPackageIsValid(GlobalStoreModule.CURRENCY, dataPackage, {
         data: {
            playerCharacter_1: 45323815,
         },
      });
   });
});
