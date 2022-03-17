import { CharacterClientEvents, EngineEventType, ExperienceGainSource, GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { AddExperienceEvent, CharacterEngineEvents } from '../../Events';

interface setupEngineProps {
   chatChannelName: string;
}

const CURRENT_MODULE = GlobalStoreModule.EXPERIENCE;

const setupEngine = ({ chatChannelName }: setupEngineProps = { chatChannelName: 'channelName' }) => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

jest.mock('../../../MonsterModule/MonsterRespawns', () => ({
   MonsterRespawns: {},
}));

jest.mock('../../../NpcModule/NpcRespawns', () => ({
   NpcRespawns: {},
}));

describe('Character experience', () => {
   it('When character is created he should be informed about his experience track and other characters level', () => {
      const { engineManager, players } = setupEngine();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { playerCharacter_1: { level: 1 }, playerCharacter_2: { experienceAmount: 0, level: 1, toNextLevel: 250 } },
      });
   });

   it('When character is created other players should be informed about his level', () => {
      const { engineManager, players } = setupEngine();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { playerCharacter_2: { level: 1 } },
      });
   });

   it('Player should be notifier when his character is gaining experience', () => {
      const { engineManager, players } = setupEngine();

      engineManager.createSystemAction<AddExperienceEvent>({
         type: CharacterEngineEvents.AddExperience,
         amount: 100,
         characterId: players['1'].characterId,
         experienceGainDetails: {
            type: ExperienceGainSource.MonsterKill,
            monsterId: '123',
         },
      });

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { playerCharacter_1: { experienceAmount: 100 } },
         events: [
            {
               amount: 100,
               characterId: 'playerCharacter_1',
               type: CharacterClientEvents.ExperienceGain,
               experienceGainDetails: {
                  type: ExperienceGainSource.MonsterKill,
                  monsterId: '123',
               },
            },
         ],
      });
   });

   it('Other players should not be informed about experience gain', () => {
      const { engineManager, players } = setupEngine();

      engineManager.createSystemAction<AddExperienceEvent>({
         type: CharacterEngineEvents.AddExperience,
         amount: 100,
         characterId: players['1'].characterId,
         experienceGainDetails: {
            type: ExperienceGainSource.MonsterKill,
            monsterId: '123',
         },
      });

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
   });
});
