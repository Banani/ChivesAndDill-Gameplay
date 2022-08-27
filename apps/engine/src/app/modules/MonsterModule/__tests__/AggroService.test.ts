import { CommonClientMessages, GlobalStoreModule, RecursivePartial } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge, times } from 'lodash';
import { Character, CharacterType } from '../../../types';
import { CharacterRespawn, WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { CharacterEngineEvents, TakeCharacterHealthPointsEvent } from '../../CharacterModule/Events';
import { ApplyTargetSpellEffectEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { SpellEffect, SpellEffectType } from '../../SpellModule/types/SpellTypes';
import { MonsterRespawnTemplateService } from '../dataProviders';
import { MonsterTemplate, MonsterTemplates } from '../MonsterTemplates';
import { Monster } from '../types';
import _ = require('lodash');

jest.mock('../dataProviders/MonsterRespawnTemplateService', () => {
   const getData = jest.fn();

   return {
      MonsterRespawnTemplateService: function () {
         return {
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
         };
      },
   };
});

jest.mock('../../NpcModule/services/NpcRespawnTemplateService', () => {
   const getData = jest.fn().mockReturnValue({});

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

const setupEngine = ({ monsterTemplates }: RecursivePartial<{ monsterTemplates: Record<string, CharacterRespawn<MonsterTemplate>> }> = {}) => {
   const calculatedMonsterTemplates = merge(
      {},
      {
         '1': {
            id: '1',
            location: { x: 150, y: 100 },
            characterTemplate: { ...MonsterTemplates['Orc'], sightRange: 300 },
            time: 4000,
            walkingType: WalkingType.None,
         },
      },
      monsterTemplates
   );
   const monsterRespawnTemplateService = new MonsterRespawnTemplateService();
   (monsterRespawnTemplateService.getData as jest.Mock).mockReturnValue(calculatedMonsterTemplates);

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };
   let initialDataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

   return { engineManager, players, monsterTemplates: calculatedMonsterTemplates, initialDataPackage };
};

describe('Aggro service', () => {
   it('Monster should go to character if he is in range', () => {
      const { players, engineManager, monsterTemplates } = setupEngine();

      engineManager.doEngineAction();
      engineManager.doEngineAction();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
         data: {
            monster_0: {
               direction: 2,
               isInMove: true,
               location: {
                  x: 150 - monsterTemplates['1'].characterTemplate.speed,
                  y: 100,
               },
            },
         },
      });
   });

   it('Monster should not go to character if he is not in range', () => {
      const startingLocation = { x: 200, y: 100 };
      const { players, engineManager } = setupEngine({
         monsterTemplates: { '1': { location: startingLocation, characterTemplate: { sightRange: 100 } } },
      });

      engineManager.doEngineAction();
      engineManager.doEngineAction();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
         data: {
            monster_0: {
               direction: 1,
               isInMove: false,
               location: startingLocation,
            },
         },
      });
   });

   it('Monster should go to player character if he came to his sight range', () => {
      const startingLocation = { x: 200, y: 100 };
      const { players, engineManager, monsterTemplates } = setupEngine({
         monsterTemplates: { '1': { location: startingLocation, characterTemplate: { sightRange: 100 } } },
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PlayerStartMove,
         x: 1,
         source: 'D',
      });

      times(12, () => {
         engineManager.doEngineAction();
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PlayerStopMove,
         source: 'D',
      });

      engineManager.doEngineAction();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
         data: {
            monster_0: {
               direction: 2,
               isInMove: true,
               location: { y: 100, x: 200 - monsterTemplates['1'].characterTemplate.speed },
            },
         },
      });
   });

   it('Monster should go back to his respawn when player character ran to far away', () => {
      const startingLocation = { x: 52, y: 100 };
      const { players, engineManager, monsterTemplates } = setupEngine({
         monsterTemplates: { '1': { location: startingLocation, characterTemplate: { sightRange: 2, speed: 1, desiredRange: 1 } } },
      });

      engineManager.doEngineAction();

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PlayerStartMove,
         x: -1,
         source: 'D',
      });

      engineManager.doEngineAction();
      engineManager.doEngineAction();

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PlayerStopMove,
         source: 'D',
      });

      engineManager.doEngineAction();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
         data: {
            monster_0: {
               direction: 1,
               isInMove: false,
               location: startingLocation,
            },
         },
      });
   });

   it('Monster should not go to character if he is in range but dead', () => {
      const { players, engineManager, initialDataPackage } = setupEngine();

      const monster: Monster = _.find(initialDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<TakeCharacterHealthPointsEvent>({
         type: CharacterEngineEvents.TakeCharacterHealthPoints,
         attackerId: monster.id,
         characterId: players['1'].characterId,
         amount: 1000,
      });

      engineManager.doEngineAction();
      engineManager.doEngineAction();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
         data: {
            monster_0: {
               direction: 1,
               isInMove: false,
               location: {
                  x: 150,
                  y: 100,
               },
            },
         },
      });
   });

   it('Monster should start chasing when is beeing hit by player character', () => {
      const startingLocation = { x: 100, y: 100 };
      const { players, engineManager, monsterTemplates } = setupEngine({
         monsterTemplates: { '1': { location: startingLocation, characterTemplate: { sightRange: 25, desiredRange: 1 } } },
      });
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
         type: SpellEngineEvents.ApplyTargetSpellEffect,
         caster: { id: players['1'].characterId } as Character,
         target: monster,
         effect: {
            type: SpellEffectType.Damage,
            amount: 10,
         } as SpellEffect,
      });

      engineManager.doEngineAction();
      engineManager.doEngineAction();
      engineManager.doEngineAction();

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
         data: {
            monster_0: {
               direction: 2,
               isInMove: true,
               location: {
                  x: 94,
                  y: 100,
               },
            },
         },
      });
   });
});
