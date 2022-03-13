import { GlobalStoreModule, ChatChannelClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';

interface setupEngineProps {
   chatChannelName: string;
}

const CURRENT_MODULE = GlobalStoreModule.CHAT_CHANNEL;

const setupEngine = ({ chatChannelName }: setupEngineProps = { chatChannelName: 'channelName' }) => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientMessages.CreateChatChannel, chatChannelName });

   const recentlyCreatedChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

   return { engineManager, players, chatChannelName, recentlyCreatedChatChannelId };
};

describe('Leave chat channel action', () => {
   it('Player should be able to leave chat', () => {
      const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.LeaveChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { '1': null },
      });
   });

   it('When player tries to leave chat that does not exist he should get the error message', () => {
      const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.LeaveChatChannel,
         chatChannelId: 'SOME_RANDOM_ID',
      });

      checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Chat channel does not exist.', dataPackage);
   });

   it('When player tries to leave chat that he is not a member he should get the error message', () => {
      const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.LeaveChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'You are not a member of this chat channel.', dataPackage);
   });

   it('All chat members should be informed when player leaves chat channel', () => {
      const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.LeaveChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { '1': { membersIds: { playerCharacter_2: null } } },
      });
   });

   it('When chat owner leaves channel, next player on the list should be new owner', () => {
      const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.LeaveChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { '1': { characterOwnerId: players['2'].characterId } },
         toDelete: { '1': { membersIds: { playerCharacter_1: null } } },
      });
   });

   it('All chat members should be informed about the new owner', () => {
      const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['3'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.LeaveChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { '1': { characterOwnerId: players['2'].characterId } },
         toDelete: { '1': { membersIds: { playerCharacter_1: null } } },
      });
   });
});
