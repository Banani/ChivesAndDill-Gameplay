import { CharacterDirection } from '@bananos/types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { MonsterEngineEvents, MonsterTemplateFetchedFromDbEvent } from '../Events';
import { MonsterTemplate } from '../MonsterTemplates';
import { MonsterApi, MonsterTemplateDb } from '../db';

export class MonsterTemplateService extends EventParser {
    monsterTemplates: Record<string, MonsterTemplate> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        const monsterDbApi = new MonsterApi(services.dbService.getDb());

        monsterDbApi.fetchMonsterTemplates().then((monsterTemplates) => {
            this.monsterTemplates = _.mapValues(monsterTemplates, this.mapMonsterTemplate);

            this.engineEventCrator.asyncCeateEvent<MonsterTemplateFetchedFromDbEvent>({
                type: MonsterEngineEvents.MonsterTemplateFetchedFromDb,
                monsterTemplateDbRecords: monsterTemplates
            });
        });
        monsterDbApi.watchForMonsterTemplates((data) => {
            if (data.operationType === "update") {
                this.monsterTemplates[data.fullDocument._id] = this.mapMonsterTemplate(data.fullDocument);

                this.engineEventCrator.asyncCeateEvent<MonsterTemplateFetchedFromDbEvent>({
                    type: MonsterEngineEvents.MonsterTemplateFetchedFromDb,
                    monsterTemplateDbRecords: {
                        [data.fullDocument._id]: data.fullDocument
                    }
                });
            }
        });
    }

    mapMonsterTemplate = (npcTemplate: MonsterTemplateDb) =>
    ({
        id: npcTemplate._id.toString(),
        name: npcTemplate.name,
        healthPoints: npcTemplate.healthPoints,
        healthPointsRegeneration: npcTemplate.healthPointsRegeneration,
        spellPower: npcTemplate.spellPower,
        spellPowerRegeneration: npcTemplate.spellPowerRegeneration,
        movementSpeed: npcTemplate.movementSpeed,
        sightRange: npcTemplate.sightRange,
        desiredRange: npcTemplate.desiredRange,
        escapeRange: npcTemplate.escapeRange,
        attackFrequency: npcTemplate.attackFrequency,
        spells: npcTemplate.spells,
        dropSchema: npcTemplate.dropSchema,
        quotesEvents: npcTemplate.quotesEvents,
        sprites: 'orc',
        avatar: '../../../../assets/spritesheets/avatars/orcAvatar.png',
        direction: CharacterDirection.DOWN,
        isInMove: false,
        size: 96,

    })

    getData = () => this.monsterTemplates;
}