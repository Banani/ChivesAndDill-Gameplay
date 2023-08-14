import { AbsorbShieldTrack, CharacterClientEvents, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { AbsorbShieldChangedEvent, AbsorbShieldCreatedEvent, AbsorbShieldFinishedEvent, DamageAbsorbedEvent, SpellEngineEvents } from '../Events';

export class AbsorbShieldNotifier extends Notifier<AbsorbShieldTrack> {
    constructor() {
        super({ key: GlobalStoreModule.ABSORB_SHIELDS });
        this.eventsToHandlersMap = {
            [SpellEngineEvents.AbsorbShieldCreated]: this.handleAbsorbShieldCreated,
            [SpellEngineEvents.AbsorbShieldFinished]: this.handleAbsorbShieldFinished,
            [SpellEngineEvents.AbsorbShieldChanged]: this.handleAbsorbShieldChanged,
            [SpellEngineEvents.DamageAbsorbed]: this.handleDamageAbsorbed,
        };
    }

    handleAbsorbShieldCreated: EngineEventHandler<AbsorbShieldCreatedEvent> = ({ event }) => {
        this.broadcastObjectsUpdate({
            objects: {
                [event.absorbId]: {
                    id: event.absorbId,
                    ownerId: event.ownerId,
                    value: event.newValue,
                    iconImage: event.iconImage,
                    creationTime: event.creationTime,
                    period: event.period,
                    timeEffectType: event.timeEffectType,
                },
            },
        });
    };

    handleAbsorbShieldFinished: EngineEventHandler<AbsorbShieldFinishedEvent> = ({ event }) => {
        this.broadcastObjectsDeletion({ objects: { [event.absorbId]: null } });
    };

    handleDamageAbsorbed: EngineEventHandler<DamageAbsorbedEvent> = ({ event }) => {
        this.broadcastEvents({
            events: [
                {
                    type: CharacterClientEvents.DamageAbsorbed,
                    characterId: event.targetId,
                },
            ],
        });
    };

    handleAbsorbShieldChanged: EngineEventHandler<AbsorbShieldChangedEvent> = ({ event }) => {
        this.broadcastObjectsUpdate({
            objects: {
                [event.absorbId]: {
                    // TODO: to check if this id is really needed
                    id: event.absorbId,
                    value: event.value,
                },
            },
        });
    };
}
