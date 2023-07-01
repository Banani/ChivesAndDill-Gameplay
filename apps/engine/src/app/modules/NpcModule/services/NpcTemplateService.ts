import { CharacterDirection } from '@bananos/types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { NpcEngineEvents, NpcTemplateFetchedFromDbEvent } from '../Events';
import { NpcTemplate } from '../NpcTemplate';
import { NpcApi } from '../db';

export class NpcTemplateService extends EventParser {
    npcTemplates: Record<string, NpcTemplate> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        const npcDbApi = new NpcApi(services.dbService.getDb());

        npcDbApi.fetchNpcTemplates().then((npcTemplates) => {
            this.npcTemplates = _.mapValues(npcTemplates, (npcTemplate) => ({
                id: npcTemplate._id.toString(),
                name: npcTemplate.name,
                healthPoints: npcTemplate.healthPoints,
                healthPointsRegeneration: npcTemplate.healthPointsRegeneration,
                spellPower: npcTemplate.spellPower,
                spellPowerRegeneration: npcTemplate.spellPowerRegeneration,
                movementSpeed: npcTemplate.movementSpeed,
                stock: npcTemplate.stock,
                quests: npcTemplate.quests,
                quotesEvents: npcTemplate.quotesEvents,
                sprites: 'citizen',
                avatar: 'https://avatars.githubusercontent.com/u/5495772?v=4',
                direction: CharacterDirection.DOWN,
                isInMove: false,
                size: 96,
                spells: {}
            }));

            this.engineEventCrator.asyncCeateEvent<NpcTemplateFetchedFromDbEvent>({
                type: NpcEngineEvents.NpcTemplateFetchedFromDb,
                npcTemplateDbRecords: npcTemplates
            });
        });
        // npcDbApi.watchForMapDefinition((data) => {
        //     const sprites = [data.fullDocument.spriteId];
        //     this.mapDefinition[data.documentKey['_id']] = sprites;
        //     this.engineEventCrator.asyncCeateEvent<MapDefinitionUpdatedEvent>({
        //         type: MapEvents.MapDefinitionUpdated,
        //         mapDefinition: {
        //             [data.documentKey['_id']]: sprites
        //         },
        //     });
        // });
    }

    getData = () => this.npcTemplates;
}
