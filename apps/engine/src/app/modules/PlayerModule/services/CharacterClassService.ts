import { CharacterClass } from '@bananos/types';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';

export class CharacterClassService extends EventParser {
    characterClasses: Record<string, CharacterClass> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        let realDataFetched = false;

        services.dbService.getCachedData("characterClasses", (characterClasses) => {
            if (!realDataFetched) {
                this.characterClasses = characterClasses;
            }
        });

        services.dbService.fetchDataFromDb("characterClasses").then((characterClasses) => {
            realDataFetched = true;
            this.characterClasses = characterClasses;
        });

        services.dbService.watchForDataChanges("characterClasses", (data) => {
            // if (data.operationType === "update") {
            //     this.itemTemplates[data.fullDocument._id] = {
            //         id: data.fullDocument._id.toString(),
            //         ..._.omit(data.fullDocument, "_id")
            //     } as ItemTemplate;

            // }

            // if (data.operationType === "delete") {
            //     delete this.itemTemplates[data.documentKey._id.toString()]
            // }
        });
    }

    getData = () => this.characterClasses;
}
