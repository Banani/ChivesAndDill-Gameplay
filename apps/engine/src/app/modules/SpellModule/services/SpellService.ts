import { Spell } from '@bananos/types';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { SpellDefinitionUpdatedEvent, SpellEngineEvents } from '../Events';

export class SpellService extends EventParser {
    spells: Record<string, Spell> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        let realSpellsFetched = false;

        services.dbService.getCachedData("spells", (spells) => {
            if (!realSpellsFetched) {
                this.spells = spells;
            }
        });

        services.dbService.fetchDataFromDb("spells").then((spells) => {
            realSpellsFetched = true;
            this.spells = spells;
        });

        services.dbService.watchForDataChanges("spells", (data) => {
            if (data.operationType === "update") {
                this.spells[data.fullDocument._id] = data.fullDocument;

                this.engineEventCrator.asyncCeateEvent<SpellDefinitionUpdatedEvent>({
                    type: SpellEngineEvents.SpellDefinitionUpdated,
                    spellId: data.fullDocument._id
                });
            }
        });
    }

    getData = () => this.spells;
}