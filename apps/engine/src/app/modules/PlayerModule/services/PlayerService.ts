import { EventParser } from '../../../EventParser';
import type { EngineEventHandler } from '../../../types';
import type { Player } from '../types';
import { CreateNewPlayerEvent, NewPlayerCreatedEvent, PlayerDisconnectedEvent, PlayerEngineEvents } from '../Events';

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

   handlePlayerDisconnected: EngineEventHandler<PlayerDisconnectedEvent> = ({ event }) => {
      delete this.players[event.playerId];
   };
}
