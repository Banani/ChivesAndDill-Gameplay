import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { EngineEventHandler } from 'apps/engine/src/app/types';
import { omit } from 'lodash';
import { PlayerEngineEvents, SendErrorMessageEvent } from '../../../PlayerModule/Events';
import {
   SpellLandedEvent,
   SpellEngineEvents,
   SpellReachedTargetEvent,
   SubSpellCastedEvent,
   PlayerCastedSpellEvent,
   PlayerCastSpellEvent,
   PlayerCastSubSpellEvent,
} from '../../Events';
import { SpellType } from '../../types/SpellTypes';

export class DirectInstantSpellService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [SpellEngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
      };
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.DirectInstant) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const character = allCharacters[event.casterId];

         if (character && distanceBetweenTwoPoints(character.location, event.directionLocation) > event.spell.range) {
            this.sendErrorMessage(event.casterId, 'Out of range.');
            return;
         }

         for (const i in omit(allCharacters, [event.casterId])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
                  type: SpellEngineEvents.PlayerCastedSpell,
                  casterId: event.casterId,
                  spell: event.spell,
               });

               this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
                  type: SpellEngineEvents.SpellLanded,
                  spell: event.spell,
                  caster: character,
                  location: allCharacters[i].location,
               });

               this.engineEventCrator.asyncCeateEvent<SpellReachedTargetEvent>({
                  type: SpellEngineEvents.SpellReachedTarget,
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
               this.engineEventCrator.asyncCeateEvent<SubSpellCastedEvent>({
                  type: SpellEngineEvents.SubSpellCasted,
                  casterId: event.casterId,
                  spell: event.spell,
               });

               this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
                  type: SpellEngineEvents.SpellLanded,
                  spell: event.spell,
                  caster: character,
                  location: allCharacters[i].location,
               });

               this.engineEventCrator.asyncCeateEvent<SpellReachedTargetEvent>({
                  type: SpellEngineEvents.SpellReachedTarget,
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
