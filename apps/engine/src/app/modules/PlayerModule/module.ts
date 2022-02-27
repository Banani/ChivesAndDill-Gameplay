import { PlayerNotifier, PlayerMovementNotifier, ActiveCharacterNotifier, ActiveLootNotifier } from './notifiers';
import { ActiveLootService, PlayerCharacterService, PlayerMovementService, PlayerService } from './services';
import { PlayersMovement } from './engines';
import { EngineModule } from '../../types/EngineModule';
import { ErrorMessagesNotifier } from './notifiers/ErrorMessagesNotifier';

export interface PlayerModuleServices {
   playerCharacterService: PlayerCharacterService;
   playerMovementService: PlayerMovementService;
   playerService: PlayerService;
   activeLootService: ActiveLootService;
}

export const getPlayerModule: () => EngineModule<PlayerModuleServices> = () => {
   const playerMovementEngine = new PlayersMovement();

   return {
      notifiers: [new PlayerNotifier(), new PlayerMovementNotifier(), new ActiveCharacterNotifier(), new ActiveLootNotifier(), new ErrorMessagesNotifier()],
      services: {
         playerCharacterService: new PlayerCharacterService(),
         playerMovementService: new PlayerMovementService(playerMovementEngine),
         playerService: new PlayerService(),
         activeLootService: new ActiveLootService(),
      },
      fastEngines: [playerMovementEngine],
   };
};
