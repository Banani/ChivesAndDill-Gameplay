import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { Character, EngineEventHandler, PlayerCastSpellEvent, PlayerTriesToCastASpellEvent } from '../../../types';

export class SpellAvailabilityService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerTriesToCastASpell]: this.handlePlayerTriesToCastASpell,
      };
   }

   handlePlayerTriesToCastASpell: EngineEventHandler<PlayerTriesToCastASpellEvent> = ({ event, services }) => {
      const character = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() }[event.spellData.characterId];

      // BUG
      if (!character || (character as Character).isDead) {
         return;
      }

      if (character.currentSpellPower < event.spellData.spell.spellPowerCost) {
         return;
      }

      if (services.cooldownService.isSpellAvailable(character.id, event.spellData.spell.name)) {
         this.engineEventCrator.createEvent<PlayerCastSpellEvent>({
            type: EngineEvents.PlayerCastSpell,
            casterId: event.spellData.characterId,
            spell: event.spellData.spell,
            directionLocation: event.spellData.directionLocation,
         });
      }
   };
}
