import { EngineMessages } from '@bananos/types';
import { AREAS } from '../../map';
import { EngineEvents } from '../EngineEvents';
import { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';

export class SocketConnectionService extends EventParser {
  io;
  sockets = {};

  constructor(io: any) {
    super();
    this.io = io;

    this.eventsToHandlersMap = {
      [EngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
    };
  }

  getIO = () => this.io;

  getSocketById = (userId) => this.sockets[userId];

  init(engineEventCrator: EngineEventCrator, services) {
    super.init(engineEventCrator, services);

    this.io.on('connection', (socket) => {
      this.sockets[socket.id] = socket;
      this.engineEventCrator.createEvent({
        type: EngineEvents.CreateNewPlayer,
        payload: {
          socketId: socket.id,
        },
      });
    });
  }

  handleNewCharacterCreated = ({ event, services }) => {
    const { newCharacter: currentCharacter } = event.payload;
    const currentSocket = this.sockets[currentCharacter.socketId];

    currentSocket.emit(EngineMessages.Inicialization, {
      activePlayer: currentCharacter.id,
      players: services.characterService.getAllCharacters(),
      projectiles: services.projectilesService.getAllProjectiles(),
      areas: AREAS,
    });

    currentSocket.broadcast.emit(EngineMessages.UserConnected, {
      player: currentCharacter,
    });

    currentSocket.on('disconnect', () => {
      currentSocket.broadcast.emit(EngineMessages.UserDisconnected, {
        userId: currentCharacter.id,
      });
      this.engineEventCrator.createEvent({
        type: EngineEvents.PlayerDisconnected,
        payload: {
          playerId: currentCharacter.id,
        },
      });
      delete this.sockets[currentCharacter.socketId];
    });
  };
}