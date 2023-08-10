import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineEventHandler, PlayerMovedEvent } from '../../../types';
import {
    ConversationWithNpcEndedEvent,
    ConversationWithNpcStartedEvent,
    NpcEngineEvents,
    PlayerTriesToFinishConversationEvent,
    PlayerTriesToStartConversationEvent,
} from '../Events';

export class ActiveNpcConversationService extends EventParser {
    // character_id => npc_id
    activeDialogs: Record<string, string> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [NpcEngineEvents.PlayerTriesToStartConversation]: this.handlePlayerTriesToStartConversation,
            [EngineEvents.CharacterMoved]: this.handlePlayerMoved,
            [NpcEngineEvents.PlayerTriesToFinishConversation]: this.handlePlayerTriesToFinishConversation,
        };
    }

    handlePlayerTriesToStartConversation: EngineEventHandler<PlayerTriesToStartConversationEvent> = ({ event, services }) => {
        const npc = services.npcService.getNpcById(event.npcId);
        if (!npc) {
            this.sendErrorMessage(event.requestingCharacterId, 'That npc does not exist.');
            return;
        }

        const character = services.characterService.getCharacterById(event.requestingCharacterId);
        if (distanceBetweenTwoPoints(npc.location, character.location) > 200) {
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

    handlePlayerTriesToFinishConversation: EngineEventHandler<PlayerTriesToFinishConversationEvent> = ({ event }) => {
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
