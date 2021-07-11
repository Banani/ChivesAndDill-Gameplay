import { EngineEvents } from '../EngineEvents';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import { distanceBetweenTwoPoints } from '../math';
import { SpellType } from '../SpellType';
import _ from 'lodash';
import { CharacterHitEvent, EngineEventHandler, PlayerCastedSpellEvent, PlayerTriesToCastASpellEvent } from '../types';

export class DirectHitService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerTriesToCastASpell]: this.handlePlayerTriesToCastASpell,
      };
   }

   init(engineEventCrator: EngineEventCrator) {
      super.init(engineEventCrator);
   }

   handlePlayerTriesToCastASpell: EngineEventHandler<PlayerTriesToCastASpellEvent> = ({ event, services }) => {
      if (event.spellData.spell.type === SpellType.DIRECT_HIT) {
         const character = services.characterService.getCharacterById(event.spellData.characterId);

         if (!services.characterService.canCastASpell(character.id)) {
            return;
         }

         if (distanceBetweenTwoPoints(character.location, event.spellData.directionLocation) > event.spellData.spell.range) {
            return;
         }

         if (!services.cooldownService.isSpellAvailable(character.id, event.spellData.spell.name)) {
            return;
         }

         const allCharacters = services.characterService.getAllCharacters();
         for (const i in _.omit(allCharacters, [character.id])) {
            if (distanceBetweenTwoPoints(event.spellData.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
                  type: EngineEvents.PlayerCastedSpell,
                  casterId: character.id,
                  spell: event.spellData.spell,
               });

               this.engineEventCrator.createEvent<CharacterHitEvent>({
                  type: EngineEvents.CharacterHit,
                  spell: event.spellData.spell,
                  target: allCharacters[i],
               });
               break;
            }
         }
      }
   };
}
