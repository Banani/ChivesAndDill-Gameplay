import { CloseNpcConversationDialog, NpcClientActions, OpenNpcConversationDialog } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineActionHandler, EngineEventHandler, PlayerMovedEvent } from '../../../types';
import {
    ConversationWithNpcEndedEvent,
    ConversationWithNpcStartedEvent,
    NpcEngineEvents
} from '../Events';
import { NPC_TALK_DISTANCE } from '../consts';

export class ActiveNpcConversationService extends EventParser {
    // character_id => npc_id
    activeDialogs: Record<string, string> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [NpcClientActions.OpenNpcConversationDialog]: this.handlePlayerTriesToStartConversation,
            [EngineEvents.CharacterMoved]: this.handlePlayerMoved,
            [NpcClientActions.CloseNpcConversationDialog]: this.handlePlayerTriesToFinishConversation,
        };
    }

    handlePlayerTriesToStartConversation: EngineActionHandler<OpenNpcConversationDialog> = ({ event, services }) => {
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

        this.activeDialogs[event.requestingCharacterId] = event.npcId;

        this.engineEventCrator.asyncCeateEvent<ConversationWithNpcStartedEvent>({
            type: NpcEngineEvents.ConversationWithNpcStarted,
            characterId: event.requestingCharacterId,
            npcId: event.npcId,
        });
    };

    handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
        if (this.activeDialogs[event.characterId]) {
            this.closeConversationDialog(event.characterId);
        }
    };

    handlePlayerTriesToFinishConversation: EngineActionHandler<CloseNpcConversationDialog> = ({ event }) => {
        if (this.activeDialogs[event.requestingCharacterId]) {
            this.closeConversationDialog(event.requestingCharacterId);
        } else {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not talking with anyone.');
        }
    };

    closeConversationDialog = (characterId: string) => {
        delete this.activeDialogs[characterId];

        this.engineEventCrator.asyncCeateEvent<ConversationWithNpcEndedEvent>({
            type: NpcEngineEvents.ConversationWithNpcEnded,
            characterId,
        });
    };

    getConversationById = (characterId: string) => this.activeDialogs[characterId];
}
