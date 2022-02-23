import { EngineModule } from '../../types/EngineModule';
import { CharacterNotifier, PowerPointsNotifier } from './notifiers';
import { CharactersService, PowerPointsService, RegenerationService } from './services';

export interface CharacterModuleServices {
   characterService: CharactersService;
   powerPointsService: PowerPointsService;
   regenerationService: RegenerationService;
}

export const getCharacterModule: () => EngineModule<CharacterModuleServices> = () => {
   return {
      notifiers: [new CharacterNotifier(), new PowerPointsNotifier()],
      services: {
         characterService: new CharactersService(),
         powerPointsService: new PowerPointsService(),
         regenerationService: new RegenerationService(),
      },
   };
};
