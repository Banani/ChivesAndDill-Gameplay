import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { Character, EngineEventHandler, PlayerCastSpellEvent, PlayerTriesToCastASpellEvent, Spell } from '../../../types';
import { Services } from '../../../types/Services';

export class SpellAvailabilityService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerTriesToCastASpell]: this.handlePlayerTriesToCastASpell,
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
      const character = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() }[event.spellData.characterId];

      if (character.currentSpellPower < event.spellData.spell.spellPowerCost) {
         return;
      }

      if (!this.haveEnoughPowerStacks(event.spellData.spell, character.id, services)) {
         return;
      }

      if (services.cooldownService.isSpellAvailable(character.id, event.spellData.spell.name)) {
         this.engineEventCrator.asyncCeateEvent<PlayerCastSpellEvent>({
            type: EngineEvents.PlayerCastSpell,
            casterId: event.spellData.characterId,
            spell: event.spellData.spell,
            directionLocation: event.spellData.directionLocation,
         });
      }
   };
}
