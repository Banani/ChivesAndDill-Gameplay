import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { QuestCompletedEvent, QuestEngineEvents } from '../Events';

export class ArchivedQuestService extends EventParser {
   // characterId -> questId
   questArchives: Record<string, Record<string, boolean>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
         [QuestEngineEvents.QuestCompleted]: this.handleQuestCompleted,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      if (!this.questArchives[event.playerCharacter.id]) {
         this.questArchives[event.playerCharacter.id] = {};
      }
   };

   handleQuestCompleted: EngineEventHandler<QuestCompletedEvent> = ({ event }) => {
      this.questArchives[event.characterId][event.questId] = true;
   };

   getCompletedQuests = (characterId: string) => this.questArchives[characterId];
}
