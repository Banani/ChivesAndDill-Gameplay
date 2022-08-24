import { EngineModule } from '../../types/EngineModule';
import { CharacterNotifier, ExperienceNotifier, PowerPointsNotifier } from './notifiers';
import { AvailableCorpseDropNotifier } from './notifiers/AvailableCorpseDropNotifier';
import { CharactersService, PowerPointsService, RegenerationService } from './services';
import { CorpseDropService } from './services/CorpseDropService';
import { ExperienceService } from './services/ExperienceService';
import { QuotesService } from './services/QuotesService';

export interface CharacterModuleServices {
   characterService: CharactersService;
   powerPointsService: PowerPointsService;
   regenerationService: RegenerationService;
   experienceService: ExperienceService;
   corpseDropService: CorpseDropService;
   quotesService: QuotesService;
}

export const getCharacterModule: () => EngineModule<CharacterModuleServices> = () => {
   return {
      notifiers: [new CharacterNotifier(), new PowerPointsNotifier(), new ExperienceNotifier(), new AvailableCorpseDropNotifier()],
      services: {
         characterService: new CharactersService(),
         powerPointsService: new PowerPointsService(),
         regenerationService: new RegenerationService(),
         experienceService: new ExperienceService(),
         corpseDropService: new CorpseDropService(),
         quotesService: new QuotesService(),
      },
   };
};
