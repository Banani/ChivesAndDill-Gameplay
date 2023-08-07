import { GlobalStoreModule, SpellClientEvent } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCastedSpellEvent, SpellEngineEvents, SpellLandedEvent, SubSpellCastedEvent } from '../Events';

export class SpellNotifier extends Notifier {
    constructor() {
        super({ key: GlobalStoreModule.SPELLS });
        this.eventsToHandlersMap = {
            [SpellEngineEvents.SpellLanded]: this.handleSpellLanded,
            [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
            [SpellEngineEvents.SubSpellCasted]: this.handleSubSpellCasted,
        };
    }

    handleSpellLanded: EngineEventHandler<SpellLandedEvent> = ({ event, services }) => {
        this.broadcastEvents({
            events: [
                {
                    type: SpellClientEvent.SpellLanded,
                    spell: event.spell,
                    angle: event.angle,
                    castLocation: event.caster.location,
                    directionLocation: event.location,
                },
            ],
        });
    };

    handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event, services }) => {
        this.broadcastEvents({
            events: [
                {
                    type: SpellClientEvent.SpellCasted,
                    spell: event.spell,
                    casterId: event.casterId,
                },
            ],
        });
    };

    handleSubSpellCasted: EngineEventHandler<SubSpellCastedEvent> = ({ event, services }) => {
        this.broadcastEvents({
            events: [
                {
                    type: SpellClientEvent.SpellCasted,
                    spell: event.spell,
                    casterId: event.casterId,
                },
            ],
        });
    };
}
