import { EngineMessages } from '@bananos/types';
import { filter, forEach, merge } from 'lodash';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import { CreateNewPlayerEvent, NewPlayerCreatedEvent, PlayerDisconnectedEvent, PlayerEngineEvents } from '../modules/PlayerModule/Events';
import { Notifier } from '../Notifier';
import type { EngineEventHandler } from '../types';

export class SocketConnectionService extends EventParser {
   io;
   sockets: Record<string, any> = {};
   notifiers: Notifier<any>[] = [];

   constructor(io: any, notifiers: Notifier<any>[]) {
      super();
      this.io = io;
      this.notifiers = notifiers;

      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };
   }

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
            type: PlayerEngineEvents.PlayerDisconnected,
            playerId: event.playerId,
         });
         delete this.sockets[event.playerId];
      });
   };
}
