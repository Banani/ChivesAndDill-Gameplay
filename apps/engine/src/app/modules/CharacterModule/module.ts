import { EngineModule } from '../../types/EngineModule';
import { CharacterNotifier, ExperienceNotifier, PowerPointsNotifier } from './notifiers';
import { CharactersService, PowerPointsService, RegenerationService } from './services';
import { CorpseDropService } from './services/CorpseDropService';
import { ExperienceService } from './services/ExperienceService';

export interface CharacterModuleServices {
   characterService: CharactersService;
   powerPointsService: PowerPointsService;
   regenerationService: RegenerationService;
   experienceService: ExperienceService;
   corpseDropService: CorpseDropService;
}

export const getCharacterModule: () => EngineModule<CharacterModuleServices> = () => {
   return {
      notifiers: [new CharacterNotifier(), new PowerPointsNotifier(), new ExperienceNotifier()],
      services: {
         characterService: new CharactersService(),
         powerPointsService: new PowerPointsService(),
         regenerationService: new RegenerationService(),
         experienceService: new ExperienceService(),
         corpseDropService: new CorpseDropService(),
      },
   };
};
