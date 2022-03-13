import { QuestEngineMessages } from '@bananos/types';
import { omit } from 'lodash';
import { EventParser } from '../../../EventParser';
import { CharacterType, EngineEventHandler } from '../../../types';
import { KillingStagePartProgress, NewQuestStageStartedEvent, QuestCompletedEvent, QuestEngineEvents, QuestStartedEvent } from '../Events';

export class QuestNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [QuestEngineEvents.QUEST_STARTED]: this.handleQuestStarted,
         [QuestEngineEvents.QUEST_COMPLETED]: this.handleQuestCompleted,
         [QuestEngineEvents.KILLING_STAGE_PART_PROGRESS]: this.handleKillingStagePartProgress,
         [QuestEngineEvents.NEW_QUEST_STAGE_STARTED]: this.handleNewQuestStageStarted,
      };
   }

   handleQuestStarted: EngineEventHandler<QuestStartedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type === CharacterType.Player) {
         services.socketConnectionService.getSocketById(character.ownerId).emit(QuestEngineMessages.QuestStarted, omit(event, 'type'));
      }
   };

   handleQuestCompleted: EngineEventHandler<QuestCompletedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type === CharacterType.Player) {
         services.socketConnectionService.getSocketById(character.ownerId).emit(QuestEngineMessages.QuestCompleted, omit(event, 'type'));
      }
   };

   handleKillingStagePartProgress: EngineEventHandler<KillingStagePartProgress> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type === CharacterType.Player) {
         services.socketConnectionService.getSocketById(character.ownerId).emit(QuestEngineMessages.KillingStagePartProgress, omit(event, 'type'));
      }
   };

   handleNewQuestStageStarted: EngineEventHandler<NewQuestStageStartedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type === CharacterType.Player) {
         services.socketConnectionService.getSocketById(character.ownerId).emit(QuestEngineMessages.NewQuestStageStarted, omit(event, 'type'));
      }
   };
}
