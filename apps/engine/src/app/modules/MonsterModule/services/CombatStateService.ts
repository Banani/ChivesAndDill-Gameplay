import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterCombatFinishedEvent, CharacterCombatStartedEvent, MonsterEngineEvents, MonsterLostTargetEvent, MonsterPulledEvent } from '../Events';

export class CombatStateService extends EventParser {
    // Character => list of monsters in fight
    characterCombats: Record<string, Record<string, boolean>> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [MonsterEngineEvents.MonsterPulled]: this.handleMonsterPulled,
            [MonsterEngineEvents.MonsterLostTarget]: this.handleMonsterLostTarget
        };
    }

    handleMonsterPulled: EngineEventHandler<MonsterPulledEvent> = ({ event }) => {
        if (!this.characterCombats[event.targetId]) {
            this.characterCombats[event.targetId] = {}

            this.engineEventCrator.asyncCeateEvent<CharacterCombatStartedEvent>({
                type: MonsterEngineEvents.CharacterCombatStarted,
                playerCharacterId: event.targetId
            });
        }
        this.characterCombats[event.targetId][event.monster.id] = true;
    };

    handleMonsterLostTarget: EngineEventHandler<MonsterLostTargetEvent> = ({ event, services }) => {
        if (this.characterCombats[event.targetId]) {
            delete this.characterCombats[event.targetId][event.monsterId];

            if (Object.keys(this.characterCombats[event.targetId]).length > 0) {
                return;
            }

            delete this.characterCombats[event.targetId];
            this.engineEventCrator.asyncCeateEvent<CharacterCombatFinishedEvent>({
                type: MonsterEngineEvents.CharacterCombatFinished,
                playerCharacterId: event.targetId
            });
        }
    };
}
