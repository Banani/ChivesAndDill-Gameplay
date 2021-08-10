import { AreaTimeEffect, TimeEffect } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { AreaSpellEffectCreatedEvent, AreaSpellEffectRemovedEvent, SpellEngineEvents, TimeEffectCreatedEvent, TimeEffectRemovedEvent } from '../Events';

export class AreaTimeEffectNotifier extends EventParser implements Notifier {
   private areaTimeEffects: Record<string, AreaTimeEffect> = {};
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.AreaSpellEffectCreated]: this.handleAreaSpellEffectCreated,
         [SpellEngineEvents.AreaSpellEffectRemoved]: this.handleAreaSpellEffectRemoved,
      };
   }

   getBroadcast = () => {
      const areaTimeEffects = this.areaTimeEffects;
      const toDelete = [...this.toDelete];

      this.areaTimeEffects = {};
      this.toDelete = [];

      return { data: areaTimeEffects, key: 'areaTimeEffects', toDelete };
   };

   handleAreaSpellEffectCreated: EngineEventHandler<AreaSpellEffectCreatedEvent> = ({ event }) => {
      this.areaTimeEffects[event.areaSpellEffectId] = {
         id: event.areaSpellEffectId,
         location: event.location,
         radius: event.effect.radius,
         name: event.effect.name,
      };
   };

   handleAreaSpellEffectRemoved: EngineEventHandler<AreaSpellEffectRemovedEvent> = ({ event }) => {
      this.toDelete.push(event.areaSpellEffectId);
      delete this.areaTimeEffects[event.areaSpellEffectId];
   };
}
