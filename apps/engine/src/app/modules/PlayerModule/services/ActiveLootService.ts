import { CloseLoot, OpenLoot, PlayerClientActions } from '@bananos/types';
import * as _ from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineActionHandler, EngineEventHandler, PlayerMovedEvent } from '../../../types';
import { CharacterEngineEvents, CorpseDropTrackRemovedEvent } from '../../CharacterModule/Events';
import { LootClosedEvent, LootOpenedEvent, PlayerEngineEvents } from '../Events';

export class ActiveLootService extends EventParser {
    // character_id => corpse_id
    activeLoots: Record<string, string> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [PlayerClientActions.OpenLoot]: this.handlePlayerTriesToOpenLoot,
            [PlayerClientActions.CloseLoot]: this.handlePlayerTriesToCloseLoot,
            [CharacterEngineEvents.CorpseDropTrackRemoved]: this.handleCorpseDropTrackRemoved,
            [EngineEvents.CharacterMoved]: this.handlePlayerMoved, // TODO: ten event powinien byc odpalany tylko dla characterow w activeLoots
        };
    }

    handlePlayerTriesToOpenLoot: EngineActionHandler<OpenLoot> = ({ event, services }) => {
        const corpse = services.corpseDropService.getCorpseDropTrackById(event.corpseId);
        if (!corpse) {
            this.sendErrorMessage(event.requestingCharacterId, 'This corpse does not exist.');
            return;
        }

        const character = services.characterService.getCharacterById(event.requestingCharacterId);
        if (distanceBetweenTwoPoints(character.location, corpse.corpse.location) > 100) {
            this.sendErrorMessage(event.requestingCharacterId, 'This corpse is to far away.');
            return;
        }

        if (this.activeLoots[event.requestingCharacterId]) {
            this.closeLoot(event.requestingCharacterId);
        }

        this.activeLoots[event.requestingCharacterId] = event.corpseId;
        const items = services.corpseDropService.getCorpseDropTrackById(event.corpseId);

        if (items) {
            this.engineEventCrator.asyncCeateEvent<LootOpenedEvent>({
                type: PlayerEngineEvents.LootOpened,
                characterId: event.requestingCharacterId,
                corpseId: event.corpseId,
                corpseDropTrack: items,
            });
        }
    };

    handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
        if (this.activeLoots[event.characterId]) {
            this.closeLoot(event.characterId);
        }
    };

    handlePlayerTriesToCloseLoot: EngineActionHandler<CloseLoot> = ({ event }) => {
        this.closeLoot(event.requestingCharacterId);
    };

    closeLoot = (characterId: string) => {
        const corpseId = this.activeLoots[characterId];
        delete this.activeLoots[characterId];

        this.engineEventCrator.asyncCeateEvent<LootClosedEvent>({
            type: PlayerEngineEvents.LootClosed,
            characterId,
            corpseId,
        });
    };

    handleCorpseDropTrackRemoved: EngineEventHandler<CorpseDropTrackRemovedEvent> = ({ event }) => {
        const characterIds = this.getAllCharacterIdsWithThatCorpseOpened(event.corpseId);
        characterIds.forEach((characterId) => this.closeLoot(characterId));
    };

    getAllCharacterIdsWithThatCorpseOpened = (corpseId) =>
        _.chain(this.activeLoots)
            .pickBy((loot) => loot === corpseId)
            .map((_, key) => key)
            .value();

    getCharacterActiveLoot = (characterId: string) => this.activeLoots[characterId];
}
