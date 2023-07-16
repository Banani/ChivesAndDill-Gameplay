import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { CharacterType, EngineEventHandler } from 'apps/engine/src/app/types';
import { omit, pickBy } from 'lodash';
import {
    PlayerCastSpellEvent,
    PlayerCastSubSpellEvent,
    PlayerCastedSpellEvent,
    SpellEngineEvents,
    SpellLandedEvent,
    SpellReachedTargetEvent,
    SubSpellCastedEvent,
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
            const caster = services.characterService.getAllCharacters()[event.casterId];
            let allCharacters = services.characterService.getAllCharacters();
            allCharacters = pickBy(allCharacters, character => character.type !== CharacterType.Npc);

            if (!event.spell.monstersImpact) {
                allCharacters = pickBy(allCharacters, character => character.type !== CharacterType.Monster);
            }

            if (!event.spell.casterImpact) {
                allCharacters = omit(allCharacters, [event.casterId]);
            }

            if (!event.spell.playersImpact) {
                allCharacters = pickBy(allCharacters, character => character.type !== CharacterType.Player);
            }

            if (caster && distanceBetweenTwoPoints(caster.location, event.directionLocation) > event.spell.range) {
                this.sendErrorMessage(event.casterId, 'Out of range.');
                return;
            }

            for (const i in allCharacters) {
                if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
                    this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
                        type: SpellEngineEvents.PlayerCastedSpell,
                        casterId: event.casterId,
                        spell: event.spell,
                    });

                    this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
                        type: SpellEngineEvents.SpellLanded,
                        spell: event.spell,
                        caster: caster,
                        location: allCharacters[i].location,
                    });

                    this.engineEventCrator.asyncCeateEvent<SpellReachedTargetEvent>({
                        type: SpellEngineEvents.SpellReachedTarget,
                        spell: event.spell,
                        caster: caster,
                        target: allCharacters[i],
                    });
                    return;
                }
            }

            this.sendErrorMessage(event.casterId, 'Invalid target.');
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
