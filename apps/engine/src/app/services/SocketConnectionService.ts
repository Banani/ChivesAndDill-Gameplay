import { EngineMessages } from '@bananos/types';
import { AREAS } from '../../map';
import { EngineEvents } from '../EngineEvents';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import { SpellsPerClass } from '../modules/SpellModule/spells';
import type { CreateNewPlayerEvent, EngineEventHandler, NewPlayerCreatedEvent, PlayerDisconnectedEvent } from '../types';

export class SocketConnectionService extends EventParser {
   io;
   sockets = {};

   constructor(io: any) {
      super();
      this.io = io;

      this.eventsToHandlersMap = {
         [EngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };
   }

   getIO = () => this.io;

   getSocketById = (userId) => this.sockets[userId];

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator, services);

      this.io.on('connection', (socket) => {
         this.sockets[socket.id] = socket;
         this.engineEventCrator.asyncCeateEvent<CreateNewPlayerEvent>({
            type: EngineEvents.CreateNewPlayer,
            payload: {
               socketId: socket.id,
            },
         });
      });
   }

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
      const { newCharacter: currentCharacter } = event.payload;
      const currentSocket = this.sockets[currentCharacter.socketId];

      currentSocket.emit(EngineMessages.Inicialization, {
         activePlayer: currentCharacter.id,
         players: { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() },
         projectiles: services.projectilesService.getAllProjectiles(),
         areas: AREAS,
         spells: SpellsPerClass[currentCharacter.class],
      });

      currentSocket.broadcast.emit(EngineMessages.UserConnected, {
         player: currentCharacter,
      });

      currentSocket.on('disconnect', () => {
         currentSocket.broadcast.emit(EngineMessages.UserDisconnected, {
            userId: currentCharacter.id,
         });
         this.engineEventCrator.asyncCeateEvent<PlayerDisconnectedEvent>({
            type: EngineEvents.PlayerDisconnected,
            payload: {
               playerId: currentCharacter.id,
            },
         });
         delete this.sockets[currentCharacter.socketId];
      });
   };
}
