import { EngineModule } from '../../types/EngineModule';
import { PlayersMovement } from './engines';
import { ActiveCharacterNotifier, ActiveLootNotifier, PlayerMovementNotifier, PlayerNotifier } from './notifiers';
import { CharacterClassNotifier } from './notifiers/CharacterClassNotifier';
import { ErrorMessagesNotifier } from './notifiers/ErrorMessagesNotifier';
import { ActiveLootService, PlayerCharacterService, PlayerMovementService, PlayerService } from './services';
import { CharacterClassService } from './services/CharacterClassService';

export interface PlayerModuleServices {
    playerCharacterService: PlayerCharacterService;
    playerMovementService: PlayerMovementService;
    playerService: PlayerService;
    activeLootService: ActiveLootService;
    characterClassService: CharacterClassService;
}

export const getPlayerModule: () => EngineModule<PlayerModuleServices> = () => {
    const playerMovementEngine = new PlayersMovement();

    return {
        notifiers: [
            new PlayerNotifier(),
            new PlayerMovementNotifier(),
            new ActiveCharacterNotifier(),
            new ActiveLootNotifier(),
            new ErrorMessagesNotifier(),
            new CharacterClassNotifier()
        ],
        services: {
            playerCharacterService: new PlayerCharacterService(),
            playerMovementService: new PlayerMovementService(playerMovementEngine),
            playerService: new PlayerService(),
            activeLootService: new ActiveLootService(),
            characterClassService: new CharacterClassService()
        },
        fastEngines: [playerMovementEngine],
    };
};
