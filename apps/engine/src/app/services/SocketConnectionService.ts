import { EngineMessages, EnginePackage } from '@bananos/types';
import { filter, forEach, merge } from 'lodash';
import { AREAS } from '../../map';
import { EngineEvents } from '../EngineEvents';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import { CreateNewPlayerEvent, NewPlayerCreatedEvent, PlayerEngineEvents } from '../modules/PlayerModule/Events';
import { Notifier } from '../Notifier';
import type { EngineEventHandler, PlayerDisconnectedEvent } from '../types';

export class SocketConnectionService extends EventParser {
   io;
   sockets: Record<string, any> = {};
   notifiers: Notifier[] = [];

   constructor(io: any, notifiers: Notifier[]) {
      super();
      this.io = io;
      this.notifiers = notifiers;

      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };
   }

   getIO = () => this.io;

   // Not sure about it
   getSocketById = (userId) => this.sockets[userId];

   sendMessages = () => {
      const commonPackage = {};
      const targetSpecificPackage = {};
      forEach(this.sockets, (_, playerId) => {
         targetSpecificPackage[playerId] = {};
      });

      forEach(filter(this.notifiers, (notifier) => notifier.getBroadcast) as Notifier[], (notifier) => {
         const notifierPackage = notifier.getBroadcast();
         commonPackage[notifierPackage.key] = notifierPackage;
      });

      forEach(filter(this.notifiers, (notifier) => notifier.getMulticast) as Notifier[], (notifier) => {
         const notifierPackage = notifier.getMulticast();
         forEach(notifierPackage.messages, (message, receiverId) => {
            targetSpecificPackage[receiverId][notifierPackage.key] = message;
         });
      });

      forEach(this.sockets, (socket, playerId) => {
         socket.emit(EngineMessages.Package, merge({}, commonPackage, targetSpecificPackage[playerId]));
      });
   };

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator, services);

      this.io.on('connection', (socket) => {
         this.engineEventCrator.asyncCeateEvent<CreateNewPlayerEvent>({
            type: PlayerEngineEvents.CreateNewPlayer,
            socket: socket,
         });
      });
   }

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
      this.sockets[event.playerId] = event.socket;

      event.socket.on('disconnect', () => {
         this.engineEventCrator.asyncCeateEvent<PlayerDisconnectedEvent>({
            type: EngineEvents.PlayerDisconnected,
            payload: {
               playerId: event.playerId,
            },
         });
         delete this.sockets[event.playerId];
      });
   };
}
