import { ChatChannel } from '@bananos/types';
import { find } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerEngineEvents, SendErrorMessageEvent } from '../../PlayerModule/Events';
import {
   AddPlayerCharacterToChatEvent,
   ChatChannelOwnerChangedEvent,
   CharacterAddedToChatEvent,
   ChatChannelCreatedEvent,
   ChatChannelDeletedEvent,
   ChatEngineEvents,
   CreateChatChannelEvent,
   DeleteChatChannelEvent,
   LeaveChatChannelEvent,
   PlayerCharacterRemovedFromChatChannelEvent,
   PlayerLeftChatChannelEvent,
   RemovePlayerCharacterFromChatChannelEvent,
   ChangeChatChannelOwnerEvent,
} from '../Events';

export class ChatChannelService extends EventParser {
   private channels: Record<string, ChatChannel> = {};
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [ChatEngineEvents.CreateChatChannel]: this.handleCreateChannel,
         [ChatEngineEvents.DeleteChatChannel]: this.handleDeleteChatChannel,
         [ChatEngineEvents.AddPlayerCharacterToChat]: this.handleAddPlayerCharacterToChat,
         [ChatEngineEvents.RemovePlayerCharacterFromChatChannel]: this.handleRemovePlayerCharacterFromChatChannel,
         [ChatEngineEvents.LeaveChatChannel]: this.handleLeaveChatChannel,
         [ChatEngineEvents.ChangeChatChannelOwner]: this.handleChangeChatChannelOwner,
      };
   }

   handleCreateChannel: EngineEventHandler<CreateChatChannelEvent> = ({ event, services }) => {
      if (!event.chatChannel.name) {
         this.sendErrorMessage(event.requestingCharacterId, 'Chat channel name cannot be empty.');
         return;
      }

      if (find(this.channels, (channel) => channel.name === event.chatChannel.name)) {
         this.sendErrorMessage(event.requestingCharacterId, 'Chat channel with that name already exist.');
         return;
      }

      this.increment++;
      this.channels[this.increment] = { id: this.increment.toString(), ...event.chatChannel };

      this.engineEventCrator.asyncCeateEvent<ChatChannelCreatedEvent>({
         type: ChatEngineEvents.ChatChannelCreated,
         chatChannel: event.chatChannel,
         channelId: this.increment.toString(),
      });

      const character = services.characterService.getCharacterById(event.requestingCharacterId);

      this.engineEventCrator.asyncCeateEvent<AddPlayerCharacterToChatEvent>({
         type: ChatEngineEvents.AddPlayerCharacterToChat,
         characterName: character.name,
         chatChannelId: this.increment.toString(),
      });
   };

   handleDeleteChatChannel: EngineEventHandler<DeleteChatChannelEvent> = ({ event }) => {
      const chatChannelId = event.chatChannel?.id;

      if (!this.channels[chatChannelId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'Chat channel does not exist.');
         return;
      }

      if (this.wasRequestedByPlayer(event) && event.requestingCharacterId !== this.channels[chatChannelId].characterOwnerId) {
         this.sendErrorMessage(event.requestingCharacterId, 'Only the owner is allowed to delete the chat channel.');
         return;
      }

      this.engineEventCrator.asyncCeateEvent<ChatChannelDeletedEvent>({
         type: ChatEngineEvents.ChatChannelDeleted,
         chatChannel: this.channels[chatChannelId],
         chatChannelId: chatChannelId,
      });

      delete this.channels[chatChannelId];
   };

   handleAddPlayerCharacterToChat: EngineEventHandler<AddPlayerCharacterToChatEvent> = ({ event, services }) => {
      const character = find(services.characterService.getAllCharacters(), (character) => character.name === event.characterName);

      if (!character) {
         this.sendErrorMessage(event.requestingCharacterId, 'Character with that name does not exist.');
         return;
      }

      if (!this.channels[event.chatChannelId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'Channel does not exist.');
         return;
      }

      if (this.wasRequestedByPlayer(event) && event.requestingCharacterId !== this.channels[event.chatChannelId].characterOwnerId) {
         this.sendErrorMessage(event.requestingCharacterId, 'Only the owner is allowed to add new member to the chat channel.');
         return;
      }

      if (this.channels[event.chatChannelId].membersIds[character.id]) {
         this.sendErrorMessage(event.requestingCharacterId, 'This character is already a member.');
         return;
      }

      this.channels[event.chatChannelId].membersIds[character.id] = true;

      this.engineEventCrator.asyncCeateEvent<CharacterAddedToChatEvent>({
         type: ChatEngineEvents.CharacterAddedToChat,
         characterId: character.id,
         chatChannel: this.channels[event.chatChannelId],
      });
   };

   handleRemovePlayerCharacterFromChatChannel: EngineEventHandler<RemovePlayerCharacterFromChatChannelEvent> = ({ event }) => {
      if (this.wasRequestedByPlayer(event) && event.requestingCharacterId !== this.channels[event.chatChannelId].characterOwnerId) {
         this.sendErrorMessage(event.requestingCharacterId, 'Only the owner is allowed to remove members from the chat channel.');
         return;
      }

      if (!this.channels[event.chatChannelId].membersIds[event.characterId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'This character is not a member.');
         return;
      }

      delete this.channels[event.chatChannelId].membersIds[event.characterId];

      this.engineEventCrator.asyncCeateEvent<PlayerCharacterRemovedFromChatChannelEvent>({
         type: ChatEngineEvents.PlayerCharacterRemovedFromChatChannel,
         characterId: event.characterId,
         chatChannel: this.channels[event.chatChannelId],
      });
   };

   handleLeaveChatChannel: EngineEventHandler<LeaveChatChannelEvent> = ({ event }) => {
      if (!this.channels[event.chatChannelId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'Chat channel does not exist.');
         return;
      }

      if (!this.channels[event.chatChannelId].membersIds[event.requestingCharacterId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'You are not a member of this chat channel.');
         return;
      }

      delete this.channels[event.chatChannelId].membersIds[event.requestingCharacterId];

      this.engineEventCrator.asyncCeateEvent<PlayerLeftChatChannelEvent>({
         type: ChatEngineEvents.PlayerLeftChatChannel,
         characterId: event.requestingCharacterId,
         chatChannel: this.channels[event.chatChannelId],
      });

      if (this.channels[event.chatChannelId].characterOwnerId === event.requestingCharacterId) {
         const membersIds = Object.keys(this.channels[event.chatChannelId].membersIds);
         if (membersIds) {
            this.channels[event.chatChannelId].characterOwnerId = membersIds[0];
            this.engineEventCrator.asyncCeateEvent<ChatChannelOwnerChangedEvent>({
               type: ChatEngineEvents.ChatChannelOwnerChanged,
               chatChannel: this.channels[event.chatChannelId],
               newOwnerId: this.channels[event.chatChannelId].characterOwnerId,
            });
         } else {
            this.engineEventCrator.asyncCeateEvent<DeleteChatChannelEvent>({
               type: ChatEngineEvents.DeleteChatChannel,
               chatChannel: this.channels[event.chatChannelId],
            });
         }
      }
   };

   handleChangeChatChannelOwner: EngineEventHandler<ChangeChatChannelOwnerEvent> = ({ event }) => {
      if (!this.channels[event.chatChannelId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'Chat channel does not exist.');
         return;
      }

      if (!this.channels[event.chatChannelId].membersIds[event.newOwnerId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'This character is not a member.');
         return;
      }

      if (this.wasRequestedByPlayer(event) && event.requestingCharacterId !== this.channels[event.chatChannelId].characterOwnerId) {
         this.sendErrorMessage(event.requestingCharacterId, 'Only the owner is allowed promote a member to be a new owner.');
         return;
      }

      if (this.wasRequestedByPlayer(event) && event.newOwnerId === this.channels[event.chatChannelId].characterOwnerId) {
         this.sendErrorMessage(event.requestingCharacterId, 'You are already the owner of this chat channel.');
         return;
      }

      this.channels[event.chatChannelId].characterOwnerId = event.newOwnerId;

      this.engineEventCrator.asyncCeateEvent<ChatChannelOwnerChangedEvent>({
         type: ChatEngineEvents.ChatChannelOwnerChanged,
         chatChannel: this.channels[event.chatChannelId],
         newOwnerId: this.channels[event.chatChannelId].characterOwnerId,
      });
   };

   getChatChannelById = (id: string) => this.channels[id];
}
