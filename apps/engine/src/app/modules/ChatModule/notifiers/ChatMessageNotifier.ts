import { ChatChannel, ChatChannelClientMessages, GlobalStoreModule } from '@bananos/types';
import { keyBy, map, mapValues, pickBy } from 'lodash';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { ChatEngineEvents, ChatMessagesDeletedEvent, ChatMessageSentEvent, SendChatMessageEvent } from '../Events';

export class ChatMessageNotifier extends Notifier<ChatChannel> {
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

      currentSocket.on(ChatChannelClientMessages.SendChatMessage, ({ chatChannelId, message }) => {
         this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            requestingCharacterId: event.playerCharacter.id,
            chatChannelId,
            message,
         });
      });
   };

   handleChatMessageSent: EngineEventHandler<ChatMessageSentEvent> = ({ event, services }) => {
      const chatChannel = services.chatChannelService.getChatChannelById(event.chatMessage.chatChannelId);
      const chatMembers = pickBy(services.characterService.getAllCharacters(), (character) => chatChannel.membersIds[character.id]) as Record<
         string,
         PlayerCharacter
      >;

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
