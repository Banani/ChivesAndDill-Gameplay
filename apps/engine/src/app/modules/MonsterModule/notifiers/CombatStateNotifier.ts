import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
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
        const receiverId = this.getReceiverId(event.playerCharacterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId,
                objects: {
                    [event.playerCharacterId]: true
                },
            },
        ]);
    };

    handleCharacterCombatFinished: EngineEventHandler<CharacterCombatFinishedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.playerCharacterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId,
                objects: {
                    [event.playerCharacterId]: false
                },
            },
        ]);
    };
}
