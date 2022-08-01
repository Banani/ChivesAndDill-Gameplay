import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { ItemTemplates } from '../../ItemModule/ItemTemplates';
import { NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import _ = require('lodash');

jest.mock('../services/NpcRespawnTemplateService', () => {
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

const CURRENT_MODULE = GlobalStoreModule.NPC_STOCK;

const setupEngine = () => {
   const respawnService = new NpcRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue({
      Manczur: {
         id: 'Manczur',
         location: { x: 100, y: 100 },
         characterTemplate: {
            ...NpcTemplates['Manczur'],
            stock: {
               '1': ItemTemplates['1'],
               '2': ItemTemplates['2'],
               '4': ItemTemplates['4'],
            },
         },
         time: 20000,
         walkingType: WalkingType.None,
      },
      Kreton: {
         id: 'Kreton',
         location: { x: 80, y: 100 },
         characterTemplate: {
            ...NpcTemplates['KretonPL'],
            stock: undefined,
         },
         time: 20000,
         walkingType: WalkingType.None,
      },
   });

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
   const npcs = {
      Manczur: _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name),
      KretonPL: _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['KretonPL'].name),
   };

   return { engineManager, players, npcs };
};

describe('Npc Stock', () => {
   it('Player should be notifier about items that this npc is selling, when starting conversation', () => {
      const { players, engineManager, npcs } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId: npcs['Manczur'].id,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { [npcs['Manczur'].id]: { '1': true, '2': true, '4': true, '5': true } },
      });
   });

   it('Player should not be notified about items when npc has nothing to sell', () => {
      const { players, engineManager, npcs } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId: npcs['KretonPL'].id,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
   });
});
