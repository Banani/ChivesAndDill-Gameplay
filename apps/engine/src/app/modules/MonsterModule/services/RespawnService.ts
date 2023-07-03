import * as _ from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { CreateNewMonsterEvent, MonsterEngineEvents, MonsterRespawnsUpdatedEvent, RespawnMonsterEvent } from '../Events';
import { RespawnMonsterEngine } from '../engines';

interface MonsterDead {
    deadTime: number;
}

export class RespawnService extends EventParser {
    respawnMonsterEngine: RespawnMonsterEngine;
    waitingRespawns: Record<string, MonsterDead> = {};

    constructor(respawnMonsterEngine: RespawnMonsterEngine) {
        super();
        this.respawnMonsterEngine = respawnMonsterEngine;
        this.eventsToHandlersMap = {
            [EngineEvents.CharacterDied]: this.handleCharacterDied,
            [MonsterEngineEvents.RespawnMonster]: this.handleRespawnMonster,
            [MonsterEngineEvents.MonsterRespawnsUpdated]: this.handleMonsterRespawnsUpdated
        };
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        this.respawnMonsterEngine.init(this.engineEventCrator, services);
    }

    handleMonsterRespawnsUpdated: EngineEventHandler<MonsterRespawnsUpdatedEvent> = ({ event, services }) => {
        const respawns = services.monsterRespawnTemplateService.getData();

        _.map(event.respawnIds, (respawnId) => {
            this.engineEventCrator.asyncCeateEvent<CreateNewMonsterEvent>({
                type: MonsterEngineEvents.CreateNewMonster,
                monsterRespawn: respawns[respawnId],
            });
        });
    };

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
        if (event.character.type === CharacterType.Monster) {
            this.waitingRespawns[event.character.respawnId] = {
                deadTime: Date.now(),
            };
        }
    };

    handleRespawnMonster: EngineEventHandler<RespawnMonsterEvent> = ({ event, services }) => {
        const monsterRespawns = services.monsterRespawnTemplateService.getData();
        delete this.waitingRespawns[event.respawnId];

        this.engineEventCrator.asyncCeateEvent<CreateNewMonsterEvent>({
            type: MonsterEngineEvents.CreateNewMonster,
            monsterRespawn: monsterRespawns[event.respawnId],
        });
    };

    getWaitingRespawns = () => this.waitingRespawns;
}
