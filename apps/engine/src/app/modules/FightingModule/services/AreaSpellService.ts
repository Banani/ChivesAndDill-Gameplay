import { omit, forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { SpellType } from '../../../SpellType';
import { ApplyLocationSpellEffectEvent, ApplyTargetSpellEffectEvent, EngineEventHandler, PlayerCastedSpellEvent, PlayerCastSpellEvent } from '../../../types';

export class AreaSpellService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
      };
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.Area) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const character = allCharacters[event.casterId];

         if (distanceBetweenTwoPoints(character.location, event.directionLocation) > event.spell.range) {
            return;
         }

         this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
            type: EngineEvents.PlayerCastedSpell,
            casterId: character.id,
            spell: event.spell,
         });

         forEach(event.spell.spellEffectsOnDirectionLocation, (spellEffect) => {
            this.engineEventCrator.createEvent<ApplyLocationSpellEffectEvent>({
               type: EngineEvents.ApplyLocationSpellEffect,
               caster: character,
               effect: spellEffect,
               location: event.directionLocation,
            });
         });

         for (const i in omit(allCharacters, [character.id])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < event.spell.radius) {
               forEach(event.spell.spellEffectsOnTarget, (spellEffect) => {
                  this.engineEventCrator.createEvent<ApplyTargetSpellEffectEvent>({
                     type: EngineEvents.ApplyTargetSpellEffect,
                     caster: character,
                     target: allCharacters[i],
                     effect: spellEffect,
                  });
               });
            }
         }
      }
   };
}
