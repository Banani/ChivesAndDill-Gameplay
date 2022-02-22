import { GlobalStoreModule, TimeEffect } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { SpellEngineEvents, TimeEffectCreatedEvent, TimeEffectRemovedEvent } from '../Events';

export class TimeEffectNotifier extends Notifier<TimeEffect> {
   constructor() {
      super({ key: GlobalStoreModule.TIME_EFFECTS });
      this.eventsToHandlersMap = {
         [SpellEngineEvents.TimeEffectCreated]: this.handleTimeEffectCreated,
         [SpellEngineEvents.TimeEffectRemoved]: this.handleTimeEffectRemoved,
      };
   }

   handleTimeEffectCreated: EngineEventHandler<TimeEffectCreatedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.timeEffect.id]: {
               id: event.timeEffect.id,
               period: event.timeEffect.period,
               name: event.timeEffect.name,
               description: event.timeEffect.description,
               timeEffectType: event.timeEffect.timeEffectType,
               creationTime: event.timeEffect.creationTime,
               iconImage: event.timeEffect.iconImage,
               targetId: event.timeEffect.targetId,
            },
         },
      });
   };

   handleTimeEffectRemoved: EngineEventHandler<TimeEffectRemovedEvent> = ({ event }) => {
      this.broadcastObjectsDeletion({ ids: [event.tickOverTimeId] });
   };
}
