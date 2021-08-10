import { TimeEffect } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { SpellEngineEvents, TimeEffectCreatedEvent, TimeEffectRemovedEvent } from '../Events';

export class TimeEffectNotifier extends EventParser implements Notifier {
   private timeEffects: Record<string, TimeEffect> = {};
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.TimeEffectCreated]: this.handleTimeEffectCreated,
         [SpellEngineEvents.TimeEffectRemoved]: this.handleTimeEffectRemoved,
      };
   }

   getBroadcast = () => {
      const timeEffects = this.timeEffects;
      const toDelete = [...this.toDelete];

      this.timeEffects = {};
      this.toDelete = [];

      return { data: timeEffects, key: 'timeEffects', toDelete };
   };

   handleTimeEffectCreated: EngineEventHandler<TimeEffectCreatedEvent> = ({ event }) => {
      this.timeEffects[event.timeEffect.id] = {
         id: event.timeEffect.id,
         period: event.timeEffect.period,
         name: event.timeEffect.name,
         description: event.timeEffect.description,
         timeEffectType: event.timeEffect.timeEffectType,
         creationTime: event.timeEffect.creationTime,
         iconImage: event.timeEffect.iconImage,
         targetId: event.timeEffect.targetId,
      };
   };

   handleTimeEffectRemoved: EngineEventHandler<TimeEffectRemovedEvent> = ({ event }) => {
      this.toDelete.push(event.tickOverTimeId);
      delete this.timeEffects[event.tickOverTimeId];
   };
}
