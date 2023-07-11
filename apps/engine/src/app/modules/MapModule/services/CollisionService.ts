import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { MapDefinitionUpdatedEvent, MapEvents } from '../Events';

const BLOCK_SIZE = 96;

export class CollisionService extends EventParser {
    private areas: number[][][] = []

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [MapEvents.MapDefinitionUpdated]: this.handleMapDefinitionUpdated,
        };
    }

    handleMapDefinitionUpdated: EngineEventHandler<MapDefinitionUpdatedEvent> = ({ event, services }) => {
        const sprites = services.mapService.mapSchema;
        const areas = [];

        for (let i in services.mapService.mapDefinition) {
            const bottomSprite = sprites[services.mapService.mapDefinition[i].bottomSpriteId];
            const upperSprite = sprites[services.mapService.mapDefinition[i].upperSpriteId];

            if (!bottomSprite?.collision && !upperSprite?.collision) {
                continue;
            }

            const locations = i.split(":");
            const x = parseInt(locations[0]);
            const y = parseInt(locations[1]);
            const xOffset = (x * BLOCK_SIZE);
            const yOffset = (y * BLOCK_SIZE);

            areas.push([
                [
                    0 + xOffset,
                    0 + yOffset
                ], [
                    BLOCK_SIZE + xOffset,
                    0 + yOffset
                ], [
                    BLOCK_SIZE + xOffset,
                    BLOCK_SIZE + yOffset
                ], [
                    0 + xOffset,
                    BLOCK_SIZE + yOffset
                ]
            ])
        }

        this.areas = areas;
    };

    getAreas = () => this.areas
}
