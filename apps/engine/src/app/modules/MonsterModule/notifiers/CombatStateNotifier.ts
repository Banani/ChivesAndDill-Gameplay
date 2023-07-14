import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { CharacterCombatFinishedEvent, CharacterCombatStartedEvent, MonsterEngineEvents, MonsterLostTargetEvent, MonsterPulledEvent } from '../Events';

export class CombatStateNotifier extends Notifier<boolean> {
    constructor() {
        super({ key: GlobalStoreModule.COMBAT_STATE });
        this.eventsToHandlersMap = {
            [MonsterEngineEvents.CharacterCombatStarted]: this.handleCharacterCombatStarted,
            [MonsterEngineEvents.CharacterCombatFinished]: this.handleCharacterCombatFinished,
            [MonsterEngineEvents.MonsterPulled]: this.handleMonsterPulled,
            [MonsterEngineEvents.MonsterLostTarget]: this.handleMonsterLostTarget
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


    handleMonsterPulled: EngineEventHandler<MonsterPulledEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.targetId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId,
                objects: {
                    [event.monster.id]: true
                },
            },
        ]);
    };

    handleMonsterLostTarget: EngineEventHandler<MonsterLostTargetEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.targetId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId,
                objects: {
                    [event.monsterId]: false
                },
            },
        ]);
    };
}
