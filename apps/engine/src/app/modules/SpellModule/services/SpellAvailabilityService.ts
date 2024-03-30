import { CastSpell, CharacterType, Spell, SpellClientActions } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineActionHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { Services } from '../../../types/Services';
import { PlayerCastSpellEvent, SpellEngineEvents } from '../Events';

export class SpellAvailabilityService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [SpellClientActions.CastSpell]: this.handlePlayerTriesToCastASpell,
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

    handlePlayerTriesToCastASpell: EngineActionHandler<CastSpell> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.requestingCharacterId) as PlayerCharacter;

        if (!character) {
            return;
        }

        const spell = services.spellService.getData()[event.spellId];

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
                casterId: event.requestingCharacterId,
                spell,
                directionLocation: event.directionLocation,
                targetId: event.targetId
            });
        }
    };
}
