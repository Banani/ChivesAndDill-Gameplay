import { CharacterType } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterEngineEvents, CreateCharacterEvent } from '../../CharacterModule/Events';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../Events';
import type { Npc } from '../types';

export class NpcService extends EventParser {
    //TODO: Jak zginie to sie nie usuwa? 
    npcs: Record<string, Npc> = {};
    increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [NpcEngineEvents.NpcRespawnsUpdated]: this.handleNpcRespawnsUpdated,
        };
    }

    handleNpcRespawnsUpdated: EngineEventHandler<NpcRespawnsUpdatedEvent> = ({ event, services }) => {
        const respawns = services.npcRespawnTemplateService.getData();
        _.map(event.respawnIds, (respawnId) => {
            const npcRespawn = respawns[respawnId];
            this.increment++;
            const id = 'npc_' + this.increment;

            this.npcs[id] = {
                type: CharacterType.Npc,
                //TODO: niech to sie odwoluje do npc template, zamiast przekopiowac go calego
                ...services.npcTemplateService.getData()[npcRespawn.templateId],
                location: npcRespawn.location,
                isDead: false,
                respawnId: npcRespawn.id,
                templateId: npcRespawn.templateId,
                id,
            };

            this.engineEventCrator.asyncCeateEvent<CreateCharacterEvent>({
                type: CharacterEngineEvents.CreateCharacter,
                character: this.npcs[id],
            });
        });
    };

    getNpcById = (npcId: string) => this.npcs[npcId];
}
