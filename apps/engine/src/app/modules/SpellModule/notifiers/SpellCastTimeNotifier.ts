import { GlobalStoreModule } from '@bananos/types';
import { now } from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCastedSpellEvent, SpellEngineEvents } from '../Events';

export class SpellCastTimeNotifier extends Notifier<number> {
    constructor() {
        super({ key: GlobalStoreModule.SPELL_CAST_TIME });
        this.eventsToHandlersMap = {
            [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
        };
    }


    handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.casterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId,
                objects: {
                    [event.spell.id]: now()
                },
            },
        ]);
    };
}
