import { CharacterType, Location, SpellType } from '@bananos/types';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints, isSegementCrossingWithAnyWall } from 'apps/engine/src/app/math';
import { omit } from 'lodash';
import { EngineEventHandler } from '../../../../types';
import {
    PlayerCastSpellEvent,
    PlayerCastSubSpellEvent,
    PlayerCastedSpellEvent,
    SpellEngineEvents,
    SpellLandedEvent,
    SpellReachedTargetEvent,
    SubSpellCastedEvent,
} from '../../Events';

export class AreaSpellService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
            [SpellEngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
        };
    }

    isTargetInSight = (shooter: Location, target: Location, areas) => {
        const shotSegment = [
            [shooter.x, shooter.y],
            [target.x, target.y],
        ];

        return !isSegementCrossingWithAnyWall(shotSegment, areas);
    };

    handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
        if (event.spell.type === SpellType.Area) {
            const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
            const character = allCharacters[event.casterId];

            if (distanceBetweenTwoPoints(character.location, event.directionLocation) > event.spell.range) {
                if (character.type === CharacterType.Player) {
                    this.sendErrorMessage(event.casterId, 'You are out of range.');
                }
                return;
            }

            if (!event.spell.passThrough && !this.isTargetInSight(character.location, event.directionLocation, services.collisionService.getAreas())) {
                if (character.type === CharacterType.Player) {
                    this.sendErrorMessage(event.casterId, 'You cannot use it there.');
                }
                return;
            }

            this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
                type: SpellEngineEvents.PlayerCastedSpell,
                casterId: character.id,
                spell: event.spell,
            });

            this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
                type: SpellEngineEvents.SpellLanded,
                spell: event.spell,
                caster: character,
                location: event.directionLocation,
            });

            for (const i in omit(allCharacters, [character.id])) {
                if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) > event.spell.radius) {
                    continue;
                }

                this.engineEventCrator.asyncCeateEvent<SpellReachedTargetEvent>({
                    type: SpellEngineEvents.SpellReachedTarget,
                    spell: event.spell,
                    caster: character,
                    target: allCharacters[i],
                });
            }
        }
    };

    handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
        if (event.spell.type === SpellType.Area) {
            const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
            const character = allCharacters[event.casterId];

            this.engineEventCrator.createEvent<SubSpellCastedEvent>({
                type: SpellEngineEvents.SubSpellCasted,
                casterId: event.casterId,
                spell: event.spell,
            });

            this.engineEventCrator.createEvent<SpellLandedEvent>({
                type: SpellEngineEvents.SpellLanded,
                spell: event.spell,
                caster: character,
                location: event.directionLocation,
            });

            for (const i in omit(allCharacters, [character.id])) {
                if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < event.spell.radius) {
                    this.engineEventCrator.createEvent<SpellReachedTargetEvent>({
                        type: SpellEngineEvents.SpellReachedTarget,
                        spell: event.spell,
                        caster: character,
                        target: allCharacters[i],
                    });
                }
            }
        }
    };
}
