import { ChatChannelClientMessages, GlobalStoreModule } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';

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

describe('Chat channel - remove player character from channel action', () => {
   it('Player should be able to remove other players from his chat', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

      engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.RemovePlayerCharacterFromChatChannel,
         characterId: players['2'].characterId,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { '1': { membersIds: { playerCharacter_2: null } } },
      });
   });

   it('Player should get error message when tries to remove player from chat when he is not an owner of that chat channel', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['3'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
         type: ChatChannelClientMessages.RemovePlayerCharacterFromChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterId: players['2'].characterId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

      checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Only the owner is allowed to remove members from the chat channel.', dataPackage);
   });

   it('Player should get error message when tries to remove player from chat when the player is not a member', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.RemovePlayerCharacterFromChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterId: players['2'].characterId,
      });

      checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'This character is not a member.', dataPackage);
   });
});
