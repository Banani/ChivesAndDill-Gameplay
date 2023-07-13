import { QuestSchema } from '@bananos/types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';

export class QuestSchemasService extends EventParser {
    questSchemas: Record<string, QuestSchema> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        let realQuestSchemasFetched = false;

        services.dbService.getCachedData("questSchemas", (questSchemas) => {
            if (!realQuestSchemasFetched) {
                this.questSchemas = _.mapValues(questSchemas, (questSchema, questId) => ({
                    ...questSchema,
                    stageOrder: Object.keys(questSchema.stages),
                    stages: _.mapValues(questSchema.stages, (stage, stageId) => ({
                        ...stage,
                        id: stageId,
                        stageParts: _.mapValues(stage.stageParts, (stagePart, stagePartId) => ({
                            ...stagePart,
                            id: stagePartId,
                            stageId,
                            questId
                        }))
                    }))
                }));
            }
        });

        services.dbService.fetchDataFromDb("questSchemas").then((questSchemas) => {
            realQuestSchemasFetched = true;
            this.questSchemas = _.mapValues(questSchemas, (questSchema, questId) => ({
                ...questSchema,
                stageOrder: Object.keys(questSchema.stages),
                stages: _.mapValues(questSchema.stages, (stage, stageId) => ({
                    ...stage,
                    id: stageId,
                    stageParts: _.mapValues(stage.stageParts, (stagePart, stagePartId) => ({
                        ...stagePart,
                        id: stagePartId,
                        stageId,
                        questId
                    }))
                }))
            }));
        });

        services.dbService.watchForDataChanges("questSchemas", (data) => {
            if (data.operationType === "update") {
                this.questSchemas[data.fullDocument._id] = {
                    ..._.omit(data.fullDocument, "_id"),
                    id: data.fullDocument._id.toString(),
                    stageOrder: Object.keys(data.fullDocument.stages)
                } as QuestSchema;

            }

            if (data.operationType === "delete") {
                delete this.questSchemas[data.documentKey._id.toString()]
            }
        });
    }

    getData = () => this.questSchemas;
}
