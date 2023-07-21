import { Spell } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { Services } from '../../../types/Services';
import { PlayerCastSpellEvent, PlayerTriesToCastASpellEvent, SpellEngineEvents } from '../Events';

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
        const character = services.characterService.getCharacterById(event.spellData.characterId) as PlayerCharacter;

        if (!character) {
            return;
        }

        const spell = services.spellService.getData()[event.spellData.spellId];

        if (character.type == CharacterType.Player) {
            const characterClass = services.characterClassService.getData()[character.characterClassId];

            if (!characterClass.spells[spell.id]) {
                return;
            }
        }

        if (services.powerPointsService.getSpellPower(character.id) < spell.spellPowerCost) {
            return;
        }

        if (!this.haveEnoughPowerStacks(spell, character.id, services)) {
            return;
        }

        if (services.cooldownService.isSpellAvailable(character.id, spell.id)) {
            this.engineEventCrator.asyncCeateEvent<PlayerCastSpellEvent>({
                type: SpellEngineEvents.PlayerCastSpell,
                casterId: event.spellData.characterId,
                spell,
                directionLocation: event.spellData.directionLocation,
                targetId: event.spellData.targetId
            });
        }
    };
}
