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

    mapMonsterTemplate = (monsterTemplate: MonsterTemplateDb) =>
    ({
        id: monsterTemplate._id.toString(),
        name: monsterTemplate.name,
        healthPoints: monsterTemplate.healthPoints,
        healthPointsRegeneration: monsterTemplate.healthPointsRegeneration,
        spellPower: monsterTemplate.spellPower,
        spellPowerRegeneration: monsterTemplate.spellPowerRegeneration,
        movementSpeed: monsterTemplate.movementSpeed,
        sightRange: monsterTemplate.sightRange,
        desiredRange: monsterTemplate.desiredRange,
        escapeRange: monsterTemplate.escapeRange,
        attackFrequency: monsterTemplate.attackFrequency,
        spells: monsterTemplate.spells,
        dropSchema: monsterTemplate.dropSchema,
        quotesEvents: _.mapValues(monsterTemplate.quotesEvents, quoteEvent => ({
            ...quoteEvent,
            chance: quoteEvent.chance / 1000,
        })),
        sprites: 'orc',
        avatar: '../../../../assets/spritesheets/avatars/orcAvatar.png',
        direction: CharacterDirection.DOWN,
        isInMove: false,
        size: 96,

    })

    getData = () => this.monsterTemplates;
}