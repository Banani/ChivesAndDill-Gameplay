import { AbsorbShieldTrack, EngineEventType, EnginePackageEvent, GlobalStoreModule } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { AbsorbShieldChangedEvent, AbsorbShieldCreatedEvent, AbsorbShieldFinishedEvent, DamageAbsorbedEvent, SpellEngineEvents } from '../Events';

export class AbsorbShieldNotifier extends EventParser implements Notifier {
   private absorbShields: Record<string, Partial<AbsorbShieldTrack>> = {};
   private events: EnginePackageEvent[] = [];
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.AbsorbShieldCreated]: this.handleAbsorbShieldCreated,
         [SpellEngineEvents.AbsorbShieldFinished]: this.handleAbsorbShieldFinished,
         [SpellEngineEvents.AbsorbShieldChanged]: this.handleAbsorbShieldChanged,
         [SpellEngineEvents.DamageAbsorbed]: this.handleDamageAbsorbed,
      };
   }

   getBroadcast = () => {
      const absorbShields = this.absorbShields;
      const toDelete = [...this.toDelete];
      const events = this.events;

      this.absorbShields = {};
      this.toDelete = [];
      this.events = [];

      return { data: absorbShields, key: GlobalStoreModule.ABSORB_SHIELDS, toDelete, events };
   };

   handleAbsorbShieldCreated: EngineEventHandler<AbsorbShieldCreatedEvent> = ({ event }) => {
      this.absorbShields[event.absorbId] = {
         id: event.absorbId,
         ownerId: event.ownerId,
         value: event.newValue,
         iconImage: event.iconImage,
         creationTime: event.creationTime,
         period: event.period,
         timeEffectType: event.timeEffectType,
      };
   };

   handleAbsorbShieldFinished: EngineEventHandler<AbsorbShieldFinishedEvent> = ({ event }) => {
      this.toDelete.push(event.absorbId);
      delete this.absorbShields[event.absorbId];
   };

   handleDamageAbsorbed: EngineEventHandler<DamageAbsorbedEvent> = ({ event }) => {
      this.events.push({
         type: EngineEventType.DamageAbsorbed,
         characterId: event.targetId,
      });
   };

   handleAbsorbShieldChanged: EngineEventHandler<AbsorbShieldChangedEvent> = ({ event }) => {
      this.absorbShields[event.absorbId] = {
         id: event.absorbId,
         value: event.value,
      };
   };
}
