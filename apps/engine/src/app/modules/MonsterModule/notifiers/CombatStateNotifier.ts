import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { CharacterCombatFinishedEvent, CharacterCombatStartedEvent, MonsterEngineEvents } from '../Events';

export class CombatStateNotifier extends Notifier<boolean> {
    constructor() {
        super({ key: GlobalStoreModule.COMBAT_STATE });
        this.eventsToHandlersMap = {
            [MonsterEngineEvents.CharacterCombatStarted]: this.handleCharacterCombatStarted,
            [MonsterEngineEvents.CharacterCombatFinished]: this.handleCharacterCombatFinished
        };
    }

    handleCharacterCombatStarted: EngineEventHandler<CharacterCombatStartedEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.playerCharacterId);
        if (character.type != CharacterType.Player) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId: character.ownerId,
                objects: {
                    [character.id]: true
                },
            },
        ]);
    };

    handleCharacterCombatFinished: EngineEventHandler<CharacterCombatFinishedEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.playerCharacterId);
        if (character.type != CharacterType.Player) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId: character.ownerId,
                objects: {
                    [character.id]: false
                },
            },
        ]);
    };
}
