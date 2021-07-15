import { EngineMessages } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { MonsterEngineEvents, NewMonsterCreatedEvent } from '../Events';

export class MonsterNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.NewMonsterCreated]: this.handleCreateNewMonster,
      };
   }

   handleCreateNewMonster: EngineEventHandler<NewMonsterCreatedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.UserConnected, {
         player: event.monster,
      });
   };
}
