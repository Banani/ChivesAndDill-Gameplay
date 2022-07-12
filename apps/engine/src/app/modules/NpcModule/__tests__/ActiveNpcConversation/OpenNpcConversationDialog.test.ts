import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import _ = require('lodash');
import { NpcTemplate, NpcTemplates } from '../../NpcTemplate';
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

const CURRENT_MODULE = GlobalStoreModule.NPC_CONVERSATION;

const setupEngine = (npcRespawns: Record<string, CharacterRespawn<NpcTemplate>> = {}) => {
   const respawnService = new NpcRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue({
      Manczur: {
         id: 'Manczur',
         location: { x: 100, y: 100 },
         characterTemplate: NpcTemplates['Manczur'],
         time: 20000,
         walkingType: WalkingType.None,
      },
      ...npcRespawns,
   });

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('OpenNpcConversationDialog action', () => {
   it('Player should be able to start conversation', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { playerCharacter_1: { npcId } },
      });
   });

   it('Player should get error if he tries to start conversation with npc that does not exist', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId: 'some_random_npc',
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'That npc does not exist.', dataPackage);
   });

   it('Player should get error if he tries to start conversation with npc that is too far away', () => {
      const { players, engineManager } = setupEngine({
         Manczur: {
            id: 'Manczur',
            location: { x: 151, y: 100 },
            characterTemplate: NpcTemplates['Manczur'],
            time: 20000,
            walkingType: WalkingType.None,
         },
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You are too far away.', dataPackage);
   });
});
