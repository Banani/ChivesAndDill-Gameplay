import { ChannelType, ChatChannelClientMessages, ChatMessage, GlobalStoreModule, RangeChatMessage } from '@bananos/types';
import { keyBy, map, mapValues, pickBy } from 'lodash';
import { Notifier } from '../../../Notifier';
import { distanceBetweenTwoPoints } from '../../../math';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { ChatEngineEvents, ChatMessageSentEvent, ChatMessagesDeletedEvent, SendChatMessageEvent } from '../Events';
import { RangeChannels } from '../RangeChannels';

export class ChatMessageNotifier extends Notifier<ChatMessage> {
    constructor() {
        super({ key: GlobalStoreModule.CHAT_MESSAGES });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [ChatEngineEvents.ChatMessageSent]: this.handleChatMessageSent,
            [ChatEngineEvents.ChatMessagesDeleted]: this.handleChatMessagesDeleted,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        currentSocket.on(ChatChannelClientMessages.SendChatMessage, ({ chatChannelId, message, channelType }) => {
            const character = services.characterService.getAllCharacters()[event.playerCharacter.id];
            this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
                type: ChatEngineEvents.SendChatMessage,
                requestingCharacterId: event.playerCharacter.id,
                chatChannelId,
                channelType,
                message,
                location: {
                    x: character.location.x,
                    y: character.location.y,
                }
            });
        });
    };

    handleChatMessageSent: EngineEventHandler<ChatMessageSentEvent> = ({ event, services }) => {
        let chatMembers: Record<string, PlayerCharacter> = {};
        if (event.chatMessage.channelType === ChannelType.Custom) {
            const chatChannel = services.chatChannelService.getChatChannelById(event.chatMessage.chatChannelId);
            chatMembers = pickBy(services.characterService.getAllCharacters(), (character) => chatChannel.membersIds[character.id]) as Record<
                string,
                PlayerCharacter
            >;
        } else if (event.chatMessage.channelType === ChannelType.Quotes) {
            chatMembers = pickBy(services.characterService.getAllCharacters(),
                (character) => character.type === CharacterType.Player &&
                    distanceBetweenTwoPoints(character.location, event.chatMessage.location) < RangeChannels.say.range
            ) as Record<string, PlayerCharacter>;

        } else if (event.chatMessage.channelType === ChannelType.Range) {
            const chatMessage: RangeChatMessage = event.chatMessage;
            chatMembers = pickBy(
                services.characterService.getAllCharacters(),
                (character) =>
                    character.type === CharacterType.Player &&
                    distanceBetweenTwoPoints(character.location, event.chatMessage.location) < RangeChannels[chatMessage.chatChannelId].range
            ) as Record<string, PlayerCharacter>;
        }

        this.multicastMultipleObjectsUpdate(
            map(chatMembers, (receiverCharacter) => ({
                receiverId: receiverCharacter.ownerId,
                objects: { [event.chatMessage.id]: event.chatMessage },
            }))
        );
    };

    handleChatMessagesDeleted: EngineEventHandler<ChatMessagesDeletedEvent> = ({ event, services }) => {
        const chatMembers = pickBy(services.characterService.getAllCharacters(), (character) => character.type === CharacterType.Player) as Record<
            string,
            PlayerCharacter
        >;

        this.multicastObjectsDeletion(
            map(event.receiversIds, (characterId) => ({
                receiverId: chatMembers[characterId].ownerId,
                objects: mapValues(keyBy(event.messagesIds), () => null),
            }))
        );
    };
}
