import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge } from 'lodash';
import { RecursivePartial } from '../../../types';
import { NpcTemplate, NpcTemplates } from '../NpcTemplate';
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

const setupEngine = (npcRespawns: RecursivePartial<Record<string, CharacterRespawn<NpcTemplate>>> = {}) => {
   const respawnService = new NpcRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue(
      merge(
         {},
         {
            Manczur: {
               id: 'Manczur',
               location: { x: 100, y: 100 },
               characterTemplate: NpcTemplates['Manczur'],
               time: 20000,
               walkingType: WalkingType.None,
            },
         },
         npcRespawns
      )
   );

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('PlayerTriesToFinalizeQuestWithNpc action', () => {
   it('Player should get error if he tries to finalize quest with npc that he is not talking with', () => {
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
         type: NpcClientMessages.FinalizeQuestWithNpc,
         npcId,
         questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'You are not talking with such npc.', dataPackage);
   });

   it('Player should get error if he tries to finish quest that this npc is not offering', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.FinalizeQuestWithNpc,
         npcId,
         questId: 'random_id',
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'This npc does not have such quest.', dataPackage);
   });

   it('Player should get error if he tries to finish quest that character does not have', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.FinalizeQuestWithNpc,
         npcId,
         questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'You does not have that quest.', dataPackage);
   });

   it('Player should get error if he tries to finish quest which is not done yet', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.PlayerTriesToTakeQuestFromNpc,
         npcId,
         questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.FinalizeQuestWithNpc,
         npcId,
         questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'This quest is not done yet.', dataPackage);
   });
});
