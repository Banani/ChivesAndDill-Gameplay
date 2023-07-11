import { CharacterDirection, Location } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints, getCrossingPointsWithWalls } from 'apps/engine/src/app/math';
import { EngineEventHandler, PlayerMovedEvent } from 'apps/engine/src/app/types';
import { PlayerCastSpellEvent, PlayerCastedSpellEvent, SpellEngineEvents, SpellLandedEvent, SpellReachedTargetEvent } from '../../Events';
import { SpellType } from '../../types/SpellTypes';

export class TeleportationSpellService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
        };
    }

    isInRange = (caster: Location, target: Location, range: number) => distanceBetweenTwoPoints(caster, target) <= range;

    isInWall = (startLocation: Location, directionLocation: Location, areas) => {
        const movementSegment = [
            [startLocation.x, startLocation.y],
            [directionLocation.x, directionLocation.y],
        ];

        return getCrossingPointsWithWalls(movementSegment, areas).length % 2 === 1;
    };

    handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
        if (event.spell.type === SpellType.Teleportation) {
            const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
            const caster = allCharacters[event.casterId];

            if (!this.isInRange(caster.location, event.directionLocation, event.spell.range)) {
                return;
            }

            if (this.isInWall(caster.location, event.directionLocation, services.collisionService.getAreas())) {
                return;
            }

            this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
                type: SpellEngineEvents.PlayerCastedSpell,
                casterId: caster.id,
                spell: event.spell,
            });

            this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
                type: SpellEngineEvents.SpellLanded,
                spell: event.spell,
                caster,
                location: event.directionLocation,
            });

            this.engineEventCrator.asyncCeateEvent<SpellReachedTargetEvent>({
                type: SpellEngineEvents.SpellReachedTarget,
                spell: event.spell,
                caster,
                target: caster,
            });

            this.engineEventCrator.asyncCeateEvent<PlayerMovedEvent>({
                type: EngineEvents.PlayerMoved,
                characterId: caster.id,
                newCharacterDirection: CharacterDirection.DOWN,
                newLocation: event.directionLocation,
            });
        }
    };
}
