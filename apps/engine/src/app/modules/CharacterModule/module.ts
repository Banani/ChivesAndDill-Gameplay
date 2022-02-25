import { EngineModule } from '../../types/EngineModule';
import { CharacterNotifier, ExperienceNotifier, PowerPointsNotifier } from './notifiers';
import { CharactersService, PowerPointsService, RegenerationService } from './services';
import { ExperienceService } from './services/ExperienceService';

export interface CharacterModuleServices {
   characterService: CharactersService;
   powerPointsService: PowerPointsService;
   regenerationService: RegenerationService;
   experienceService: ExperienceService;
}

export const getCharacterModule: () => EngineModule<CharacterModuleServices> = () => {
   return {
      notifiers: [new CharacterNotifier(), new PowerPointsNotifier(), new ExperienceNotifier()],
      services: {
         characterService: new CharactersService(),
         powerPointsService: new PowerPointsService(),
         regenerationService: new RegenerationService(),
         experienceService: new ExperienceService(),
      },
   };
};
