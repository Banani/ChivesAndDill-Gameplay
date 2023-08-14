import { ChannelType, CharacterType, ChatChannelClientActions, ChatMessage, GlobalStoreModule, RangeChatMessage } from '@bananos/types';
import { keyBy, map, mapValues, pickBy } from 'lodash';
import { Notifier } from '../../../Notifier';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineEventHandler } from '../../../types';
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

        currentSocket.on(ChatChannelClientActions.SendChatMessage, ({ chatChannelId, message, channelType }) => {
            const character = services.characterService.getAllCharacters()[event.playerCharacter.id];
            this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
                type: ChatEngineEvents.SendChatMessage,
                requestingCharacterId: event.playerCharacter.id,
                message,
                details: {
                    chatChannelId,
                    channelType,
                    location: {
                        x: character.location.x,
                        y: character.location.y,
                    },
                    authorId: character.id
                }
            });
        });
    };

    handleChatMessageSent: EngineEventHandler<ChatMessageSentEvent> = ({ event, services }) => {
        let chatMembers: Record<string, PlayerCharacter> = {};
        let chatMessage = {
            id: event.messageId,
            time: event.time,
            message: event.message
        } as ChatMessage;

        if (event.chatMessage.channelType === ChannelType.Custom) {
            const chatChannel = services.chatChannelService.getChatChannelById(event.chatMessage.chatChannelId);
            chatMessage = {
                ...chatMessage,
                channelType: ChannelType.Custom,
                location: event.chatMessage.location,
                chatChannelId: event.chatMessage.chatChannelId,
                authorId: event.chatMessage.authorId
            }

            chatMembers = pickBy(services.characterService.getAllCharacters(), (character) => chatChannel.membersIds[character.id]) as Record<
                string,
                PlayerCharacter
            >;
        } else if (event.chatMessage.channelType === ChannelType.Quotes) {
            const quoteMessageDetail = event.chatMessage;
            chatMessage = {
                ...chatMessage,
                channelType: ChannelType.Quotes,
                authorId: quoteMessageDetail.authorId,
                location: quoteMessageDetail.location,
            };

            chatMembers = pickBy(services.playerCharacterService.getAllCharacters(),
                (character) => distanceBetweenTwoPoints(character.location, quoteMessageDetail.location) < RangeChannels.say.range
            ) as Record<string, PlayerCharacter>;

        } else if (event.chatMessage.channelType === ChannelType.Range) {
            const rangeMessageDetail = event.chatMessage;
            chatMessage = {
                ...chatMessage,
                channelType: ChannelType.Range,
                authorId: rangeMessageDetail.authorId,
                location: rangeMessageDetail.location,
                chatChannelId: rangeMessageDetail.chatChannelId
            } as RangeChatMessage

            chatMembers = pickBy(
                services.playerCharacterService.getAllCharacters(),
                (character) => distanceBetweenTwoPoints(character.location, rangeMessageDetail.location) < RangeChannels[rangeMessageDetail.chatChannelId].range
            ) as Record<string, PlayerCharacter>;
        } else if (event.chatMessage.channelType === ChannelType.System) {
            chatMessage = {
                ...chatMessage,
                channelType: ChannelType.System,
                targetId: event.chatMessage.targetId
            };

            if (event.chatMessage.amount) {
                chatMessage.amount = event.chatMessage.amount;
            }

            if (event.chatMessage.itemId) {
                chatMessage.itemId = event.chatMessage.itemId;
            }
            chatMembers = { [event.chatMessage.targetId]: services.playerCharacterService.getAllCharacters()[event.chatMessage.targetId] }
        }

        this.multicastMultipleObjectsUpdate(
            map(chatMembers, (receiverCharacter) => ({
                receiverId: receiverCharacter.ownerId,
                objects: { [event.messageId]: chatMessage },
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
