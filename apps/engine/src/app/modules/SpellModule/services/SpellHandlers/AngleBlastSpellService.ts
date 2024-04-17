import { Location, SpellType } from '@bananos/types';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints, isSegementCrossingWithAnyWall } from 'apps/engine/src/app/math';
import { EngineEventHandler } from 'apps/engine/src/app/types';
import { omit } from 'lodash';
import {
    PlayerCastSpellEvent,
    PlayerCastSubSpellEvent,
    PlayerCastedSpellEvent,
    SpellEngineEvents,
    SpellLandedEvent,
    SpellReachedTargetEvent,
    SubSpellCastedEvent,
} from '../../Events';
import { filterCharactersBaseOnSpellImpact } from '../utils';

export class AngleBlastSpellService extends EventParser {
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

    isInRange = (caster, target, range) => distanceBetweenTwoPoints(caster.location, target.location) <= range;

    handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
        if (event.spell.type === SpellType.AngleBlast) {
            const spell = event.spell;
            const caster = services.characterService.getAllCharacters()[event.casterId];
            const allCharacters = filterCharactersBaseOnSpellImpact(services.characterService.getAllCharacters(), event.spell, event.casterId);

            const castAngle = Math.atan2(-(event.directionLocation.y - caster.location.y), event.directionLocation.x - caster.location.x);

            const distanceToPI = Math.PI - Math.abs(castAngle);
            const rotatedAngle = castAngle > 0 ? -Math.PI - distanceToPI : Math.PI + distanceToPI;
            const angleDistance = spell.angle / 2;

            this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
                type: SpellEngineEvents.PlayerCastedSpell,
                casterId: caster.id,
                spell,
            });

            this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
                type: SpellEngineEvents.SpellLanded,
                spell,
                caster,
                // BUG, do ustalenia jaka jest location
                location: event.directionLocation,
                angle: castAngle,
            });

            const affectedTargets = [];

            for (const i in allCharacters) {
                if (allCharacters[i].id === caster.id) {
                    affectedTargets.push(allCharacters[i]);
                    continue;
                }

                const targetAngle = Math.atan2(-(allCharacters[i].location.y - caster.location.y), allCharacters[i].location.x - caster.location.x);
                if (
                    (Math.abs(targetAngle - castAngle) <= angleDistance || Math.abs(targetAngle - rotatedAngle) <= angleDistance) &&
                    this.isInRange(caster, allCharacters[i], spell.range) &&
                    this.isTargetInSight(caster.location, allCharacters[i].location, services.collisionService.getAreas())
                ) {
                    affectedTargets.push(allCharacters[i]);
                }
            }

            affectedTargets.forEach(target => {
                this.engineEventCrator.asyncCeateEvent<SpellReachedTargetEvent>({
                    type: SpellEngineEvents.SpellReachedTarget,
                    spell,
                    caster,
                    target,
                    effectMultiplier: spell.effectSpread ? 1 / affectedTargets.length : 1
                });
            })
        }
    };

    handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
        if (event.spell.type === SpellType.AngleBlast) {
            // TODO: Tutaj nie dodałem spread damage. Ale moze to tutaj sie powinno znalezc.
            const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
            const caster = allCharacters[event.casterId];
            const castAngle = Math.atan2(-(event.directionLocation.y - caster.location.y), event.directionLocation.x - caster.location.x);

            const distanceToPI = Math.PI - Math.abs(castAngle);
            const rotatedAngle = castAngle > 0 ? -Math.PI - distanceToPI : Math.PI + distanceToPI;
            const angleDistance = event.spell.angle / 2;

            this.engineEventCrator.asyncCeateEvent<SubSpellCastedEvent>({
                type: SpellEngineEvents.SubSpellCasted,
                casterId: caster.id,
                spell: event.spell,
            });

            this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
                type: SpellEngineEvents.SpellLanded,
                spell: event.spell,
                caster,
                // BUG, do ustalenia jaka jest location
                location: event.directionLocation,
                angle: castAngle,
            });

            for (const i in omit(allCharacters, [caster.id])) {
                const targetAngle = Math.atan2(-(allCharacters[i].location.y - caster.location.y), allCharacters[i].location.x - caster.location.x);
                if (
                    (Math.abs(targetAngle - castAngle) <= angleDistance || Math.abs(targetAngle - rotatedAngle) <= angleDistance) &&
                    this.isInRange(caster, allCharacters[i], event.spell.range) &&
                    this.isTargetInSight(caster.location, allCharacters[i].location, services.collisionService.getAreas())
                ) {
                    this.engineEventCrator.asyncCeateEvent<SpellReachedTargetEvent>({
                        type: SpellEngineEvents.SpellReachedTarget,
                        spell: event.spell,
                        caster,
                        target: allCharacters[i],
                    });
                }
            }
        }
    };
}
