import { AreaEffect } from 'apps/engine/src/app/types/Spell';
import { EngineEvents } from '../../../../EngineEvents';
import { EventParser } from '../../../../EventParser';
import { SpellEffectType } from '../../../../SpellType';
import { ApplyLocationSpellEffectEvent, Character, EngineEventHandler, Location, RemoveAreaSpellEffectEvent } from '../../../../types';
import { Monster } from '../../../MonsterModule/types';
import { AreaEffectsEngine } from '../../engines';

export interface AreaSpellEffectTrack {
   id: string;
   creationTime: number;
   areaEffect: AreaEffect;
   location: Location;
   caster: Character | Monster;
}

export class AreaEffectService extends EventParser {
   areaEffectEngine: AreaEffectsEngine;
   activeAreaSpellEffects: Record<string, AreaSpellEffectTrack> = {};
   increment: number = 0;

   constructor(areaEffectEngine: AreaEffectsEngine) {
      super();
      this.areaEffectEngine = areaEffectEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.ApplyLocationSpellEffect]: this.handleApplyLocationSpellEffect,
         [EngineEvents.RemoveAreaSpellEffect]: this.handleRemoveAreaSpellEffect,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.areaEffectEngine.init(engineEventCrator, services);
   }

   handleApplyLocationSpellEffect: EngineEventHandler<ApplyLocationSpellEffectEvent> = ({ event }) => {
      if (event.effect.type === SpellEffectType.Area) {
         this.increment++;
         this.activeAreaSpellEffects[this.increment] = {
            id: this.increment.toString(),
            creationTime: Date.now(),
            areaEffect: event.effect as AreaEffect,
            location: event.location,
            caster: event.caster,
         };
      }
   };

   handleRemoveAreaSpellEffect: EngineEventHandler<RemoveAreaSpellEffectEvent> = ({ event }) => {
      delete this.activeAreaSpellEffects[event.areaId];
   };

   getAllActiveAreaSpellEffects = () => this.activeAreaSpellEffects;
}
