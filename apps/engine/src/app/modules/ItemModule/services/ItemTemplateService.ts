import { ItemTemplate } from '@bananos/types';
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

            // this.engineEventCrator.asyncCeateEvent<NpcTemplateFetchedFromDbEvent>({
            //     type: NpcEngineEvents.NpcTemplateFetchedFromDb,
            //     npcTemplateDbRecords: itemTemplates
            // });
        });
        // itemDbApi.watchForNpcTemplates((data) => {
        //     if (data.operationType === "update") {
        //         this.npcTemplates[data.fullDocument._id] = this.mapNpcTemplate(data.fullDocument);

        //         this.engineEventCrator.asyncCeateEvent<NpcTemplateFetchedFromDbEvent>({
        //             type: NpcEngineEvents.NpcTemplateFetchedFromDb,
        //             npcTemplateDbRecords: {
        //                 [data.fullDocument._id]: data.fullDocument
        //             }
        //         });
        //     }
        // });
    }

    getData = () => this.itemTemplates;
}
