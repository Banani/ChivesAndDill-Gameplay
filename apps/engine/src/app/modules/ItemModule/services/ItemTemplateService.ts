import { ItemTemplate } from '@bananos/types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { ItemApi } from '../db';

export class ItemTemplateService extends EventParser {
    itemTemplates: Record<string, ItemTemplate> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        const itemDbApi = new ItemApi(services.dbService.getDb());

        itemDbApi.fetchItemTemplates().then((itemTemplates) => {
            this.itemTemplates = itemTemplates;
        });

        itemDbApi.watchForItemTemplates((data) => {
            if (data.operationType === "update") {
                this.itemTemplates[data.fullDocument._id] = {
                    id: data.fullDocument._id.toString(),
                    ..._.omit(data.fullDocument, "_id")
                } as ItemTemplate;

            }

            if (data.operationType === "delete") {
                delete this.itemTemplates[data.documentKey._id.toString()]
            }
        });
    }

    getData = () => this.itemTemplates;
}
