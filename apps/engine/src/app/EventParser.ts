import { EngineEventCrator } from './EngineEventsCreator';
import { CharacterEngineEventsMap } from './modules/CharacterModule/Events';
import { ChatEngineEventsMap } from './modules/ChatModule/Events';
import { ItemEngineEventsMap } from './modules/ItemModule/Events';
import { MapEventsMap } from './modules/MapModule/Events';
import { MonsterEngineEventsMap } from './modules/MonsterModule/Events';
import { NpcEngineEventsMap } from './modules/NpcModule/Events';
import { PlayerEngineEvents, PlayerEngineEventsMap, SendErrorMessageEvent } from './modules/PlayerModule/Events';
import { QuestEngineEventsMap } from './modules/QuestModule/Events';
import { FightingEngineEventsMap } from './modules/SpellModule/Events';
import { EngineEvent, EngineEventsMap } from './types';
import { Services } from './types/Services';

export abstract class EventParser {
   engineEventCrator: EngineEventCrator;
   eventsToHandlersMap: Partial<
      EngineEventsMap &
         QuestEngineEventsMap &
         MonsterEngineEventsMap &
         FightingEngineEventsMap &
         CharacterEngineEventsMap &
         PlayerEngineEventsMap &
         ItemEngineEventsMap &
         ChatEngineEventsMap &
         NpcEngineEventsMap &
         MapEventsMap
   > = {};

   init(engineEventCrator: EngineEventCrator, services?: Services) {
      this.engineEventCrator = engineEventCrator;
   }

   handleEvent<EventType extends EngineEvent>({ event, services }: { event: EventType; services: Services }) {
      if (this.eventsToHandlersMap[event.type]) {
         this.eventsToHandlersMap[event.type]({ event: event as any, services });
      }
   }

   wasRequestedByPlayer(event: EngineEvent) {
      return event.requestingCharacterId;
   }

   sendErrorMessage = (receiverId: string, message: string) => {
      this.engineEventCrator.asyncCeateEvent<SendErrorMessageEvent>({
         type: PlayerEngineEvents.SendErrorMessage,
         characterId: receiverId,
         message: message,
      });
   };
}
