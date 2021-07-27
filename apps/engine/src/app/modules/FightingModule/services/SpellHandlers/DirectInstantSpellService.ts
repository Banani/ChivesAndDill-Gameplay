import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { SpellType } from 'apps/engine/src/app/SpellType';
import {
   EngineEventHandler,
   PlayerCastSpellEvent,
   PlayerCastedSpellEvent,
   ApplyTargetSpellEffectEvent,
   PlayerCastSubSpellEvent,
} from 'apps/engine/src/app/types';
import { omit, forEach } from 'lodash';
import { SpellLandedEvent, FightingEngineEvents, SpellReachedTargetEvent, SubSpellCastedEvent } from '../../Events';

export class DirectInstantSpellService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [EngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
      };
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.DirectInstant) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const character = allCharacters[event.casterId];

         if (character && distanceBetweenTwoPoints(character.location, event.directionLocation) > event.spell.range) {
            return;
         }

         for (const i in omit(allCharacters, [event.casterId])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
                  type: EngineEvents.PlayerCastedSpell,
                  casterId: event.casterId,
                  spell: event.spell,
               });

               this.engineEventCrator.createEvent<SpellLandedEvent>({
                  type: FightingEngineEvents.SpellLanded,
                  spell: event.spell,
                  caster: character,
                  location: allCharacters[i].location,
               });

               this.engineEventCrator.createEvent<SpellReachedTargetEvent>({
                  type: FightingEngineEvents.SpellReachedTarget,
                  spell: event.spell,
                  caster: character,
                  target: allCharacters[i],
               });
               break;
            }
         }
      }
   };

   handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.DirectInstant) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const character = allCharacters[event.casterId];

         for (const i in omit(allCharacters, [event.casterId])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               this.engineEventCrator.createEvent<SubSpellCastedEvent>({
                  type: FightingEngineEvents.SubSpellCasted,
                  casterId: event.casterId,
                  spell: event.spell,
               });

               this.engineEventCrator.createEvent<SpellLandedEvent>({
                  type: FightingEngineEvents.SpellLanded,
                  spell: event.spell,
                  caster: character,
                  location: allCharacters[i].location,
               });

               this.engineEventCrator.createEvent<SpellReachedTargetEvent>({
                  type: FightingEngineEvents.SpellReachedTarget,
                  spell: event.spell,
                  caster: character,
                  target: allCharacters[i],
               });
               break;
            }
         }
      }
   };
}
