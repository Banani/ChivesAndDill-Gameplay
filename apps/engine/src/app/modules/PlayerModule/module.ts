import { EngineModule } from '../../types/EngineModule';
import { ActiveCharacterNotifier, ActiveLootNotifier, PlayerNotifier } from './notifiers';
import { CharacterClassNotifier } from './notifiers/CharacterClassNotifier';
import { ErrorMessagesNotifier } from './notifiers/ErrorMessagesNotifier';
import { ActiveLootService, PlayerCharacterService, PlayerService } from './services';
import { CharacterClassService } from './services/CharacterClassService';

export interface PlayerModuleServices {
    playerCharacterService: PlayerCharacterService;
    playerService: PlayerService;
    activeLootService: ActiveLootService;
    characterClassService: CharacterClassService;
}

export const getPlayerModule: () => EngineModule<PlayerModuleServices> = () => {

    return {
        notifiers: [
            new PlayerNotifier(),
            new ActiveCharacterNotifier(),
            new ActiveLootNotifier(),
            new ErrorMessagesNotifier(),
            new CharacterClassNotifier()
        ],
        services: {
            playerCharacterService: new PlayerCharacterService(),
            playerService: new PlayerService(),
            activeLootService: new ActiveLootService(),
            characterClassService: new CharacterClassService()
        }
    };
};
