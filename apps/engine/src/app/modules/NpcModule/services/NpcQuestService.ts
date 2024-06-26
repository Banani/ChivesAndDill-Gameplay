import { FinalizeQuestWithNpc, NpcClientActions, TakeQuestFromNpc } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineActionHandler } from '../../../types';
import { QuestCompletedEvent, QuestEngineEvents, StartQuestEvent } from '../../QuestModule/Events';
import { NPC_TALK_DISTANCE } from '../consts';

export class NpcQuestService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [NpcClientActions.TakeQuestFromNpc]: this.handlePlayerTakesQuestFromNpc,
            [NpcClientActions.FinalizeQuestWithNpc]: this.handlePlayerFinalizeQuestWithNpc,
        };
    }

    handlePlayerTakesQuestFromNpc: EngineActionHandler<TakeQuestFromNpc> = ({ event, services }) => {
        const npc = services.npcService.getNpcById(event.npcId);
        if (!npc) {
            this.sendErrorMessage(event.requestingCharacterId, 'That npc does not exist.');
            return;
        }

        const character = services.characterService.getCharacterById(event.requestingCharacterId);
        if (distanceBetweenTwoPoints(npc.location, character.location) > NPC_TALK_DISTANCE) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are too far away.');
            return;
        }

        const template = services.npcTemplateService.getData()[npc.templateId];
        if (!template.quests[event.questId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'This npc does not have such quest.');
            return;
        }

        if (services.questProgressService.isQuestInProgress(event.requestingCharacterId, event.questId)) {
            this.sendErrorMessage(event.requestingCharacterId, 'You already have that quest.');
            return;
        }

        this.engineEventCrator.asyncCeateEvent<StartQuestEvent>({
            type: QuestEngineEvents.StartQuest,
            characterId: event.requestingCharacterId,
            questId: event.questId,
        });
    };

    handlePlayerFinalizeQuestWithNpc: EngineActionHandler<FinalizeQuestWithNpc> = ({ event, services }) => {
        const npc = services.npcService.getNpcById(event.npcId);
        const conversation = services.activeNpcConversationService.getConversationById(event.requestingCharacterId);

        if (conversation !== npc.id) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not talking with such npc.');
            return;
        }

        const template = services.npcTemplateService.getData()[npc.templateId];
        if (!template.quests[event.questId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'This npc does not have such quest.');
            return;
        }

        if (!services.questProgressService.isQuestInProgress(event.requestingCharacterId, event.questId)) {
            this.sendErrorMessage(event.requestingCharacterId, 'You does not have that quest.');
            return;
        }

        if (!services.questProgressService.isQuestDone(event.requestingCharacterId, event.questId)) {
            this.sendErrorMessage(event.requestingCharacterId, 'This quest is not done yet.');
            return;
        }

        this.engineEventCrator.asyncCeateEvent<QuestCompletedEvent>({
            type: QuestEngineEvents.QuestCompleted,
            characterId: event.requestingCharacterId,
            questId: event.questId,
        });
    };
}
