import { CharacterClass } from '@bananos/types';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterClassApi } from '../db';

export class CharacterClassService extends EventParser {
    characterClasses: Record<string, CharacterClass> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        const characterClassDbApi = new CharacterClassApi(services.dbService.getDb());

        characterClassDbApi.fetchCharacterClasses().then((characterClasses) => {
            this.characterClasses = characterClasses;
        });

        characterClassDbApi.watchForCharacterClasses((data) => {
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
