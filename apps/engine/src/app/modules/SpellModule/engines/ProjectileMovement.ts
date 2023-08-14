import { Character, Location, ProjectileSpell } from '@bananos/types';
import { each, filter, pickBy } from 'lodash';
import { Engine } from '../../../Engine';
import { distanceBetweenTwoPoints, getCrossingPointsWithWalls, getTheClosestObject, isSegmentIntersectingWithACircle } from '../../../math';
import { Projectile, ProjectileMovedEvent, RemoveProjectileEvent, SpellEngineEvents, SpellLandedEvent, SpellReachedTargetEvent } from '../Events';
import { filterCharactersBaseOnSpellImpact } from '../services/utils';

enum ProjectileIntersection {
    WALL,
    CHARACTER,
}

export class ProjectileMovement extends Engine {
    calculateAngles(projectile) {
        const angle = Math.atan2(projectile.directionLocation.y - projectile.startLocation.y, projectile.directionLocation.x - projectile.startLocation.x);

        return {
            xMultiplayer: Math.cos(angle),
            yMultiplayer: Math.sin(angle),
            angle,
        };
    }

    isItOutOfRange(projectile: Projectile, newLocation: Location) {
        return distanceBetweenTwoPoints(projectile.startLocation, newLocation) > projectile.spell.range;
    }

    getCrossingCharacter(characters: Record<string, Character>, movementSegment) {
        return pickBy(characters, (character) => {
            return isSegmentIntersectingWithACircle(movementSegment, [character.location.x, character.location.y, character.size / 2]);
        });
    }

    doAction() {
        each(this.services.projectilesService.getAllProjectiles(), (projectile, projectileId) => {
            const newLocation = {
                x: projectile.currentLocation.x + projectile.xMultiplayer * projectile.spell.speed,
                y: projectile.currentLocation.y + projectile.yMultiplayer * projectile.spell.speed,
            };

            const movementSegment = [
                [projectile.currentLocation.x, projectile.currentLocation.y],
                [newLocation.x, newLocation.y],
            ];

            const allCharacters = filterCharactersBaseOnSpellImpact(
                this.services.characterService.getAllCharacters(),
                projectile.spell as ProjectileSpell,
                projectile.characterId
            );

            const hitCharacters = filter(this.getCrossingCharacter(allCharacters, movementSegment), (character) => character.id !== projectile.characterId);
            const wallsInteractionPoints = getCrossingPointsWithWalls(movementSegment, this.services.collisionService.getAreas());

            const allProjectileIntersections = [
                ...hitCharacters.map((character) => ({
                    type: ProjectileIntersection.CHARACTER,
                    location: character.location,
                    character,
                })),
                ...wallsInteractionPoints.map((crossPoint) => ({
                    type: ProjectileIntersection.WALL,
                    location: crossPoint,
                })),
            ];

            const theClossestIntersection = getTheClosestObject(projectile.currentLocation, allProjectileIntersections);

            if (theClossestIntersection?.type === ProjectileIntersection.CHARACTER) {
                if (!projectile.spell.passThrough) {
                    this.eventCrator.createEvent<RemoveProjectileEvent>({
                        type: SpellEngineEvents.RemoveProjectile,
                        projectileId,
                    });
                } else {
                    this.eventCrator.createEvent<ProjectileMovedEvent>({
                        ...projectile,
                        type: SpellEngineEvents.ProjectileMoved,
                        projectileId,
                        newLocation,
                    });
                }

                this.eventCrator.createEvent<SpellLandedEvent>({
                    type: SpellEngineEvents.SpellLanded,
                    spell: projectile.spell,
                    caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.characterId],
                    location: theClossestIntersection.character.location,
                });

                this.eventCrator.createEvent<SpellReachedTargetEvent>({
                    type: SpellEngineEvents.SpellReachedTarget,
                    spell: projectile.spell,
                    caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.characterId],
                    target: theClossestIntersection.character,
                });
            } else if (this.isItOutOfRange(projectile, newLocation) || theClossestIntersection?.type === ProjectileIntersection.WALL) {
                this.eventCrator.createEvent<RemoveProjectileEvent>({
                    type: SpellEngineEvents.RemoveProjectile,
                    projectileId,
                });
            } else {
                this.eventCrator.createEvent<ProjectileMovedEvent>({
                    ...projectile,
                    type: SpellEngineEvents.ProjectileMoved,
                    projectileId,
                    newLocation,
                });
            }
        });
    }
}
