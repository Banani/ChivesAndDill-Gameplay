import { Spell } from '@bananos/types';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { SpellDefinitionUpdatedEvent, SpellEngineEvents } from '../Events';
import { SpellApi } from '../db';

export class SpellService extends EventParser {
    spells: Record<string, Spell> = {}

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        const spellApi = new SpellApi(services.dbService.getDb());

        spellApi.fetchSpells().then((spells) => {
            this.spells = spells;
        });

        spellApi.watchForSpells((data) => {
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