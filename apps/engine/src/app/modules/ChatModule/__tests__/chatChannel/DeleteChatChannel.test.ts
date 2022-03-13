import { ChatChannelClientMessages, EngineEventType, GlobalStoreModule } from '@bananos/types';
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
   };

   const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientMessages.CreateChatChannel, chatChannelName });

   const recentlyCreatedChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

   return { engineManager, players, chatChannelName, recentlyCreatedChatChannelId };
};

describe('Chat channel delete action', () => {
   it('Chat owner should be informed about recently deleted chat channel', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.DeleteChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { '1': null },
      });
   });

   it('Chat member should be informed about recently deleted chat channel', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
         characterName: players['2'].character.name,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.DeleteChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });
      dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { '1': null },
      });
   });

   it('Player should get error message when tries to delete chat channel which does not exist', () => {
      const { engineManager, players } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ChatChannelClientMessages.DeleteChatChannel,
         chatChannelId: 'SOME_RANDOM_ID',
      });

      checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Chat channel does not exist.', dataPackage);
   });

   it('Player should get error message when tries to delete chat which is not owned by him', () => {
      const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
         type: ChatChannelClientMessages.DeleteChatChannel,
         chatChannelId: recentlyCreatedChatChannelId,
      });

      checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Only the owner is allowed to delete the chat channel.', dataPackage);
   });
});
