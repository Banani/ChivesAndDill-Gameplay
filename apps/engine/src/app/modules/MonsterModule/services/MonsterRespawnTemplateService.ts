import { forEach } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterRespawn } from '../../../types/CharacterRespawn';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent, MonsterTemplateFetchedFromDbEvent } from '../Events';

const BLOCK_SIZE = 96;

export class MonsterRespawnTemplateService extends EventParser {
    monsterRespawns: Record<string, CharacterRespawn> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [MonsterEngineEvents.MonsterTemplateFetchedFromDb]: this.handleMonsterTemplateFetchedFromDb
        };
    }

    handleMonsterTemplateFetchedFromDb: EngineEventHandler<MonsterTemplateFetchedFromDbEvent> = ({ event, services }) => {
        let monsterRespawnIds = [];

        forEach(event.monsterTemplateDbRecords, (monsterTemplate) => {
            if (!monsterTemplate.monsterRespawns) {
                return;
            }

            for (let respawn of monsterTemplate.monsterRespawns) {
                this.monsterRespawns[respawn.id] = {
                    id: respawn.id,
                    characterTemplateId: monsterTemplate._id.toString(),
                    location: { x: respawn.location.x * BLOCK_SIZE, y: respawn.location.y * BLOCK_SIZE },
                    time: respawn.time,
                    walkingType: respawn.walkingType,
                    patrolPath: respawn.patrolPath?.map(el => ({ x: el.x * 3, y: el.y * 3 }))
                }
                monsterRespawnIds.push(respawn.id)
            }
        })

        this.engineEventCrator.asyncCeateEvent<MonsterRespawnsUpdatedEvent>({
            type: MonsterEngineEvents.MonsterRespawnsUpdated,
            respawnIds: monsterRespawnIds
        });

    }

    getData: () => Record<string, CharacterRespawn> = () => this.monsterRespawns;
}
