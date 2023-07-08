import { ItemTemplate } from '@bananos/types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';

export class ItemTemplateService extends EventParser {
    itemTemplates: Record<string, ItemTemplate> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        let realItemTemplatesFetched = false;

        services.dbService.getCachedData("itemTemplates", (itemTemplates) => {
            if (!realItemTemplatesFetched) {
                this.itemTemplates = itemTemplates;
            }
        });

        services.dbService.fetchDataFromDb("itemTemplates").then((itemTemplates) => {
            realItemTemplatesFetched = true;
            this.itemTemplates = itemTemplates;
        });

        services.dbService.watchForDataChanges("itemTemplates", (data) => {
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
