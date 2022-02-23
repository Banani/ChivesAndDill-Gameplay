import { PlayerNotifier, PlayerMovementNotifier, ActiveCharacterNotifier } from './notifiers';
import { PlayerCharacterService, PlayerMovementService, PlayerService } from './services';
import { PlayersMovement } from './engines';
import { EngineModule } from '../../types/EngineModule';

export interface PlayerModuleServices {
   playerCharacterService: PlayerCharacterService;
   playerMovementService: PlayerMovementService;
   playerService: PlayerService;
}

export const getPlayerModule: () => EngineModule<PlayerModuleServices> = () => {
   const playerMovementEngine = new PlayersMovement();

   return {
      notifiers: [new PlayerNotifier(), new PlayerMovementNotifier(), new ActiveCharacterNotifier()],
      services: {
         playerCharacterService: new PlayerCharacterService(),
         playerMovementService: new PlayerMovementService(playerMovementEngine),
         playerService: new PlayerService(),
      },
      fastEngines: [playerMovementEngine],
   };
};
