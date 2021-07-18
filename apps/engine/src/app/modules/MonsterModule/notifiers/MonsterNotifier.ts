import { EngineMessages } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { MonsterDiedEvent, MonsterEngineEvents, NewMonsterCreatedEvent } from '../Events';

export class MonsterNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.NewMonsterCreated]: this.handleCreateNewMonster,
         [MonsterEngineEvents.MonsterDied]: this.handleMonsterDied,
      };
   }

   handleCreateNewMonster: EngineEventHandler<NewMonsterCreatedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.UserConnected, {
         player: event.monster,
      });
   };

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.CharacterDied, {
         characterId: event.monster.id,
      });
   };
}
