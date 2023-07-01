import { forEach } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterRespawn } from '../../../types/CharacterRespawn';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent, NpcTemplateFetchedFromDbEvent } from '../Events';

const BLOCK_SIZE = 96;

export class NpcRespawnTemplateService extends EventParser {
    npcRespawns: Record<string, CharacterRespawn> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [NpcEngineEvents.NpcTemplateFetchedFromDb]: this.handleNpcTemplateFetchedFromDb
        };
    }

    handleNpcTemplateFetchedFromDb: EngineEventHandler<NpcTemplateFetchedFromDbEvent> = ({ event, services }) => {
        let npcRespawnIds = [];

        forEach(event.npcTemplateDbRecords, (npcTemplate) => {
            if (!npcTemplate.npcRespawns) {
                return;
            }

            for (let respawn of npcTemplate.npcRespawns) {
                this.npcRespawns[respawn._id] = {
                    id: respawn._id,
                    characterTemplateId: npcTemplate._id.toString(),
                    location: { x: respawn.location.x * BLOCK_SIZE, y: respawn.location.y * BLOCK_SIZE },
                    time: respawn.time,
                    walkingType: respawn.walkingType
                }
                npcRespawnIds.push(respawn._id)
            }
        })

        this.engineEventCrator.asyncCeateEvent<NpcRespawnsUpdatedEvent>({
            type: NpcEngineEvents.NpcRespawnsUpdated,
            respawnIds: npcRespawnIds
        });

    }

    getData: () => Record<string, CharacterRespawn> = () => this.npcRespawns;
}
