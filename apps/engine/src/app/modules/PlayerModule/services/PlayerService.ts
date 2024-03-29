import { CharacterType } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterEngineEvents, RemoveCharacterEvent } from '../../CharacterModule/Events';
import { CreateNewPlayerEvent, NewPlayerCreatedEvent, PlayerDisconnectedEvent, PlayerEngineEvents } from '../Events';
import type { Player } from '../types';

export class PlayerService extends EventParser {
    players: Record<string, Player> = {};
    increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.CreateNewPlayer]: this.handleCreateNewPlayer,
            [PlayerEngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
        };
    }

    handleCreateNewPlayer: EngineEventHandler<CreateNewPlayerEvent> = ({ event }) => {
        const playerId = `player_${++this.increment}`;

        this.players[playerId] = {};

        this.engineEventCrator.asyncCeateEvent<NewPlayerCreatedEvent>({
            type: PlayerEngineEvents.NewPlayerCreated,
            socket: event.socket,
            playerId,
        });
    };

    handlePlayerDisconnected: EngineEventHandler<PlayerDisconnectedEvent> = ({ event, services }) => {
        delete this.players[event.playerId];

        const playerCharacter = _.find(
            services.characterService.getAllCharacters(),
            (character) => character.type === CharacterType.Player && character.ownerId === event.playerId
        );

        if (playerCharacter) {
            this.engineEventCrator.asyncCeateEvent<RemoveCharacterEvent>({
                type: CharacterEngineEvents.RemoveCharacter,
                character: playerCharacter,
            });
        }
    };
}
