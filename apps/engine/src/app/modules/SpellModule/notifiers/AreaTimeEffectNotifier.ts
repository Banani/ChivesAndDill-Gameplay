import { AreaTimeEffect, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { AreaSpellEffectCreatedEvent, AreaSpellEffectRemovedEvent, SpellEngineEvents, TimeEffectCreatedEvent, TimeEffectRemovedEvent } from '../Events';

export class AreaTimeEffectNotifier extends Notifier<AreaTimeEffect> {
   constructor() {
      super({ key: GlobalStoreModule.AREA_TIME_EFFECTS });
      this.eventsToHandlersMap = {
         [SpellEngineEvents.AreaSpellEffectCreated]: this.handleAreaSpellEffectCreated,
         [SpellEngineEvents.AreaSpellEffectRemoved]: this.handleAreaSpellEffectRemoved,
      };
   }

   handleAreaSpellEffectCreated: EngineEventHandler<AreaSpellEffectCreatedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.areaSpellEffectId]: {
               id: event.areaSpellEffectId,
               location: event.location,
               radius: event.effect.radius,
               name: event.effect.name,
            },
         },
      });
   };

   handleAreaSpellEffectRemoved: EngineEventHandler<AreaSpellEffectRemovedEvent> = ({ event }) => {
      this.broadcastObjectsDeletion({ ids: [event.areaSpellEffectId] });
   };
}
