import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { Engine } from '../../../engines/Engine';
import { ApplyTargetSpellEffectEvent, RemoveTickOverTimeEffectEvent } from '../../../types';
import { TickEffectOverTimeTrack } from '../services/EffectHandlers/TickEffectOverTimeService';

export class TickOverTimeEffectEngine extends Engine {
   tickTime: Record<string, number> = {};

   isNotReadyForHit = (channelSpellsTrack: TickEffectOverTimeTrack) => {
      if (!this.tickTime[channelSpellsTrack.id]) {
         this.tickTime[channelSpellsTrack.id] = Date.now();
      }
      return this.tickTime[channelSpellsTrack.id] && this.tickTime[channelSpellsTrack.id] + channelSpellsTrack.effect.activationFrequency > Date.now();
   };

   doAction() {
      forEach(this.services.tickEffectOverTimeService.getActiveTickEffectOverTime(), (tickOverTime) => {
         if (this.isNotReadyForHit(tickOverTime)) {
            return;
         }
         this.tickTime[tickOverTime.id] = Date.now();

         forEach(tickOverTime.effect.spellEffects, (effect) => {
            this.eventCrator.createEvent<ApplyTargetSpellEffectEvent>({
               type: EngineEvents.ApplyTargetSpellEffect,
               caster: tickOverTime.caster,
               target: tickOverTime.target,
               effect,
            });
         });

         if (tickOverTime.creationTime + tickOverTime.effect.period <= Date.now()) {
            delete this.tickTime[tickOverTime.id];
            this.eventCrator.createEvent<RemoveTickOverTimeEffectEvent>({
               type: EngineEvents.RemoveTickOverTimeEffect,
               tickOverTimeId: tickOverTime.id,
            });
         }
      });
   }
}
