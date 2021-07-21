import { omit, forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { SpellType } from '../../../SpellType';
import { ApplySpellEffectEvent, EngineEventHandler, PlayerCastedSpellEvent, PlayerCastSpellEvent } from '../../../types';

export class DirectInstantSpellService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
      };
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.DirectInstant) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const character = allCharacters[event.casterId];

         if (distanceBetweenTwoPoints(character.location, event.directionLocation) > event.spell.range) {
            return;
         }

         for (const i in omit(allCharacters, [character.id])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
                  type: EngineEvents.PlayerCastedSpell,
                  casterId: character.id,
                  spell: event.spell,
               });

               forEach(event.spell.spellEffects, (spellEffect) => {
                  this.engineEventCrator.createEvent<ApplySpellEffectEvent>({
                     type: EngineEvents.ApplySpellEffect,
                     caster: character,
                     target: allCharacters[i],
                     effect: spellEffect,
                  });
               });
               break;
            }
         }
      }
   };
}
