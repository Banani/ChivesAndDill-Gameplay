import { EventParser } from '../../../EventParser';
import { Character, EngineEventHandler } from '../../../types';
import { Services } from '../../../types/Services';
import { PlayerCastSpellEvent, PlayerTriesToCastASpellEvent, SpellEngineEvents } from '../Events';
import { ALL_SPELLS } from '../spells';
import { Spell } from '../types/SpellTypes';

export class SpellAvailabilityService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.PlayerTriesToCastASpell]: this.handlePlayerTriesToCastASpell,
      };
   }

   haveEnoughPowerStacks = (spell: Spell, characterId: string, services: Services) => {
      if (spell.requiredPowerStacks) {
         for (let requiredPowerStack of spell.requiredPowerStacks) {
            const availableAmount = services.powerStackEffectService.getAmountOfPowerStack(characterId, requiredPowerStack.type);
            if (availableAmount < requiredPowerStack.amount) {
               return false;
            }
         }
      }

      return true;
   };

   handlePlayerTriesToCastASpell: EngineEventHandler<PlayerTriesToCastASpellEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.spellData.characterId);

      const spell = ALL_SPELLS[event.spellData.spellName];

      if (!character || !character.spells[spell?.name]) {
         return;
      }

      if (services.powerPointsService.getSpellPower(character.id) < spell.spellPowerCost) {
         return;
      }

      if (!this.haveEnoughPowerStacks(spell, character.id, services)) {
         return;
      }

      if (services.cooldownService.isSpellAvailable(character.id, spell)) {
         this.engineEventCrator.asyncCeateEvent<PlayerCastSpellEvent>({
            type: SpellEngineEvents.PlayerCastSpell,
            casterId: event.spellData.characterId,
            spell,
            directionLocation: event.spellData.directionLocation,
         });
      }
   };
}
