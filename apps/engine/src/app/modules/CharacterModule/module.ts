import { EngineModule } from '../../types/EngineModule';
import { RandomQuoteEngine } from './engines/RandomQuoteEngine';
import { CharacterNotifier, ExperienceNotifier, PowerPointsNotifier } from './notifiers';
import { AttributesNotifier } from './notifiers/AttributesNotifier';
import { AvailableCorpseDropNotifier } from './notifiers/AvailableCorpseDropNotifier';
import { CharactersService, PowerPointsService, RegenerationService } from './services';
import { AttributesService } from './services/AttributesService';
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
   attributesService: AttributesService;
}

export const getCharacterModule: () => EngineModule<CharacterModuleServices> = () => {
   const randomQuoteEngine = new RandomQuoteEngine();
   return {
      notifiers: [new CharacterNotifier(), new PowerPointsNotifier(), new ExperienceNotifier(), new AvailableCorpseDropNotifier(), new AttributesNotifier()],
      services: {
         characterService: new CharactersService(),
         powerPointsService: new PowerPointsService(),
         regenerationService: new RegenerationService(),
         experienceService: new ExperienceService(),
         corpseDropService: new CorpseDropService(),
         quotesService: new QuotesService(randomQuoteEngine),
         attributesService: new AttributesService(),
      },
      slowEngines: [randomQuoteEngine],
   };
};
