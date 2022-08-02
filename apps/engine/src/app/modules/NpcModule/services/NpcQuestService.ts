import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineEventHandler } from '../../../types';
import { QuestEngineEvents, StartQuestEvent } from '../../QuestModule/Events';
import { NpcEngineEvents, PlayerTriesToTakeQuestFromNpcEvent } from '../Events';

export class NpcQuestService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [NpcEngineEvents.PlayerTriesToTakeQuestFromNpc]: this.handlePlayerTriesToTakeQuestFromNpc,
      };
   }

   handlePlayerTriesToTakeQuestFromNpc: EngineEventHandler<PlayerTriesToTakeQuestFromNpcEvent> = ({ event, services }) => {
      const npc = services.npcService.getNpcById(event.npcId);
      if (!npc) {
         this.sendErrorMessage(event.requestingCharacterId, 'That npc does not exist.');
         return;
      }

      const character = services.characterService.getCharacterById(event.requestingCharacterId);
      if (distanceBetweenTwoPoints(npc.location, character.location) > 100) {
         this.sendErrorMessage(event.requestingCharacterId, 'You are too far away.');
         return;
      }

      const template = services.npcTemplateService.getData()[npc.templateId];
      if (!template.quests[event.questId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'This npc does not have such quest.');
         return;
      }

      this.engineEventCrator.asyncCeateEvent<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: event.requestingCharacterId,
         questId: event.questId,
      });
   };
}
