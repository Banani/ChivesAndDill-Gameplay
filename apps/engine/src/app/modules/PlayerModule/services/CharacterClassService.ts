import { CharacterClass } from '@bananos/types';
import * as _ from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterClassUpdatedEvent, PlayerEngineEvents } from '../Events';

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
            if (data.operationType === "update") {
                const characterClassId = data.fullDocument._id.toString()
                this.characterClasses[characterClassId] = {
                    id: characterClassId,
                    ..._.omit(data.fullDocument, "_id")
                } as CharacterClass;

                this.engineEventCrator.asyncCeateEvent<CharacterClassUpdatedEvent>({
                    type: PlayerEngineEvents.CharacterClassUpdated,
                    characterClassId: characterClassId
                });
            }

            if (data.operationType === "delete") {
                delete this.characterClasses[data.documentKey._id.toString()]
            }
        });
    }

    getData = () => this.characterClasses;
}
