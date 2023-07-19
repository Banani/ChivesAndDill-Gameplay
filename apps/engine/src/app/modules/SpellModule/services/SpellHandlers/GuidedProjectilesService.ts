import { GuidedProjectileSpell, GuidedProjectileSubSpell, Location, SpellType } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { CharacterDiedEvent, EngineEventHandler } from 'apps/engine/src/app/types';
import { CharacterUnion } from 'apps/engine/src/app/types/CharacterUnion';
import { chain } from 'lodash';
import {
    PlayerCastSpellEvent,
    PlayerCastSubSpellEvent,
    PlayerCastedSpellEvent,
    ProjectileCreatedEvent,
    ProjectileMovedEvent,
    ProjectileRemovedEvent,
    RemoveProjectileEvent,
    SpellEngineEvents,
    SubSpellCastedEvent,
} from '../../Events';
import { GuidedProjectileEngine } from '../../engines/GuidedProjectileEngine';
import { filterCharactersBaseOnSpellImpact } from '../utils';

interface GuidedProjectileTrack {
    caster: CharacterUnion;
    spell: GuidedProjectileSubSpell | GuidedProjectileSpell;
    directionLocation: Location;
    targetId: string;
    startLocation: Location;
    currentLocation: Location;
}

export class GuidedProjectilesService extends EventParser {
    guidedProjectileEngine: GuidedProjectileEngine;
    guidedProjectilesTracks: Record<string, GuidedProjectileTrack> = {};
    increment = 0;

    constructor(guidedProjectileEngine: GuidedProjectileEngine) {
        super();
        this.guidedProjectileEngine = guidedProjectileEngine;
        this.eventsToHandlersMap = {
            [EngineEvents.CharacterDied]: this.handleCharacterDied,
            [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
            [SpellEngineEvents.ProjectileMoved]: this.handleProjectileMoved,
            [SpellEngineEvents.RemoveProjectile]: this.handleRemoveProjectile,
            [SpellEngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
        };
    }

    init(engineEventCrator, services) {
        super.init(engineEventCrator);
        this.guidedProjectileEngine.init(engineEventCrator, services);
    }

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
        const projectileIds = chain(this.guidedProjectilesTracks)
            .pickBy((track) => track.targetId === event.characterId)
            .map((_, key) => key)
            .value();

        this.removeProjectiles(projectileIds);
    };

    handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
        if (event.spell.type === SpellType.GuidedProjectile) {
            const caster = services.characterService.getCharacterById(event.casterId);
            const allCharacters = filterCharactersBaseOnSpellImpact(services.characterService.getAllCharacters(), event.spell, event.casterId);

            if (caster && distanceBetweenTwoPoints(caster.location, event.directionLocation) > event.spell.range) {
                this.sendErrorMessage(event.casterId, 'Out of range.');
                return;
            }

            for (const i in allCharacters) {
                if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
                    this.increment++;
                    const projectileId = 'guided_projectile_' + this.increment;
                    this.guidedProjectilesTracks[projectileId] = {
                        caster: caster,
                        spell: event.spell,
                        directionLocation: event.directionLocation as Location,
                        targetId: allCharacters[i].id,
                        startLocation: caster.location,
                        currentLocation: caster.location,
                    };

                    this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
                        type: SpellEngineEvents.PlayerCastedSpell,
                        casterId: event.casterId,
                        spell: event.spell,
                    });

                    this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
                        type: SpellEngineEvents.ProjectileCreated,
                        projectileId,
                        currentLocation: caster.location,
                        spell: event.spell,
                    });

                    return;
                }
            }

            this.sendErrorMessage(event.casterId, 'Invalid target.');
        }
    };

    handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
        if (event.spell.type === SpellType.GuidedProjectile) {
            const casterCharacter = services.characterService.getCharacterById(event.casterId);

            if (!services.characterService.getCharacterById(event.targetId)) {
                return;
            }

            this.increment++;
            const projectileId = 'guided_projectile_' + this.increment;
            this.guidedProjectilesTracks[projectileId] = {
                caster: casterCharacter,
                spell: event.spell,
                directionLocation: event.directionLocation as Location,
                targetId: event.targetId,
                startLocation: casterCharacter.location,
                currentLocation: casterCharacter.location,
            };

            this.engineEventCrator.asyncCeateEvent<SubSpellCastedEvent>({
                type: SpellEngineEvents.SubSpellCasted,
                casterId: event.casterId,
                spell: event.spell,
            });

            this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
                type: SpellEngineEvents.ProjectileCreated,
                projectileId,
                currentLocation: casterCharacter.location,
                spell: event.spell,
            });
        }
    };

    handleProjectileMoved: EngineEventHandler<ProjectileMovedEvent> = ({ event }) => {
        if (this.guidedProjectilesTracks[event.projectileId]) {
            this.guidedProjectilesTracks[event.projectileId] = {
                ...this.guidedProjectilesTracks[event.projectileId],
                currentLocation: event.newLocation,
            };
        }
    };

    handleRemoveProjectile: EngineEventHandler<RemoveProjectileEvent> = ({ event }) => {
        if (this.guidedProjectilesTracks[event.projectileId]) {
            this.removeProjectiles([event.projectileId]);
        }
    };

    removeProjectiles = (projectileIds: string[]) => {
        projectileIds.forEach((projectileId) => {
            delete this.guidedProjectilesTracks[projectileId];

            this.engineEventCrator.asyncCeateEvent<ProjectileRemovedEvent>({
                type: SpellEngineEvents.ProjectileRemoved,
                projectileId: projectileId,
            });
        });
    };

    getAllGuidedProjectiles = () => this.guidedProjectilesTracks;
}
